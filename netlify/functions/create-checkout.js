// Netlify Function — cria uma sessao de Checkout do Stripe e devolve a URL
// pra onde o navegador deve redirecionar. Usa a API REST do Stripe direto
// via fetch (sem precisar instalar o pacote "stripe", sem build step).
//
// POST /.netlify/functions/create-checkout
// body: { plan: "mensal" | "anual" | "fundador", email: string }

const PRICE_BY_PLAN = {
  mensal: process.env.STRIPE_PRICE_MENSAL,
  anual: process.env.STRIPE_PRICE_ANUAL,
  fundador: process.env.STRIPE_PRICE_FUNDADOR,
};

// "fundador" e pagamento unico (vitalicio); os outros dois sao assinatura recorrente
const MODE_BY_PLAN = {
  mensal: "subscription",
  anual: "subscription",
  fundador: "payment",
};
const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
async function authenticatedUser(event) {
  const authorization = event.headers.authorization || event.headers.Authorization || "";
  if (!authorization.startsWith("Bearer ")) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {headers:{apikey:SUPABASE_ANON_KEY,Authorization:authorization}});
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id && user?.email ? user : null;
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "method not allowed" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "invalid json" }) };
  }

  const { plan } = body;
  const user = await authenticatedUser(event);
  if (!user) return { statusCode: 401, headers, body: JSON.stringify({ error: "login obrigatorio" }) };
  const email = user.email;
  const priceId = PRICE_BY_PLAN[plan];
  if (!priceId) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "plano invalido ou price id nao configurado: " + plan }) };
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "STRIPE_SECRET_KEY nao configurada no Netlify" }) };
  }

  const origin = event.headers.origin || `https://${event.headers.host}`;
  // ui_mode=embedded: o checkout roda dentro da propria pagina (iframe do
  // Stripe), sem sair do site. So precisa de return_url (nao success/cancel).
  const embedded = body.embedded !== false;

  const params = new URLSearchParams();
  params.append("mode", MODE_BY_PLAN[plan]);
  params.append("line_items[0][price]", priceId);
  params.append("line_items[0][quantity]", "1");
  params.append("customer_email", email);
  params.append("client_reference_id", email);
  if (embedded) {
    params.append("ui_mode", "embedded");
    params.append("return_url", `${origin}/app/perfil.html?checkout=sucesso&session_id={CHECKOUT_SESSION_ID}`);
  } else {
    params.append("success_url", `${origin}/app/perfil.html?checkout=sucesso`);
    params.append("cancel_url", `${origin}/app/planos.html?checkout=cancelado`);
  }
  params.append("metadata[plan]", plan);
  params.append("metadata[email]", email);
  params.append("metadata[user_id]", user.id);

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: data.error?.message || "erro no Stripe" }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(embedded ? { clientSecret: data.client_secret } : { url: data.url }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
