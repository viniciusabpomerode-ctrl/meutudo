// Caderno — R2 via Worker
// Vikings: 💛 | Guardiãs: ❤️/🤍

const SavedItems = (() => {
  const WORKER = "/.netlify/functions/saved-items";
  let cache = null;
  let loading = null;

  function localItems() {
    try { return JSON.parse(localStorage.getItem("afb_saved") || "[]"); } catch { return []; }
  }
  function mergeItems(remote, local) {
    const map = new Map();
    [...(remote||[]), ...(local||[])].forEach(i => map.set(`${i.type}:${i.id}`, i));
    return [...map.values()].sort((a,b) => String(b.created_at||"").localeCompare(String(a.created_at||"")));
  }
  async function timedFetch(url, options, ms=8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try { return await fetch(url, {...options, signal:controller.signal}); }
    finally { clearTimeout(timer); }
  }

  function getUserId() {
    // Tenta Supabase Auth primeiro
    try {
      if (typeof Auth !== "undefined" && Auth.currentUser) {
        var u = Auth.currentUser();
        if (u && u.id) return u.id;
      }
    } catch(e) {}
    // Fallback localStorage
    try {
      var s = JSON.parse(localStorage.getItem("afb_session") || "{}");
      if (s.id) return s.id;
      if (s.email) return s.email;
    } catch(e) {}
    return localStorage.getItem("afb_fallback_uid") || "anon";
  }

  async function requestOptions(method, body) {
    const token = typeof Auth !== "undefined" && Auth.accessToken
      ? await Auth.accessToken()
      : null;
    const headers = {"Content-Type":"application/json"};
    if (token) headers.Authorization = `Bearer ${token}`;
    return {method, headers, ...(body === undefined ? {} : {body: JSON.stringify(body)})};
  }

  async function load() {
    if (cache) return cache;
    if (loading) return loading;
    loading = (async () => {
      const local = localItems();
      try {
        const r = await timedFetch(WORKER, await requestOptions("GET"));
        if (r.ok) cache = mergeItems(await r.json(), local);
      } catch {}
      cache = cache || local;
      localStorage.setItem("afb_saved", JSON.stringify(cache));
      loading = null;
      return cache;
    })();
    return loading;
  }

  // Salva local primeiro (sempre funciona), depois tenta mandar pro R2.
  // Retorna false se a sincronizacao com o servidor falhar -- o item fica
  // salvo so localmente nesse caso, e quem chamou precisa avisar a pessoa.
  async function save(items) {
    cache = items;
    localStorage.setItem("afb_saved", JSON.stringify(items));
    try {
      const r = await timedFetch(WORKER, await requestOptions("PUT", items));
      return r.ok;
    } catch {
      return false;
    }
  }

  async function add({ type, id, parentId, nivel, refUrl, notes, title, subtitle, audioUrl }) {
    let items = await load();
    items = items.filter(i => !(i.type===type && i.id===id));
    items.unshift({ type, id, parentId, nivel, refUrl:refUrl||window.location.href, notes:notes||"", title:title||"", subtitle:subtitle||"", audioUrl:audioUrl||"", reviewed_at:null, created_at:new Date().toISOString() });
    return await save(items);
  }

  async function remove(type, id) { return await save((await load()).filter(i => !(i.type===type && i.id===id))); }
  async function getAll() { return await load(); }
  async function isSaved(type, id) { return (await load()).some(i => i.type===type && i.id===id); }
  async function updateNotes(type, id, notes) { let items=await load(); const idx=items.findIndex(i=>i.type===type&&i.id===id); if(idx>=0){items[idx].notes=notes;return await save(items)} return false; }
  async function markReviewed(type, id) { let items=await load(); const idx=items.findIndex(i=>i.type===type&&i.id===id); if(idx>=0){items[idx].reviewed_at=new Date().toISOString();return await save(items)} return false; }

  function icon(saved) { const t=(typeof Theme!=="undefined"&&Theme.get())||"vikings"; return t==="guardians"?(saved?"❤️":"🤍"):(saved?"💛":"💛"); }

  function showNotesModal({ title, onSave }) {
    const overlay=document.createElement("div");
    overlay.style.cssText="position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center";
    const box=document.createElement("div");
    box.style.cssText="background:var(--bg-secondary,#1e1e2a);border-radius:16px;padding:24px;width:380px;max-width:90vw;box-shadow:0 8px 40px rgba(0,0,0,.5);font-family:inherit";
    box.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><strong style="color:var(--text-primary)">📝 '+(title||"Salvar").substring(0,40)+'</strong><button id="nx" style="background:none;border:none;color:#888;cursor:pointer;font-size:1.2rem">✕</button></div><textarea id="nt" placeholder="Escreva suas anotações... (opcional)" style="width:100%;height:100px;background:rgba(255,255,255,.05);border:1px solid var(--border-light);border-radius:10px;padding:12px;color:var(--text-primary);font-family:inherit;font-size:.85rem;resize:vertical"></textarea><div style="display:flex;gap:8px;margin-top:12px"><button id="ns" style="flex:1;padding:10px;border-radius:10px;border:none;background:var(--color-primary,#FFD700);color:#222;font-weight:700;cursor:pointer;font-family:inherit">💾 Salvar</button><button id="np" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--border-light);background:transparent;color:var(--text-secondary);cursor:pointer;font-family:inherit">Pular</button></div>';
    overlay.appendChild(box);document.body.appendChild(overlay);
    const close=(n)=>{overlay.remove();onSave(n||"");};
    overlay.onclick=(e)=>{if(e.target===overlay)close();};
    document.getElementById("nx").onclick=()=>close();
    document.getElementById("np").onclick=()=>close();
    document.getElementById("ns").onclick=()=>close(document.getElementById("nt").value);
  }

  function createSaveButton({ type, id, parentId, nivel, title, subtitle, audioUrl, refUrl }) {
    const btn=document.createElement("button");
    btn.className="btn-save";btn.title="Salvar para depois";btn.innerHTML=icon(false);
    btn.style.cssText="background:transparent;border:1px solid var(--border-light);border-radius:8px;padding:4px 10px;cursor:pointer;font-size:1rem;transition:.2s;opacity:.4;line-height:1";
    btn.onmouseenter=()=>{btn.style.opacity="1";btn.style.borderColor="var(--color-primary)";};
    btn.onmouseleave=()=>{};
    isSaved(type,id).then(s=>{btn.innerHTML=icon(s);btn.style.opacity=s?"1":".4";btn.style.borderColor=s?"var(--color-primary)":"var(--border-light)";});
    btn.onclick=async(e)=>{
      e.preventDefault();e.stopPropagation();
      if(getUserId()==="anon"){
        location.href="login.html?next="+encodeURIComponent(location.pathname+location.search);
        return;
      }
      try{
        const saved=await isSaved(type,id);
        if(saved){
          const synced=await remove(type,id);
          btn.innerHTML=icon(false);btn.style.opacity=".4";btn.style.borderColor="var(--border-light)";
          if(!synced)btn.title="Removido aqui, mas não deu pra confirmar com o servidor — confira sua internet.";
        }
        else{showNotesModal({title,onSave:async(notes)=>{
          btn.innerHTML="⏳";btn.disabled=true;
          const synced=await add({type,id,parentId,nivel,refUrl,notes,title,subtitle,audioUrl});
          btn.innerHTML=synced?icon(true):"⚠️";
          btn.style.opacity="1";
          btn.style.borderColor=synced?"var(--color-primary)":"#c9786d";
          btn.title=synced?"Salvo":"Salvo só neste aparelho — não deu pra sincronizar com sua conta agora. Tenta de novo com internet.";
          btn.disabled=false;
        }});}
      }catch{btn.innerHTML="⚠️";}
    };
    return btn;
  }

  return { add, remove, getAll, isSaved, updateNotes, markReviewed, createSaveButton };
})();
