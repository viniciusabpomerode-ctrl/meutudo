// Carrega os JSONs de conteudo (baixados ao vivo do Supabase do app original,
// veja Cursoweb/scripts/fetch_live_supabase.ps1 e build_cursos_live.py)
const AFB_SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const AFB_SUPABASE_ANON_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
const AFB_AUDIO_BUCKET = "podcast"; // mesmo bucket usado pelo app Flutter (bucket privado)

// Conteudo passa pelo Worker "content-gateway" (protege quem nao e Premium
// de baixar o banco completo). window.AFB_CONTENT_GATEWAY_URL pode
// sobrescrever isso (ex: apontar de volta pra URL publica do R2 em caso
// de emergencia/debug).
const AFB_R2_PUBLIC_URL = (typeof window !== "undefined" && window.AFB_CONTENT_GATEWAY_URL)
  || "https://deutschbloom-content-gateway.quesaco93.workers.dev";

const AFBData = {
  _cache: {},

  // Carrega do R2 (nuvem), fallback local
  async load(path) {
    const lang = I18n.getCurrent();
    const key = lang !== "pt" ? `${lang}/${path}` : path;
    if (AFBData._cache[key]) return AFBData._cache[key];

    let res = null;
    // Todo idioma usa a mesma base didática em português. A tradução é
    // aplicada abaixo por I18n.translateData; não busca uma cópia paralela
    // por idioma, que pode estar incompleta ou fora de sincronia (sobretudo
    // em verbos e músicas).
    const urls = [
      `${AFB_R2_PUBLIC_URL}/data/${path}.json`,
      `../data/${path}.json`,
    ];

    // Manda o token de acesso quando existir -- o content-gateway usa isso
    // pra saber se devolve o conteudo completo (Premium) ou uma amostra.
    // Fetch direto no R2/local ignora esse header sem problema nenhum.
    let authHeaders = {};
    try {
      if (typeof Auth !== "undefined" && Auth.accessToken) {
        const token = await Auth.accessToken();
        if (token) authHeaders = { Authorization: `Bearer ${token}` };
      }
    } catch {}

    for (const url of urls) {
      try {
        const r = await fetch(url, { cache: "default", headers: authHeaders });
        if (r.ok) { res = r; break; }
      } catch {}
    }

    if (!res || !res.ok) throw new Error(`Falha ao carregar ${path}.json`);
    let json = await res.json();
    if (lang !== "pt" && typeof I18n !== "undefined" && I18n.translateData) {
      json = await I18n.translateData(json);
    }
    AFBData._cache[key] = json;
    return json;
  },
  niveis() { return AFBData.load("niveis"); },
  // { dialog_themes: [...], podcasts: [...] } do nivel (A1..C2)
  nivel(code) { return AFBData.load(`cursos/${code}`); },
  // lista de verbos do nivel (arquivo separado por ser mais pesado)
  verbos(code) { return AFBData.load(`cursos/${code}_verbs`); },
  musica() { return AFBData.load("musica"); },
  jogoVocabulario() { return AFBData.load("jogo_vocabulario"); },

  // Busca em todos os niveis ate achar o item com o id dado (usado quando a
  // pagina so recebe o id pela URL, sem saber o nivel de antemao)
  async findAcrossLevels(kind, id) {
    const niveis = await AFBData.niveis();
    for (const lvl of niveis) {
      if (kind === "verb") {
        const verbs = await AFBData.verbos(lvl.code);
        const found = verbs.find((v) => v.id === id);
        if (found) return { item: found, level: lvl.code };
      } else {
        const data = await AFBData.nivel(lvl.code);
        const list = kind === "dialog"
          ? data.dialog_themes.flatMap((t) => t.dialogs)
          : data.podcasts;
        const found = list.find((x) => x.id === id);
        if (found) return { item: found, level: lvl.code };
      }
    }
    return null;
  },

  // Pede ao Supabase Storage uma URL assinada temporaria (o bucket 'podcast'
  // e privado, entao a URL publica direta nao funciona).
  _signedCache: {},
  async signedAudioUrl(path) {
    if (!path) return null;
    // Os JSONs mais novos podem trazer a URL completa do R2. O Supabase
    // precisa somente da chave interna do objeto.
    if (/^https?:\/\//i.test(path)) {
      try { path = new URL(path).pathname.replace(/^\/+/, ""); }
      catch { return null; }
    }
    if (AFBData._signedCache[path]) return AFBData._signedCache[path];
    const res = await fetch(
      `${AFB_SUPABASE_URL}/storage/v1/object/sign/${AFB_AUDIO_BUCKET}/${path}`,
      {
        method: "POST",
        headers: {
          apikey: AFB_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${AFB_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expiresIn: 3600 }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.signedURL) return null;
    const url = `${AFB_SUPABASE_URL}/storage/v1${data.signedURL}`;
    AFBData._signedCache[path] = url;
    return url;
  },
};

// Velocidade de reprodução — compartilhada entre verbos, gírias e
// vocabulário (cada aluno ajusta uma vez e continua valendo em toda parte).
const AFB_SPEED_KEY = "afb_playback_speed";
function afbGetSpeed() {
  const s = parseFloat(localStorage.getItem(AFB_SPEED_KEY));
  return [0.5, 0.75, 1.0].includes(s) ? s : 1.0;
}
function afbSetSpeed(speed) {
  localStorage.setItem(AFB_SPEED_KEY, String(speed));
  document.querySelectorAll("#afb-audio-player,[data-afb-speed-player]").forEach((player) => {
    player.defaultPlaybackRate = speed;
    player.playbackRate = speed;
  });
  document.querySelectorAll("[data-afb-speed]").forEach((b) => {
    b.classList.toggle("active", parseFloat(b.dataset.afbSpeed) === speed);
  });
}
// Insere o seletor de velocidade (0.5x/0.75x/1x) num container da página.
function afbRenderSpeedControl(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const current = afbGetSpeed();
  el.innerHTML = [0.5, 0.75, 1.0].map((s) =>
    `<button type="button" class="btn-speed${s === current ? " active" : ""}" data-afb-speed="${s}" onclick="afbSetSpeed(${s})">${s}x</button>`
  ).join("");
}

// Cria (ou reaproveita) um <audio> escondido na pagina e toca o caminho dado.
// Tenta Supabase e Cloudflare R2 em paralelo — se um falhar, troca instantaneamente.
async function afbPlayAudio(path, btn) {
  if (!path) return;
  const originalLabel = btn ? btn.textContent : null;
  if (btn) btn.textContent = "⏳";

  const isAbsolute = /^https?:\/\//i.test(path);
  const storagePath = isAbsolute
    ? new URL(path).pathname.replace(/^\/+/, "")
    : String(path).replace(/^\/+/, "");
  const r2Url = isAbsolute ? path : `${AFB_R2_PUBLIC_URL}/${storagePath}`;
  // A assinatura do Supabase começa agora, em paralelo. O R2 toca no mesmo
  // clique para preservar a permissão de reprodução do navegador.
  const supabasePromise = AFBData.signedAudioUrl(storagePath).catch(() => null);
  let switchedToSupabase = false;

  let player = document.getElementById("afb-audio-player");
  if (!player) {
    player = document.createElement("audio");
    player.id = "afb-audio-player";
    player.dataset.afbSpeedPlayer = "true";
    player.style.display = "none";
    document.body.appendChild(player);
  }
  const applyCurrentSpeed = () => {
    const speed = afbGetSpeed();
    player.defaultPlaybackRate = speed;
    player.playbackRate = speed;
  };
  applyCurrentSpeed();
  player.onloadedmetadata = applyCurrentSpeed;
  player.oncanplay = applyCurrentSpeed;
  async function trySupabase() {
    if (switchedToSupabase) return;
    switchedToSupabase = true;
    const supabaseUrl = await supabasePromise;
    if (supabaseUrl) {
      player.src = supabaseUrl;
      applyCurrentSpeed();
      try { await player.play(); return; } catch {}
    }
    if (btn) {
      btn.textContent = "⚠️ áudio indisponível";
      setTimeout(() => { btn.textContent = originalLabel; }, 2000);
    }
  }
  player.onerror = trySupabase;
  player.src = r2Url;
  applyCurrentSpeed();
  if (btn) btn.textContent = originalLabel;
  player.play().catch(trySupabase);
}
