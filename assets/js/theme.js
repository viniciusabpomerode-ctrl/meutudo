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
