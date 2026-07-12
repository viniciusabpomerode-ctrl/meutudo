// Caderno autenticado: Supabase valida o JWT; R2 guarda um JSON por usuário.

const AWS = require("aws-sdk");
const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";

const s3 = new AWS.S3({
  endpoint: `https://${process.env.R2_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_KEY,
  secretAccessKey: process.env.R2_SECRET,
  region: "auto",
  signatureVersion: "v4",
});

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  const authorization = event.headers.authorization || event.headers.Authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    return { statusCode: 401, headers, body: '{"error":"unauthorized"}' };
  }
  const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: authorization },
  });
  if (!authResponse.ok) {
    return { statusCode: 401, headers, body: '{"error":"unauthorized"}' };
  }
  const user = await authResponse.json();
  if (!user?.id) return { statusCode: 401, headers, body: '{"error":"unauthorized"}' };

  const key = `saved_items/${user.id}.json`;

  if (event.httpMethod === "GET") {
    try {
      const obj = await s3.getObject({ Bucket: "edicao", Key: key }).promise();
      return { statusCode: 200, headers, body: obj.Body.toString() };
    } catch (e) {
      if (e.code === "NoSuchKey") return { statusCode: 200, headers, body: "[]" };
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  if (event.httpMethod === "PUT") {
    if (!event.body || event.body.length > 1_000_000) {
      return { statusCode: 400, headers, body: '{"error":"invalid_payload"}' };
    }
    let items;
    try {
      items = JSON.parse(event.body);
      if (!Array.isArray(items)) throw new Error("not_array");
    } catch (e) {
      return { statusCode: 400, headers, body: '{"error":"invalid_payload"}' };
    }
    try {
      await s3.putObject({
        Bucket: "edicao",
        Key: key,
        Body: JSON.stringify(items.slice(0, 5000)),
        ContentType: "application/json",
      }).promise();
      return { statusCode: 200, headers, body: '{"ok":true}' };
    } catch (e) {
      // Erro real de infraestrutura (credenciais R2, bucket, rede) --
      // nao mascara mais como "invalid_payload", senao fica impossivel
      // saber o que realmente esta falhando.
      console.error("saved-items PUT falhou:", e.message);
      return { statusCode: 500, headers, body: JSON.stringify({ error: "storage_failed", detail: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: '{"error":"method not allowed"}' };
};
