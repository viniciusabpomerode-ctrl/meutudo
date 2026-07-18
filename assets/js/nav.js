// Navbar comum as paginas internas (app/*.html) — menu curto e direto:
// Início / Conteúdo (dropdown com tudo) / Planos / Suporte
const AFB_CONTENT_PAGES = [
  { href: "teste-rapido.html", label: "🧭 Teste rápido", key: "teste-rapido" },
  { href: "cursos.html", label: "💬 Diálogos", key: "cursos" },
  { href: "cursos.html?tab=verbos", label: "📖 Verbos", key: "verbos" },
  { href: "musica.html", label: "🎵 Música", key: "musica" },
  { href: "podcasts.html", label: "🎧 Podcasts", key: "podcasts" },
  { href: "expressoes.html", label: "🗣️ Gírias", key: "expressoes" },
  { href: "vocabulario.html", label: "📚 Vocabulário", key: "vocabulario" },
  { href: "profissoes.html", label: "💼 Profissões", key: "profissoes" },
  { href: "quiz.html", label: "⚡ Quiz", key: "quiz" },
  { href: "simulado.html", label: "📝 Simulado Goethe", key: "simulado" },
  { href: "escrita.html", label: "✍️ Escrita", key: "escrita" },
  { href: "pronuncia.html", label: "🎤 Pronúncia", key: "pronuncia" },
  { href: "criatividade.html", label: "💡 Teste de Criatividade", key: "criatividade" },
  { href: "jogo.html", label: "🎮 Jogo", key: "jogo" },
  { href: "caderno.html", label: "📝 Caderno", key: "caderno" },
  { href: "../blog/index.html", label: "📰 Blog", key: "blog" },
];

function renderNav(active) {
  _renderNavNow(active);
  // Auth.currentUser() pode nao estar pronto ainda no primeiro desenho
  // (a sessao do Supabase carrega de forma assincrona). Redesenha assim
  // que a sessao real estiver confirmada, pra nao mostrar "visitante"
  // por engano em quem ja esta logado.
  if (typeof Auth !== "undefined" && Auth._ready) {
    Auth._ready().then(() => _renderNavNow(active));
  }
}

function _renderNavNow(active) {
  const user = Auth.currentUser();
  const isContentPage = AFB_CONTENT_PAGES.some((l) => l.key === active);
  const navLang = localStorage.getItem("afb_language") || "pt";
  const navCopy = {
    pt:{home:"Início",plans:"Planos",support:"Suporte"},
    en:{home:"Home",plans:"Plans",support:"Support"},
    es:{home:"Inicio",plans:"Planes",support:"Soporte"},
    fr:{home:"Accueil",plans:"Forfaits",support:"Assistance"},
    it:{home:"Home",plans:"Piani",support:"Assistenza"},
    tr:{home:"Ana Sayfa",plans:"Planlar",support:"Destek"},
    ar:{home:"الرئيسية",plans:"الخطط",support:"الدعم"},
    he:{home:"דף הבית",plans:"תוכניות",support:"תמיכה"},
    hi:{home:"होम",plans:"योजनाएँ",support:"सहायता"},
    pl:{home:"Strona główna",plans:"Plany",support:"Pomoc"}
  }[navLang] || {home:"Início",plans:"Planos",support:"Suporte"};

  const dropdownItems = AFB_CONTENT_PAGES
    .map((l) => `<a href="${l.href}" class="nav-dd-item ${l.key === active ? "active" : ""}">${l.label}</a>`)
    .join("");

  const linksHtml = `
    <a href="../index.html" class="${active === "dashboard" ? "active" : ""}">${navCopy.home}</a>
    <div class="nav-dropdown">
      <a href="cursos.html" class="nav-dd-trigger ${isContentPage ? "active" : ""}">Conteúdo ▾</a>
      <div class="nav-dd-menu">${dropdownItems}</div>
    </div>
    <a href="planos.html" class="${active === "planos" ? "active" : ""}">${navCopy.plans}</a>
    <a href="suporte.html" class="${active === "suporte" ? "active" : ""}">${navCopy.support}</a>
  `;

  const el = document.getElementById("app-nav");
  if (!el) return;
  const navRight = user
    ? `<a class="btn btn-ghost btn-sm" href="perfil.html">Perfil</a>
       <button class="btn btn-ghost btn-sm" onclick="Auth.logout()">Sair</button>`
    : `<a class="btn btn-ghost btn-sm" href="login.html">Entrar</a>
       <a class="btn btn-primary btn-sm" href="cadastro.html">Criar conta</a>`;
  el.outerHTML = `
    <header class="navbar" id="app-nav">
      <a class="brand" href="../index.html">
        <span>${Theme.meta().icon}</span> DeutschBloom
      </a>
      <nav>${linksHtml}</nav>
      <div class="nav-right">${navRight}</div>
    </header>
  `;

  // No celular o "Conteudo ▾" abre/fecha ao tocar (no desktop continua
  // sendo so hover, via CSS).
  const trigger = document.querySelector("#app-nav .nav-dd-trigger");
  const menu = document.querySelector("#app-nav .nav-dd-menu");
  if (trigger && menu) {
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth > 1050) return;
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (window.innerWidth > 1050) return;
      if (!menu.contains(e.target) && e.target !== trigger) menu.classList.remove("open");
    });
  }
}

