// ============================================================
// Modo visitante — sem login a pessoa navega pelas paginas reais
// vendo os primeiros itens de cada categoria; o resto aparece
// BLOQUEADO (pra mostrar o tamanho do conteudo, sem revelar o
// conteudo em si). Quando o auth do Supabase confirmar um usuario
// logado, o bloqueio some sozinho (Guest.check resolve false).
// ============================================================

var AFB_FREE_LIMIT = 20;        // diálogos, podcasts, música, profissões
var AFB_FREE_LIMIT_STRICT = 10; // verbos e gírias/expressões
var AFB_FREE_A2_LESSONS = 5;    // amostra adicional de diálogos e verbos A2
var AFB_FREE_PROF_PHRASES = 10; // frases liberadas em cada profissão
var AFB_FREE_PRONUNCIATION = 10;// gravações de pronúncia para visitante

var Guest = {
  _premiumCache: null,
  _premiumEmail: null,

  // Resolve true se for premium (cache por email)
  isPremium: function () {
    var user = Auth.currentUser();
    if (!user) return Promise.resolve(false);
    if (Guest._premiumEmail === user.email && Guest._premiumCache !== null) {
      return Promise.resolve(Guest._premiumCache);
    }
    return Auth.accessToken().then(function(token) {
      if (!token) return { ok: false, json: function(){ return Promise.resolve({premium:false}); } };
      return fetch("/.netlify/functions/check-premium", {headers:{Authorization:"Bearer "+token}});
    })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        Guest._premiumEmail = user.email;
        Guest._premiumCache = !!d.premium;
        return Guest._premiumCache;
      })
      .catch(function() { return false; });
  },

  // Resolve true se a pessoa nao tem conta (visitante)
  // Para bloquear conteudo de usuario free, as paginas devem
  // combinar: Guest.check() (login) + Guest.isPremium() (plano)
  check: function () {
    if (typeof Auth !== "undefined" && Auth._ready) {
      return Auth._ready().then(function () {
        var user = Auth.currentUser();
        if (user) return false;
        // Retry after a short delay — Supabase session may need time
        return new Promise(function(r) {
          setTimeout(function() {
            r(!Auth.currentUser());
          }, 600);
        });
      });
    }
    return Promise.resolve(true);
  },

  // Resolve true se o conteudo deve ficar limitado (visitante OU
  // logado sem plano pago) — e o que as paginas de conteudo devem
  // usar pra decidir o que bloquear, nao Guest.check() sozinho.
  isFree: async function () {
    var guest = await Guest.check();
    if (guest) return true;
    return !(await Guest.isPremium());
  },

  // Progress seguro: visitante nao tem progresso salvo
  safeProgress: function () {
    try {
      if (window.Progress && Progress.load) return Progress.load();
    } catch (e) {}
    return { xp: 0, completed: [], streak: 0 };
  },

  // Card bloqueado para grades — usado quando o titulo e so um NOME
  // de licao (ex: "Apresentações Básicas 01"), nao a frase/palavra em si.
  lockedCard: function (title, subtitle) {
    return '<a class="card card-sm locked-item" href="planos.html">' +
      '<div class="flex-between"><b>' + title + '</b><span class="lock-pill">🔒</span></div>' +
      (subtitle ? '<p class="muted" style="font-size:.82rem; margin:6px 0 0;">' + subtitle + '</p>' : '') +
      '</a>';
  },

  // Linha bloqueada para listas — mesma regra do lockedCard (titulo = nome, nao conteudo)
  lockedRow: function (title, subtitle) {
    return '<a class="sentence-row locked-item" href="planos.html" style="text-decoration:none;">' +
      '<div><div class="sentence-de">' + title + '</div>' +
      (subtitle ? '<div class="sentence-pt">' + subtitle + '</div>' : '') + '</div>' +
      '<span class="lock-pill">🔒</span></a>';
  },

  // Gera um texto de mentira (mesmo formato de uma frase/palavra real) so
  // pra dar volume visual ao blur — nunca e conteudo de verdade.
  _fakeWords: {
    de: ["sprechen", "verstehen", "erzählen", "beginnen", "erklären", "versuchen", "gewinnen", "bewegen", "bringen", "arbeiten", "Sprache", "Gespräch", "Geschichte", "Wörter", "Übung"],
    pt: ["trabalhar bastante", "entender rápido", "contar uma história", "começar agora mesmo", "explicar direitinho", "tentar de novo", "conseguir vencer", "se mover devagar", "aprender todo dia", "praticar sempre"],
  },
  _fakeLine: function (lang) {
    var bank = Guest._fakeWords[lang];
    var n = lang === "de" ? (2 + Math.floor(Math.random() * 3)) : 1;
    var out = [];
    for (var i = 0; i < n; i++) out.push(bank[Math.floor(Math.random() * bank.length)]);
    return out.join(" ");
  },

  // Card bloqueado que NAO revela a palavra/frase em alemao nem a traducao
  // — mostra um texto borrado (blur) so pra dar a sensacao de volume real
  // (usado para verbos e girias, onde o titulo E o proprio conteudo)
  lockedWord: function (meta) {
    return '<a class="card card-sm locked-item center" href="planos.html">' +
      '<b class="blur-fake" aria-hidden="true">' + Guest._fakeLine("de") + '</b>' +
      '<p class="muted blur-fake" aria-hidden="true" style="margin:4px 0; font-size:.85rem;">' + Guest._fakeLine("pt") + '</p>' +
      '<span class="lock-pill">🔒 Premium</span>' +
      (meta ? '<p class="muted" style="font-size:.7rem; margin:6px 0 0; opacity:.7;">' + meta + '</p>' : '') +
      '</a>';
  },

  // Linha bloqueada que NAO revela a frase/palavra em alemao nem a traducao
  // — mesma logica de blur, mantendo a "silhueta" da frase visivel
  lockedRowHidden: function (meta) {
    return '<a class="sentence-row locked-item" href="planos.html" style="text-decoration:none;">' +
      '<div>' +
      '<div class="sentence-de blur-fake" aria-hidden="true">' + Guest._fakeLine("de") + '</div>' +
      '<div class="sentence-pt blur-fake" aria-hidden="true">' + Guest._fakeLine("pt") + '</div>' +
      (meta ? '<div class="sentence-pron" style="opacity:.7;">' + meta + '</div>' : '') +
      '</div>' +
      '<span class="lock-pill">🔒</span></a>';
  },

  // Banner de conversao no fim das listas — tom acolhedor, nao de paywall
  banner: function (lockedCount, label) {
    return '<div class="sample-lock" style="margin-top:26px;">' +
      '<span class="eyebrow">Ainda tem mais</span>' +
      '<h3 style="margin:8px 0 6px; font-weight:500;">Mais ' + Number(lockedCount).toLocaleString("pt-BR") + ' ' + label + ' te esperando aqui dentro</h3>' +
      '<p class="muted" style="margin:0 0 18px; font-size:.88rem; max-width:440px; margin-left:auto; margin-right:auto;">Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.</p>' +
      '<div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">' +
      '<a class="btn btn-primary" href="planos.html">Desbloquear tudo</a>' +
      '<a class="btn btn-outline" href="cadastro.html">Criar conta grátis</a>' +
      '</div></div>';
  },
};
