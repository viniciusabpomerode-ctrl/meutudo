// Netlify Function — recebe os eventos do Stripe (pagamento confirmado,
// assinatura cancelada etc.) e atualiza a tabela user_premium no Supabase.
// Verifica a assinatura do webhook na mao (HMAC-SHA256), sem precisar do
// pacote "stripe".
//
// Configure no painel do Stripe: Developers > Webhooks > Add endpoint
//   URL: https://SEUSITE.netlify.app/.netlify/functions/stripe-webhook
//   Eventos: checkout.session.completed, customer.subscription.deleted

const crypto = require("crypto");

const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";

function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => p.split("=").map((s) => s.trim()))
  );
  const signedPayload = `${parts.t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

async function upsertPremium(email, plan, active) {
  const expiresAt =
    plan === "fundador"
      ? null // vitalicio, nunca expira
      : new Date(Date.now() + (plan === "anual" ? 366 : 32) * 24 * 60 * 60 * 1000).toISOString();

  await fetch(`${SUPABASE_URL}/rest/v1/user_premium`, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify([{ email, plan, active, expires_at: expiresAt, updated_at: new Date().toISOString() }]),
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "method not allowed" };
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { statusCode: 500, body: "webhook nao configurado (faltam variaveis de ambiente)" };
  }

  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  const sigHeader = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  if (!verifyStripeSignature(rawBody, sigHeader, process.env.STRIPE_WEBHOOK_SECRET)) {
    return { statusCode: 400, body: "assinatura invalida" };
  }

  const stripeEvent = JSON.parse(rawBody);

  try {
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      const email = session.customer_email || session.metadata?.email;
      const plan = session.metadata?.plan || "mensal";
      if (email) await upsertPremium(email, plan, true);
    }

    if (stripeEvent.type === "customer.subscription.deleted") {
      const sub = stripeEvent.data.object;
      // Busca o e-mail do customer pra desativar o premium dele
      const custRes = await fetch(`https://api.stripe.com/v1/customers/${sub.customer}`, {
        headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      });
      const cust = await custRes.json();
      if (cust.email) await upsertPremium(cust.email, "cancelado", false);
    }
  } catch (e) {
    // Nunca retorna erro pro Stripe por falha nossa (ele fica reenviando);
    // so loga. O importante e ter confirmado a assinatura acima.
    console.error("Erro processando webhook:", e.message);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
