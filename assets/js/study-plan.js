// Plano de Jornada: metas pequenas e pessoais, sem comparar com a biblioteca inteira.
const StudyPlan = (() => {
  const API = "/.netlify/functions/study-plan";
  const GOALS = {
    general: "Aprender alemão com constância",
    zero: "Começar do zero",
    conversation: "Conversar no dia a dia",
    work: "Trabalhar na Alemanha",
    goethe: "Preparar para o Goethe",
    pronunciation: "Melhorar a pronúncia",
    vocabulary: "Expandir o vocabulário"
  };
  let plan = null, dirtySeconds = 0, timer = null, lastTick = Date.now();

  function uid(){ try{const u=typeof Auth!=="undefined"&&Auth.currentUser&&Auth.currentUser();return u&&u.id?u.id:"anon"}catch(e){return "anon"} }
  function key(){return "afb_study_plan_"+uid()}
  function dateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
  function weekKey(d=new Date()){const x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=x.getUTCDay()||7;x.setUTCDate(x.getUTCDate()+4-day);const y=new Date(Date.UTC(x.getUTCFullYear(),0,1));const w=Math.ceil((((x-y)/86400000)+1)/7);return x.getUTCFullYear()+"-W"+String(w).padStart(2,"0")}
  function defaults(){return {version:1,goal:"general",level:"A1",minutesPerDay:15,daysPerWeek:4,horizon:"3_months",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),days:{},missions:{},achievements:[]}}
  function normalize(p){const d=defaults(),x=Object.assign(d,p||{});x.days=x.days&&typeof x.days==="object"?x.days:{};Object.values(x.days).forEach(v=>{if(!v||typeof v!=="object")return;if(!Number.isFinite(Number(v.seconds)))v.seconds=Math.max(0,Number(v.minutes)||0)*60;v.minutes=Math.floor(Math.max(0,Number(v.seconds)||0)/60);v.activities=Math.max(0,Number(v.activities)||0)});x.missions=x.missions&&typeof x.missions==="object"?x.missions:{};x.achievements=Array.isArray(x.achievements)?x.achievements:[];return x}
  function load(){try{plan=normalize(JSON.parse(localStorage.getItem(key())||"null"))}catch(e){plan=defaults()}localStorage.setItem(key(),JSON.stringify(plan));return plan}
  function persist(remote=true){plan.updatedAt=new Date().toISOString();localStorage.setItem(key(),JSON.stringify(plan));window.dispatchEvent(new CustomEvent("afb:study-plan",{detail:plan}));if(remote&&uid()!=="anon"&&typeof Auth!=="undefined"&&Auth.accessToken){const snapshot=JSON.stringify(plan);Auth.accessToken().then(t=>{if(t)return fetch(API,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Bearer "+t},body:snapshot,keepalive:true})}).catch(()=>{})}}
  function mergePlans(local,remote){local=normalize(local);remote=normalize(remote);const localNewer=Date.parse(local.updatedAt||0)>=Date.parse(remote.updatedAt||0),merged=normalize(Object.assign({},localNewer?remote:local,localNewer?local:remote));merged.days={};for(const d of new Set([...Object.keys(local.days),...Object.keys(remote.days)])){const a=local.days[d]||{},b=remote.days[d]||{},seconds=Math.max(Number(a.seconds)||Number(a.minutes||0)*60,Number(b.seconds)||Number(b.minutes||0)*60);merged.days[d]={seconds,minutes:Math.floor(seconds/60),activities:Math.max(Number(a.activities)||0,Number(b.activities)||0)}}merged.missions={};for(const d of new Set([...Object.keys(local.missions),...Object.keys(remote.missions)]))merged.missions[d]=[...new Set([...(local.missions[d]||[]),...(remote.missions[d]||[])])];const achievements=new Map();[...(remote.achievements||[]),...(local.achievements||[])].forEach(a=>{if(a&&a.id)achievements.set(a.id,Object.assign({},achievements.get(a.id)||{},a))});merged.achievements=[...achievements.values()];merged.createdAt=local.createdAt&&remote.createdAt?[local.createdAt,remote.createdAt].sort()[0]:(local.createdAt||remote.createdAt);merged.updatedAt=new Date(Math.max(Date.parse(local.updatedAt||0)||0,Date.parse(remote.updatedAt||0)||0)).toISOString();return merged}
  async function hydrate(){const local=load();if(uid()==="anon"||typeof Auth==="undefined"||!Auth.accessToken)return plan;try{const t=await Auth.accessToken();if(!t)return plan;const r=await fetch(API,{headers:{Authorization:"Bearer "+t},cache:"no-store"});if(r.ok){const remote=await r.json();if(remote&&remote.version){plan=mergePlans(local,remote);localStorage.setItem(key(),JSON.stringify(plan));if(JSON.stringify(plan)!==JSON.stringify(normalize(remote)))persist(true)}}}catch(e){}return plan}
  function configure(values){load();plan.goal=GOALS[values.goal]?values.goal:"general";plan.level=/^(A1|A2|B1|B2|C1|C2)$/.test(values.level)?values.level:"A1";plan.minutesPerDay=Math.max(5,Math.min(180,Number(values.minutesPerDay)||15));plan.daysPerWeek=Math.max(1,Math.min(7,Number(values.daysPerWeek)||4));plan.horizon=["30_days","3_months","6_months","1_year"].includes(values.horizon)?values.horizon:"3_months";persist();return plan}
  function recordTime(force=false){const now=Date.now();if(document.hidden&&!force){lastTick=now;return}const elapsed=Math.max(0,Math.min(30,Math.floor((now-lastTick)/1000)));lastTick=now;if(!elapsed)return;load();const k=dateKey();plan.days[k]=plan.days[k]||{seconds:0,minutes:0,activities:0};const day=plan.days[k];day.seconds=Math.max(Number(day.seconds)||Number(day.minutes||0)*60,Number(day.minutes||0)*60)+elapsed;day.minutes=Math.floor(day.seconds/60);dirtySeconds+=elapsed;checkAchievements();if(dirtySeconds>=60){dirtySeconds=0;persist()}else{localStorage.setItem(key(),JSON.stringify(plan));window.dispatchEvent(new CustomEvent("afb:study-plan",{detail:plan}))}}
  function startTimer(){if(timer)return;lastTick=Date.now();timer=setInterval(recordTime,15000);document.addEventListener("visibilitychange",()=>{if(document.hidden)recordTime(true);else lastTick=Date.now()});window.addEventListener("pagehide",()=>{recordTime(true);if(dirtySeconds)persist()})}
  function missions(){load();const lv=plan.level;const common=[
    {id:"quick",icon:"⚡",label:"Sessão rápida",detail:"10 frases, quizzes e verbos",href:"sessao-rapida.html"},
    {id:"dialog",icon:"💬",label:"Um diálogo",detail:"Pratique alemão em contexto",href:`cursos.html?nivel=${lv}`},
    {id:"verb",icon:"📖",label:"Um verbo em foco",detail:"Veja exemplos e conjugação",href:`cursos.html?nivel=${lv}&tab=verbos`},
    {id:"quiz",icon:"🧠",label:"Quiz curto",detail:"Teste o que ficou na memória",href:"quiz.html"},
    {id:"review",icon:"📝",label:"Revisar o caderno",detail:"Retome o que você salvou",href:"caderno.html"},
    {id:"pronunciation",icon:"🎤",label:"Praticar pronúncia",detail:"Ouça, grave e compare",href:"pronuncia.html"}
  ];
  if(plan.goal==="work")common[1]={id:"profession",icon:"💼",label:"Alemão para o trabalho",detail:"Frases de profissões",href:"profissoes.html"};
  if(plan.goal==="goethe")common[3]={id:"goethe",icon:"📋",label:"Prática Goethe",detail:"Uma seção de simulado",href:"simulado.html"};
  if(plan.goal==="pronunciation")common.unshift(common.pop());
  const count=plan.minutesPerDay<=10?3:plan.minutesPerDay<=20?4:plan.minutesPerDay<=30?5:6;
  return common.slice(0,count)
  }
  function completedToday(){load();return plan.missions[dateKey()]||[]}
  function toggleMission(id){load();const k=dateKey(),a=plan.missions[k]||[];const i=a.indexOf(id);if(i>=0)a.splice(i,1);else{a.push(id);plan.days[k]=plan.days[k]||{minutes:0,activities:0};plan.days[k].activities=(plan.days[k].activities||0)+1}plan.missions[k]=a;checkAchievements();persist();return a}
  function summary(){load();const wk=weekKey(),entries=Object.entries(plan.days).filter(([d])=>weekKey(new Date(d+"T12:00:00"))===wk);const seconds=entries.reduce((s,[,v])=>s+(Number(v.seconds)||Number(v.minutes||0)*60),0),minutes=Math.floor(seconds/60);const activeDays=entries.filter(([,v])=>(Number(v.seconds)||Number(v.minutes||0)*60)>0||(v.activities||0)>0).length;const missionCount=Object.entries(plan.missions).filter(([d])=>weekKey(new Date(d+"T12:00:00"))===wk).reduce((s,[,a])=>s+a.length,0);return {seconds,minutes,activeDays,missionCount,minutesGoal:plan.minutesPerDay*plan.daysPerWeek,daysGoal:plan.daysPerWeek}}
  function periodStats(period="week",now=new Date()){load();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate()),end=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1),start=new Date(today);if(period==="year")start.setMonth(0,1);else if(period==="month")start.setDate(1);else{const day=today.getDay()||7;start.setDate(today.getDate()-day+1)}const inPeriod=d=>{const x=new Date(d+"T12:00:00");return x>=start&&x<end},days=Object.entries(plan.days).filter(([d])=>inPeriod(d)),seconds=days.reduce((s,[,v])=>s+(Number(v.seconds)||Number(v.minutes||0)*60),0),activeDays=days.filter(([,v])=>(Number(v.seconds)||Number(v.minutes||0)*60)>0||(v.activities||0)>0).length,missionCount=Object.entries(plan.missions).filter(([d])=>inPeriod(d)).reduce((s,[,a])=>s+(Array.isArray(a)?a.length:0),0);return{period,start:start.toISOString(),end:end.toISOString(),seconds,minutes:Math.floor(seconds/60),activeDays,missionCount}}
  function calculatedTotalMinutes(p){return Math.floor(Object.values(p.days||{}).reduce((s,v)=>s+(Number(v.seconds)||Number(v.minutes||0)*60),0)/60)}
  function totalMinutes(){load();return calculatedTotalMinutes(plan)}
  function checkAchievements(){if(!plan)load();const total=calculatedTotalMinutes(plan),allMissions=Object.values(plan.missions).reduce((s,a)=>s+a.length,0),candidates=[{id:"first_mission",at:1,label:"Primeira missão concluída"},{id:"ten_missions",at:10,label:"10 missões concluídas"},{id:"hour",at:60,label:"Primeira hora de estudo"},{id:"five_hours",at:300,label:"5 horas de alemão"}];candidates.forEach(a=>{const value=a.id.includes("mission")?allMissions:total;if(value>=a.at&&!plan.achievements.some(x=>x.id===a.id))plan.achievements.push({id:a.id,label:a.label,earnedAt:new Date().toISOString(),seen:false})})}
  function unseenAchievement(){load();return plan.achievements.find(a=>!a.seen)||null}
  function markSeen(id){load();const a=plan.achievements.find(x=>x.id===id);if(a){a.seen=true;persist()}}
  async function init(){load();window.dispatchEvent(new CustomEvent("afb:study-plan",{detail:plan}));if(typeof Auth!=="undefined"&&Auth._ready){try{await Auth._ready();await hydrate()}catch(e){}}startTimer();window.dispatchEvent(new CustomEvent("afb:study-plan",{detail:plan}));return plan}
  return {GOALS,init,load,configure,missions,completedToday,toggleMission,summary,periodStats,totalMinutes,unseenAchievement,markSeen,dateKey};
})();
