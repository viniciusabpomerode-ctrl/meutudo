// ============================================================
// Sistema de XP e niveis — portado de lib/models/xp_system.dart
// (mesmas faixas de XP e nomes de "criaturas" do app original)
// ============================================================

const XP_LEVELS = {
  A1: { name: "A1 - Iniciante", minXP: 0, maxXP: 499, icon: "🐱", creature: "Gato Maroto", color: "--level-a1" },
  A2: { name: "A2 - Elementar", minXP: 500, maxXP: 999, icon: "🦊", creature: "Raposa do Submundo", color: "--level-a2" },
  B1: { name: "B1 - Intermediário", minXP: 1000, maxXP: 1499, icon: "🔮", creature: "Ser Místico", color: "--level-b1" },
  B2: { name: "B2 - Intermediário Experiente", minXP: 1500, maxXP: 1999, icon: "🦉", creature: "Coruja em Extinção", color: "--level-b2" },
  C1: { name: "C1 - Avançado", minXP: 2000, maxXP: 2499, icon: "🐱", creature: "Gato de Asas", color: "--level-c1" },
  C2: { name: "C2 - Proficiente", minXP: 2500, maxXP: 999999, icon: "🦅", creature: "Águia do Conhecimento", color: "--level-c2" },
};
const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

const ACTIVITY_REWARDS = {
  dialog_sentence: 5,
  dialog_completed: 15,
  podcast_completed: 25,
  verb_studied: 10,
  music_track: 20,
  daily_streak: 10,
};

const XPSystem = {
  getCurrentLevel(xp) {
    for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
      const code = LEVEL_ORDER[i];
      if (xp >= XP_LEVELS[code].minXP) return code;
    }
    return "A1";
  },
  getNextLevel(level) {
    const idx = LEVEL_ORDER.indexOf(level);
    if (idx === -1 || idx === LEVEL_ORDER.length - 1) return level;
    return LEVEL_ORDER[idx + 1];
  },
  getProgressToNextLevel(xp) {
    const level = XPSystem.getCurrentLevel(xp);
    if (level === "C2") return 1;
    const next = XPSystem.getNextLevel(level);
    const cur = XP_LEVELS[level];
    const nxt = XP_LEVELS[next];
    return (xp - cur.minXP) / (nxt.minXP - cur.minXP);
  },
  getXPToNextLevel(xp) {
    const level = XPSystem.getCurrentLevel(xp);
    if (level === "C2") return 0;
    const next = XPSystem.getNextLevel(level);
    return XP_LEVELS[next].minXP - xp;
  },
  canAccessLevel(xp, level) {
    return xp >= XP_LEVELS[level].minXP;
  },
};

// ---------------- Progresso do usuario (localStorage + R2 sync) ----------------

const PROGRESS_WORKER = "/.netlify/functions/progress";

function progressKey(){
  var uid = "anon";
  try { if (typeof Auth !== "undefined" && Auth.currentUser) { var u = Auth.currentUser(); if (u && u.id) uid = u.id } } catch(e) {}
  if (uid === "anon") uid = localStorage.getItem("afb_fallback_uid") || "anon";
  return "afb_progress_" + uid;
}

function syncProgressToR2(progress){
  var key = progressKey();
  localStorage.setItem(key, JSON.stringify(progress));
  // Supabase autentica; a função usa o ID validado para gravar progress/:uid.json no R2.
  try { if(typeof Auth!=="undefined"&&Auth.accessToken)Auth.accessToken().then(function(token){
    if(!token)return;
    fetch(PROGRESS_WORKER,{method:"PUT",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify(progress)}).catch(function(){});
  }); } catch(e) {}
}

// Mescla posicoes de podcast local x remoto escolhendo, por chave
// "slug:idioma", o registro com updatedAt mais recente.
function mergePodcasts(local, remote){
  var out = Object.assign({}, local||{});
  var r = remote||{};
  for (var key in r) {
    if (!out[key] || new Date(r[key].updatedAt||0) > new Date(out[key].updatedAt||0)) {
      out[key] = r[key];
    }
  }
  return out;
}

function loadProgress(){
  var key = progressKey();
  try {
    var raw = localStorage.getItem(key);
    if (raw) {
      var p = JSON.parse(raw);
      if (!p.podcasts) p.podcasts = {};
      return p;
    }
  } catch(e) {}
  return { xp: 0, completed: [], streak: 0, lastActivity: null, podcasts: {} };
}

