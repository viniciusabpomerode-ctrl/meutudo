// ============================================================
// Autenticacao via Supabase Auth (email/senha + Google OAuth)
// Sessao JWT gerenciada pelo Supabase, dados no R2.
// ============================================================

const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
const AFB_BASE = location.pathname.includes("/alemao-facil-brasil/") || location.pathname.startsWith("/alemao-facil-brasil") ? "/alemao-facil-brasil" : "";

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
            sb.auth.getSession().then(function(x){_afbSessionCache=x&&x.data?x.data.session:null;r(true)}).catch(function(){r(true)});
            if(sb.auth.onAuthStateChange)sb.auth.onAuthStateChange(function(_event,session){_afbSessionCache=session||null});
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
      return {ok:true};
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

  updateCurrentUser: function(patch){},

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
      if(Auth.currentUser())window.location.href=AFB_BASE+"/app/dashboard.html";
    });
  }
};
