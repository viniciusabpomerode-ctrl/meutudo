const crypto = require("crypto");
const A = require("./_auth");

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization,Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Cache-Control": "no-store",
};

const reply = (statusCode, data) => ({
  statusCode,
  headers: HEADERS,
  body: JSON.stringify(data),
});

function clientIp(event) {
  const headers = event.headers || {};
  const forwarded = headers["x-forwarded-for"] || headers["X-Forwarded-For"] || "";
  return String(
    headers["x-nf-client-connection-ip"] ||
    headers["X-Nf-Client-Connection-Ip"] ||
    headers["cf-connecting-ip"] ||
    headers["CF-Connecting-IP"] ||
    forwarded.split(",")[0] ||
    ""
  ).trim();
}

function hashIp(ip) {
  const secret = process.env.PROMO_IP_HASH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("promo_hash_secret_missing");
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: HEADERS };
  if (event.httpMethod !== "POST") return reply(405, { error: "method_not_allowed" });

  const user = await A.user(event);
  if (!user?.id || !user?.email) return reply(401, { error: "unauthorized" });

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return reply(400, { error: "invalid_body" });
  }

  const code = String(body.code || "").trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,40}$/.test(code)) return reply(400, { error: "invalid_code" });

  const ip = clientIp(event);
  if (!ip) return reply(400, { error: "ip_unavailable" });

  try {
    const response = await fetch(`${A.SUPABASE_URL}/rest/v1/rpc/redeem_promo_link`, {
      method: "POST",
      headers: A.serviceHeaders(),
      body: JSON.stringify({
        p_code: code,
        p_user_id: user.id,
        p_email: user.email.toLowerCase(),
        p_ip_hash: hashIp(ip),
      }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) throw new Error(JSON.stringify(result || {}).slice(0, 300));

    const ok = !!result?.ok;
    const reason = result?.reason || null;
    const status = ok ? 200 : (reason === "invalid_or_expired" ? 404 : 409);
    return reply(status, {
      ok,
      reason,
      trial_days: result?.trial_days || null,
      expires_at: result?.expires_at || null,
    });
  } catch (error) {
    console.error("promo redemption failed", error.message);
    return reply(500, { error: "promo_redemption_failed" });
  }
};
