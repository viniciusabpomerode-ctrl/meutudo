// Progresso autenticado: Supabase valida o JWT; R2 guarda um JSON por usuário.
const AWS = require("aws-sdk");
const SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
const s3 = new AWS.S3({
  endpoint: `https://${process.env.R2_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_KEY,
  secretAccessKey: process.env.R2_SECRET,
  region: "auto", signatureVersion: "v4",
});
const headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, PUT, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization","Content-Type":"application/json","Cache-Control":"no-store"};

async function authenticatedUser(event){
  const auth=event.headers.authorization||event.headers.Authorization||"";
  if(!auth.startsWith("Bearer "))return null;
  const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_ANON_KEY,Authorization:auth}});
  if(!r.ok)return null;const user=await r.json();return user&&user.id?user:null;
}

exports.handler=async(event)=>{
  if(event.httpMethod==="OPTIONS")return{statusCode:204,headers};
  const user=await authenticatedUser(event);
  if(!user)return{statusCode:401,headers,body:JSON.stringify({error:"unauthorized"})};
  const key=`progress/${user.id}.json`;
  if(event.httpMethod==="GET"){
    try{const obj=await s3.getObject({Bucket:"edicao",Key:key}).promise();return{statusCode:200,headers,body:obj.Body.toString()}}
    catch(e){if(e.code==="NoSuchKey"||e.statusCode===404)return{statusCode:200,headers,body:JSON.stringify({xp:0,completed:[],streak:0,lastActivity:null})};return{statusCode:500,headers,body:JSON.stringify({error:"read_failed"})}}
  }
  if(event.httpMethod==="PUT"){
    try{
      const p=JSON.parse(event.body||"{}");
      const clean={xp:Math.max(0,Math.min(10000000,Number(p.xp)||0)),completed:Array.isArray(p.completed)?p.completed.slice(0,100000):[],streak:Math.max(0,Math.min(100000,Number(p.streak)||0)),lastActivity:typeof p.lastActivity==="string"?p.lastActivity:null,updatedAt:new Date().toISOString()};
      await s3.putObject({Bucket:"edicao",Key:key,Body:JSON.stringify(clean),ContentType:"application/json"}).promise();
      return{statusCode:200,headers,body:JSON.stringify({ok:true})};
    }catch(e){return{statusCode:400,headers,body:JSON.stringify({error:"invalid_progress"})}}
  }
  return{statusCode:405,headers,body:JSON.stringify({error:"method_not_allowed"})};
};
