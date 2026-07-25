const AWS = require("aws-sdk");

const DEFAULTS = Object.freeze({
  active: false,
  headline: "Só este mês: Premium em promoção",
  monthly: { brl: 10, usd: 3, eur: 3, idr: 50000 },
  lifetime: { brl: 97, usd: 20, eur: 20, idr: 341868.74 },
  updated_at: null,
});

const s3 = new AWS.S3({
  endpoint: `https://${process.env.R2_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_KEY,
  secretAccessKey: process.env.R2_SECRET,
  region: "auto",
  signatureVersion: "v4",
});

const BUCKET = "edicao";
const KEY = "site_config/paid-promotion.json";

function clean(raw = {}) {
  const amount = (group, currency, fallback) => {
    const n = Number(raw[group]?.[currency]);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  return {
    active: raw.active === true,
    headline: String(raw.headline || DEFAULTS.headline).trim().slice(0, 120),
    monthly: Object.fromEntries(Object.entries(DEFAULTS.monthly).map(([c, v]) => [c, amount("monthly", c, v)])),
    lifetime: Object.fromEntries(Object.entries(DEFAULTS.lifetime).map(([c, v]) => [c, amount("lifetime", c, v)])),
    updated_at: raw.updated_at || null,
  };
}

async function read() {
  try {
    const obj = await s3.getObject({ Bucket: BUCKET, Key: KEY }).promise();
    return clean(JSON.parse(obj.Body.toString("utf8")));
  } catch (error) {
    if (error.code === "NoSuchKey" || error.statusCode === 404) return { ...DEFAULTS };
    throw error;
  }
}

async function write(value) {
  const config = clean({ ...value, updated_at: new Date().toISOString() });
  await s3.putObject({
    Bucket: BUCKET,
    Key: KEY,
    Body: JSON.stringify(config),
    ContentType: "application/json",
    CacheControl: "no-store",
  }).promise();
  return config;
}

module.exports = { DEFAULTS, read, write };
