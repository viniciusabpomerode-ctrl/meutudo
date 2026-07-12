// Worker "portao" na frente do bucket R2 "edicao". Hoje o bucket tem uma
// URL publica (r2.dev) que devolve QUALQUER arquivo pra QUALQUER pessoa,
// sem checar login nem plano -- ou seja, o banco de dados inteiro (todas
// as frases, traducoes, verbos etc.) pode ser baixado de graca por
// qualquer um. Este Worker resolve isso: quem nao tem Premium recebe uma
// AMOSTRA (poucos itens de cada lista), quem tem Premium recebe o
// conteudo completo. So depois de trocar assets/js/data.js pra usar a
// URL deste Worker (em vez da URL publica do R2) e testar direito, a URL
// publica do R2 pode ser desativada.
//
// Rotas:
//   GET /data/<caminho>.json  -> JSON, com amostra pra quem nao e Premium
//   GET /<qualquer outro caminho>  -> repassa direto do R2 (audios etc.),
//                                     aceita Range pra tocar audio
//
// Configuracao (wrangler.content-gateway.toml):
//   - binding R2 "CONTENT" apontando pro bucket "edicao"
//   - secret SUPABASE_SERVICE_ROLE_KEY (mesma chave usada nas Netlify Functions)

const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";

const FREE_LIMIT = 20;
const FREE_LIMIT_STRICT = 10;
const STRICT_KEYS = /verb|giria|express|palavra|word/i;

// Limita listas dentro do JSON pra dar so uma amostra. Nao tenta ser
// pixel-perfeito com o que o frontend mostra como "gratis" -- o objetivo
// aqui e garantir que o banco de dados inteiro nunca saia sem Premium.
function sampleDeep(key, value) {
  if (Array.isArray(value)) {
    const limit = STRICT_KEYS.test(key || "") ? FREE_LIMIT_STRICT : FREE_LIMIT;
    const limited = value.length > limit ? value.slice(0, limit) : value;
    return limited.map((v) => sampleDeep("", v));
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = sampleDeep(k, v);
    return out;
  }
  return value;
}

// So confere se o token e valido (sem checar plano) -- usado pra exigir
// pelo menos login em audios, ja que visitante 100% anonimo nunca tem
// botao de tocar pra itens travados mesmo, so pros liberados.
async function getLoggedInUser(request) {
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: auth },
  });
  if (!userRes.ok) return null;
  const user = await userRes.json();
  return user?.id && user?.email ? user : null;
}

async function resolveAccess(request, env) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return { user: null, isAdmin: false, isPremium: false };
  const user = await getLoggedInUser(request);
  if (!user) return { user: null, isAdmin: false, isPremium: false };

  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  };

  // Admin do site tem Premium automatico (mesma regra do check-premium.js)
  const adminRes = await fetch(
    `${SUPABASE_URL}/rest/v1/app_admins?user_id=eq.${user.id}&select=role`,
    { headers }
  );
  const adminRows = await adminRes.json().catch(() => []);
  if (adminRows[0]) return { user, isAdmin: true, isPremium: true };

  const premRes = await fetch(
    `${SUPABASE_URL}/rest/v1/user_premium?email=eq.${encodeURIComponent(user.email)}&select=active,expires_at`,
    { headers }
  );
  const rows = await premRes.json().catch(() => []);
  const row = rows[0];
  const expired = row?.expires_at && new Date(row.expires_at) < new Date();
  const isPremium = !!row && row.active && !expired;
  return { user, isAdmin: false, isPremium };
}

// Registra quantas vezes cada conta pediu conteudo completo hoje --
// permite o admin perceber se alguem esta baixando tudo de forma
// automatizada (um humano estudando nao faz dezenas de pedidos rapido).
async function trackUsage(env, userId) {
  if (!env.GATEWAY_LIMITS || !userId) return;
  const day = new Date().toISOString().slice(0, 10);
  const key = `usage:${day}:${userId}`;
  try {
    const current = Number((await env.GATEWAY_LIMITS.get(key)) || "0");
    await env.GATEWAY_LIMITS.put(key, String(current + 1), { expirationTtl: 172800 });
  } catch {}
}

