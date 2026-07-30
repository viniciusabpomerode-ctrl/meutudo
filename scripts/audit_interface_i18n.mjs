import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const locales = ["en", "es", "fr", "it", "tr", "ar", "he", "hi", "pl", "id", "ru"];
const i18nPath = path.join(root, "assets", "js", "i18n.js");
const source = fs.readFileSync(i18nPath, "utf8");

function decodeHtml(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => named[n] ?? m);
}

function clean(value) {
  return decodeHtml(value).replace(/\s+/g, " ").trim();
}

function extractTranslationMaps() {
  const start = source.indexOf("const DYNAMIC_UI_REPAIRS");
  const end = source.indexOf("const AFB_LANG_KEY");
  if (start < 0 || end < 0) throw new Error("Translation map block not found");
  let block = source.slice(start, end);
  const names = [...block.matchAll(/^const\s+([A-Z][A-Z0-9_]+)\s*=/gm)].map(m => m[1]);
  block = block.replace(/^const\s+/gm, "var ");
  const context = {};
  vm.createContext(context);
  vm.runInContext(block + `\nthis.__maps={${names.join(",")}};`, context, { timeout: 5000 });
  return context.__maps;
}

const maps = extractTranslationMaps();
const merged = Object.fromEntries(locales.map(locale => [locale, {}]));
for (const value of Object.values(maps)) {
  if (!value || typeof value !== "object") continue;
  for (const locale of locales) {
    if (value[locale] && typeof value[locale] === "object" && !Array.isArray(value[locale])) {
      Object.assign(merged[locale], value[locale]);
    }
  }
}

for (const locale of locales) {
  const localData = path.join(root, "data", `${locale}.json`);
  if (!fs.existsSync(localData)) continue;
  const data = JSON.parse(fs.readFileSync(localData, "utf8"));
  Object.assign(merged[locale], data.translations || {});
}
const files = [
  ...fs.readdirSync(root).filter(name => name.endsWith(".html")).map(name => path.join(root, name)),
  ...fs.readdirSync(path.join(root, "app")).filter(name => name.endsWith(".html") && !name.startsWith("curso-a1")).map(name => path.join(root, "app", name)),
];

function extractHtmlStrings(file) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<!--[\s\S]*?-->/g, " ");
  html = html.replace(/<(script|style|code|pre)\b[\s\S]*?<\/\1>/gi, " ");
  const found = new Set();
  for (const match of html.matchAll(/>([^<>]+)</g)) {
    const value = clean(match[1]);
    if (value) found.add(value);
  }
  for (const match of html.matchAll(/\b(?:placeholder|title|aria-label)\s*=\s*["']([^"']+)["']/gi)) {
    const value = clean(match[1]);
    if (value) found.add(value);
  }
  return found;
}

const technical = /^(?:DeutschBloom|A1|A2|B1|B2|C1|C2|PT|EN|ES|FR|IT|TR|AR|HE|HI|PL|ID|RU|[0-9.,%+×/–—·:()\- ]+|[▶✓✦⚡🎓📚🎧💬📖🎵🗣️💼📊📓🌐🇩🇪 ]+)$/u;
const germanSignals = /\b(?:der|die|das|ein|eine|ich|du|sie|wir|ihr|nicht|und|oder|ist|sind|haben|sein|wie|was|wo|wer|warum|guten|hallo|danke|bitte|tschüss|deutsch|deutschland)\b/i;
const portugueseSignals = /\b(?:aula|curso|grátis|inicio|início|entrar|sair|conta|senha|nome|email|idioma|perfil|plano|planos|progresso|aprender|alemão|frases|verbos|música|podcasts|gírias|vocabulário|profissões|blog|quiz|escrita|pronúncia|simulado|caderno|ouvir|começar|continuar|salvar|buscar|pesquisar|todos|todas|nenhum|nenhuma|carregando|erro|tentar|resposta|pergunta|seu|sua|você|esta|este|para|com|sem|mais|menos|agora|hoje|dias|semana|nível|conteúdo|palavra|áudio|diálogo|explicação|prática|curiosidade|material|abrir|voltar|próxima|anterior|escolha|selecione|descubra|estudar|treinar|acompanhar)\b/i;

