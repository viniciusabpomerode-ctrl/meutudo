// ============================================================
// Autenticacao via Supabase Auth (email/senha + Google OAuth)
// Sessao JWT gerenciada pelo Supabase, dados no R2.
// ============================================================

const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
const AFB_BASE = location.pathname.includes("/alemao-facil-brasil/") || location.pathname.startsWith("/alemao-facil-brasil") ? "/alemao-facil-brasil" : "";

// Guarda o codigo mesmo se a pessoa navegar, usar login Google ou precisar
// confirmar o e-mail antes de receber o teste promocional.
(function capturePromoCode(){
  try{
    var code=new URLSearchParams(location.search).get("promo");
    code=String(code||"").trim().toUpperCase();
    if(/^[A-Z0-9_-]{3,40}$/.test(code))localStorage.setItem("afb_pending_promo",code);
  }catch(e){}
})();

// Carrega Supabase JS dinamicamente
(function(){
  var s=document.createElement("script");
  s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
  s.onload=function(){window._supabaseReady=true};
  document.head.appendChild(s);
})();

function getSupabase(){
  if(!window._supabaseReady||!window.supabase)return null;
  if(!window._sb)window._sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
  return window._sb;
}

var _afbSessionCache = null;
var _afbAuthReadyPromise = null;
async function syncPendingReferral(session){const code=localStorage.getItem('afb_pending_referral');if(!code||!session?.access_token)return;try{const r=await fetch('/.netlify/functions/referrals',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({code})});if(r.ok)localStorage.removeItem('afb_pending_referral')}catch(e){}}
function showPromoActivated(days){
  const lang=localStorage.getItem('afb_language')||'pt';
  const messages={
    pt:`Seu teste de ${days} dias foi ativado. Aproveite a biblioteca completa!`,
    en:`Your ${days}-day trial is active. Enjoy the complete library!`,
    es:`Tu prueba de ${days} días está activa. ¡Disfruta de la biblioteca completa!`,
    fr:`Votre essai de ${days} jours est activé. Profitez de toute la bibliothèque !`,
    it:`La tua prova di ${days} giorni è attiva. Goditi la biblioteca completa!`,
    tr:`${days} günlük deneme süreniz etkinleştirildi. Tüm kütüphanenin keyfini çıkarın!`,
    ar:`تم تفعيل تجربتك لمدة ${days} أيام. استمتع بالمكتبة الكاملة!`,
    he:`תקופת הניסיון שלך ל-${days} ימים הופעלה. כל הספרייה פתוחה עבורך!`,
    hi:`आपका ${days} दिन का ट्रायल सक्रिय हो गया है। पूरी लाइब्रेरी का आनंद लें!`,
    pl:`Twój ${days}-dniowy okres próbny jest aktywny. Korzystaj z całej biblioteki!`
  };
  const render=()=>{if(document.getElementById('afb-promo-notice'))return;const el=document.createElement('div');el.id='afb-promo-notice';el.setAttribute('role','status');el.textContent=messages[lang]||messages.pt;el.style.cssText='position:fixed;z-index:100000;left:50%;top:18px;transform:translateX(-50%);max-width:min(92vw,560px);padding:13px 18px;border-radius:12px;background:#216e4e;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.25);font-weight:700;text-align:center';document.body.appendChild(el);setTimeout(()=>el.remove(),7000)};
  if(document.body)render();else document.addEventListener('DOMContentLoaded',render,{once:true});
}
async function syncPendingPromo(session){
  const code=localStorage.getItem('afb_pending_promo');
  if(!code||!session?.access_token)return;
  try{
    const r=await fetch('/.netlify/functions/promo-links',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({code})});
    const data=await r.json().catch(()=>({}));
    if(r.ok){
      localStorage.removeItem('afb_pending_promo');
      localStorage.setItem('afb_promo_result',JSON.stringify({ok:true,days:data.trial_days,expires_at:data.expires_at,at:Date.now()}));
      showPromoActivated(data.trial_days||3);
    }else if(r.status===404||r.status===409){
      localStorage.removeItem('afb_pending_promo');
      localStorage.setItem('afb_promo_result',JSON.stringify({ok:false,reason:data.reason||data.error,at:Date.now()}));
    }
  }catch(e){}
}
function syncPendingBenefits(session){syncPendingReferral(session);syncPendingPromo(session)}

function getUserId(){
  var sb=getSupabase();
  if(!sb)return localStorage.getItem("afb_fallback_uid")||"anon";
  try{
    var session=sb.auth.session();
    return session&&session.user?session.user.id:localStorage.getItem("afb_fallback_uid")||"anon";
  }catch(e){return localStorage.getItem("afb_fallback_uid")||"anon"}
}

