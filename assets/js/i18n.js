// ============================================
// SISTEMA DE IDIOMAS — portado do app Flutter
// ============================================

const AppLanguage = {
  pt: { code: "pt", name: "Português", flag: "🇧🇷" },
  en: { code: "en", name: "English", flag: "🇺🇸" },
  es: { code: "es", name: "Español", flag: "🇪🇸" },
  fr: { code: "fr", name: "Français", flag: "🇫🇷" },
  it: { code: "it", name: "Italiano", flag: "🇮🇹" },
  tr: { code: "tr", name: "Türkçe", flag: "🇹🇷" },
};

const AFB_LANG_KEY = "afb_language";

const I18n = {
  _current: "pt",
  _listeners: [],
  _contentTranslations: null,
  _translationPromise: null,

  // ── Inicialização ──
  init() {
    const saved = localStorage.getItem(AFB_LANG_KEY);
    const requested = new URLSearchParams(location.search).get("lang");
    this._current = requested && AppLanguage[requested] ? requested : (saved && AppLanguage[saved] ? saved : "pt");
    if (requested && AppLanguage[requested]) localStorage.setItem(AFB_LANG_KEY, requested);
  },

  getCurrent() {
    return this._current;
  },

  getCurrentLang() {
    return AppLanguage[this._current] || AppLanguage.pt;
  },

  getAvailable() {
    return Object.values(AppLanguage);
  },

  // ── Trocar idioma ──
  async setLanguage(code) {
    if (!AppLanguage[code]) return;
    this._current = code;
    localStorage.setItem(AFB_LANG_KEY, code);
    // Notifica listeners (para recarregar UI)
    this._listeners.forEach(fn => fn(code));
    // Recarrega a página para aplicar novo idioma
    location.reload();
  },

  onChange(fn) {
    this._listeners.push(fn);
  },

  async loadContentTranslations() {
    if (this._current === "pt") return {};
    if (this._contentTranslations) return this._contentTranslations;
    if (this._translationPromise) return this._translationPromise;
    this._translationPromise = fetch(`/data/${this._current}.json`, { cache: "default" })
      .then(r => r.ok ? r.json() : { translations: {} })
      .then(data => (this._contentTranslations = data.translations || {}))
      .catch(() => (this._contentTranslations = {}));
    return this._translationPromise;
  },

  async translateData(value) {
    const map = await this.loadContentTranslations();
    const germanField = /(?:german|_de(?:_|$)|^de$|base_verb|conjugated_verb|german_example|example_sentence_german|contexto_de|prompt$|modelAnswer|pronunciation)/i;
    const visit = (item, key = "") => {
      if (typeof item === "string") return map["" + item.replace(/\s+/g, " ").trim()] || item;
      if (Array.isArray(item)) return item.map(child => visit(child, key));
      if (item && typeof item === "object") {
        Object.keys(item).forEach(childKey => {
          if (!germanField.test(childKey)) item[childKey] = visit(item[childKey], childKey);
        });
      }
      return item;
    };
    return visit(value);
  },

  async applyPageTranslations(root = document.body) {
    if (this._current === "pt" || !root) return;
    const map = await this.loadContentTranslations();
    const ui = {
      "Conteúdo":"Content","Conteúdo ▾":"Content ▾","Planos":"Plans","Clique para ouvir":"Click to listen",
      "Música ambiente para focar":"Ambient music for focus","🎵 Música ambiente para focar":"🎵 Ambient music for focus","Clique no player para ajustar volume":"Click the player to adjust the volume",
      "Foco":"Focus","📚 Foco":"📚 Focus","Bom dia! 👋":"Good morning! 👋","Boa tarde! 👋":"Good afternoon! 👋","Boa noite! 👋":"Good evening! 👋",
      "dias seguidos":"day streak","Marcar como concluída":"Mark as completed","Ver planos":"View plans",
      "Iniciante":"Beginner","Básico":"Basic","Intermediário":"Intermediate","Avançado":"Advanced","Proficiente":"Proficient","Mestre":"Master",
      "Ainda tem mais":"There is more","Desbloquear tudo":"Unlock everything","Simulados Goethe-Zertifikat":"Goethe-Zertifikat Practice Tests","📝 Simulados Goethe-Zertifikat":"📝 Goethe-Zertifikat Practice Tests",
      "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.":"Feel free to keep browsing. When you want full access, Premium unlocks the entire library and you continue right where you left off.",
      "Treinar":"Practice","Acompanhar":"Track","Outros":"Other","Escrita":"Writing","Seu plano de jornada":"Your learning journey",
      "Meta desta semana":"This week's goal","dias ativos":"active days","missões":"missions","Um diálogo":"One dialogue",
      "Pratique alemão em contexto":"Practice German in context","Um verbo em foco":"One verb in focus","Veja exemplos e conjugação":"See examples and conjugation",
      "Quiz curto":"Short quiz","Teste o que ficou na memória":"Test what you remember","teste seus reflexos":"test your reflexes",
      "prova oficial":"official exam","frases profissionais":"professional phrases","frases conjugadas":"conjugated sentences",
      "Criar conta pra não perder seu progresso":"Create an account so you don't lose your progress"
      ,"Misturado":"Mixed","em breve":"coming soon","JOGAR":"PLAY","▶ JOGAR":"▶ PLAY","desbloquear todas":"unlock all"
      ,"Você está jogando com 20 questões grátis de 3.000 —":"You are playing with 20 free questions out of 3,000 —"
    };
    const fragments = {
      " frases":" sentences"," verbos":" verbs"," por dia":" per day"," dias por semana":" days per week"," nível ":" level ",
      " de 60 min":" of 60 min"," da sua meta pessoal — sem comparar com toda a biblioteca.":" of your personal goal — without comparing yourself to the whole library.",
      " questões de simulado Goethe":" Goethe practice-test questions"," te esperando aqui dentro":" waiting for you inside",
      "Mais ":"More ","frases, quizzes e verbos":"sentences, quizzes and verbs"
    };
    const translateText = text => {
      const compact = text.replace(/\s+/g, " ").trim();
      if (!compact) return text;
      let translated = map[compact] || ui[compact];
      if (!translated) {
        translated = compact;
        Object.entries(fragments).forEach(([source, target]) => { translated = translated.replace(source, target); });
        if (translated === compact) return text;
      }
      const start = text.match(/^\s*/)?.[0] || "";
      const end = text.match(/\s*$/)?.[0] || "";
      return start + translated + end;
    };
    const apply = node => {
      if (node.nodeType === 3) {
        const parent = node.parentElement;
        if (parent?.closest?.('[lang="de"],.sentence-de,.german,.phrase-de,.quiz-context,.german-text,.german-word,[data-no-translate]')) return;
        node.nodeValue = translateText(node.nodeValue || "");
      }
      if (node.nodeType !== 1) return;
      if (["SCRIPT", "STYLE", "CODE", "TEXTAREA"].includes(node.tagName)) return;
      ["placeholder", "title", "aria-label"].forEach(attr => {
        const value = node.getAttribute?.(attr);
        if (value) node.setAttribute(attr, translateText(value));
      });
      node.childNodes.forEach(apply);
    };
    apply(root);
    if (!this._translationObserver) {
      this._translationObserver = new MutationObserver(changes => {
        changes.forEach(change => change.addedNodes.forEach(apply));
      });
      this._translationObserver.observe(document.body, { childList: true, subtree: true });
    }
  },

  // ── Campo dinâmico com suporte a _{lang} ──
  // Ex: I18n.field(obj, 'portuguese_translation') retorna
  //     obj.portuguese_translation_en se lang=en, senão obj.portuguese_translation
  field(obj, baseField) {
    if (!obj) return '';
    const lang = this._current;
    if (lang === 'pt') return obj[baseField] || '';
    const translated = obj[baseField + '_' + lang];
    if (translated !== undefined && translated !== null && translated !== '') return translated;
    return obj[baseField] || ''; // fallback
  },

  // ── Traduções estáticas da UI (portado do AppTranslations) ──
  _strings: {
    pt: {
      // Geral
      cursos: "Cursos",
      music: "Música",
      game: "Jogo",
      profile: "Perfil",
      plans: "Planos",
      login: "Entrar",
      logout: "Sair",
      settings: "Configurações",
      language: "Idioma",
      theme: "Tema",
      about: "Sobre",
      save: "Salvar",
      cancel: "Cancelar",
      ok: "OK",
      error: "Erro",
      success: "Sucesso",
      loading: "Carregando...",
      close: "Fechar",
      back: "Voltar",
      // App
      app_title: "DeutschBloom",
      home: "Início",
      dialogs: "Diálogos",
      podcasts: "Podcasts",
      verbs: "Verbos",
      verb_conjugations: "Conjugações e exemplos",
      essential_verbs: "Verbos Essenciais",
      music_title: "Música",
      game_title: "Jogo",
      vocabulary_hunting: "Caçando Vocabulário",
      vocabulary_hunting_desc: "Controle um dragão e capture palavras em alemão!",
      // Perfil
      my_profile: "Meu perfil",
      statistics: "Estatísticas",
      total_xp: "XP total",
      current_level: "Nível",
      daily_streak: "Streak",
      completed: "Concluídos",
      edit_name: "Editar Nome",
      enter_name: "Digite seu nome",
      name: "Nome",
      email: "Email",
      password: "Senha",
      // Idioma
      select_language: "Selecionar Idioma",
      choose_app_language: "Selecione o idioma do aplicativo",
      language_changed: "🌍 Idioma alterado!",
      change_language: "Trocar Idioma",
      // Tema
      choose_theme: "Escolha seu Tema",
      vikings_theme: "🛡️ Vikings",
      guardians_theme: "🦋 Guardiãs",
      vikings_desc: "Aventure-se pelos caminhos dos guerreiros nórdicos",
      guardians_desc: "Explore a magia e sabedoria das guardiãs místicas",
      // Player
      speed: "Velocidade",
      very_slow: "Muito Lento",
      slow: "Lento",
      normal: "Normal",
      playing: "Tocando",
      sentences: "Frases",
      vocabulary_tab: "Vocabulário",
      grammar_tab: "Gramática",
      dialog_full: "Diálogo Completo",
      main_audio: "Áudio principal",
      listen_full: "Ouvir completo",
      // Cursos
      choose_level: "Escolha um nível",
      dialogues: "Conversações práticas por temas",
      podcast_stories: "Histórias por categorias",
      verbs_count: "verbos • 5 tempos • 6 pronomes",
      progress: "Progresso",
      xp_to_next_level: "Faltam {xp} XP para o próximo nível",
      continue_learning: "Continue aprendendo",
      level: "Nível",
      levels: "Níveis",
      // Ações
      create_account: "Criar conta",
      create_account_free: "Criar conta grátis",
      already_have_account: "Já tenho conta",
      no_account_yet: "Ainda não tem conta?",
      forgot_password: "Esqueceu a senha?",
      login_success: "Login realizado com sucesso!",
      // Progresso
      completed_lessons: "Lições completadas",
      lessons_completed: "Lições completadas",
      your_progress: "Seu Progresso",
      progress_saved: "Progresso salvo!",
      mark_complete: "Marcar como concluído",
      already_completed: "Já concluído",
      congratulations: "Parabéns!",
      leveled_up: "Você subiu para o nível {level}!",
      // Vocabulário
      vocabulary: "Vocabulário",
      pronunciation: "Pronúncia",
      translation: "Tradução",
      // Premium
      free_plan: "Grátis",
      premium_plan: "Premium",
      coming_soon: "Em breve",
      // Diálogo
      no_sentences: "Nenhuma frase disponível",
      no_vocabulary: "Nenhum vocabulário disponível",
      no_grammar_tips: "Nenhuma dica de gramática disponível",
      back_to_courses: "← Voltar para Cursos",
      back_to_music: "← Voltar para Música",
      complete_dialog: "Diálogo completo!",
      xp_bonus: "+{xp} XP bônus",
    },
    en: {
      cursos: "Courses",
      music: "Music",
      game: "Game",
      profile: "Profile",
      plans: "Plans",
      login: "Sign In",
      logout: "Logout",
      settings: "Settings",
      language: "Language",
      theme: "Theme",
      about: "About",
      save: "Save",
      cancel: "Cancel",
      ok: "OK",
      error: "Error",
      success: "Success",
      loading: "Loading...",
      close: "Close",
      back: "Back",
      app_title: "Easy German Brasil",
      home: "Home",
      dialogs: "Dialogs",
      podcasts: "Podcasts",
      verbs: "Verbs",
      verb_conjugations: "Conjugations and examples",
      essential_verbs: "Essential Verbs",
      music_title: "Music",
      game_title: "Game",
      vocabulary_hunting: "Vocabulary Hunter",
      vocabulary_hunting_desc: "Control a dragon and capture German words!",
      my_profile: "My profile",
      statistics: "Statistics",
      total_xp: "Total XP",
      current_level: "Level",
      daily_streak: "Streak",
      completed: "Completed",
      edit_name: "Edit Name",
      enter_name: "Enter your name",
      name: "Name",
      email: "Email",
      password: "Password",
      select_language: "Select Language",
      choose_app_language: "Choose the app language",
      language_changed: "🌍 Language changed!",
      change_language: "Change Language",
      choose_theme: "Choose your Theme",
      vikings_theme: "🛡️ Vikings",
      guardians_theme: "🦋 Guardians",
      vikings_desc: "Embark on the paths of Nordic warriors",
      guardians_desc: "Explore the magic and wisdom of mystical guardians",
      speed: "Speed",
      very_slow: "Very Slow",
      slow: "Slow",
      normal: "Normal",
      playing: "Playing",
      sentences: "Sentences",
      vocabulary_tab: "Vocabulary",
      grammar_tab: "Grammar",
      dialog_full: "Full Dialog",
      main_audio: "Main audio",
      listen_full: "Listen full",
      choose_level: "Choose a level",
      dialogues: "Practical conversations by themes",
      podcast_stories: "Stories by categories",
      verbs_count: "verbs • 5 tenses • 6 pronouns",
      progress: "Progress",
      xp_to_next_level: "{xp} XP to next level",
      continue_learning: "Keep learning",
      level: "Level",
      levels: "Levels",
      create_account: "Create account",
      create_account_free: "Create free account",
      already_have_account: "I already have an account",
      no_account_yet: "Don't have an account yet?",
      login_success: "Login successful!",
      completed_lessons: "Completed lessons",
      lessons_completed: "Lessons completed",
      your_progress: "Your Progress",
      progress_saved: "Progress saved!",
      mark_complete: "Mark as completed",
      already_completed: "Already completed",
      congratulations: "Congratulations!",
      leveled_up: "You leveled up to {level}!",
      vocabulary: "Vocabulary",
      pronunciation: "Pronunciation",
      translation: "Translation",
      free_plan: "Free",
      premium_plan: "Premium",
      coming_soon: "Coming soon",
      no_sentences: "No sentences available",
      no_vocabulary: "No vocabulary available",
      no_grammar_tips: "No grammar tips available",
      back_to_courses: "← Back to Courses",
      back_to_music: "← Back to Music",
      complete_dialog: "Dialog complete!",
      xp_bonus: "+{xp} XP bonus",
    },
    es: {
      cursos: "Cursos",
      music: "Música",
      game: "Juego",
      profile: "Perfil",
      plans: "Planes",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      settings: "Ajustes",
      language: "Idioma",
      theme: "Tema",
      about: "Acerca de",
      save: "Guardar",
      cancel: "Cancelar",
      ok: "OK",
      error: "Error",
      success: "Éxito",
      loading: "Cargando...",
      close: "Cerrar",
      back: "Volver",
      app_title: "Alemán Fácil Brasil",
      home: "Inicio",
      dialogs: "Diálogos",
      podcasts: "Podcasts",
      verbs: "Verbos",
      verb_conjugations: "Conjugaciones y ejemplos",
      essential_verbs: "Verbos Esenciales",
      music_title: "Música",
      game_title: "Juego",
      vocabulary_hunting: "Cazando Vocabulario",
      my_profile: "Mi perfil",
      statistics: "Estadísticas",
      total_xp: "XP total",
      current_level: "Nivel",
      daily_streak: "Racha",
      completed: "Completados",
      select_language: "Seleccionar Idioma",
      language_changed: "🌍 ¡Idioma cambiado!",
      change_language: "Cambiar Idioma",
      speed: "Velocidad",
      very_slow: "Muy Lento",
      slow: "Lento",
      normal: "Normal",
      sentences: "Frases",
      vocabulary: "Vocabulario",
      no_sentences: "No hay frases disponibles",
      no_vocabulary: "No hay vocabulario disponible",
      back_to_courses: "← Volver a Cursos",
      create_account: "Crear cuenta",
      create_account_free: "Crear cuenta gratis",
      already_have_account: "Ya tengo cuenta",
      no_account_yet: "¿Aún no tienes cuenta?",
      congratulations: "¡Felicidades!",
      leveled_up: "¡Subiste al nivel {level}!",
      mark_complete: "Marcar como completado",
      already_completed: "Ya completado",
      progress: "Progreso",
      continue_learning: "Continúa aprendiendo",
      level: "Nivel",
    },
    fr: {
      cursos: "Cours",
      music: "Musique",
      game: "Jeu",
      profile: "Profil",
      plans: "Forfaits",
      login: "Connexion",
      logout: "Déconnexion",
      settings: "Paramètres",
      language: "Langue",
      theme: "Thème",
      about: "À propos",
      save: "Enregistrer",
      cancel: "Annuler",
      ok: "OK",
      error: "Erreur",
      success: "Succès",
      loading: "Chargement...",
      close: "Fermer",
      back: "Retour",
      app_title: "Allemand Facile Brésil",
      home: "Accueil",
      dialogs: "Dialogues",
      podcasts: "Podcasts",
      verbs: "Verbes",
      verb_conjugations: "Conjugaisons et exemples",
      essential_verbs: "Verbes Essentiels",
      music_title: "Musique",
      game_title: "Jeu",
      vocabulary_hunting: "Chasse au Vocabulaire",
      my_profile: "Mon profil",
      statistics: "Statistiques",
      total_xp: "XP total",
      current_level: "Niveau",
      daily_streak: "Série",
      completed: "Terminés",
      select_language: "Choisir la Langue",
      language_changed: "🌍 Langue changée !",
      change_language: "Changer de Langue",
      speed: "Vitesse",
      very_slow: "Très Lent",
      slow: "Lent",
      normal: "Normal",
      sentences: "Phrases",
      vocabulary: "Vocabulaire",
      no_sentences: "Aucune phrase disponible",
      no_vocabulary: "Aucun vocabulaire disponible",
      back_to_courses: "← Retour aux Cours",
      create_account: "Créer un compte",
      create_account_free: "Créer un compte gratuit",
      already_have_account: "J'ai déjà un compte",
      no_account_yet: "Vous n'avez pas encore de compte ?",
      congratulations: "Félicitations !",
      leveled_up: "Vous êtes passé au niveau {level} !",
      mark_complete: "Marquer comme terminé",
      already_completed: "Déjà terminé",
      progress: "Progrès",
      continue_learning: "Continuez à apprendre",
      level: "Niveau",
    },
    it: {
      cursos: "Corsi",
      music: "Musica",
      game: "Gioco",
      profile: "Profilo",
      plans: "Piani",
      login: "Accedi",
      logout: "Esci",
      settings: "Impostazioni",
      language: "Lingua",
      theme: "Tema",
      about: "Informazioni",
      save: "Salva",
      cancel: "Annulla",
      ok: "OK",
      error: "Errore",
      success: "Successo",
      loading: "Caricamento...",
      close: "Chiudi",
      back: "Indietro",
      app_title: "Tedesco Facile Brasile",
      home: "Home",
      dialogs: "Dialoghi",
      podcasts: "Podcast",
      verbs: "Verbi",
      verb_conjugations: "Coniugazioni ed esempi",
      essential_verbs: "Verbi Essenziali",
      music_title: "Musica",
      game_title: "Gioco",
      vocabulary_hunting: "Caccia al Vocabolario",
      my_profile: "Il mio profilo",
      statistics: "Statistiche",
      total_xp: "XP totale",
      current_level: "Livello",
      daily_streak: "Serie",
      completed: "Completati",
      select_language: "Seleziona Lingua",
      language_changed: "🌍 Lingua cambiata!",
      change_language: "Cambia Lingua",
      speed: "Velocità",
      very_slow: "Molto Lento",
      slow: "Lento",
      normal: "Normale",
      sentences: "Frasi",
      vocabulary: "Vocabolario",
      no_sentences: "Nessuna frase disponibile",
      no_vocabulary: "Nessun vocabolario disponibile",
      back_to_courses: "← Torna ai Corsi",
      create_account: "Crea account",
      create_account_free: "Crea account gratuito",
      already_have_account: "Ho già un account",
      no_account_yet: "Non hai ancora un account?",
      congratulations: "Congratulazioni!",
      leveled_up: "Sei salito al livello {level}!",
      mark_complete: "Segna come completato",
      already_completed: "Già completato",
      progress: "Progressi",
      continue_learning: "Continua a imparare",
      level: "Livello",
    },
  },

  // ── Obter tradução ──
  t(key, params = {}) {
    const lang = this._strings[this._current];
    if (!lang) return key;
    let text = lang[key];
    if (!text) {
      // Fallback para português
      text = this._strings.pt[key] || key;
    }
    // Substituir parâmetros {xp}, {level}, etc.
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  },

  // ── Atalho ──
  static(key) {
    return I18n.t(key);
  },
};

// Inicializa
I18n.init();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => I18n.applyPageTranslations());
} else {
  I18n.applyPageTranslations();
}