// ── Bandeja de ferramentas (LoFi + Pomodoro) ──
// Presente em todas as paginas (Inicio incluso), arrastavel e redimensionavel,
// com posicao/tamanho salvos por elemento (localStorage) pra manter onde o
// usuario deixou ao navegar entre paginas.
(function(){
const MUSIC_KEY="afb_music_state";
function musicGet(){try{return{station:"working",playing:false,...JSON.parse(localStorage.getItem(MUSIC_KEY)||"{}")}}catch{return{station:"working",playing:false}}}
function musicSet(patch){const state={...musicGet(),...patch};localStorage.setItem(MUSIC_KEY,JSON.stringify(state));document.dispatchEvent(new CustomEvent("afb:music-state",{detail:{...state,title:`${state.station} · LoFi`}}));return state}

const S = document.createElement("style");
S.textContent = `
.ext-arrow{position:fixed;bottom:20px;right:20px;z-index:9999;width:36px;height:36px;border-radius:50%;border:none;background:rgba(30,30,40,.88);color:#b8a99a;font-size:1rem;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,.3);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;font-family:inherit}
.ext-arrow:hover{background:rgba(40,40,55,.95);color:#e0d5c1}
.ext-tray{position:fixed;bottom:68px;right:8px;z-index:9999;background:rgba(25,25,35,.95);border-radius:14px;padding:10px;box-shadow:0 8px 30px rgba(0,0,0,.4);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);min-width:160px;font-family:inherit}
.ext-tray.hidden{display:none}
.ext-tray .ext-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;color:#c8bcaa;font-size:.85rem;font-weight:500;transition:.2s}
.ext-tray .ext-item:hover{background:rgba(255,255,255,.06);color:#e0d5c1}
.ext-tray .ext-item .dot{width:8px;height:8px;border-radius:50%;background:#555;transition:.3s}
.ext-tray .ext-item .dot.on{background:#7ecf7e;box-shadow:0 0 6px #7ecf7e}
.ext-tray .tray-play{transition:.2s;cursor:pointer}
.lofi-player{position:fixed;bottom:80px;right:80px;z-index:9998;background:rgba(25,25,35,.95);border-radius:16px;padding:16px;box-shadow:0 8px 30px rgba(0,0,0,.4);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);width:360px;min-width:220px;min-height:120px;font-family:inherit;overflow:auto;resize:both}
.lofi-player .hdr{cursor:move}
.lofi-player.hidden{opacity:0;transform:scale(.8) translateY(10px);pointer-events:none}
.lofi-player .hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.lofi-player .hdr .left{display:flex;align-items:center;gap:8px}
.lofi-player .hdr .left span{font-size:.82rem;color:#b8a99a;font-weight:600}
.lofi-player .hdr button{background:none;border:none;color:#888;cursor:pointer;font-size:.9rem;padding:2px 8px;border-radius:6px}
.lofi-player .hdr button:hover{background:rgba(255,255,255,.08);color:#ccc}
.lofi-player .lofi-extra{max-height:0;overflow:hidden;transition:max-height .4s ease,margin .3s;margin-top:0}
.lofi-player.expanded .lofi-extra{max-height:200px;margin-top:12px}
.lofi-player .lofi-extra p{color:#887a6a;font-size:.78rem;line-height:1.5;margin:0;text-align:center}
.lofi-player .lofi-extra .sts{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:10px}
.lofi-player .lofi-extra .sts a{padding:4px 10px;border-radius:12px;font-size:.75rem;background:rgba(255,255,255,.06);color:#b8a99a;text-decoration:none}
.lofi-player .lofi-extra .sts a:hover{background:rgba(255,255,255,.12);color:#e0d5c1}
.lofi-player .play-bar{display:flex;align-items:center;gap:10px;padding:8px 0;margin-bottom:8px}
.pomo-box{position:fixed;bottom:80px;right:80px;z-index:9998;background:rgba(25,25,35,.95);border-radius:16px;padding:20px;box-shadow:0 8px 30px rgba(0,0,0,.4);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);width:280px;min-width:220px;min-height:180px;font-family:inherit;text-align:center;overflow:auto;resize:both}
.pomo-box .hdr{cursor:move}
.pomo-box.hidden{opacity:0;transform:scale(.8) translateY(10px);pointer-events:none}
.pomo-box .hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.pomo-box .hdr span{font-size:.78rem;color:#b8a99a;font-weight:600}
.pomo-box .hdr button{background:none;border:none;color:#888;cursor:pointer;font-size:.85rem;padding:2px 6px;border-radius:6px}
.pomo-box .hdr button:hover{background:rgba(255,255,255,.08);color:#ccc}
.pomo-box .mode{font-size:.75rem;color:#887a6a;margin-bottom:6px}
.pomo-box .time{font-size:3rem;font-weight:800;margin:6px 0;letter-spacing:2px;color:#f0e6d0;text-shadow:0 0 12px rgba(240,230,208,.15)}
.pomo-box .bar{height:4px;border-radius:2px;margin:8px 0 14px;transition:.3s}
.pomo-box .acts{display:flex;gap:8px;justify-content:center}
.pomo-box .acts button{border:none;border-radius:20px;padding:8px 24px;font-weight:600;font-size:.82rem;cursor:pointer;color:#fff;transition:.2s;font-family:inherit}
.pomo-box .acts button:hover{opacity:.85}
.pomo-box .acts .start{background:var(--color-primary,#FFD700);color:#222!important}
.pomo-box .acts .reset{background:transparent;border:1px solid #555!important;color:#888!important;padding:8px 16px}
@media(max-width:640px){
  .ext-arrow{right:12px;bottom:max(12px,env(safe-area-inset-bottom))}
  .ext-tray{right:12px;bottom:60px}
  .lofi-player,.pomo-box{right:12px;bottom:64px;width:calc(100vw - 24px);max-height:calc(100svh - 90px);overflow:auto}
  #lofi-frame{right:12px!important;bottom:64px!important;width:calc(100vw - 24px)!important}
}
`;
document.head.appendChild(S);

const arrow=document.createElement("button");arrow.className="ext-arrow";arrow.id="ext-arrow";arrow.textContent="^";arrow.title="Ferramentas";
const tray=document.createElement("div");tray.className="ext-tray hidden";tray.id="ext-tray";
const trayLanguage=localStorage.getItem("afb_language")||"pt";
const traySavedLabels={pt:"Salvos",en:"Saved",es:"Guardados",fr:"Enregistrés",it:"Salvati",tr:"Kaydedilenler",ar:"المحفوظات",he:"שמורים",hi:"सहेजे गए",pl:"Zapisane"};
const traySavedLabel=traySavedLabels[trayLanguage]||traySavedLabels.pt;
tray.innerHTML='<div class="ext-item" id="tray-lofi"><span class="dot" id="tl-dot"></span><span id="tl-name">🎵 LoFi</span><span class="tray-play" id="tl-play" style="margin-left:auto;font-size:.8rem;padding:2px 8px;border-radius:8px;background:#444;color:#999">▶</span></div><div class="ext-item" id="tray-pomo"><span class="dot" id="tp-dot"></span>🍅 Pomodoro</div><div class="ext-item" id="tray-saved"><span class="dot" id="ts-dot"></span><span id="tray-saved-icon">❤️</span> '+traySavedLabel+'</div>';
const initialMusic=musicGet();const lofiFrame=document.createElement("iframe");lofiFrame.id="lofi-frame";lofiFrame.setAttribute("width","360");lofiFrame.setAttribute("height","80");lofiFrame.setAttribute("frameborder","0");lofiFrame.setAttribute("allow","autoplay");lofiFrame.style.cssText="position:fixed;bottom:-9999px;right:-9999px;border-radius:10px";

const lofi=document.createElement("div");lofi.className="lofi-player hidden";lofi.id="lofi-player";
lofi.innerHTML='<div class="hdr"><div class="left"><span>🎧 Working · LoFi Cafe</span></div><div><button class="expand-btn" id="lofi-expand" title="Expandir">⤢</button><button id="lofi-x">✕</button></div></div><div class="play-bar"><button id="lofi-play" style="width:44px;height:44px;border-radius:50%;border:none;background:var(--color-primary,#FFD700);color:#222;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">▶</button><span style="font-size:.8rem;color:#887a6a">Clique para ouvir</span></div><div class="lofi-extra"><p>🎵 Música ambiente para focar<br>Clique no player para ajustar volume</p><div class="sts"><a href="https://loficafe.net/embed/chilling" target="_blank">🧊 Chill</a><a href="https://loficafe.net/embed/studying" target="_blank">📚 Study</a><a href="https://loficafe.net/embed/working" target="_blank">💼 Work</a><a href="https://loficafe.net/embed/sleeping" target="_blank">😴 Sleep</a><a href="https://loficafe.net/embed/gaming" target="_blank">🎮 Game</a></div></div>';
const pomo=document.createElement("div");pomo.className="pomo-box hidden";pomo.id="pomo-box";
pomo.innerHTML='<div class="hdr"><span>🍅 Pomodoro</span><button id="pomo-x">✕</button></div><div class="mode" id="pomo-mode">📚 Foco</div><div class="time" id="pomo-time">25:00</div><div class="bar" id="pomo-bar" style="width:0%"></div><div class="acts"><button class="start" id="pomo-start">▶ Iniciar</button><button class="reset" id="pomo-reset">↺</button></div>';
const saved=document.createElement("div");saved.className="pomo-box hidden";saved.id="saved-box";
saved.innerHTML='<div class="hdr"><span>📝 Caderno</span><button id="saved-x">✕</button></div><div id="saved-list" style="max-height:400px;overflow-y:auto;text-align:left;font-size:.82rem"><p style="color:#887a6a;text-align:center;padding:20px">Carregando...</p></div>';
document.body.append(arrow,tray,lofiFrame,lofi,pomo,saved);

// ── Arrastar e redimensionar (posicao/tamanho salvos por widget) ──
function makeDraggable(el,key){
  const POS_KEY="afb_widget_pos_"+key;
  try{
    const saved=JSON.parse(localStorage.getItem(POS_KEY)||"null");
    if(saved&&typeof saved.left==="number"&&typeof saved.top==="number"){
      el.style.left=saved.left+"px";el.style.top=saved.top+"px";
      el.style.right="auto";el.style.bottom="auto";
    }
    if(saved&&saved.width){el.style.width=saved.width}
    if(saved&&saved.height){el.style.height=saved.height}
  }catch(e){}
  const hdr=el.querySelector(".hdr");
  if(hdr){
    let dragging=false,startX=0,startY=0,startLeft=0,startTop=0;
    const onMove=(e)=>{
      if(!dragging)return;
      const p=e.touches?e.touches[0]:e;
      let left=startLeft+(p.clientX-startX),top=startTop+(p.clientY-startY);
      left=Math.max(4,Math.min(window.innerWidth-60,left));
      top=Math.max(4,Math.min(window.innerHeight-40,top));
      el.style.left=left+"px";el.style.top=top+"px";el.style.right="auto";el.style.bottom="auto";
    };
    const onUp=()=>{
      if(!dragging)return;dragging=false;
      const r=el.getBoundingClientRect();
      const cur=JSON.parse(localStorage.getItem(POS_KEY)||"{}");
      localStorage.setItem(POS_KEY,JSON.stringify({...cur,left:r.left,top:r.top}));
      document.removeEventListener("mousemove",onMove);document.removeEventListener("mouseup",onUp);
      document.removeEventListener("touchmove",onMove);document.removeEventListener("touchend",onUp);
    };
    const onDown=(e)=>{
      if(e.target.tagName==="BUTTON")return;
      dragging=true;const p=e.touches?e.touches[0]:e;const r=el.getBoundingClientRect();
      startX=p.clientX;startY=p.clientY;startLeft=r.left;startTop=r.top;
      document.addEventListener("mousemove",onMove);document.addEventListener("mouseup",onUp);
      document.addEventListener("touchmove",onMove,{passive:false});document.addEventListener("touchend",onUp);
    };
    hdr.addEventListener("mousedown",onDown);
    hdr.addEventListener("touchstart",onDown,{passive:true});
  }
  if(window.ResizeObserver){
    let first=true;
    new ResizeObserver(()=>{
      if(first){first=false;return}
      const cur=JSON.parse(localStorage.getItem(POS_KEY)||"{}");
      localStorage.setItem(POS_KEY,JSON.stringify({...cur,width:el.style.width||el.offsetWidth+"px",height:el.style.height||el.offsetHeight+"px"}));
    }).observe(el);
  }
}
makeDraggable(lofi,"lofi");
makeDraggable(pomo,"pomo");

arrow.onclick=()=>tray.classList.toggle("hidden");
document.addEventListener("click",e=>{if(!arrow.contains(e.target)&&!tray.contains(e.target))tray.classList.add("hidden")});

const ld=document.getElementById("tl-dot");const pd=document.getElementById("tp-dot");const lp=document.getElementById("tl-play");
function lofiPlay(){lofiFrame.style.cssText="position:fixed;bottom:20px;right:20px;width:360px;border-radius:10px;z-index:9997";lofiFrame.src=`https://loficafe.net/embed/${musicGet().station}?utm_source=deutschbloom&utm_medium=embed`;ld.classList.add("on");lp.textContent="⏸";lp.style.background="#2d7a2d";lp.style.color="#fff";musicSet({playing:true})}
function lofiPause(){lofiFrame.style.cssText="position:fixed;bottom:-9999px;right:-9999px";lofiFrame.src="";ld.classList.remove("on");lp.textContent="▶";lp.style.background="#444";lp.style.color="#999";musicSet({playing:false})}
document.getElementById("tl-name").onclick=()=>{tray.classList.add("hidden");if(window.AFBMusicPlayer){document.querySelector(".music-player")?.scrollIntoView({behavior:"smooth",block:"center"});return}lofi.classList.remove("hidden")};
lp.onclick=(e)=>{e.stopPropagation();tray.classList.add("hidden");if(window.AFBMusicPlayer){window.AFBMusicPlayer.toggle();return}const f=lofiFrame;if(f.style.bottom==="-9999px")lofiPlay();else lofiPause()};
document.addEventListener("afb:music-state",function(e){var d=e.detail||{};document.getElementById("tl-name").textContent=d.title||"Música";lp.textContent=d.playing?"⏸":"▶";ld.classList.toggle("on",!!d.playing)});
document.getElementById("lofi-x").onclick=()=>{lofi.classList.add("hidden");lofiPause()};
document.getElementById("lofi-play").onclick=function(){const f=lofiFrame;if(f.style.bottom==="-9999px"){f.style.cssText="position:fixed;bottom:20px;right:20px;width:360px;border-radius:10px;z-index:9997";f.src=`https://loficafe.net/embed/${musicGet().station}?utm_source=deutschbloom&utm_medium=embed`;this.textContent="⏸";musicSet({playing:true})}else{f.style.cssText="position:fixed;bottom:-9999px;right:-9999px";f.src="";this.textContent="▶";musicSet({playing:false})}};
document.getElementById("lofi-expand").onclick=function(){lofi.classList.toggle("expanded");this.textContent=lofi.classList.contains("expanded")?"⤡":"⤢"};
document.querySelectorAll('.lofi-extra .sts a').forEach(link=>{link.onclick=e=>{e.preventDefault();const station=link.href.split('/embed/')[1].split('?')[0];lofiFrame.src=`https://loficafe.net/embed/${station}?utm_source=deutschbloom&utm_medium=embed`;musicSet({station});if(musicGet().playing)lofiPlay()}});
document.getElementById("tray-pomo").onclick=()=>{tray.classList.add("hidden");pomo.classList.toggle("hidden");pd.classList.toggle("on",!pomo.classList.contains("hidden"))};
document.getElementById("pomo-x").onclick=()=>{pomo.classList.add("hidden");pd.classList.remove("on")};

// ── Salvos ──
const sd=document.getElementById("ts-dot");
const APP_PREFIX=window.location.pathname.includes("/app/")?"":"app/";
document.getElementById("tray-saved").onclick=()=>{ window.location.href = APP_PREFIX+"caderno.html"; };
// old saved panel cleanup
try { document.getElementById("saved-x")?.remove(); document.getElementById("saved-box")?.remove(); } catch(e){}
const PW=25*60,PB=5*60,POMO_KEY="afb_pomodoro_state";
let pt=null,pm="work",ps=PW,pr=false,endAt=0;
function pomoSave(){localStorage.setItem(POMO_KEY,JSON.stringify({mode:pm,seconds:ps,running:pr,endAt:pr?endAt:0}))}
function pomoLoad(){try{const x=JSON.parse(localStorage.getItem(POMO_KEY)||"{}");pm=x.mode==="break"?"break":"work";pr=!!x.running;endAt=Number(x.endAt)||0;ps=pr&&endAt?Math.max(0,Math.ceil((endAt-Date.now())/1000)):Math.max(0,Number(x.seconds)||(pm==="work"?PW:PB))}catch(e){}}
function pomoTick(){if(!pr)return;if(endAt)ps=Math.max(0,Math.ceil((endAt-Date.now())/1000));if(ps<=0){pm=pm==="work"?"break":"work";ps=pm==="work"?PW:PB;endAt=Date.now()+ps*1000;pomoSave()}u()}
document.getElementById("pomo-start").onclick=function(){
if(pr){pr=false;if(pt){clearInterval(pt);pt=null}endAt=0;this.textContent="▶ Continuar";pomoSave()}
else{pr=true;endAt=Date.now()+ps*1000;pt=setInterval(pomoTick,1000);this.textContent="⏸ Pausar";pomoSave()}};
document.getElementById("pomo-reset").onclick=()=>{pr=false;if(pt){clearInterval(pt);pt=null}pm="work";ps=PW;endAt=0;document.getElementById("pomo-start").textContent="▶ Iniciar";pomoSave();u()};
function u(){const e=document.getElementById("pomo-time"),m=document.getElementById("pomo-mode"),b=document.getElementById("pomo-bar"),mi=Math.floor(ps/60),s=ps%60;e.textContent=String(mi).padStart(2,"0")+":"+String(s).padStart(2,"0");const t=pm==="work"?PW:PB,p=t>0?((t-ps)/t)*100:0;b.style.width=p+"%";const c=pm==="work"?"var(--color-primary,#FFD700)":"var(--color-warm,#6C5CE7)";b.style.background=c;m.textContent=pm==="work"?"📚 Foco":"☕ Pausa";m.style.color=c;pomoSave()}
pomoLoad();if(pr){pomoTick();pt=setInterval(pomoTick,1000);document.getElementById("pomo-start").textContent="⏸ Pausar";pd.classList.add("on")}u();
if(initialMusic.playing)setTimeout(lofiPlay,300);
})();

// Mede tempo de estudo nas páginas internas e sincroniza o Plano de Jornada.
(function(){if(document.querySelector('script[src*="study-plan.js"]'))return;const s=document.createElement("script");s.src="../assets/js/study-plan.js?v=20260714-time3";s.onload=()=>StudyPlan.init();document.head.appendChild(s)})();
