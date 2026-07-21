const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
const MODEL = "@cf/meta/llama-3.2-3b-instruct";
const DAILY_LIMIT = 3;
const COOLDOWN_SECONDS = 30;

function json(data, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": origin, "Vary": "Origin" } });
}
function allowedOrigin(request, env) { const origin=request.headers.get("Origin")||"";const list=(env.ALLOWED_ORIGINS||"").split(",").map(x=>x.trim()).filter(Boolean);return !list.length||list.includes(origin)?origin||"*":""; }
async function authenticatedUser(request, env) { const authorization=request.headers.get("Authorization")||"";if(!authorization.startsWith("Bearer "))return null;const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{Authorization:authorization,apikey:SUPABASE_ANON_KEY}});if(!r.ok)return null;const user=await r.json();return user&&user.id?user:null; }
async function takeAttempt(env,userId,scope="analysis",dailyLimit=DAILY_LIMIT,cooldownSeconds=COOLDOWN_SECONDS){if(!env.LIMITS)throw new Error("LIMITS_KV_NOT_CONFIGURED");const day=new Date().toISOString().slice(0,10),key=`creativity:${scope}:${day}:${userId}`,now=Math.floor(Date.now()/1000),saved=await env.LIMITS.get(key,"json")||{count:0,last:0};if(saved.count>=dailyLimit)return{ok:false,reason:"daily",remaining:0};if(now-saved.last<cooldownSeconds)return{ok:false,reason:"cooldown",retryAfter:cooldownSeconds-(now-saved.last),remaining:dailyLimit-saved.count};const next={count:saved.count+1,last:now};await env.LIMITS.put(key,JSON.stringify(next),{expirationTtl:172800});return{ok:true,remaining:dailyLimit-next.count};}
function audioBase64(buffer){const bytes=new Uint8Array(buffer);let binary="";for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(binary);}
function clean(value,max){return typeof value==="string"?value.trim().slice(0,max):""}
function extractJson(output){const text=typeof output==="string"?output:(output&&output.response)||"",match=text.match(/\{[\s\S]*\}/);if(!match)throw new Error("INVALID_AI_RESPONSE");const d=JSON.parse(match[0]);return{score:Math.max(0,Math.min(100,Number(d.score)||0)),summary:clean(d.summary,240),corrected:clean(d.corrected,1800),grammar:Array.isArray(d.grammar)?d.grammar.slice(0,4).map(x=>clean(x,240)):[],vocabulary:Array.isArray(d.vocabulary)?d.vocabulary.slice(0,5).map(x=>clean(x,100)):[],structure:clean(d.structure,360),modelAnswer:clean(d.modelAnswer,1800),mode:"ai"};}

// Rate limit por IP (sem exigir login) -- o simulado Goethe e gratuito de
// proposito, entao a correcao do Schreiben livre (so o C2 hoje) nao pode
// travar quem esta so testando de graca. O DeepSeek Flash custa uma fracao
// de centavo por correcao, o limite por IP e so pra evitar abuso automatizado.
async function checkIpRateLimit(env,request,scope,limit,windowSeconds){
  if(!env.LIMITS)return true;
  const ip=request.headers.get("CF-Connecting-IP")||"unknown",key=`iprl:${scope}:${ip}`,now=Math.floor(Date.now()/1000);
  let saved=await env.LIMITS.get(key,"json")||{count:0,windowStart:now};
  if(now-saved.windowStart>windowSeconds)saved={count:0,windowStart:now};
  saved.count++;
  await env.LIMITS.put(key,JSON.stringify(saved),{expirationTtl:windowSeconds*2});
  return saved.count<=limit;
}
async function gradeWriting(env,{pergunta,contexto,resposta,nivel}){
  const system=`Voce corrige uma questao de escrita (Schreiben) de um simulado Goethe-Zertifikat de alemao, nivel ${nivel||"B1"}. Avalie se a resposta do aluno atende ao que foi pedido: tamanho e estrutura razoaveis, faz sentido pro contexto, e o alemao esta compreensivel pro nivel (nao precisa ser perfeito). Responda SOMENTE em JSON valido: {"ok": true|false, "feedback": "..."}. "feedback" deve ser uma frase curta em portugues, encorajadora mesmo quando ok=false, apontando o que ajustar.`;
  const userMsg=`PERGUNTA: ${pergunta}\nCONTEXTO: ${contexto}\nRESPOSTA DO ALUNO: ${resposta}`;
  const r=await fetch("https://api.deepseek.com/chat/completions",{
    method:"POST",
    headers:{"Content-Type":"application/json",Authorization:`Bearer ${env.DEEPSEEK_API_KEY}`},
    body:JSON.stringify({model:"deepseek-chat",messages:[{role:"system",content:system},{role:"user",content:userMsg}],max_tokens:220,temperature:.3,response_format:{type:"json_object"}}),
  });
  if(!r.ok)throw new Error("DEEPSEEK_ERROR");
  const data=await r.json();
  const parsed=JSON.parse(data.choices[0].message.content);
  return{ok:!!parsed.ok,feedback:clean(parsed.feedback,300)};
}

