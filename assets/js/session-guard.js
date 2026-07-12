(function(){
  async function check(mode){const token=await Auth.accessToken();if(!token)return;try{const r=await fetch('/.netlify/functions/session-guard',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({mode:mode||'heartbeat',device:(navigator.platform||'Navegador')+' · '+(navigator.userAgent.includes('Mobile')?'Mobile':'Desktop')})});if(r.status===409){await getSupabase()?.auth.signOut();alert('Esta conta foi aberta em outro dispositivo. Para sua segurança, esta sessão foi encerrada.');location.href=AFB_BASE+'/app/login.html'}}catch(e){}}
  Auth._ready().then(()=>{if(!Auth.currentUser())return;check('register');setInterval(()=>check('heartbeat'),60000)});
})();

