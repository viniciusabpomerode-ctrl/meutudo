// Sistema de "Ambientes de Estudo": Moderno (padrão), Vikings e Aurora
// Cada tema tem modo dia/noite
const AFB_THEME_KEY = "afb_theme";
const AFB_MODE_KEY = "afb_mode";
const AFB_THEMES = ["moderno", "vikings", "aurora"];
const AFB_MODES = ["day", "night"];
const AFB_THEME_META = {
  moderno: { icon: "◆", label: "Moderno", tag: "Elegante, minimalista e focado" },
  vikings: { icon: "🛡️", label: "Vikings", tag: "Força, história e conquista" },
  aurora: { icon: "🌌", label: "Aurora", tag: "Leveza, inspiração e equilíbrio" },
};

const AFB_THEME_LOCALE_LABELS = {
  pt:{moderno:"Moderno",vikings:"Vikings",aurora:"Aurora"},
  en:{moderno:"Modern",vikings:"Vikings",aurora:"Aurora"},
  es:{moderno:"Moderno",vikings:"Vikingos",aurora:"Aurora"},
  fr:{moderno:"Moderne",vikings:"Vikings",aurora:"Aurore"},
  it:{moderno:"Moderno",vikings:"Vichinghi",aurora:"Aurora"},
  tr:{moderno:"Modern",vikings:"Vikingler",aurora:"Aurora"},
  ar:{moderno:"عصري",vikings:"الفايكنغ",aurora:"الشفق"},
  he:{moderno:"מודרני",vikings:"ויקינגים",aurora:"זוהר"},
  hi:{moderno:"आधुनिक",vikings:"वाइकिंग",aurora:"ऑरोरा"},
  pl:{moderno:"Nowoczesny",vikings:"Wikingowie",aurora:"Zorza"},
  id:{moderno:"Modern",vikings:"Viking",aurora:"Aurora"},
  ru:{moderno:"Современная",vikings:"Викинги",aurora:"Аврора"}
};

const Theme = {
  get() {
    const t = localStorage.getItem(AFB_THEME_KEY);
    return AFB_THEMES.includes(t) ? t : "moderno";
  },
  set(theme) {
    if (!AFB_THEMES.includes(theme)) theme = "moderno";
    localStorage.setItem(AFB_THEME_KEY, theme);
    Theme.apply();
  },
  cycle() {
    const i = AFB_THEMES.indexOf(Theme.get());
    Theme.set(AFB_THEMES[(i + 1) % AFB_THEMES.length]);
  },
  toggle() { Theme.cycle(); },

  /** Modo dia/noite */
  getMode() {
    const m = localStorage.getItem(AFB_MODE_KEY);
    return AFB_MODES.includes(m) ? m : Theme.defaultMode();
  },
  defaultMode() {
    // Aurora começa dia, os outros noite
    return Theme.get() === "aurora" ? "day" : "night";
  },
  setMode(mode) {
    if (!AFB_MODES.includes(mode)) mode = Theme.defaultMode();
    localStorage.setItem(AFB_MODE_KEY, mode);
    Theme.apply();
  },
  toggleMode() {
    Theme.setMode(Theme.getMode() === "day" ? "night" : "day");
  },
  modeLabel() {
    return Theme.getMode() === "day" ? "☀️" : "🌙";
  },

  apply() {
    document.documentElement.setAttribute("data-theme", Theme.get());
    document.documentElement.setAttribute("data-mode", Theme.getMode());
  },
  meta() {
    return AFB_THEME_META[Theme.get()];
  },
  label() {
    const m = Theme.meta();
    return `${m.icon} ${m.label}`;
  },
};

Theme.apply();

// Campanha paga global (desativada por padrão no servidor).
(function loadPaidPromotion(){
  if(document.querySelector('script[data-paid-promotion]'))return;
  const s=document.createElement("script");s.src="/assets/js/promo-banner.js?v=20260725";s.dataset.paidPromotion="1";s.defer=true;document.head.appendChild(s);
})();


// global-sfx-loader: som discreto e coerente com o tema em toda a interface.
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector('script[src*="/sfx.js"],script[src*="../assets/js/sfx.js"],script[src*="assets/js/sfx.js"]')) return;
  const script = document.createElement("script");
  script.src = new URL("/assets/js/sfx.js", window.location.origin).href;
  script.defer = true;
  script.dataset.globalSfx = "1";
  document.head.appendChild(script);
});
