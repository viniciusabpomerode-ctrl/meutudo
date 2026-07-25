const Promotion = require("./_paid-promotion");

exports.handler = async event => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store, max-age=0",
  };
  if (event.httpMethod !== "GET") return { statusCode: 405, headers, body: JSON.stringify({ error: "method_not_allowed" }) };
  try {
    return { statusCode: 200, headers, body: JSON.stringify(await Promotion.read()) };
  } catch (error) {
    console.error("paid promotion read failed", error.message);
    return { statusCode: 200, headers, body: JSON.stringify({ ...Promotion.DEFAULTS, active: false }) };
  }
};
