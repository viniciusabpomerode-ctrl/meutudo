// Netlify Function — verifica se um e-mail tem premium ativo.
// GET /.netlify/functions/check-premium?email=fulano@exemplo.com

const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };

  const email = event.queryStringParameters?.email;
  if (!email) return { statusCode: 400, headers, body: JSON.stringify({ error: "email obrigatorio" }) };
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { statusCode: 200, headers, body: JSON.stringify({ premium: false, plan: null }) };
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/user_premium?email=eq.${encodeURIComponent(email)}&select=plan,active,expires_at`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );
    const rows = await res.json();
    const row = rows[0];
    const expired = row?.expires_at && new Date(row.expires_at) < new Date();
    const premium = !!row && row.active && !expired;
    return { statusCode: 200, headers, body: JSON.stringify({ premium, plan: premium ? row.plan : null }) };
  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ premium: false, plan: null, error: e.message }) };
  }
};
