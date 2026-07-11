// Netlify Function — abre o Portal de Cobranca do Stripe (pra cancelar/trocar
// cartao) pra um cliente ja existente. Usado no botao "Cancelar assinatura"
// da pagina de Perfil.
//
// POST /.netlify/functions/create-portal
// body: { email: string }

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "method not allowed" }) };
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "STRIPE_SECRET_KEY nao configurada no Netlify" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "invalid json" }) };
  }
  const { email } = body;
  if (!email) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "email obrigatorio" }) };
  }

  const origin = event.headers.origin || `https://${event.headers.host}`;
  const authHeaders = {
    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    // Acha o customer do Stripe pelo e-mail
    const searchRes = await fetch(
      `https://api.stripe.com/v1/customers/search?query=${encodeURIComponent(`email:'${email}'`)}`,
      { headers: authHeaders }
    );
    const searchData = await searchRes.json();
    const customer = searchData.data && searchData.data[0];
    if (!customer) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "nenhuma assinatura encontrada pra esse e-mail" }) };
    }

    const portalParams = new URLSearchParams();
    portalParams.append("customer", customer.id);
    portalParams.append("return_url", `${origin}/app/perfil.html`);

    const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: authHeaders,
      body: portalParams.toString(),
    });
    const portalData = await portalRes.json();
    if (!portalRes.ok) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: portalData.error?.message || "erro no Stripe" }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ url: portalData.url }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
