(function () {
  const TEXT = {
    pt:"Só este mês: Premium em promoção",en:"This month only: Premium sale",es:"Solo este mes: Premium en oferta",
    fr:"Ce mois-ci seulement : Premium en promotion",it:"Solo questo mese: Premium in offerta",
    tr:"Sadece bu ay: Premium indirimde",ar:"هذا الشهر فقط: عرض Premium",he:"רק החודש: מבצע Premium",
    hi:"केवल इस महीने: Premium पर छूट",pl:"Tylko w tym miesiącu: promocja Premium",
    id:"Hanya bulan ini: promo Premium",ru:"Только в этом месяце: скидка на Premium"
  };
  const CTA={pt:"Ver planos",en:"View plans",es:"Ver planes",fr:"Voir les offres",it:"Vedi piani",tr:"Planları gör",ar:"عرض الخطط",he:"צפייה בתוכניות",hi:"प्लान देखें",pl:"Zobacz plany",id:"Lihat paket",ru:"Посмотреть тарифы"};
  const MONTH={pt:"mês",en:"month",es:"mes",fr:"mois",it:"mese",tr:"ay",ar:"شهر",he:"חודש",hi:"माह",pl:"miesiąc",id:"bulan",ru:"месяц"};
  const PLAN={
    pt:{monthly:"Mensal",lifetime:"Vitalício"},en:{monthly:"Monthly",lifetime:"Lifetime"},es:{monthly:"Mensual",lifetime:"De por vida"},
    fr:{monthly:"Mensuel",lifetime:"À vie"},it:{monthly:"Mensile",lifetime:"A vita"},tr:{monthly:"Aylık",lifetime:"Ömür boyu"},
    ar:{monthly:"شهري",lifetime:"مدى الحياة"},he:{monthly:"חודשי",lifetime:"לכל החיים"},hi:{monthly:"मासिक",lifetime:"लाइफ़टाइम"},
    pl:{monthly:"Miesięczny",lifetime:"Dożywotni"},id:{monthly:"Bulanan",lifetime:"Seumur hidup"},ru:{monthly:"Месячный",lifetime:"Пожизненный"}
  };
  const EU=new Set(["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","GB","CH","NO","IS"]);
  let lastSignature,currencyPromise;
  function language(){return(localStorage.getItem("afb_language")||document.documentElement.lang||"pt").toLowerCase().split("-")[0]}
  async function currency(){
    if(currencyPromise)return currencyPromise;
    currencyPromise=(async()=>{try{const r=await fetch("/.netlify/functions/geo",{cache:"no-store"}),g=await r.json();return g.country==="BR"?"brl":g.country==="ID"?"idr":EU.has(g.country)?"eur":g.country?"usd":language()==="id"?"idr":language()==="pt"?"brl":"usd"}catch{return language()==="id"?"idr":language()==="pt"?"brl":"usd"}})();
    return currencyPromise;
  }
  function money(value,c){return c==="brl"?`R$ ${Number(value).toLocaleString("pt-BR",{maximumFractionDigits:2})}`:c==="eur"?`€${Number(value).toLocaleString("de-DE",{maximumFractionDigits:2})}`:c==="idr"?`Rp${Math.round(value).toLocaleString("id-ID")}`:`US$ ${Number(value).toLocaleString("en-US",{maximumFractionDigits:2})}`}
  async function refresh(){
    try{
      const [r,c]=await Promise.all([fetch("/.netlify/functions/paid-promotion",{cache:"no-store"}),currency()]);
      const config=await r.json();window.AFB_PAID_PROMOTION=config;
      const signature=JSON.stringify([!!config.active,config.updated_at,config.monthly,config.lifetime]);
      const changed=lastSignature!==undefined&&lastSignature!==signature;lastSignature=signature;
      let bar=document.getElementById("afb-paid-promo-banner");
      if(!config.active){if(bar)bar.remove();if(changed)window.dispatchEvent(new CustomEvent("afb:paid-promotion",{detail:config}));return}
      const lang=language();
      if(!bar){bar=document.createElement("aside");bar.id="afb-paid-promo-banner";bar.style.cssText="position:relative;z-index:10001;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;padding:10px 16px;text-align:center;background:linear-gradient(90deg,#7c3aed,#db2777);color:#fff;font:700 14px/1.35 system-ui,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.18)";document.body.insertBefore(bar,document.body.firstChild)}
      const plan=PLAN[lang]||PLAN.pt;
      bar.innerHTML=`<span>✨ ${TEXT[lang]||TEXT.pt}: <strong>${plan.monthly} ${money(config.monthly[c],c)}/${MONTH[lang]||MONTH.pt}</strong> · <strong>${plan.lifetime} ${money(config.lifetime[c],c)}</strong></span><a href="/app/planos.html" style="color:#fff;border:1px solid rgba(255,255,255,.75);border-radius:999px;padding:5px 12px;text-decoration:none">${CTA[lang]||CTA.pt} →</a>`;
      if(changed)window.dispatchEvent(new CustomEvent("afb:paid-promotion",{detail:config}));
    }catch(e){}
  }
  const boot=()=>{refresh();setInterval(refresh,15000)};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
