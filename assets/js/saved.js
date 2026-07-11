// Sistema de Salvos/Favoritos — integrado ao Supabase
// Uso: SavedItems.save({type, id, nivel, title, subtitle, preview, link})
//       SavedItems.unsave(type, id)
//       SavedItems.isSaved(type, id) → Promise<bool>

const SavedItems = (() => {
  const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
  const SUPABASE_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
  const TABLE = "saved_items";

  let _userId = null;

  async function getUserId() {
    if (_userId) return _userId;
    const { data } = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${(await getSession()).access_token}` }
    }).then(r => r.json()).catch(() => ({}));
    _userId = data?.id || null;
    return _userId;
  }

  async function getSession() {
    // Tenta pegar do localStorage do Supabase
    const raw = localStorage.getItem("sb-zqrdpmrwnprtelgloawb-auth-token");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
    return { access_token: "" };
  }

  async function save({ type, id, nivel, title, subtitle, preview, link, notes }) {
    const userId = await getUserId();
    if (!userId) return false;
    const session = getSession();
    const body = {
      user_id: userId, item_type: type, item_id: id,
      nivel: nivel || "", title: title || "", subtitle: subtitle || "",
      preview_text: (preview || "").substring(0, 200),
      link_url: link || window.location.href,
      notes: notes || ""
    };
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${session.access_token}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(body)
      });
      return r.ok;
    } catch { return false; }
  }

  async function unsave(type, id) {
    const userId = await getUserId();
    if (!userId) return false;
    const session = await getSession();
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?user_id=eq.${userId}&item_type=eq.${type}&item_id=eq.${id}`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session.access_token}` }
      });
      return r.ok;
    } catch { return false; }
  }

  async function getAll() {
    const userId = await getUserId();
    if (!userId) return [];
    const session = await getSession();
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?user_id=eq.${userId}&order=created_at.desc&limit=50`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session.access_token}` }
      });
      return await r.json();
    } catch { return []; }
  }

  async function isSaved(type, id) {
    const userId = await getUserId();
    if (!userId) return false;
    const session = await getSession();
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?user_id=eq.${userId}&item_type=eq.${type}&item_id=eq.${id}&select=id`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session.access_token}` }
      });
      const data = await r.json();
      return data.length > 0;
    } catch { return false; }
  }

  async function update(id, data) {
    const session = getSession();
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${id}`, {
        method: "PATCH",
        headers: { "Content-Type":"application/json", apikey:SUPABASE_KEY, Authorization:`Bearer ${session.access_token}`, Prefer:"return=minimal" },
        body: JSON.stringify(data)
      });
      return r.ok;
    } catch { return false; }
  }

  // Abre modal de notas ao salvar
  function showNotesModal({ type, id, title, onSave }) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center";
    const box = document.createElement("div");
    box.style.cssText = "background:var(--bg-secondary,#1e1e2a);border-radius:16px;padding:24px;width:380px;max-width:90vw;box-shadow:0 8px 40px rgba(0,0,0,.5);font-family:inherit";
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong style="color:var(--text-primary)">📝 ${title?.substring(0,40)||"Salvar"}</strong>
        <button id="notes-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:1.2rem">✕</button>
      </div>
      <textarea id="notes-text" placeholder="Escreva suas anotações... (opcional)" style="width:100%;height:100px;background:rgba(255,255,255,.05);border:1px solid var(--border-light);border-radius:10px;padding:12px;color:var(--text-primary);font-family:inherit;font-size:.85rem;resize:vertical"></textarea>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button id="notes-save" style="flex:1;padding:10px;border-radius:10px;border:none;background:var(--color-primary,#FFD700);color:#222;font-weight:700;cursor:pointer;font-family:inherit">💾 Salvar</button>
        <button id="notes-skip" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--border-light);background:transparent;color:var(--text-secondary);cursor:pointer;font-family:inherit">Pular</button>
      </div>`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) { overlay.remove(); onSave(""); } };
    document.getElementById("notes-close").onclick = () => { overlay.remove(); onSave(""); };
    document.getElementById("notes-skip").onclick = () => { overlay.remove(); onSave(""); };
    document.getElementById("notes-save").onclick = () => {
      const notes = document.getElementById("notes-text").value;
      overlay.remove();
      onSave(notes);
    };
  }
  function icon(saved) {
    const t = (typeof Theme !== "undefined" && Theme.get()) || "vikings";
    return t === "guardians" ? (saved ? "❤️" : "🤍") : (saved ? "💛" : "💛");
  }

  // Cria botao de salvar tematico
  function createSaveButton({ type, id, nivel, title, subtitle, preview, link }) {
    const btn = document.createElement("button");
    btn.className = "btn-save";
    btn.title = "Salvar para depois";
    btn.innerHTML = icon(false);
    btn.style.cssText = "background:transparent;border:1px solid var(--border-light);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:1.1rem;transition:.2s;opacity:.4";

    btn.onmouseenter = () => { btn.style.opacity = "1"; btn.style.borderColor = "var(--color-primary)"; };
    btn.onmouseleave = () => { isSaved(type,id).then(s => { btn.style.opacity = s ? "1" : ".4"; btn.style.borderColor = s ? "var(--color-primary)" : "var(--border-light)"; }); };

    isSaved(type, id).then(saved => {
      btn.innerHTML = icon(saved);
      btn.style.opacity = saved ? "1" : ".4";
      btn.style.borderColor = saved ? "var(--color-primary)" : "var(--border-light)";
    });

    btn.onclick = async (e) => {
      e.preventDefault(); e.stopPropagation();
      try {
        const saved = await isSaved(type, id);
        if (saved) {
          await unsave(type, id);
          btn.innerHTML = icon(false);
          btn.style.opacity = ".4"; btn.style.borderColor = "var(--border-light)";
        } else {
          // Abre modal de notas antes de salvar
          showNotesModal({
            type, id, title,
            onSave: async (notes) => {
              btn.innerHTML = "⏳"; btn.disabled = true;
              const ok = await save({ type, id, nivel, title, subtitle, preview, link, notes });
              btn.innerHTML = icon(ok);
              btn.style.opacity = ok ? "1" : ".4";
              btn.style.borderColor = ok ? "var(--color-primary)" : "var(--border-light)";
              btn.disabled = false;
            }
          });
        }
      } catch { btn.innerHTML = "⚠️"; }
    };
    return btn;
  }

  return { save, unsave, getAll, isSaved, update, createSaveButton, showNotesModal };
})();
