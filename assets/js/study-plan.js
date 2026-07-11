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
  let plan = null, dirtyMinutes = 0, timer = null;

  function uid(){ try{const u=window.Auth&&Auth.currentUser&&Auth.currentUser();return u&&u.id?u.id:"anon"}catch(e){return "anon"} }
  function key(){return "afb_study_plan_"+uid()}
  function dateKey(d=new Date()){return d.toISOString().slice(0,10)}
  function weekKey(d=new Date()){const x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=x.getUTCDay()||7;x.setUTCDate(x.getUTCDate()+4-day);const y=new Date(Date.UTC(x.getUTCFullYear(),0,1));const w=Math.ceil((((x-y)/86400000)+1)/7);return x.getUTCFullYear()+"-W"+String(w).padStart(2,"0")}
  function defaults(){return {version:1,goal:"general",level:"A1",minutesPerDay:15,daysPerWeek:4,horizon:"3_months",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),days:{},missions:{},achievements:[]}}
  function normalize(p){const d=defaults(),x=Object.assign(d,p||{});x.days=x.days||{};x.missions=x.missions||{};x.achievements=x.achievements||[];return x}
  function load(){try{plan=normalize(JSON.parse(localStorage.getItem(key())||"null"))}catch(e){plan=defaults()}localStorage.setItem(key(),JSON.stringify(plan));return plan}
  function persist(remote=true){plan.updatedAt=new Date().toISOString();localStorage.setItem(key(),JSON.stringify(plan));window.dispatchEvent(new CustomEvent("afb:study-plan",{detail:plan}));if(remote&&uid()!=="anon"&&window.Auth&&Auth.accessToken){Auth.accessToken().then(t=>{if(t)fetch(API,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Bearer "+t},body:JSON.stringify(plan)}).catch(()=>{})})}}
  async function hydrate(){load();if(uid()==="anon"||!window.Auth||!Auth.accessToken)return plan;try{const t=await Auth.accessToken();if(!t)return plan;const r=await fetch(API,{headers:{Authorization:"Bearer "+t}});if(r.ok){const remote=await r.json();if(remote&&remote.version){plan=normalize(remote);localStorage.setItem(key(),JSON.stringify(plan))}}}catch(e){}return plan}
  function configure(values){load();plan.goal=GOALS[values.goal]?values.goal:"general";plan.level=/^(A1|A2|B1|B2|C1|C2)$/.test(values.level)?values.level:"A1";plan.minutesPerDay=Math.max(5,Math.min(180,Number(values.minutesPerDay)||15));plan.daysPerWeek=Math.max(1,Math.min(7,Number(values.daysPerWeek)||4));plan.horizon=["30_days","3_months","6_months","1_year"].includes(values.horizon)?values.horizon:"3_months";persist();return plan}
  function addMinute(){if(document.hidden)return;load();const k=dateKey();plan.days[k]=plan.days[k]||{minutes:0,activities:0};plan.days[k].minutes++;dirtyMinutes++;checkAchievements();if(dirtyMinutes>=5){dirtyMinutes=0;persist()}else{localStorage.setItem(key(),JSON.stringify(plan));window.dispatchEvent(new CustomEvent("afb:study-plan",{detail:plan}))}}
  function startTimer(){if(timer)return;timer=setInterval(addMinute,60000);window.addEventListener("beforeunload",()=>{if(dirtyMinutes)persist()})}
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
  function summary(){load();const wk=weekKey(),entries=Object.entries(plan.days).filter(([d])=>weekKey(new Date(d+"T12:00:00"))===wk);const minutes=entries.reduce((s,[,v])=>s+(Number(v.minutes)||0),0);const activeDays=entries.filter(([,v])=>(v.minutes||0)>0||(v.activities||0)>0).length;const missionCount=Object.entries(plan.missions).filter(([d])=>weekKey(new Date(d+"T12:00:00"))===wk).reduce((s,[,a])=>s+a.length,0);return {minutes,activeDays,missionCount,minutesGoal:plan.minutesPerDay*plan.daysPerWeek,daysGoal:plan.daysPerWeek}}
  function totalMinutes(){load();return Object.values(plan.days).reduce((s,v)=>s+(Number(v.minutes)||0),0)}
  function checkAchievements(){load();const total=totalMinutes(),allMissions=Object.values(plan.missions).reduce((s,a)=>s+a.length,0),candidates=[{id:"first_mission",at:1,label:"Primeira missão concluída"},{id:"ten_missions",at:10,label:"10 missões concluídas"},{id:"hour",at:60,label:"Primeira hora de estudo"},{id:"five_hours",at:300,label:"5 horas de alemão"}];candidates.forEach(a=>{const value=a.id.includes("mission")?allMissions:total;if(value>=a.at&&!plan.achievements.some(x=>x.id===a.id))plan.achievements.push({id:a.id,label:a.label,earnedAt:new Date().toISOString(),seen:false})})}
  function unseenAchievement(){load();return plan.achievements.find(a=>!a.seen)||null}
  function markSeen(id){load();const a=plan.achievements.find(x=>x.id===id);if(a){a.seen=true;persist()}}
  async function init(){load();startTimer();window.dispatchEvent(new CustomEvent("afb:study-plan",{detail:plan}));if(window.Auth&&Auth._ready){Auth._ready().then(()=>hydrate()).then(()=>window.dispatchEvent(new CustomEvent("afb:study-plan",{detail:plan}))).catch(()=>{})}return plan}
  return {GOALS,init,load,configure,missions,completedToday,toggleMission,summary,totalMinutes,unseenAchievement,markSeen,dateKey};
})();