const Progress = {
  load: function(){ return loadProgress(); },

  save: function(progress){ syncProgressToR2(progress); },

  hydrate: async function(){
    if(typeof Auth==="undefined"||!Auth.accessToken)return Progress.load();
    var token=await Auth.accessToken();if(!token)return Progress.load();
    try{
      var r=await fetch(PROGRESS_WORKER,{headers:{"Authorization":"Bearer "+token}});if(!r.ok)return Progress.load();
      var remote=await r.json(),local=Progress.load();
      var merged={xp:Math.max(Number(local.xp)||0,Number(remote.xp)||0),completed:Array.from(new Set([].concat(local.completed||[],remote.completed||[]))),streak:Math.max(Number(local.streak)||0,Number(remote.streak)||0),lastActivity:[local.lastActivity,remote.lastActivity].filter(Boolean).sort().pop()||null,podcasts:mergePodcasts(local.podcasts,remote.podcasts)};
      localStorage.setItem(progressKey(),JSON.stringify(merged));return merged;
    }catch(e){return Progress.load()}
  },

  // Registra a conclusao de um item (dialogo/podcast/verbo/musica) e da XP
  // uma unica vez por itemKey (ex: "dialog-9"). Retorna {xpGained, leveledUp}
  complete(itemKey, xpAmount) {
    const progress = Progress.load();
    if (progress.completed.includes(itemKey)) {
      return { xpGained: 0, leveledUp: false, alreadyDone: true };
    }
    const oldLevel = XPSystem.getCurrentLevel(progress.xp);
    progress.completed.push(itemKey);
    progress.xp += xpAmount;
    Progress.bumpStreak(progress);
    const newLevel = XPSystem.getCurrentLevel(progress.xp);
    Progress.save(progress);
    return { xpGained: xpAmount, leveledUp: newLevel !== oldLevel, newLevel, alreadyDone: false };
  },

  // XP repetivel, sem chave unica (usado pelo jogo, que pode ser jogado varias vezes)
  addXP(xpAmount) {
    const progress = Progress.load();
    const oldLevel = XPSystem.getCurrentLevel(progress.xp);
    progress.xp += xpAmount;
    Progress.bumpStreak(progress);
    const newLevel = XPSystem.getCurrentLevel(progress.xp);
    Progress.save(progress);
    return { leveledUp: newLevel !== oldLevel, newLevel };
  },

  bumpStreak(progress) {
    const today = todayStr();
    if (progress.lastActivity === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    progress.streak = progress.lastActivity === yesterday ? (progress.streak || 0) + 1 : 1;
    progress.lastActivity = today;
  },

  isCompleted(itemKey) {
    return Progress.load().completed.includes(itemKey);
  },

  // ---------------- Posição de reprodução dos podcasts ----------------
  // Grava só no aparelho (rápido, sem rede) -- quem chama decide a
  // cadência (o player chama isso a cada poucos segundos).
  savePodcastPosition(slug, language, info) {
    const progress = Progress.load();
    if (!progress.podcasts) progress.podcasts = {};
    const key = slug + ":" + language;
    progress.podcasts[key] = {
      position: info.position,
      duration: info.duration,
      percent: info.duration > 0 ? (info.position / info.duration) * 100 : 0,
      chapterId: info.chapterId || null,
      sentenceId: info.sentenceId || null,
      updatedAt: new Date().toISOString(),
      completed: !!info.completed,
    };
    localStorage.setItem(progressKey(), JSON.stringify(progress));
    return progress.podcasts[key];
  },

  getPodcastPosition(slug, language) {
    const progress = Progress.load();
    return (progress.podcasts && progress.podcasts[slug + ":" + language]) || null;
  },

  // Sincroniza o progresso (incluindo podcasts) com o R2 agora mesmo --
  // usado no pause, ao trocar de página e em visibilitychange, não em
  // todo timeupdate.
  syncPodcastNow() {
    Progress.save(Progress.load());
  },

  // Chegou a 90%+ pela primeira vez nesse episódio: concede XP uma única
  // vez (independente do idioma -- ouvir de novo ou trocar de idioma não
  // duplica), usando a mesma chave de conclusão dos outros conteúdos.
  completePodcast(slug, xpAmount) {
    return Progress.complete("podcast-" + slug, xpAmount);
  },
};
