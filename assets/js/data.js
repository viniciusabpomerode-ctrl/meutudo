// Carrega os JSONs de conteudo (baixados ao vivo do Supabase do app original,
// veja Cursoweb/scripts/fetch_live_supabase.ps1 e build_cursos_live.py)
const AFB_SUPABASE_URL = "https://zqrdpmrwnprtelgloawb.supabase.co";
const AFB_SUPABASE_ANON_KEY = "sb_publishable_CVFm1nLMf9GCPr-RKKU6Rw_AFixWd5z";
const AFB_AUDIO_BUCKET = "podcast"; // mesmo bucket usado pelo app Flutter (bucket privado)

// Cloudflare R2 — fallback para audios que nao estao no Supabase
const AFB_R2_PUBLIC_URL = "https://pub-d856fe7eb96043c3a93a4d72cd8317cc.r2.dev";

const AFBData = {
  _cache: {},

  // Carrega do R2 (nuvem), fallback local
  async load(path) {
    const lang = I18n.getCurrent();
    const key = lang !== "pt" ? `${lang}/${path}` : path;
    if (AFBData._cache[key]) return AFBData._cache[key];

    let res = null;
    // Tenta R2 primeiro, depois local
    const urls = [
      `${AFB_R2_PUBLIC_URL}/data/${path}.json`,
      `../data/${path}.json`,
    ];
    if (lang !== "pt") {
      urls.unshift(`${AFB_R2_PUBLIC_URL}/data/${lang}/${path}.json`);
      urls.push(`../data/${lang}/${path}.json`);
    }

    for (const url of urls) {
      try {
        const r = await fetch(url, { cache: "no-cache" });
        if (r.ok) { res = r; break; }
      } catch {}
    }

    if (!res || !res.ok) throw new Error(`Falha ao carregar ${path}.json`);
    const json = await res.json();
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

// Cria (ou reaproveita) um <audio> escondido na pagina e toca o caminho dado.
// Tenta Supabase e Cloudflare R2 em paralelo — se um falhar, troca instantaneamente.
async function afbPlayAudio(path, btn) {
  if (!path) return;
  const originalLabel = btn ? btn.textContent : null;
  if (btn) btn.textContent = "⏳";

  const r2Url = `${AFB_R2_PUBLIC_URL}/${path}`;
  const supabaseUrl = await AFBData.signedAudioUrl(path);

  // Prefere Supabase; se falhar, R2 assume no onerror
  let triedR2 = !supabaseUrl; // se Supabase nem retornou URL, ja vai direto pro R2
  const url = supabaseUrl || r2Url;

  let player = document.getElementById("afb-audio-player");
  if (!player) {
    player = document.createElement("audio");
    player.id = "afb-audio-player";
    player.style.display = "none";
    document.body.appendChild(player);
  }
  player.onerror = () => {
    if (!triedR2) {
      // Supabase falhou → tenta R2 na hora
      triedR2 = true;
      player.src = r2Url;
      player.play().catch(() => {});
      return;
    }
    // Ambos falharam
    if (btn) {
      btn.textContent = "⚠️ áudio indisponível";
      setTimeout(() => { btn.textContent = originalLabel; }, 2000);
    }
  };
  player.src = url;
  if (btn) btn.textContent = originalLabel;
  player.play().catch(() => {});
}