async function usageReport(env) {
  if (!env.GATEWAY_LIMITS) return [];
  const day = new Date().toISOString().slice(0, 10);
  const list = await env.GATEWAY_LIMITS.list({ prefix: `usage:${day}:` });
  const entries = await Promise.all(
    list.keys.map(async (k) => ({ userId: k.name.split(":")[2], count: Number((await env.GATEWAY_LIMITS.get(k.name)) || "0") }))
  );
  return entries.sort((a, b) => b.count - a.count);
}

// Limite de requisicoes por IP -- protege contra alguem (ou um script)
// bombardeando o Worker de pedidos pra tentar contornar a amostra fazendo
// milhares de tentativas. Sem o KV configurado, nao bloqueia nada (nao
// quebra o site se essa parte nao for configurada).
const RATE_LIMIT = 120; // pedidos por minuto por IP
const RATE_WINDOW_MS = 60000;
async function checkRateLimit(request, env) {
  if (!env.GATEWAY_LIMITS) return true;
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = `rl:${ip}`;
  const now = Date.now();
  let entry = null;
  try { entry = await env.GATEWAY_LIMITS.get(key, "json"); } catch {}
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) entry = { windowStart: now, count: 0 };
  entry.count++;
  try { await env.GATEWAY_LIMITS.put(key, JSON.stringify(entry), { expirationTtl: 90 }); } catch {}
  return entry.count <= RATE_LIMIT;
}

function corsHeaders(env, origin) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim());
  const ok = allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0] || "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, Range",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Expose-Headers": "Content-Range, Accept-Ranges, Content-Length",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(env, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET") return new Response("method not allowed", { status: 405, headers: cors });

    const okRate = await checkRateLimit(request, env).catch(() => true);
    if (!okRate) return new Response("muitas requisicoes, tenta de novo em instantes", { status: 429, headers: cors });

    const url = new URL(request.url);

    // Relatorio de uso -- so admin ve, mostra quem pediu conteudo demais
    // hoje (indicio de download em massa em vez de estudo normal).
    if (url.pathname === "/admin/usage-report") {
      const access = await resolveAccess(request, env).catch(() => ({ isAdmin: false }));
      if (!access.isAdmin) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...cors, "Content-Type": "application/json" } });
      const report = await usageReport(env);
      return new Response(JSON.stringify({ report }), { status: 200, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
    }

    let key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));

    // Nunca deixa sair da pasta de dados nem listar o bucket.
    if (!key || key.includes("..")) return new Response("not found", { status: 404, headers: cors });

    const object = await env.CONTENT.get(key, {
      range: request.headers.get("Range") ? request.headers : undefined,
    });
    if (!object) return new Response("not found", { status: 404, headers: cors });

    const isJson = key.startsWith("data/") && key.endsWith(".json");

    if (!isJson) {
      // Audio/outros arquivos: repassa direto, com suporte a Range pra
      // tocar. Nao exige login aqui de proposito -- o modo visitante deixa
      // ouvir os itens liberados sem criar conta. A protecao real do audio
      // vem do JSON: quem nao e Premium nunca descobre o nome/caminho dos
      // arquivos de itens travados (o JSON amostrado nao inclui esses
      // campos), entao nao tem como adivinhar/baixar em massa.
      const headers = new Headers(cors);
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      if (object.range) {
        headers.set("content-range", `bytes ${object.range.offset}-${object.range.offset + object.range.length - 1}/${object.size}`);
        headers.set("accept-ranges", "bytes");
        return new Response(object.body, { status: 206, headers });
      }
      return new Response(object.body, { status: 200, headers });
    }

    // JSON de conteudo: aplica amostra pra quem nao tem Premium.
    const access = await resolveAccess(request, env).catch(() => ({ user: null, isPremium: false }));
    const premium = access.isPremium;
    if (access.user) await trackUsage(env, access.user.id);
    const text = await object.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // JSON corrompido/malformado: nunca devolve o texto cru sem checar
      // Premium -- por seguranca, trata como indisponivel pra quem nao
      // e Premium, em vez de vazar o conteudo original.
      if (!premium) return new Response("conteudo indisponivel", { status: 502, headers: cors });
      return new Response(text, { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const body = premium ? data : sampleDeep("", data);
    return new Response(JSON.stringify(body), {
      // Nunca cacheia entre pessoas diferentes -- a resposta depende de
      // quem esta pedindo (Premium ou nao), cache compartilhado podia
      // vazar a versao completa pra quem nao pagou (ou o contrario).
      status: 200,
      headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "private, no-store", Vary: "Authorization" },
    });
  },
};