const Auth = {
  _ready: function(){
    if (_afbAuthReadyPromise) return _afbAuthReadyPromise;
    _afbAuthReadyPromise = new Promise(function(r){
      var i=0;
      var check=function(){
        if(window._supabaseReady&&window.supabase){
          var sb=getSupabase();
          if(!sb){r(false);return}
          if(sb.auth.getSession){
            sb.auth.getSession().then(function(x){_afbSessionCache=x&&x.data?x.data.session:null;syncPendingBenefits(_afbSessionCache);r(true)}).catch(function(){r(true)});
            if(sb.auth.onAuthStateChange)sb.auth.onAuthStateChange(function(_event,session){_afbSessionCache=session||null;syncPendingBenefits(_afbSessionCache)});
          }else{
            try{_afbSessionCache=sb.auth.session?sb.auth.session():null}catch(e){}
            r(true);
          }
        }else if(i++<100)setTimeout(check,100);else r(false)
      };
      check();
    });
    return _afbAuthReadyPromise;
  },

  signup: async function(opts){
    await Auth._ready();
    var sb=getSupabase();
    if(!sb)return {ok:false,error:"Supabase indisponivel"};
    try{
      var r=await sb.auth.signUp({email:opts.email,password:opts.password,options:{data:{name:opts.name}}});
      if(r.error)return {ok:false,error:r.error.message};
      localStorage.setItem("afb_fallback_uid",r.data.user.id);
      _afbSessionCache=r.data.session||_afbSessionCache;
      syncPendingBenefits(_afbSessionCache);
      return {ok:true, session:!!r.data.session};
    }catch(e){return {ok:false,error:e.message}}
  },

  login: async function(opts){
    await Auth._ready();
    var sb=getSupabase();
    if(!sb)return {ok:false,error:"Supabase indisponivel"};
    try{
      var r=await sb.auth.signInWithPassword({email:opts.email,password:opts.password});
      if(r.error)return {ok:false,error:r.error.message};
      localStorage.setItem("afb_fallback_uid",r.data.user.id);
      _afbSessionCache=r.data.session||_afbSessionCache;
      syncPendingBenefits(_afbSessionCache);
      return {ok:true};
    }catch(e){return {ok:false,error:e.message}}
  },

  loginWithGoogle: async function(){
    await Auth._ready();
    var sb=getSupabase();
    if(!sb)return {ok:false,error:"Supabase indisponivel"};
    try{
      var r=await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+AFB_BASE+"/app/dashboard.html"}});
      if(r.error)return {ok:false,error:r.error.message};
      return {ok:true};
    }catch(e){return {ok:false,error:e.message}}
  },

  logout: async function(){
    var sb=getSupabase();
    if(sb)try{await sb.auth.signOut()}catch(e){}
    localStorage.removeItem("afb_fallback_uid");
    window.location.href=AFB_BASE+"/index.html";
  },

  currentUser: function(){
    var sb=getSupabase();
    if(!sb)return null;
    try{
      var session=_afbSessionCache||(sb.auth.session?sb.auth.session():null);
      if(session&&session.user){
        var u=session.user;
        return {id:u.id,email:u.email,name:u.user_metadata?u.user_metadata.name:u.email,name:u.user_metadata?u.user_metadata.name||u.email.split("@")[0]:u.email.split("@")[0]};
      }
    }catch(e){}
    return null;
  },

  updateCurrentUser: async function(patch){
    await Auth._ready();
    var sb=getSupabase();
    if(!sb)return {ok:false,error:"Supabase indisponivel"};
    try{
      var data={};
      if(patch&&patch.name)data.name=String(patch.name).trim().slice(0,80);
      var r=await sb.auth.updateUser({data:data});
      if(r.error)return {ok:false,error:r.error.message};
      if(_afbSessionCache&&r.data&&r.data.user)_afbSessionCache.user=r.data.user;
      return {ok:true,user:r.data.user};
    }catch(e){return {ok:false,error:e.message}}
  },

  accessToken: async function(){
    await Auth._ready();
    if(_afbSessionCache&&_afbSessionCache.access_token)return _afbSessionCache.access_token;
    var sb=getSupabase();
    if(sb&&sb.auth.getSession){try{var x=await sb.auth.getSession();_afbSessionCache=x.data.session;return _afbSessionCache?_afbSessionCache.access_token:null}catch(e){}}
    return null;
  },

  requireLogin: function(){
    Auth._ready().then(function(){
      var u=Auth.currentUser();
      if(!u)window.location.href=AFB_BASE+"/app/login.html";
    });
  },

  redirectIfLoggedIn: function(){
    Auth._ready().then(function(){
      if(Auth.currentUser()){window.location.replace(AFB_BASE+"/index.html");return}
      setTimeout(function(){
        if(Auth.currentUser())window.location.replace(AFB_BASE+"/index.html");
      }, 600);
    });
  }
};

// Proteção leve contra uso simultâneo. O servidor continua sendo a
// autoridade; este arquivo apenas executa o heartbeat nas telas internas.
if (location.pathname.includes('/app/') && !location.pathname.endsWith('/login.html') && !location.pathname.endsWith('/cadastro.html')) {
  var sessionGuardScript=document.createElement('script');
  sessionGuardScript.src='../assets/js/session-guard.js';
  sessionGuardScript.defer=true;
  document.head.appendChild(sessionGuardScript);
}
