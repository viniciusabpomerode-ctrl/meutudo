// Netlify Function — detecta o pais do visitante pra decidir idioma/moeda
// padrao (BR ve portugues/R$, o resto do mundo ve ingles/US$).
const H = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" };

exports.handler = async (event) => {
  let country = event.headers["x-country"] || event.headers["x-nf-country"] || null;
  if (!country && event.headers["x-nf-geo"]) {
    try { country = JSON.parse(Buffer.from(event.headers["x-nf-geo"], "base64").toString("utf8")).country?.code || null; } catch {}
  }
  return { statusCode: 200, headers: H, body: JSON.stringify({ country: country || null }) };
};
