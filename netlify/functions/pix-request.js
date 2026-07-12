// Netlify Function — pessoa avisa que pagou via Pix. Fica pendente ate
// o admin conferir e conceder o plano manualmente (enquanto o Stripe nao
// processa Pix automaticamente).
const A = require('./_auth');
const H = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization,Content-Type", "Access-Control-Allow-Methods": "POST,OPTIONS", "Cache-Control": "no-store" };
const out = (s, d) => ({ statusCode: s, headers: H, body: JSON.stringify(d) });
const PLANS = ["mensal", "anual", "fundador"];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: H };
  if (event.httpMethod !== 'POST') return out(405, { error: 'method_not_allowed' });

  const u = await A.user(event);
  if (!u) return out(401, { error: 'unauthorized' });

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return out(400, { error: 'invalid_json' }); }

  const plan = PLANS.includes(body.plan) ? body.plan : null;
  if (!plan) return out(400, { error: 'invalid_plan' });
  const message = String(body.message || '').trim().slice(0, 500);

  try {
    const name = u.user_metadata?.name || u.email.split('@')[0];
    const r = await fetch(`${A.SUPABASE_URL}/rest/v1/pix_requests`, {
      method: 'POST',
      headers: A.serviceHeaders(),
      body: JSON.stringify({ user_id: u.id, email: u.email, name, plan, message }),
    });
    if (!r.ok) throw new Error(await r.text());
    return out(200, { ok: true });
  } catch (e) {
    return out(500, { error: 'pix_request_failed' });
  }
};