export default {async fetch(request,env){
  const origin=allowedOrigin(request,env);if(!origin)return json({error:"Origin not allowed"},403);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Authorization,Content-Type","Access-Control-Max-Age":"86400"}});
  const url=new URL(request.url);if(request.method!=="POST"||!["/analyze","/transcribe","/grade-writing"].includes(url.pathname))return json({error:"Not found"},404,origin);
  if(url.pathname==="/grade-writing"){
    // Sem login de proposito -- o simulado Goethe e gratuito, so protegido
    // por rate limit de IP (ver checkIpRateLimit acima).
    const okRate=await checkIpRateLimit(env,request,"grade-writing",30,3600).catch(()=>true);
    if(!okRate)return json({error:"Muitas correções em pouco tempo. Aguarde um pouco."},429,origin);
    if(!env.DEEPSEEK_API_KEY)return json({error:"Correção por IA não configurada"},503,origin);
    const body=await request.json().catch(()=>({}));
    const resposta=clean(body.resposta,2500);
    if(!resposta||resposta.split(/\s+/).filter(Boolean).length<2)return json({error:"Resposta muito curta para corrigir."},400,origin);
    try{
      const result=await gradeWriting(env,{pergunta:clean(body.pergunta,500),contexto:clean(body.contexto,800),resposta,nivel:clean(body.nivel,2)});
      return json(result,200,origin);
    }catch(e){return json({error:"Falha na correção. Tente de novo."},502,origin)}
  }
  try{
    const user=await authenticatedUser(request,env);if(!user)return json({error:"Login required"},401,origin);
    if(url.pathname==="/transcribe"){
      const length=Number(request.headers.get("Content-Length")||0);
      if(length>5_000_000)return json({error:"Audio too large"},413,origin);
      // Transcrever não consome as três análises pedagógicas. Quando o KV
      // ainda não estiver ligado, a autenticação e o limite de tamanho
      // continuam protegendo a rota e a transcrição segue funcionando.
      const attempt=env.LIMITS?await takeAttempt(env,user.id,"transcription",20,2):{ok:true,remaining:null};
      if(!attempt.ok)return json({error:attempt.reason,retryAfter:attempt.retryAfter||0,remaining:attempt.remaining},429,origin);
      const audio=await request.arrayBuffer();
      if(!audio.byteLength||audio.byteLength>5_000_000)return json({error:"Invalid audio"},400,origin);
      const result=await env.AI.run("@cf/openai/whisper-large-v3-turbo",{audio:audioBase64(audio),language:"de",task:"transcribe",vad_filter:true,condition_on_previous_text:false});
      const text=clean(result&&result.text,3000);if(!text)return json({error:"No speech detected"},422,origin);
      return json({text,remaining:attempt.remaining},200,origin);
    }
    const body=await request.json(),answer=clean(body.answer,1500),prompt=clean(body.prompt,600),level=clean(body.level,2);
    if(!answer||answer.split(/\s+/).length<5||!/^(A1|A2|B1|B2|C1|C2)$/.test(level))return json({error:"Invalid answer"},400,origin);
    const attempt=await takeAttempt(env,user.id,"analysis");if(!attempt.ok)return json({error:attempt.reason,retryAfter:attempt.retryAfter||0,remaining:attempt.remaining},429,origin);
    const system=`Você é um professor de alemão cuidadoso. Avalie uma resposta de nível ${level}. Não invente erros. Explique em português brasileiro, seja encorajador e conciso. Não atribua certificação oficial CEFR. Retorne SOMENTE JSON válido com: score (0-100), summary, corrected (alemão), grammar (array com até 4 explicações), vocabulary (array com até 5 sugestões em alemão), structure e modelAnswer (alemão).`;
    const input=`PERGUNTA: ${prompt}\nRESPOSTA DO ALUNO: ${answer}\nVOCABULÁRIO SUGERIDO: ${(Array.isArray(body.vocabulary)?body.vocabulary:[]).slice(0,5).join(", ")}\nRESPOSTA DE REFERÊNCIA: ${clean(body.modelAnswer,1000)}`;
    const output=await env.AI.run(MODEL,{messages:[{role:"system",content:system},{role:"user",content:input}],max_tokens:500,temperature:.25});return json({...extractJson(output),remaining:attempt.remaining},200,origin);
  }catch(error){const config=error&&error.message==="LIMITS_KV_NOT_CONFIGURED";return json({error:config?"Server limit storage is not configured":"Analysis failed"},config?503:500,origin)}
}};
