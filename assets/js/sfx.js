/**
 * SFX — Sons de ambiente sintetizados (Web Audio API)
 * Zero arquivos, zero upload. Tudo gerado em tempo real.
 */

var SFX = (function() {
  var ctx = null;
  var muted = localStorage.getItem('afb_sfx_muted') === '1';
  var ready = false;

  function initCtx() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      ready = true;
    } catch(e) { ctx = null; ready = false; }
    return ctx;
  }

  // ── Auto-init no primeiro toque/clique (politica do browser) ──
  function wake() {
    var c = initCtx();
    if (c && c.state === 'suspended') {
      c.resume().then(function() { ready = true; }).catch(function() {});
    }
    ready = true;
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', wake, { once: true });
    document.addEventListener('touchstart', wake, { once: true });
  }

  function getCtx() {
    if (!ctx) initCtx();
    if (!ctx || muted) return null;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(function() {});
    }
    return ctx;
  }

  /** Toca um bip de teste para confirmar que o som funciona */
  function testBeep() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(660, t);
    o.frequency.setValueAtTime(880, t + .08);
    g.gain.setValueAtTime(.18, t);
    g.gain.exponentialRampToValueAtTime(.001, t + .2);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + .2);
  }

  function playTone(c, freq, type, duration, vol) {
    if (!c || muted) return;
    var t = c.currentTime;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime((vol || .15) * 0.7, t);
    g.gain.exponentialRampToValueAtTime(.001, t + duration);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + duration);
  }

  function tone(freq, type, duration, vol) {
    var c = getCtx();
    if (!c) return;
    if (c.state === 'suspended') {
      c.resume().then(function() { ready = true; playTone(c, freq, type, duration, vol); }).catch(function() {});
      return;
    }
    playTone(c, freq, type, duration, vol);
  }

  return {
    toggle: function() {
      muted = !muted;
      localStorage.setItem('afb_sfx_muted', muted ? '1' : '0');
      if (!muted) testBeep(); // beep confirmando som ligado
      return !muted;
    },
    isMuted: function() { return muted; },
    isReady: function() { return ready && !!ctx; },

    cardFlip: function() {
      tone(600, 'sine', .06, .18);
      setTimeout(function() { tone(900, 'sine', .04, .14); }, 25);
    },
    hover: function() {
      tone(520, 'sine', .055, .12);
      setTimeout(function() { tone(680, 'sine', .035, .075); }, 24);
    },
    correct: function() {
      tone(880, 'sine', .1, .2);
      setTimeout(function() { tone(1100, 'sine', .08, .18); }, 55);
      setTimeout(function() { tone(1320, 'sine', .12, .16); }, 110);
    },
    wrong: function() {
      tone(180, 'triangle', .14, .22);
      setTimeout(function() { tone(140, 'triangle', .16, .18); }, 45);
    },
    xpUp: function() {
      var c = getCtx();
      if (!c) return;
      var t = c.currentTime;
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(350, t);
      o.frequency.exponentialRampToValueAtTime(1100, t + .22);
      g.gain.setValueAtTime(.04, t);
      g.gain.linearRampToValueAtTime(.12, t + .12);
      g.gain.exponentialRampToValueAtTime(.001, t + .32);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + .32);
    },
    click: function() {
      tone(500, 'sine', .03, .12);
    },
    ambientChime: function() {
      var c = getCtx();
      if (!c) return;
      var t = c.currentTime;
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(528, t);
      g.gain.setValueAtTime(.03, t);
      g.gain.exponentialRampToValueAtTime(.001, t + 2.5);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + 2.5);
    },

    /** Forca inicializacao — chame no primeiro clique do usuario */
    init: function() { wake(); }
  };
})();

// ── Auto card-flip: som em qualquer card, link, botao clicado ──
if (typeof document !== 'undefined') {
  document.addEventListener('click', function(e) {
    var el = e.target.closest('.card, .stat-tile, .sidebar a, .quiz-opt, .q-option, a[href]:not([href^="#"]), button:not(#sfx-toggle):not(#daynight-btn)');
    if (el && !el.closest('#pomo-ring') && !el.closest('#expand-panel')) {
      SFX.cardFlip();
    }
  });

  // Som discreto ao passar pelos cards. Navegadores só liberam áudio depois
  // da primeira interação; por isso o hover começa apenas quando o contexto
  // já estiver acordado e nunca dispara repetidamente no mesmo card.
  var lastHover = null;
  var lastHoverAt = 0;
  document.addEventListener('pointerover', function(e) {
    if (!SFX.isReady() || SFX.isMuted() || e.pointerType === 'touch') return;
    var el = e.target.closest('.card, .stat-tile, .price-card, .environment-card, .q-option, .quiz-opt');
    if (!el || el === lastHover || el.contains(e.relatedTarget)) return;
    var now = Date.now();
    if (now - lastHoverAt < 110) return;
    lastHover = el; lastHoverAt = now;
    SFX.hover();
  });
  document.addEventListener('pointerout', function(e) {
    if (lastHover && !lastHover.contains(e.relatedTarget)) lastHover = null;
  });
}
