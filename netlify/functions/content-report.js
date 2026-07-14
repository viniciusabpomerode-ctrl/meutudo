// Ticket de correção ligado a um item do caderno. Supabase autentica e o R2
// guarda um objeto independente por relato, evitando conflito entre usuários.
const AWS=require("aws-sdk"),crypto=require("crypto");
const SUPABASE_URL="https://zqrdpmrwnprtelgloawb.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
const s3=new AWS.S3({endpoint:`https://${process.env.R2_ID}.r2.cloudflarestorage.com`,accessKeyId:process.env.R2_KEY,secretAccessKey:process.env.R2_SECRET,region:"auto",signatureVersion:"v4"});
const headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization","Content-Type":"application/json","Cache-Control":"no-store"};
const clean=(v,n=500)=>String(v||"").replace(/[\u0000-\u001f]/g," ").trim().slice(0,n);
exports.handler=async event=>{if(event.httpMethod==="OPTIONS")return{statusCode:204,headers};if(event.httpMethod!=="POST")return{statusCode:405,headers,body:'{"error":"method_not_allowed"}'};
 const authorization=event.headers.authorization||event.headers.Authorization||"";if(!authorization.startsWith("Bearer "))return{statusCode:401,headers,body:'{"error":"unauthorized"}'};
 const auth=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_ANON_KEY,Authorization:authorization}});if(!auth.ok)return{statusCode:401,headers,body:'{"error":"unauthorized"}'};const user=await auth.json();
 let body;try{body=JSON.parse(event.body||"{}")}catch{return{statusCode:400,headers,body:'{"error":"invalid_payload"}'}}const message=clean(body.message,2000);if(message.length<5)return{statusCode:400,headers,body:'{"error":"message_too_short"}'};
 const id=`${Date.now()}-${crypto.randomUUID()}`,ticket={id,status:"open",created_at:new Date().toISOString(),user_id:user.id,user_email:clean(user.email,200),message,item:{type:clean(body.item?.type,40),id:clean(body.item?.id,120),parentId:clean(body.item?.parentId,120),nivel:clean(body.item?.nivel,10),title:clean(body.item?.title,300),subtitle:clean(body.item?.subtitle,500),refUrl:clean(body.item?.refUrl,1000)}};
 try{await s3.putObject({Bucket:"edicao",Key:`content_reports/open/${id}.json`,Body:JSON.stringify(ticket),ContentType:"application/json",CacheControl:"no-store"}).promise();return{statusCode:201,headers,body:JSON.stringify({ok:true,id})}}catch(e){return{statusCode:500,headers,body:'{"error":"storage_failed"}'}}};