const occurrences = new Map();
for (const file of files) {
  for (const text of extractHtmlStrings(file)) {
    if (text.length < 2 || text.length > 500 || technical.test(text)) continue;
    if (germanSignals.test(text) && !portugueseSignals.test(text)) continue;
    if (!portugueseSignals.test(text) && !/[ãõáéíóúâêôç]/i.test(text)) continue;
    if (!occurrences.has(text)) occurrences.set(text, []);
    occurrences.get(text).push(path.relative(root, file).replaceAll("\\", "/"));
  }
}

const missing = [];
for (const [text, pageList] of occurrences) {
  const absent = locales.filter(locale => !Object.hasOwn(merged[locale], text));
  if (absent.length) {
    missing.push({ source: text, missing_locales: absent, pages: [...new Set(pageList)] });
  }
}
missing.sort((a, b) => b.missing_locales.length - a.missing_locales.length || a.source.localeCompare(b.source, "pt"));

const pageCoverage = {};
for (const file of files) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const texts = [...extractHtmlStrings(file)].filter(x => occurrences.has(x));
  pageCoverage[rel] = {
    candidates: texts.length,
    unresolved: texts.filter(text => missing.some(row => row.source === text)).length,
  };
}

const report = {
  generated_at: new Date().toISOString(),
  scope: { html_pages: files.length, locales, interface_source_strings: occurrences.size },
  map_sizes: Object.fromEntries(locales.map(locale => [locale, Object.keys(merged[locale]).length])),
  unresolved_unique_strings: missing.length,
  unresolved_by_locale: Object.fromEntries(locales.map(locale => [locale, missing.filter(row => row.missing_locales.includes(locale)).length])),
  page_coverage: pageCoverage,
  missing,
};

const reportDir = path.join(root, "reports");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, "interface-i18n-audit.json"), JSON.stringify(report, null, 2), "utf8");

const deepseek = {
  task: "Translate only the missing target-language values for DeutschBloom's user interface. Keep German teaching examples unchanged. Preserve numbers, HTML-free plain text, punctuation, placeholders, emojis and the brand DeutschBloom. Return strict JSON only.",
  locales,
  items: missing.map((row, id) => ({ id: id + 1, source_pt: row.source, targets_needed: row.missing_locales })),
};
fs.writeFileSync(path.join(reportDir, "deepseek-interface-translation-input.json"), JSON.stringify(deepseek, null, 2), "utf8");

const worstPages = Object.entries(pageCoverage).sort((a, b) => b[1].unresolved - a[1].unresolved).slice(0, 20);
const markdown = [
  "# Auditoria de tradução da interface",
  "",
  `- Páginas HTML verificadas: ${files.length}`,
  `- Idiomas: ${locales.length}`,
  `- Textos de interface identificados: ${occurrences.size}`,
  `- Textos sem cobertura completa: ${missing.length}`,
  "",
  "## Pendências por idioma",
  "",
  ...locales.map(locale => `- ${locale}: ${report.unresolved_by_locale[locale]}`),
  "",
  "## Páginas com mais pendências",
  "",
  ...worstPages.map(([file, row]) => `- ${file}: ${row.unresolved}/${row.candidates}`),
  "",
  "## Primeiras pendências",
  "",
  ...missing.slice(0, 100).map(row => `- ${row.source} — ${row.missing_locales.join(", ")} — ${row.pages.slice(0, 4).join(", ")}`),
  "",
].join("\n");
fs.writeFileSync(path.join(reportDir, "interface-i18n-audit.md"), markdown, "utf8");

console.log(JSON.stringify({
  pages: files.length,
  source_strings: occurrences.size,
  unresolved: missing.length,
  by_locale: report.unresolved_by_locale,
  output: "reports/interface-i18n-audit.json",
}, null, 2));
