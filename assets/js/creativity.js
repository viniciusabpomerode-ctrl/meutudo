(function(){
  "use strict";
  renderNav("criatividade");
  const LEVELS=["A1","A2","B1","B2","C1","C2"], FREE_DAILY=3, GUEST_DAILY=1, COOLDOWN=30000;
  const $=id=>document.getElementById(id);let questions=[],level=null,current=null,recognition=null,mediaRecorder=null,mediaStream=null,recordedBlob=null,recordUrl=null,recordStarted=0,recordTimer=null,recordPausedAt=0,recordPausedTotal=0,recordingSession=0,cooldown=false,answerBeforeRecording="";
  const usageKey=()=>`afb_creativity_${new Date().toISOString().slice(0,10)}`;
  function usage(){try{return JSON.parse(localStorage.getItem(usageKey()))||{count:0,last:0}}catch(e){return {count:0,last:0}}}

  // O audio continua local no IndexedDB; o Caderno/R2 guarda somente a
  // referencia leve para exibir a gravacao sem duplicar o arquivo de voz.
  function openRecDB(){return new Promise((r,rej)=>{const req=indexedDB.open("afb_creativity_recs",1);req.onupgradeneeded=e=>e.target.result.createObjectStore("recs",{keyPath:"id"});req.onsuccess=()=>r(req.result);req.onerror=rej})}
  function putSavedRec(rec){return openRecDB().then(db=>new Promise((r,rej)=>{const tx=db.transaction("recs","readwrite");tx.objectStore("recs").put(rec);tx.oncomplete=()=>r();tx.onerror=rej}))}
  function getSavedRecs(){return openRecDB().then(db=>new Promise((r,rej)=>{const tx=db.transaction("recs","readonly");const req=tx.objectStore("recs").getAll();req.onsuccess=()=>r(req.result);req.onerror=rej}))}
  function delSavedRec(id){return openRecDB().then(db=>new Promise((r,rej)=>{const tx=db.transaction("recs","readwrite");tx.objectStore("recs").delete(id);tx.oncomplete=()=>{if(typeof SavedItems!=="undefined")SavedItems.remove("creativity_recording",id).catch(()=>{});r()};tx.onerror=rej}))}
  function clearSavedRecs(){return openRecDB().then(db=>new Promise((r,rej)=>{const tx=db.transaction("recs","readwrite");tx.objectStore("recs").clear();tx.oncomplete=()=>r();tx.onerror=rej}))}
  async function renderSavedRecs(){
    const all=await getSavedRecs();
    const card=$("saved-recs-card"),list=$("saved-recs-list");
    if(!all.length){card.style.display="none";list.innerHTML="";return}
    card.style.display="block";
    all.sort((a,b)=>b.ts-a.ts);
    list.innerHTML=all.map(rec=>`<div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border-light);gap:8px;flex-wrap:wrap"><div style="min-width:0"><b style="font-size:.82rem">${esc(rec.prompt||"Gravação")}</b><p class="muted" style="margin:2px 0 0;font-size:.72rem">${new Date(rec.ts).toLocaleString("pt-BR")}</p></div><div style="display:flex;gap:6px;align-items:center;flex-shrink:0"><audio controls preload="none" style="height:32px;max-width:180px" src="${rec.base64}"></audio><button class="btn btn-ghost btn-sm" data-del-rec="${rec.id}">🗑️</button></div></div>`).join("");
  }
  function isLogged(){return !!Auth.currentUser()}
  function maxAttempts(){return isLogged()?FREE_DAILY:GUEST_DAILY}
  function updateAttempts(){const u=usage(),left=Math.max(0,maxAttempts()-u.count);$("attempts").textContent=`${left} de ${maxAttempts()}`;$("attempt-note").textContent=isLogged()?"Seu limite diário está protegido.":"Visitantes recebem uma análise demonstrativa."}
  async function init(){
    $("levels").innerHTML=LEVELS.map(l=>`<button class="level-btn" data-level="${l}">${l}</button>`).join("");
    $("levels").onclick=e=>{const b=e.target.closest("button");if(b)selectLevel(b.dataset.level)};
    $("answer").oninput=countWords;$("next").onclick=pickQuestion;$("analyze").onclick=analyze;$("record").onclick=startRecording;$("pause").onclick=togglePauseRecording;$("stop").onclick=()=>stopRecording();$("discard-record").onclick=discardRecording;
    $("save-record").onclick=async()=>{
      if(!recordedBlob)return;
      const btn=$("save-record");btn.disabled=true;btn.textContent="Salvando...";
      const recId="crea_"+Date.now();
      const reader=new FileReader();
      reader.onload=async()=>{
        await putSavedRec({id:recId,prompt:current?current.prompt:"",translation:current?current.promptPt||"":"",level:level||"",mime:recordedBlob.type||"audio/webm",ts:Date.now(),base64:reader.result});
        await SavedItems.add({type:"creativity_recording",id:recId,nivel:level||"",refUrl:"criatividade.html"});
        btn.disabled=false;btn.textContent="✅ Salvo";setTimeout(()=>{btn.textContent="💾 Salvar gravação"},1500);
        renderSavedRecs();
      };
      reader.readAsDataURL(recordedBlob);
    };
    $("clear-recs").onclick=async()=>{
      if(!confirm("Excluir todas as gravações salvas neste aparelho?"))return;
      const saved=await getSavedRecs();await clearSavedRecs();
      if(typeof SavedItems!=="undefined")await Promise.all(saved.map(rec=>SavedItems.remove("creativity_recording",rec.id).catch(()=>{})));
      renderSavedRecs();
    };
    $("saved-recs-list").addEventListener("click",async e=>{
      const id=e.target.dataset.delRec;if(!id)return;
      await delSavedRec(id);renderSavedRecs();
    });
    renderSavedRecs();
    try{
      let r=await fetch(`${AFB_R2_PUBLIC_URL}/data/criatividade.json`);
      if(!r.ok)r=await fetch("../data/criatividade.json");
      if(!r.ok)throw new Error("questions_unavailable");
      questions=(await r.json()).questions||[];
    }catch(e){$("practice").hidden=false;$("practice").innerHTML='<div class="card" style="padding:25px">Não foi possível carregar as perguntas.</div>'}
    await Auth._ready();updateAttempts();
  }
  function selectLevel(l){level=l;document.querySelectorAll(".level-btn").forEach(b=>b.classList.toggle("active",b.dataset.level===l));$("practice").hidden=false;pickQuestion();$("practice").scrollIntoView({behavior:"smooth",block:"start"})}
  function pickQuestion(){const list=questions.filter(q=>q.level===level),pool=list.filter(q=>!current||q.id!==current.id);current=pool[Math.floor(Math.random()*pool.length)]||list[0];if(!current)return;
    cancelActiveRecording();
    if(mediaRecorder&&mediaRecorder.state==="recording")stopRecording();discardRecording();$("category").textContent=`${current.level} · ${current.category}`;$("position").textContent=`${list.indexOf(current)+1} de ${list.length}`;$("prompt").textContent=current.prompt;$("prompt-pt").textContent=current.promptPt;$("minimum").textContent=current.minWords;$("guide").innerHTML=current.guide.map(x=>`<li>${x}</li>`).join("");$("vocabulary").innerHTML=current.vocabulary.map(x=>`<span class="word-chip">${x}</span>`).join("");$("connectors").innerHTML=current.connectors.map(x=>`<span class="word-chip">${x}</span>`).join("");$("answer").value="";$("result").classList.remove("show");countWords();
  }
  function countWords(){const n=$("answer").value.trim().split(/\s+/).filter(Boolean).length;$("words").textContent=n}
  async function startRecording(){
    if(!navigator.mediaDevices||!window.MediaRecorder){$("record-status").textContent="Seu navegador não oferece gravação. Você pode digitar normalmente.";return}
    try{
      mediaStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});const chunks=[];const mime=MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":"audio/webm";answerBeforeRecording=$("answer").value.trim();
      mediaRecorder=new MediaRecorder(mediaStream,{mimeType:mime});mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};mediaRecorder.onstop=async()=>{recordedBlob=new Blob(chunks,{type:mime});if(recordUrl)URL.revokeObjectURL(recordUrl);recordUrl=URL.createObjectURL(recordedBlob);$("record-playback").src=recordUrl;$("record-panel").classList.add("show");cleanupCapture();if($("answer").value.trim()===answerBeforeRecording)await transcribeRecording();else $("record-status").textContent="Gravação e transcrição prontas. Confira o texto antes de analisar."};mediaRecorder.start();
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(SR){recognition=new SR();recognition.lang="de-DE";recognition.continuous=true;recognition.interimResults=true;let base=$("answer").value.trim();recognition.onresult=e=>{let final="",partial="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)final+=t+" ";else partial+=t}if(final)base=(base+" "+final).trim();$("answer").value=(base+" "+partial).trim();countWords()};recognition.onerror=e=>{$("record-status").textContent=`Reconhecimento do navegador indisponível (${e.error}). Tentaremos a transcrição segura ao finalizar.`};try{recognition.start()}catch(e){}}
      recordStarted=Date.now();recordTimer=setInterval(()=>{const sec=Math.floor((Date.now()-recordStarted)/1000);$("record-status").innerHTML=`<span class="record-dot"></span> Gravando ${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;if(sec>=180)stopRecording()},500);$("record").hidden=true;$("stop").hidden=false;$("record-status").className="recording";
    }catch(e){$("record-status").className="muted";$("record-status").textContent="Permita o acesso ao microfone para gravar sua resposta."}
  }
  function cleanupCapture(){if(recordTimer)clearInterval(recordTimer);recordTimer=null;if(mediaStream)mediaStream.getTracks().forEach(t=>t.stop());mediaStream=null;if(recognition)try{recognition.stop()}catch(e){}recognition=null;$("record").hidden=false;$("stop").hidden=true;$("record-status").className="muted"}
  function stopRecording(){if(mediaRecorder&&mediaRecorder.state==="recording")mediaRecorder.stop();else cleanupCapture()}
  async function transcribeRecording(){
    if(!recordedBlob){return}
    if(!window.AFB_CREATIVITY_API){$("record-status").textContent="Gravação pronta. Este navegador não gerou texto; digite a resposta ou ative o Worker de transcrição.";return}
    const token=await Auth.accessToken();if(!token){$("record-status").textContent="Gravação pronta. Entre na conta para gerar a transcrição.";return}
    $("record-status").textContent="Transcrevendo sua resposta em alemão...";
    try{const r=await fetch(window.AFB_CREATIVITY_API+"/transcribe",{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":recordedBlob.type||"audio/webm"},body:recordedBlob});const d=await r.json();if(!r.ok||!d.text)throw new Error(d.error||"transcription_failed");$("answer").value=(answerBeforeRecording+" "+d.text).trim();countWords();$("record-status").textContent="Transcrição pronta. Confira o texto antes de analisar."}catch(e){$("record-status").textContent="Não foi possível transcrever agora. A gravação continua disponível para ouvir."}
  }
  function discardRecording(){if(recordUrl)URL.revokeObjectURL(recordUrl);recordUrl=null;recordedBlob=null;$("record-playback").removeAttribute("src");$("record-panel").classList.remove("show");$("record-status").className="muted";$("record-status").textContent="Você também pode responder falando."}
  // Controle robusto do microfone: pausa/retoma, encerra ao trocar de
  // pergunta ou página e ignora callbacks de uma gravação já descartada.
  async function startRecording(){
    if(!navigator.mediaDevices||!window.MediaRecorder){$("record-status").textContent="Seu navegador não oferece gravação. Você pode digitar normalmente.";return}
    const session=++recordingSession;
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
      if(session!==recordingSession){stream.getTracks().forEach(t=>t.stop());return}
      mediaStream=stream;const chunks=[];const mime=MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":"audio/webm";answerBeforeRecording=$("answer").value.trim();
      const recorder=new MediaRecorder(stream,{mimeType:mime});mediaRecorder=recorder;
      recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      recorder.onstop=async()=>{
        cleanupCapture();
        if(session!==recordingSession)return;
        recordedBlob=new Blob(chunks,{type:mime});if(recordUrl)URL.revokeObjectURL(recordUrl);recordUrl=URL.createObjectURL(recordedBlob);$("record-playback").src=recordUrl;$("record-panel").classList.add("show");
        if($("answer").value.trim()===answerBeforeRecording)await transcribeRecording();else $("record-status").textContent="Gravação e transcrição prontas. Confira o texto antes de analisar.";
      };
      recorder.start();
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(SR){recognition=new SR();recognition.lang="de-DE";recognition.continuous=true;recognition.interimResults=true;let base=$("answer").value.trim();recognition.onresult=e=>{let final="",partial="";for(let i=e.resultIndex;i<e.results.length;i++){const text=e.results[i][0].transcript;if(e.results[i].isFinal)final+=text+" ";else partial+=text}if(final)base=(base+" "+final).trim();$("answer").value=(base+" "+partial).trim();countWords()};recognition.onerror=()=>{};try{recognition.start()}catch(e){}}
      recordStarted=Date.now();recordPausedAt=0;recordPausedTotal=0;recordTimer=setInterval(()=>{if(!mediaRecorder)return;if(mediaRecorder.state==="paused")return;const sec=Math.floor((Date.now()-recordStarted-recordPausedTotal)/1000);$("record-status").innerHTML=`<span class="record-dot"></span> Gravando ${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;if(sec>=180)stopRecording()},500);
      $("record").hidden=true;$("pause").hidden=false;$("stop").hidden=false;$("record-status").className="recording";
    }catch(e){cleanupCapture();$("record-status").className="muted";$("record-status").textContent="Permita o acesso ao microfone para gravar sua resposta."}
  }
  function resetRecordingControls(){$("record").hidden=false;$("pause").hidden=true;$("pause").textContent="⏸ Pausar";$("stop").hidden=true;$("record-status").className="muted"}
  function cleanupCapture(){if(recordTimer)clearInterval(recordTimer);recordTimer=null;if(mediaStream)mediaStream.getTracks().forEach(t=>t.stop());mediaStream=null;if(recognition)try{recognition.stop()}catch(e){}recognition=null;mediaRecorder=null;resetRecordingControls()}
  function stopRecording(){if(mediaRecorder&&mediaRecorder.state!=="inactive")mediaRecorder.stop();else cleanupCapture()}
  function togglePauseRecording(){if(!mediaRecorder)return;if(mediaRecorder.state==="recording"){mediaRecorder.pause();recordPausedAt=Date.now();$("pause").textContent="▶ Retomar";$("record-status").textContent="Gravação pausada."}else if(mediaRecorder.state==="paused"){recordPausedTotal+=Date.now()-recordPausedAt;recordPausedAt=0;mediaRecorder.resume();$("pause").textContent="⏸ Pausar";$("record-status").className="recording"}}
  function cancelActiveRecording(){recordingSession++;const recorder=mediaRecorder;if(recorder&&recorder.state!=="inactive"){recorder.onstop=()=>cleanupCapture();try{recorder.stop()}catch(e){}}cleanupCapture()}
  function discardRecording(){if(mediaRecorder)cancelActiveRecording();if(recordUrl)URL.revokeObjectURL(recordUrl);recordUrl=null;recordedBlob=null;$("record-playback").removeAttribute("src");$("record-panel").classList.remove("show");$("record-status").className="muted";$("record-status").textContent="Você também pode responder falando."}
  window.addEventListener("pagehide",cancelActiveRecording);

  async function analyze(){
    if(!current){showMessage("Escolha um nível e uma pergunta antes de analisar.");return}
    const answer=$("answer").value.trim(),words=answer.split(/\s+/).filter(Boolean).length,u=usage(),wait=COOLDOWN-(Date.now()-u.last);
    if(!answer||words<5){showMessage("Escreva ou grave uma resposta um pouco maior antes de analisar.");return}
    if(u.count>=maxAttempts()){showMessage(isLogged()?"Você concluiu as análises de hoje. Continue treinando e volte amanhã.":"Sua demonstração foi usada. Entre para receber três análises por dia.",!isLogged());return}
    if(wait>0){showMessage(`Aguarde ${Math.ceil(wait/1000)} segundos antes de uma nova análise.`);return}
    if(cooldown)return;cooldown=true;const btn=$("analyze");btn.disabled=true;btn.textContent="Analisando...";
    try{
      let feedback=null,token=await Auth.accessToken();
      if(window.AFB_CREATIVITY_API){const r=await fetch(window.AFB_CREATIVITY_API+"/analyze",{method:"POST",headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({questionId:current.id,level:current.level,prompt:current.prompt,answer,modelAnswer:current.modelAnswer,vocabulary:current.vocabulary})});const d=await r.json().catch(()=>({}));if(r.ok)feedback=d;else if(r.status===429)throw new Error("Limite diário alcançado");else if(r.status===401)throw new Error("Entre na sua conta para receber a correção por IA.");else throw new Error(d.error||"O serviço de correção por IA está indisponível agora.")}
      if(!feedback)feedback=localFeedback(answer,words);
      localStorage.setItem(usageKey(),JSON.stringify({count:u.count+1,last:Date.now()}));renderResult(feedback);updateAttempts();if(window.SFX)SFX.correct();
    }catch(e){showMessage(e.message||"Não foi possível analisar agora. Tente novamente.")}finally{cooldown=false;btn.disabled=false;btn.textContent="Analisar resposta"}
  }
  function localFeedback(answer,words){const connectors=Array.isArray(current?.connectors)?current.connectors:[],vocabulary=Array.isArray(current?.vocabulary)?current.vocabulary:[],minimum=Number(current?.minWords)||1;const used=connectors.filter(x=>answer.toLowerCase().includes(String(x).toLowerCase())),score=Math.min(88,48+Math.round(Math.min(words/minimum,1)*25)+used.length*5);return {score,summary:words>=minimum?"Boa extensão e resposta relacionada ao tema.":"A ideia está clara, mas você pode desenvolvê-la um pouco mais.",corrected:answer,grammar:["A correção detalhada por IA será ativada quando o Worker for publicado."],vocabulary:vocabulary.slice(0,3),structure:used.length?`Você utilizou ${used.join(", ")}. Tente conectar também a conclusão.`:`Use conectores como ${connectors.join(", ")} para organizar as ideias.`,modelAnswer:current?.modelAnswer||"",mode:"local"}}
  function esc(s){return String(s||"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
  function renderResult(f){$("result").innerHTML=`<div class="result-head"><div class="score-ring" style="--score:${Number(f.score)||0}"><span>${Number(f.score)||0}</span></div><div><span class="eyebrow">Orientação da sua resposta</span><h2 style="margin:4px 0">${esc(f.summary)}</h2></div></div><div class="feedback-grid"><div class="feedback-block"><h3>Versão corrigida</h3><p lang="de">${esc(f.corrected)}</p></div><div class="feedback-block"><h3>Gramática</h3><p>${(f.grammar||[]).map(esc).join(" · ")}</p></div><div class="feedback-block"><h3>Vocabulário recomendado</h3><p>${(f.vocabulary||[]).map(esc).join(" · ")}</p></div><div class="feedback-block"><h3>Estrutura</h3><p>${esc(f.structure)}</p></div><div class="feedback-block model-answer"><h3>Uma resposta-modelo</h3><p lang="de">${esc(f.modelAnswer||current.modelAnswer)}</p></div></div>${f.mode==="local"?'<div class="notice">Pré-análise local: não consumiu serviços externos. A correção gramatical completa será habilitada no deploy do Workers AI.</div>':""}`;$("result").classList.add("show");$("result").scrollIntoView({behavior:"smooth",block:"start"})}
  function showMessage(text,login){$("result").innerHTML=`<div style="text-align:center;padding:10px"><h2>${esc(text)}</h2>${login?'<a class="btn btn-primary" href="login.html?next=criatividade.html">Entrar para continuar</a>':""}</div>`;$("result").classList.add("show")}
  init();
})();
