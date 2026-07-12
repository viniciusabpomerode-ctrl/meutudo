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

async function checkPremium(request, env) {
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return false;

  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: auth },
  });
  if (!userRes.ok) return false;
  const user = await userRes.json();
  if (!user?.id || !user?.email) return false;

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
  if (adminRows[0]) return true;

  const premRes = await fetch(
    `${SUPABASE_URL}/rest/v1/user_premium?email=eq.${encodeURIComponent(user.email)}&select=active,expires_at`,
    { headers }
  );
  const rows = await premRes.json().catch(() => []);
  const row = rows[0];
  const expired = row?.expires_at && new Date(row.expires_at) < new Date();
  return !!row && row.active && !expired;
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

    const url = new URL(request.url);
    let key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));

    // Nunca deixa sair da pasta de dados nem listar o bucket.
    if (!key || key.includes("..")) return new Response("not found", { status: 404, headers: cors });

    const object = await env.CONTENT.get(key, {
      range: request.headers.get("Range") ? request.headers : undefined,
    });
    if (!object) return new Response("not found", { status: 404, headers: cors });

    const isJson = key.startsWith("data/") && key.endsWith(".json");

    if (!isJson) {
      // Audio/outros arquivos: repassa direto, com suporte a Range pra tocar.
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
    const premium = await checkPremium(request, env).catch(() => false);
    const text = await object.text();
    let data;
    try { data = JSON.parse(text); } catch { return new Response(text, { status: 200, headers: { ...cors, "Content-Type": "application/json" } }); }

    const body = premium ? data : sampleDeep("", data);
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json", "Cache-Control": premium ? "private, no-store" : "public, max-age=300" },
    });
  },
};
