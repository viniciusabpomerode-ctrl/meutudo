(function(){
  const WEEK_MS=7*24*60*60*1000;
  function dateOf(item){
    if(!item||typeof item!=="object")return null;
    const raw=item.published_at||item.publishedAt||item.added_at||item.created_at;
    if(!raw)return null;
    const date=new Date(raw);
    return Number.isNaN(date.getTime())?null:date;
  }
  function isNew(item,now=new Date()){
    const date=dateOf(item);
    if(!date)return false;
    const age=now.getTime()-date.getTime();
    return age>=0&&age<WEEK_MS;
  }
  function badge(item){return isNew(item)?'<span class="content-new-badge" title="Publicado nos últimos 7 dias">NOVO</span>':''}
  function hasNew(value,seen=new Set()){
    if(!value||typeof value!=="object"||seen.has(value))return false;
    seen.add(value);
    if(isNew(value))return true;
    return Object.values(value).some(child=>Array.isArray(child)?child.some(item=>hasNew(item,seen)):false);
  }
  function badgeAny(value){return hasNew(value)?badge({published_at:new Date().toISOString()}):''}
  window.ContentFreshness={WEEK_MS,dateOf,isNew,hasNew,badge,badgeAny};
})();
