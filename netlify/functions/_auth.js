const SUPABASE_URL="https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
function bearer(event){const a=event.headers.authorization||event.headers.Authorization||"";return a.startsWith("Bearer ")?a:""}
async function user(event){const a=bearer(event);if(!a)return null;const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_ANON_KEY,Authorization:a}});if(!r.ok)return null;const u=await r.json();return u&&u.id?u:null}
function serviceHeaders(extra={}){const k=process.env.SUPABASE_SERVICE_ROLE_KEY;return{apikey:k,Authorization:`Bearer ${k}`,"Content-Type":"application/json",...extra}}
async function admin(event){const u=await user(event);if(!u||!process.env.SUPABASE_SERVICE_ROLE_KEY)return null;const r=await fetch(`${SUPABASE_URL}/rest/v1/app_admins?user_id=eq.${u.id}&select=role`,{headers:serviceHeaders()});const rows=await r.json();return rows[0]?{user:u,role:rows[0].role}:null}
function jwtPayload(event){try{const token=bearer(event).slice(7),p=token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(Buffer.from(p,'base64').toString('utf8'))}catch{return{}}}
module.exports={SUPABASE_URL,SUPABASE_ANON_KEY,bearer,user,admin,serviceHeaders,jwtPayload};

