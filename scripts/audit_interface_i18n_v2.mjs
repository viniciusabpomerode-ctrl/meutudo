import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const locales = ["en", "es", "fr", "it", "tr", "ar", "he", "hi", "pl", "id", "ru"];
const i18nFile = path.join(root, "assets", "js", "i18n.js");
const source = fs.readFileSync(i18nFile, "utf8");

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

function balancedObject(marker, from = 0) {
  const markerAt = source.indexOf(marker, from);
  if (markerAt < 0) throw new Error(`Marker not found: ${marker}`);
  const start = source.indexOf("{", markerAt + marker.length);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Unclosed object: ${marker}`);
}

function evaluateObject(text, context = {}) {
  return vm.runInNewContext(`(${text})`, context, { timeout: 5000 });
}

function topLevelMaps() {
  const start = source.indexOf("const DYNAMIC_UI_REPAIRS");
  const end = source.indexOf("const AFB_LANG_KEY");
  let block = source.slice(start, end);
  const names = [...block.matchAll(/^const\s+([A-Z][A-Z0-9_]+)\s*=/gm)].map(m => m[1]);
  block = block.replace(/^const\s+/gm, "var ");
  const context = {};
  vm.createContext(context);
  vm.runInContext(block + `\nthis.__maps={${names.join(",")}};`, context, { timeout: 5000 });
  return context.__maps;
}

const merged = Object.fromEntries(locales.map(locale => [locale, {}]));
for (const value of Object.values(topLevelMaps())) {
  if (!value || typeof value !== "object") continue;
  for (const locale of locales) {
    if (value[locale] && typeof value[locale] === "object" && !Array.isArray(value[locale])) {
      Object.assign(merged[locale], value[locale]);
    }
  }
}

const englishUi = evaluateObject(balancedObject("const ui ="));
const uiFallbacks = evaluateObject(balancedObject("const uiFallbacks ="), { ui: englishUi });
const priorityContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "assets", "js", "i18n-id-ru-priority.js"), "utf8"), priorityContext);
const priorityUi = priorityContext.window.AFB_ID_RU_PRIORITY || {};
const semanticStrings = evaluateObject(balancedObject("_strings:"));
for (const locale of locales) {
  Object.assign(merged[locale], uiFallbacks[locale] || {});
  Object.assign(merged[locale], priorityUi[locale] || {});
  for (const [key, sourceText] of Object.entries(semanticStrings.pt || {})) {
    const translated = semanticStrings[locale]?.[key];
    if (typeof sourceText === "string" && typeof translated === "string" && translated) {
      merged[locale][sourceText] = translated;
    }
  }
}

const htmlFiles = [
  ...fs.readdirSync(root).filter(name => name.endsWith(".html")).map(name => path.join(root, name)),
  ...fs.readdirSync(path.join(root, "app")).filter(name => name.endsWith(".html") && name !== "admin.html" && (!name.startsWith("curso-a1-aula-") || name === "curso-a1-aula-01.html")).map(name => path.join(root, "app", name)),
];
const jsFiles = fs.readdirSync(path.join(root, "assets", "js"))
  .filter(name => name.endsWith(".js") && !["i18n.js", "data.js", "music-data.js", "curso-a1-piloto.js", "german-a1-lesson-01-en.js"].includes(name))
  .map(name => path.join(root, "assets", "js", name));

function htmlStrings(file) {
  let html = fs.readFileSync(file, "utf8")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|code|pre)\b[\s\S]*?<\/\1>/gi, " ");
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

function scriptStrings(file) {
  const javascript = fs.readFileSync(file, "utf8");
  const found = new Set();
  const pattern = /(["'`])((?:\\.|(?!\1)[\s\S]){2,500}?)\1/g;
  for (const match of javascript.matchAll(pattern)) {
    const value = clean(match[2]
      .replace(/\\n|\\r|\\t/g, " ")
      .replace(/\\(["'`\\])/g, "$1"));
    if (!value || /<\w|<\/\w|\$\{|https?:\/\/|=>|\b(?:const|let|var|function|return|document|window|classList|innerHTML|querySelector|getElementById|addEventListener)\b|[{};]/i.test(value) || /^[.#/[\]{}():;,=+*?!&|_-]+$/i.test(value)) continue;
    found.add(value);
  }
  return found;
}

const technical = /^(?:DeutschBloom|A1|A2|B1|B2|C1|C2|PT|EN|ES|FR|IT|TR|AR|HE|HI|PL|ID|RU|[0-9.,%+/–—·:()\- ]+)$/u;
const germanSignals = /\b(?:der|die|das|ein|eine|ich|du|sie|wir|ihr|nicht|und|oder|ist|sind|haben|sein|wie|was|wo|wer|warum|guten|hallo|danke|bitte|tschüss|deutsch|deutschland)\b/i;
const portugueseSignals = /\b(?:aula|curso|grátis|inicio|início|entrar|sair|conta|senha|nome|email|idioma|perfil|plano|planos|progresso|aprender|alemão|frases|verbos|música|podcasts|gírias|vocabulário|profissões|blog|quiz|escrita|pronúncia|simulado|caderno|ouvir|começar|continuar|salvar|buscar|pesquisar|todos|todas|nenhum|nenhuma|carregando|erro|tentar|resposta|pergunta|seu|sua|você|esta|este|para|com|sem|mais|menos|agora|hoje|dias|semana|nível|conteúdo|palavra|áudio|diálogo|explicação|prática|curiosidade|material|abrir|voltar|próxima|anterior|escolha|selecione|descubra|estudar|treinar|acompanhar|cancelar|fechar|enviar|editar|excluir|remover|confirmar|assinatura|pagamento|preço|mensal|anual|vitalício|estatísticas|configurações|tema|suporte|resultados?|corret[oa]s?|concluíd[oa]s?|disponível|falhou|atualizar|copiar|compartilhar|microfone|gravação|categorias?|objetivo|recomendação)\b/i;

const occurrences = new Map();
function add(text, file) {
  if (text.length < 2 || text.length > 500 || technical.test(text)) return;
  if (germanSignals.test(text) && !portugueseSignals.test(text)) return;
  if (!portugueseSignals.test(text) && !/[ãõáéíóúâêôç]/i.test(text)) return;
  if (!occurrences.has(text)) occurrences.set(text, new Set());
  occurrences.get(text).add(path.relative(root, file).replaceAll("\\", "/"));
}
for (const file of htmlFiles) for (const text of htmlStrings(file)) add(text, file);
for (const file of [...htmlFiles, ...jsFiles]) for (const text of scriptStrings(file)) add(text, file);

const missing = [];
for (const [text, pages] of occurrences) {
  const absent = locales.filter(locale => !Object.hasOwn(merged[locale], text));
  if (absent.length) missing.push({ source: text, missing_locales: absent, pages: [...pages] });
}
missing.sort((a, b) => b.missing_locales.length - a.missing_locales.length || a.source.localeCompare(b.source, "pt"));

const byPage = {};
for (const row of missing) {
  for (const page of row.pages) {
    byPage[page] ||= { unresolved: 0, examples: [] };
    byPage[page].unresolved += 1;
    if (byPage[page].examples.length < 12) byPage[page].examples.push(row.source);
  }
}

const report = {
  generated_at: new Date().toISOString(),
  scope: {
    html_pages: htmlFiles.length,
    javascript_files: jsFiles.length,
    locales,
    interface_source_strings: occurrences.size,
    note: "Local interface only. Large R2 content dictionaries were intentionally not loaded.",
  },
  local_map_sizes: Object.fromEntries(locales.map(locale => [locale, Object.keys(merged[locale]).length])),
  unresolved_unique_strings: missing.length,
  unresolved_by_locale: Object.fromEntries(locales.map(locale => [locale, missing.filter(row => row.missing_locales.includes(locale)).length])),
  pages: Object.fromEntries(Object.entries(byPage).sort((a, b) => b[1].unresolved - a[1].unresolved)),
  missing,
};

const reportDir = path.join(root, "reports");
fs.writeFileSync(path.join(reportDir, "interface-local-audit-v2.json"), JSON.stringify(report, null, 2), "utf8");
fs.writeFileSync(path.join(reportDir, "deepseek-interface-local-v2.json"), JSON.stringify({
  task: "Translate the missing Portuguese UI strings. Preserve DeutschBloom, German teaching examples, URLs, numbers, prices, placeholders and emojis. Return strict JSON keyed by locale and exact Portuguese source text.",
  items: missing.map((row, index) => ({ id: index + 1, source_pt: row.source, targets_needed: row.missing_locales })),
}, null, 2), "utf8");

const worst = Object.entries(byPage).slice(0, 30);
const markdown = [
  "# Auditoria local da interface — versão 2",
  "",
  `- HTML analisado: ${htmlFiles.length}`,
  `- JavaScript analisado: ${jsFiles.length}`,
  `- Textos de interface candidatos: ${occurrences.size}`,
  `- Textos sem cobertura local completa: ${missing.length}`,
  "- Dados didáticos e dicionários grandes do R2: não analisados",
  "",
  "## Lacunas por idioma",
  "",
  ...locales.map(locale => `- ${locale}: ${report.unresolved_by_locale[locale]}`),
  "",
  "## Arquivos com mais lacunas",
  "",
  ...worst.map(([file, item]) => `- ${file}: ${item.unresolved}`),
  "",
].join("\n");
fs.writeFileSync(path.join(reportDir, "interface-local-audit-v2.md"), markdown, "utf8");

console.log(JSON.stringify({
  html: htmlFiles.length,
  javascript: jsFiles.length,
  candidates: occurrences.size,
  unresolved: missing.length,
  by_locale: report.unresolved_by_locale,
  worst_pages: worst.slice(0, 15),
}, null, 2));
