const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const MODEL = "@cf/meta/llama-3.2-3b-instruct";
const DAILY_LIMIT = 3;
const COOLDOWN_SECONDS = 30;

function json(data, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": origin, "Vary": "Origin" } });
}
function allowedOrigin(request, env) { const origin=request.headers.get("Origin")||"";const list=(env.ALLOWED_ORIGINS||"").split(",").map(x=>x.trim()).filter(Boolean);return !list.length||list.includes(origin)?origin||"*":""; }
async function authenticatedUser(request, env) { const authorization=request.headers.get("Authorization")||"";if(!authorization.startsWith("Bearer "))return null;const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{Authorization:authorization,apikey:env.SUPABASE_ANON_KEY}});if(!r.ok)return null;const user=await r.json();return user&&user.id?user:null; }
async function takeAttempt(env,userId,scope="analysis"){if(!env.LIMITS)throw new Error("LIMITS_KV_NOT_CONFIGURED");const day=new Date().toISOString().slice(0,10),key=`creativity:${scope}:${day}:${userId}`,now=Math.floor(Date.now()/1000),saved=await env.LIMITS.get(key,"json")||{count:0,last:0};if(saved.count>=DAILY_LIMIT)return{ok:false,reason:"daily",remaining:0};if(now-saved.last<COOLDOWN_SECONDS)return{ok:false,reason:"cooldown",retryAfter:COOLDOWN_SECONDS-(now-saved.last),remaining:DAILY_LIMIT-saved.count};const next={count:saved.count+1,last:now};await env.LIMITS.put(key,JSON.stringify(next),{expirationTtl:172800});return{ok:true,remaining:DAILY_LIMIT-next.count};}
function clean(value,max){return typeof value==="string"?value.trim().slice(0,max):""}
function extractJson(output){const text=typeof output==="string"?output:(output&&output.response)||"",match=text.match(/\{[\s\S]*\}/);if(!match)throw new Error("INVALID_AI_RESPONSE");const d=JSON.parse(match[0]);return{score:Math.max(0,Math.min(100,Number(d.score)||0)),summary:clean(d.summary,240),corrected:clean(d.corrected,1800),grammar:Array.isArray(d.grammar)?d.grammar.slice(0,4).map(x=>clean(x,240)):[],vocabulary:Array.isArray(d.vocabulary)?d.vocabulary.slice(0,5).map(x=>clean(x,100)):[],structure:clean(d.structure,360),modelAnswer:clean(d.modelAnswer,1800),mode:"ai"};}

export default {async fetch(request,env){
  const origin=allowedOrigin(request,env);if(!origin)return json({error:"Origin not allowed"},403);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Authorization,Content-Type","Access-Control-Max-Age":"86400"}});
  const url=new URL(request.url);if(request.method!=="POST"||!["/analyze","/transcribe"].includes(url.pathname))return json({error:"Not found"},404,origin);
  try{
    const user=await authenticatedUser(request,env);if(!user)return json({error:"Login required"},401,origin);
    if(url.pathname==="/transcribe"){
      const length=Number(request.headers.get("Content-Length")||0);
      if(length>5_000_000)return json({error:"Audio too large"},413,origin);
      const attempt=await takeAttempt(env,user.id,"transcription");
      if(!attempt.ok)return json({error:attempt.reason,retryAfter:attempt.retryAfter||0,remaining:attempt.remaining},429,origin);
      const audio=await request.arrayBuffer();
      if(!audio.byteLength||audio.byteLength>5_000_000)return json({error:"Invalid audio"},400,origin);
      const result=await env.AI.run("@cf/openai/whisper",{audio:[...new Uint8Array(audio)]});
      return json({text:clean(result&&result.text,3000),remaining:attempt.remaining},200,origin);
    }
    const body=await request.json(),answer=clean(body.answer,1500),prompt=clean(body.prompt,600),level=clean(body.level,2);
    if(!answer||answer.split(/\s+/).length<5||!/^(A1|A2|B1|B2|C1|C2)$/.test(level))return json({error:"Invalid answer"},400,origin);
    const attempt=await takeAttempt(env,user.id,"analysis");if(!attempt.ok)return json({error:attempt.reason,retryAfter:attempt.retryAfter||0,remaining:attempt.remaining},429,origin);
    const system=`Você é um professor de alemão cuidadoso. Avalie uma resposta de nível ${level}. Não invente erros. Explique em português brasileiro, seja encorajador e conciso. Não atribua certificação oficial CEFR. Retorne SOMENTE JSON válido com: score (0-100), summary, corrected (alemão), grammar (array com até 4 explicações), vocabulary (array com até 5 sugestões em alemão), structure e modelAnswer (alemão).`;
    const input=`PERGUNTA: ${prompt}\nRESPOSTA DO ALUNO: ${answer}\nVOCABULÁRIO SUGERIDO: ${(Array.isArray(body.vocabulary)?body.vocabulary:[]).slice(0,5).join(", ")}\nRESPOSTA DE REFERÊNCIA: ${clean(body.modelAnswer,1000)}`;
    const output=await env.AI.run(MODEL,{messages:[{role:"system",content:system},{role:"user",content:input}],max_tokens:500,temperature:.25});return json({...extractJson(output),remaining:attempt.remaining},200,origin);
  }catch(error){const config=error&&error.message==="LIMITS_KV_NOT_CONFIGURED";return json({error:config?"Server limit storage is not configured":"Analysis failed"},config?503:500,origin)}
}};
