const A=require('./_auth');
const H={"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Authorization,Content-Type","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Cache-Control":"no-store"};
const out=(statusCode,data)=>({statusCode,headers:H,body:JSON.stringify(data)});
async function rest(path,options={}){const r=await fetch(`${A.SUPABASE_URL}/rest/v1/${path}`,{...options,headers:A.serviceHeaders(options.headers||{})});const data=await r.text();if(!r.ok)throw new Error(data);return data?JSON.parse(data):null}
async function audit(adm,action,target,details){await rest('admin_audit_log',{method:'POST',body:JSON.stringify({admin_user_id:adm.user.id,action,target_user_id:target||null,details:details||{}})})}
exports.handler=async event=>{if(event.httpMethod==='OPTIONS')return{statusCode:204,headers:H};const adm=await A.admin(event);if(!adm)return out(403,{error:'forbidden'});
 try{
  const action=event.queryStringParameters?.action||'summary';
  if(event.httpMethod==='GET'){
   if(action==='users'){const page=Math.max(1,Number(event.queryStringParameters?.page)||1);const r=await fetch(`${A.SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=50`,{headers:A.serviceHeaders()});return out(r.status,await r.json())}
   if(action==='admins')return out(200,{admins:await rest('app_admins?select=user_id,role,created_at&order=created_at.desc')});
   const [admins,plans,credits,refs]=await Promise.all([rest('app_admins?select=user_id'),rest('user_premium?select=email,plan,active,expires_at'),rest('credit_ledger?select=amount_cents,reversed_at'),rest('referrals?select=status')]);
   return out(200,{admins:admins.length,plans:plans.length,activePlans:plans.filter(x=>x.active).length,creditsCents:credits.filter(x=>!x.reversed_at).reduce((s,x)=>s+x.amount_cents,0),referrals:refs.length});
  }
  if(event.httpMethod!=='POST')return out(405,{error:'method_not_allowed'});const b=JSON.parse(event.body||'{}');
  if(action==='grant_plan'){const email=String(b.email||'').toLowerCase();const expires=b.plan==='indeterminado'||b.plan==='fundador'?null:b.expires_at||null;await rest('user_premium?on_conflict=email',{method:'POST',headers:{Prefer:'resolution=merge-duplicates'},body:JSON.stringify({email,plan:b.plan||'indeterminado',active:b.active!==false,expires_at:expires,updated_at:new Date().toISOString()})});await audit(adm,action,null,{email,plan:b.plan});return out(200,{ok:true})}
  if(action==='add_admin'){if(adm.role!=='super_admin')return out(403,{error:'super_admin_required'});const users=await fetch(`${A.SUPABASE_URL}/auth/v1/admin/users`,{headers:A.serviceHeaders()}).then(r=>r.json());const u=(users.users||[]).find(x=>x.email?.toLowerCase()===String(b.email||'').toLowerCase());if(!u)return out(404,{error:'user_not_found'});await rest('app_admins?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates'},body:JSON.stringify({user_id:u.id,role:b.role==='super_admin'?'super_admin':'admin',created_by:adm.user.id})});await audit(adm,action,u.id,{role:b.role});return out(200,{ok:true})}
  if(action==='adjust_credits'){const amount=Math.trunc(Number(b.amount_cents)||0);if(!amount)return out(400,{error:'invalid_amount'});await rest('credit_ledger',{method:'POST',body:JSON.stringify({user_id:b.user_id,amount_cents:amount,kind:'admin_adjustment',description:String(b.description||'Ajuste administrativo').slice(0,160),reference_id:`admin:${adm.user.id}:${Date.now()}`})});await audit(adm,action,b.user_id,{amount});return out(200,{ok:true})}
  return out(400,{error:'invalid_action'});
 }catch(e){return out(500,{error:'admin_operation_failed',detail:e.message.slice(0,300)})}};

