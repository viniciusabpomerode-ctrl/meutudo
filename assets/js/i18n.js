// ============================================
// SISTEMA DE IDIOMAS — portado do app Flutter
// ============================================

// Evita flicker: esconde a página até a tradução carregar (só para não-PT)
(function() {
  const style = document.createElement('style');
  style.textContent = 'html.i18n-pending body{visibility:hidden}';
  document.head.appendChild(style);
})();

const AppLanguage = {
  pt: { code: "pt", name: "Português", flag: "🇧🇷" },
  en: { code: "en", name: "English", flag: "🇺🇸" },
  es: { code: "es", name: "Español", flag: "🇪🇸" },
  fr: { code: "fr", name: "Français", flag: "🇫🇷" },
  it: { code: "it", name: "Italiano", flag: "🇮🇹" },
  tr: { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  ar: { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
  he: { code: "he", name: "עברית", flag: "🇮🇱", rtl: true },
  hi: { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  pl: { code: "pl", name: "Polski", flag: "🇵🇱" },
};

const AFB_LANG_KEY = "afb_language";

const I18n = {
  _current: "pt",
  _listeners: [],
  _contentTranslations: null,
  _translationPromise: null,

  // ── Inicialização ──
  init() {
    // Em localhost, força português sempre (geo não funciona sem Netlify Dev)
    const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (isLocal) {
      this._current = "pt";
      document.documentElement.dir = "ltr";
      return;
    }

    const saved = localStorage.getItem(AFB_LANG_KEY);
    const requested = new URLSearchParams(location.search).get("lang");
    if (requested && AppLanguage[requested]) {
      this._current = requested;
      localStorage.setItem(AFB_LANG_KEY, requested);
    } else if (saved && AppLanguage[saved]) {
      this._current = saved;
    } else {
      // Sem preferencia salva: assume ingles por padrao (publico internacional)
      // e corrige pra portugues so se detectar visitante do Brasil.
      this._current = "en";
      this._detectRegion();
    }
    document.documentElement.dir = this.getCurrentLang().rtl ? "rtl" : "ltr";
  },

  async _detectRegion() {
    if (localStorage.getItem(AFB_LANG_KEY)) return;
    try {
      const res = await fetch("/.netlify/functions/geo", { cache: "no-store" });
      const data = await res.json();
      if (localStorage.getItem(AFB_LANG_KEY)) return; // usuario ja escolheu enquanto isso rodava
      if (data.country === "BR") {
        this._current = "pt";
        localStorage.setItem(AFB_LANG_KEY, "pt");
        this._listeners.forEach(fn => fn("pt"));
        location.reload();
      } else {
        localStorage.setItem(AFB_LANG_KEY, "en");
      }
    } catch (e) {}
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
    // R2 nao cobra por trafego de saida — busca de la primeiro (arquivos de
    // 7-12MB por idioma) e so cai pro Netlify se o R2 falhar por algum motivo.
    const r2Url = "https://pub-d856fe7eb96043c3a93a4d72cd8317cc.r2.dev/data/" + this._current + ".json";
    this._translationPromise = fetch(r2Url, { cache: "default" })
      .then(r => r.ok ? r.json() : Promise.reject())
      .catch(() => fetch(`/data/${this._current}.json`, { cache: "default" }).then(r => r.ok ? r.json() : { translations: {} }))
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
      "Ainda tem mais":"There is more","Desbloquear tudo":"Unlock everything","Simulados Goethe-Zertifikat":"Goethe-Zertifikat Practice Tests","📝 Simulados Goethe-Zertifikat":"📝 Goethe-Zertifikat Practice Tests","Simulados Goethe":"Goethe Practice Tests",
      "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.":"Feel free to keep browsing. When you want full access, Premium unlocks the entire library and you continue right where you left off.",
      "Treinar":"Practice","Acompanhar":"Track","Outros":"Other","Escrita":"Writing","Seu plano de jornada":"Your learning journey",
      "Meta desta semana":"This week's goal","dias ativos":"active days","missões":"missions","Um diálogo":"One dialogue",
      "Pratique alemão em contexto":"Practice German in context","Um verbo em foco":"One verb in focus","Veja exemplos e conjugação":"See examples and conjugation",
      "Quiz curto":"Short quiz","Teste o que ficou na memória":"Test what you remember","teste seus reflexos":"test your reflexes",
      "prova oficial":"official exam","frases profissionais":"professional phrases","frases conjugadas":"conjugated sentences",
      "Criar conta pra não perder seu progresso":"Create an account so you don't lose your progress"
      ,"Meu perfil":"My profile","Nome":"Name","E-mail":"Email","Salvar":"Save","Estatísticas":"Statistics",
      "XP total":"Total XP","Nível":"Level","Concluídos":"Completed","Ambiente de estudo":"Study environment",
      "Trocar ambiente":"Switch environment","Idioma":"Language","Altere o idioma da interface do app.":"Change the app's interface language.",
      "Trocar idioma":"Switch language","Assinatura":"Subscription","Verificando...":"Checking...","Conta":"Account",
      "Indique e ganhe":"Refer and earn","Chame seus amigos pra aprender alemão 🇩🇪":"Invite your friends to learn German 🇩🇪",
      "seu saldo em créditos":"your credit balance","① Manda seu link":"① Send your link",
      "② Seu amigo assina um plano":"② Your friend subscribes to a plan",
      "③ Você ganha 20% em créditos, direto na sua carteira":"③ You earn 20% in credits, straight to your wallet",
      "Seu link de indicação":"Your referral link","Carregando...":"Loading...","Copiar":"Copy","Sair da conta":"Log out",
      "Plano grátis":"Free plan","Premium Mensal":"Monthly Premium","Premium Anual":"Yearly Premium","Premium Vitalício (Fundador)":"Lifetime Premium (Founder)",
      "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"Your credit lands in your wallet 7 days after your friend pays (that's their refund-guarantee window — if they cancel within it, no credit is generated). To use your balance, just reach out via ",
      "/ano":"/year","/mês":"/month"
      ,"Misturado":"Mixed","em breve":"coming soon","JOGAR":"PLAY","▶ JOGAR":"▶ PLAY","desbloquear todas":"unlock all"
      ,"Você está jogando com 20 questões grátis de 3.000 —":"You are playing with 20 free questions out of 3,000 —"
      ,"Investimento":"Investment","Escolha seu plano":"Choose your plan","Grátis":"Free"
      ,"para sempre · sem cartão":"forever · no card needed"
      ,"Mais popular · economize 17%":"Most popular · save 17%"
      ,"cancele quando quiser":"cancel anytime","Usar grátis":"Use for free"
      ,"20 conteúdos de cada categoria":"20 items per category"
      ,"Quiz de nivelamento":"Placement quiz"
      ,"Rádio lo-fi e Pomodoro":"Lo-fi radio & Pomodoro"
      ,"Sistema de XP e níveis":"XP & leveling system"
      ,"Biblioteca completa (63.000 itens)":"Full library (63,000 items)"
      ,"Simulados Goethe completos":"Full Goethe practice tests"
      ,"Todos os 63.000 itens liberados":"All 63,000 items unlocked"
      ,"1.225 diálogos + 1.315 verbos conjugados":"1,225 dialogs + 1,315 conjugated verbs"
      ,"3.000 questões de quiz + simulados Goethe":"3,000 quiz questions + Goethe practice tests"
      ,"1.509 gírias e 1.200 frases de profissões":"1,509 slang terms + 1,200 professional phrases"
      ,"Áudio de alta qualidade em todo o conteúdo":"High-quality audio across all content"
      ,"Progresso sincronizado na nuvem":"Cloud-synced progress"
      ,"Oferta de fundador · vagas limitadas":"Founder offer · limited spots"
      ,"Garantir vaga — R$ 297":"Claim your spot — R$ 297"
      ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"Secure payment via Stripe · 7-day guarantee: not satisfied? We'll refund you."
      ,"Biblioteca completa liberada":"Full library unlocked"
      ,"Ver progresso completo":"View full progress"
      ,"Vocabulario":"Vocabulary","planos":"plans"
      ,"📚 Vocabulário em Alemão":"📚 German Vocabulary"
      ,"2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.":"2,500 everyday words, organized into 25 categories — with plural and audio example sentences."
      ,"🔍 Buscar em todas as categorias...":"🔍 Search all categories..."
      ,"← Voltar para categorias":"← Back to categories"
      ,"🔍 Buscar nesta categoria...":"🔍 Search this category..."
      ,"Todos":"All","palavras":"words","palavra":"word"
      ,"Nenhuma encontrada.":"None found."
      ,"Plural:":"Plural:","Sem plural (substantivo abstrato)":"No plural (abstract noun)"
      ,"▶ Palavra":"▶ Word","▶ Plural":"▶ Plural","▶ Frase":"▶ Sentence"
      ,"Ouvir exemplo":"Listen to example"
    };
    const uiFallbacks = {
      en: {
        ...ui,
        "Moderno, Vikings ou Aurora — troque quando quiser.": "Modern, Vikings, or Aurora — switch whenever you like.",
        "LoFi Cafe · pausado": "LoFi Cafe · paused",
        "LoFi Cafe · tocando agora": "LoFi Cafe · playing now",
        "pausado": "paused",
        "tocando agora": "playing now",
        "Escrita": "Writing",
        "Planos": "Plans",
        "Conhecer os planos": "Explore plans",
        "treine redação": "practice writing"
      },
      es: {
        "Conteúdo": "Contenido", "Conteúdo ▾": "Contenido ▾", "Planos": "Planes",
        "Clique para ouvir": "Haz clic para escuchar", "Música ambiente para focar": "Música ambiental para concentrarte",
        "🎵 Música ambiente para focar": "🎵 Música ambiental para concentrarte", "Clique no player para ajustar volume": "Haz clic en el reproductor para ajustar el volumen",
        "Foco": "Concentración", "📚 Foco": "📚 Concentración", "Marcar como concluída": "Marcar como completada",
        "Ver planos": "Ver planes", "Treinar": "Practicar", "Acompanhar": "Seguir", "Outros": "Otros",
        "Escrita": "Escritura", "Seu plano de jornada": "Tu plan de aprendizaje", "Meta desta semana": "Objetivo de esta semana",
        "dias ativos": "días activos", "missões": "misiones", "Um diálogo": "Un diálogo",
        "Pratique alemão em contexto": "Practica alemán en contexto", "Um verbo em foco": "Un verbo destacado",
        "Veja exemplos e conjugação": "Consulta ejemplos y conjugaciones", "Quiz curto": "Cuestionario corto",
        "Teste o que ficou na memória": "Comprueba lo que recuerdas", "em breve": "próximamente",
        "Moderno, Vikings ou Aurora — troque quando quiser.": "Moderno, Vikingos o Aurora: cámbialo cuando quieras.",
        "LoFi Cafe · pausado": "LoFi Cafe · en pausa", "LoFi Cafe · tocando agora": "LoFi Cafe · reproduciendo ahora",
        "pausado": "en pausa", "tocando agora": "reproduciendo ahora", "Conhecer os planos": "Conocer los planes",
        "treine redação": "practica la escritura",
        "Bom dia! 👋": "¡Buenos días! 👋", "Boa tarde! 👋": "¡Buenas tardes! 👋", "Boa noite! 👋": "¡Buenas noches! 👋",
        "dias seguidos": "días de racha",
        "Iniciante": "Principiante", "Básico": "Básico", "Intermediário": "Intermedio", "Avançado": "Avanzado", "Proficiente": "Competente", "Mestre": "Maestro",
        "Ainda tem mais": "Todavía hay más", "Desbloquear tudo": "Desbloquear todo", "Simulados Goethe-Zertifikat": "Simulacros Goethe-Zertifikat", "📝 Simulados Goethe-Zertifikat": "📝 Simulacros Goethe-Zertifikat", "Simulados Goethe": "Simulacros Goethe",
        "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Siéntete libre de seguir explorando. Cuando quieras acceso completo, Premium desbloquea toda la biblioteca y continúas justo donde lo dejaste.",
        "prova oficial": "examen oficial", "frases profissionais": "frases profesionales", "frases conjugadas": "frases conjugadas",
        "Criar conta pra não perder seu progresso": "Crea una cuenta para no perder tu progreso",
        "Misturado": "Mixto", "JOGAR": "JUGAR", "▶ JOGAR": "▶ JUGAR", "desbloquear todas": "desbloquear todas",
        "Você está jogando com 20 questões grátis de 3.000 —": "Estás jugando con 20 preguntas gratis de 3.000 —",
        "Meu perfil":"Mi perfil", "Nome":"Nombre", "E-mail":"Correo electrónico", "Salvar":"Guardar", "Estatísticas":"Estadísticas",
        "XP total":"XP total", "Nível":"Nivel", "Concluídos":"Completados", "Ambiente de estudo":"Entorno de estudio",
        "Trocar ambiente":"Cambiar entorno", "Idioma":"Idioma", "Altere o idioma da interface do app.":"Cambia el idioma de la interfaz de la app.",
        "Trocar idioma":"Cambiar idioma", "Assinatura":"Suscripción", "Verificando...":"Verificando...", "Conta":"Cuenta",
        "Indique e ganhe":"Recomienda y gana", "Chame seus amigos pra aprender alemão 🇩🇪":"Invita a tus amigos a aprender alemán 🇩🇪",
        "seu saldo em créditos":"tu saldo en créditos", "① Manda seu link":"① Envía tu enlace",
        "② Seu amigo assina um plano":"② Tu amigo se suscribe a un plan",
        "③ Você ganha 20% em créditos, direto na sua carteira":"③ Ganas un 20% en créditos, directo a tu billetera",
        "Seu link de indicação":"Tu enlace de recomendación", "Carregando...":"Cargando...", "Copiar":"Copiar", "Sair da conta":"Cerrar sesión",
        "Plano grátis":"Plan gratis", "Premium Mensal":"Premium Mensual", "Premium Anual":"Premium Anual", "Premium Vitalício (Fundador)":"Premium Vitalicio (Fundador)",
        "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"Tu crédito llega a tu billetera 7 días después de que tu amigo pague (es su ventana de garantía de reembolso; si cancela dentro de ese plazo, no se genera crédito). Para usar tu saldo, solo contáctanos en ",
        "/ano":"/año","/mês":"/mes"
        ,"Investimento":"Inversión","Escolha seu plano":"Elige tu plan","Grátis":"Gratis"
        ,"para sempre · sem cartão":"para siempre · sin tarjeta"
        ,"Mais popular · economize 17%":"Más popular · ahorra 17%"
        ,"cancele quando quiser":"cancela cuando quieras","Usar grátis":"Usar gratis"
        ,"20 conteúdos de cada categoria":"20 contenidos por categoría"
        ,"Quiz de nivelamento":"Cuestionario de nivel"
        ,"Rádio lo-fi e Pomodoro":"Radio lo-fi y Pomodoro"
        ,"Sistema de XP e níveis":"Sistema de XP y niveles"
        ,"Biblioteca completa (63.000 itens)":"Biblioteca completa (63.000 ítems)"
        ,"Simulados Goethe completos":"Simulacros Goethe completos"
        ,"Todos os 63.000 itens liberados":"Todos los 63.000 ítems desbloqueados"
        ,"1.225 diálogos + 1.315 verbos conjugados":"1.225 diálogos + 1.315 verbos conjugados"
        ,"3.000 questões de quiz + simulados Goethe":"3.000 preguntas de quiz + simulacros Goethe"
        ,"1.509 gírias e 1.200 frases de profissões":"1.509 jergas + 1.200 frases profesionales"
        ,"Áudio de alta qualidade em todo o conteúdo":"Audio de alta calidad en todo el contenido"
        ,"Progresso sincronizado na nuvem":"Progreso sincronizado en la nube"
        ,"Oferta de fundador · vagas limitadas":"Oferta fundador · plazas limitadas"
        ,"Garantir vaga — R$ 297":"Reservar plaza — R$ 297"
        ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"Pago seguro vía Stripe · Garantía de 7 días: ¿no te gusta? Te devolvemos el dinero."
      },
      fr: {
        "Conteúdo": "Contenu", "Conteúdo ▾": "Contenu ▾", "Planos": "Forfaits",
        "Clique para ouvir": "Cliquez pour écouter", "Música ambiente para focar": "Musique d'ambiance pour se concentrer",
        "🎵 Música ambiente para focar": "🎵 Musique d'ambiance pour se concentrer", "Clique no player para ajustar volume": "Cliquez sur le lecteur pour ajuster le volume",
        "Foco": "Concentration", "📚 Foco": "📚 Concentration", "Marcar como concluída": "Marquer comme terminé",
        "Ver planos": "Voir les forfaits", "Treinar": "Pratiquer", "Acompanhar": "Suivre", "Outros": "Autres",
        "Escrita": "Écriture", "Seu plano de jornada": "Votre plan d'apprentissage", "Meta desta semana": "Objectif de cette semaine",
        "dias ativos": "jours actifs", "missões": "missions", "Um diálogo": "Un dialogue",
        "Pratique alemão em contexto": "Pratiquez l'allemand en contexte", "Um verbo em foco": "Un verbe à la loupe",
        "Veja exemplos e conjugação": "Voyez des exemples et la conjugaison", "Quiz curto": "Quiz rapide",
        "Teste o que ficou na memória": "Testez ce dont vous vous souvenez", "em breve": "bientôt disponible",
        "Moderno, Vikings ou Aurora — troque quando quiser.": "Moderne, Vikings ou Aurora — changez quand vous voulez.",
        "LoFi Cafe · pausado": "LoFi Cafe · en pause", "LoFi Cafe · tocando agora": "LoFi Cafe · en cours de lecture",
        "pausado": "en pause", "tocando agora": "en cours de lecture", "Conhecer os planos": "Découvrir les forfaits",
        "treine redação": "pratiquer l'écriture",
        "Bom dia! 👋": "Bonjour ! 👋", "Boa tarde! 👋": "Bon après-midi ! 👋", "Boa noite! 👋": "Bonsoir ! 👋",
        "dias seguidos": "jours de suite",
        "Iniciante": "Débutant", "Básico": "Basique", "Intermediário": "Intermédiaire", "Avançado": "Avancé", "Proficiente": "Compétent", "Mestre": "Maître",
        "Ainda tem mais": "Il y a encore plus", "Desbloquear tudo": "Tout débloquer", "Simulados Goethe-Zertifikat": "Simulations Goethe-Zertifikat", "📝 Simulados Goethe-Zertifikat": "📝 Simulations Goethe-Zertifikat", "Simulados Goethe": "Simulations Goethe",
        "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Continuez à explorer librement. Quand vous voudrez tout débloquer, Premium ouvre toute la bibliothèque et vous reprenez exactement là où vous en étiez.",
        "prova oficial": "examen officiel", "frases profissionais": "phrases professionnelles", "frases conjugadas": "phrases conjuguées",
        "Criar conta pra não perder seu progresso": "Créez un compte pour ne pas perdre votre progression",
        "Misturado": "Mixte", "JOGAR": "JOUER", "▶ JOGAR": "▶ JOUER", "desbloquear todas": "débloquer toutes",
        "Você está jogando com 20 questões grátis de 3.000 —": "Vous jouez avec 20 questions gratuites sur 3 000 —",
        "Meu perfil":"Mon profil", "Nome":"Nom", "E-mail":"E-mail", "Salvar":"Enregistrer", "Estatísticas":"Statistiques",
        "XP total":"XP total", "Nível":"Niveau", "Concluídos":"Terminés", "Ambiente de estudo":"Environnement d'étude",
        "Trocar ambiente":"Changer d'environnement", "Idioma":"Langue", "Altere o idioma da interface do app.":"Changez la langue de l'interface de l'application.",
        "Trocar idioma":"Changer de langue", "Assinatura":"Abonnement", "Verificando...":"Vérification...", "Conta":"Compte",
        "Indique e ganhe":"Parrainez et gagnez", "Chame seus amigos pra aprender alemão 🇩🇪":"Invitez vos amis à apprendre l'allemand 🇩🇪",
        "seu saldo em créditos":"votre solde de crédits", "① Manda seu link":"① Envoyez votre lien",
        "② Seu amigo assina um plano":"② Votre ami s'abonne à un forfait",
        "③ Você ganha 20% em créditos, direto na sua carteira":"③ Vous gagnez 20% en crédits, directement dans votre portefeuille",
        "Seu link de indicação":"Votre lien de parrainage", "Carregando...":"Chargement...", "Copiar":"Copier", "Sair da conta":"Se déconnecter",
        "Plano grátis":"Forfait gratuit", "Premium Mensal":"Premium Mensuel", "Premium Anual":"Premium Annuel", "Premium Vitalício (Fundador)":"Premium à Vie (Fondateur)",
        "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"Votre crédit arrive dans votre portefeuille 7 jours après le paiement de votre ami (c'est sa fenêtre de garantie de remboursement ; s'il annule pendant cette période, aucun crédit n'est généré). Pour utiliser votre solde, contactez-nous simplement via ",
        "/ano":"/an","/mês":"/mois"
        ,"Investimento":"Investissement","Escolha seu plano":"Choisissez votre forfait","Grátis":"Gratuit"
        ,"para sempre · sem cartão":"pour toujours · sans carte"
        ,"Mais popular · economize 17%":"Le plus populaire · économisez 17%"
        ,"cancele quando quiser":"annulez quand vous voulez","Usar grátis":"Utiliser gratuitement"
        ,"20 conteúdos de cada categoria":"20 contenus par catégorie"
        ,"Quiz de nivelamento":"Quiz de positionnement"
        ,"Rádio lo-fi e Pomodoro":"Radio lo-fi et Pomodoro"
        ,"Sistema de XP e níveis":"Système d'XP et de niveaux"
        ,"Biblioteca completa (63.000 itens)":"Bibliothèque complète (63 000 éléments)"
        ,"Simulados Goethe completos":"Simulations Goethe complètes"
        ,"Todos os 63.000 itens liberados":"Les 63 000 éléments débloqués"
        ,"1.225 diálogos + 1.315 verbos conjugados":"1 225 dialogues + 1 315 verbes conjugués"
        ,"3.000 questões de quiz + simulados Goethe":"3 000 questions de quiz + simulations Goethe"
        ,"1.509 gírias e 1.200 frases de profissões":"1 509 expressions familières + 1 200 phrases professionnelles"
        ,"Áudio de alta qualidade em todo o conteúdo":"Audio haute qualité sur tout le contenu"
        ,"Progresso sincronizado na nuvem":"Progression synchronisée dans le cloud"
        ,"Oferta de fundador · vagas limitadas":"Offre fondateur · places limitées"
        ,"Garantir vaga — R$ 297":"Réserver ma place — R$ 297"
        ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"Paiement sécurisé via Stripe · Garantie 7 jours : pas satisfait ? On vous rembourse."
      },
      it: {
        "Conteúdo": "Contenuto", "Conteúdo ▾": "Contenuto ▾", "Planos": "Piani",
        "Clique para ouvir": "Clicca per ascoltare", "Música ambiente para focar": "Musica d'ambiente per concentrarsi",
        "🎵 Música ambiente para focar": "🎵 Musica d'ambiente per concentrarsi", "Clique no player para ajustar volume": "Clicca sul lettore per regolare il volume",
        "Foco": "Concentrazione", "📚 Foco": "📚 Concentrazione", "Marcar como concluída": "Segna come completata",
        "Ver planos": "Vedi i piani", "Treinar": "Esercitati", "Acompanhar": "Segui", "Outros": "Altro",
        "Escrita": "Scrittura", "Seu plano de jornada": "Il tuo piano di apprendimento", "Meta desta semana": "Obiettivo di questa settimana",
        "dias ativos": "giorni attivi", "missões": "missioni", "Um diálogo": "Un dialogo",
        "Pratique alemão em contexto": "Pratica il tedesco nel contesto", "Um verbo em foco": "Un verbo in primo piano",
        "Veja exemplos e conjugação": "Guarda esempi e coniugazione", "Quiz curto": "Quiz breve",
        "Teste o que ficou na memória": "Metti alla prova ciò che ricordi", "em breve": "prossimamente",
        "Moderno, Vikings ou Aurora — troque quando quiser.": "Moderno, Vikings o Aurora — cambia quando vuoi.",
        "LoFi Cafe · pausado": "LoFi Cafe · in pausa", "LoFi Cafe · tocando agora": "LoFi Cafe · in riproduzione",
        "pausado": "in pausa", "tocando agora": "in riproduzione", "Conhecer os planos": "Scopri i piani",
        "treine redação": "esercitati nella scrittura",
        "Bom dia! 👋": "Buongiorno! 👋", "Boa tarde! 👋": "Buon pomeriggio! 👋", "Boa noite! 👋": "Buonasera! 👋",
        "dias seguidos": "giorni di fila",
        "Iniciante": "Principiante", "Básico": "Base", "Intermediário": "Intermedio", "Avançado": "Avanzato", "Proficiente": "Competente", "Mestre": "Maestro",
        "Ainda tem mais": "C'è ancora di più", "Desbloquear tudo": "Sblocca tutto", "Simulados Goethe-Zertifikat": "Simulazioni Goethe-Zertifikat", "📝 Simulados Goethe-Zertifikat": "📝 Simulazioni Goethe-Zertifikat", "Simulados Goethe": "Simulazioni Goethe",
        "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Continua pure a esplorare. Quando vorrai sbloccare tutto, Premium apre l'intera biblioteca e riprendi esattamente da dove avevi lasciato.",
        "prova oficial": "esame ufficiale", "frases profissionais": "frasi professionali", "frases conjugadas": "frasi coniugate",
        "Criar conta pra não perder seu progresso": "Crea un account per non perdere i tuoi progressi",
        "Misturado": "Misto", "JOGAR": "GIOCA", "▶ JOGAR": "▶ GIOCA", "desbloquear todas": "sblocca tutte",
        "Você está jogando com 20 questões grátis de 3.000 —": "Stai giocando con 20 domande gratuite su 3.000 —",
        "Meu perfil":"Il mio profilo", "Nome":"Nome", "E-mail":"Email", "Salvar":"Salva", "Estatísticas":"Statistiche",
        "XP total":"XP totale", "Nível":"Livello", "Concluídos":"Completati", "Ambiente de estudo":"Ambiente di studio",
        "Trocar ambiente":"Cambia ambiente", "Idioma":"Lingua", "Altere o idioma da interface do app.":"Cambia la lingua dell'interfaccia dell'app.",
        "Trocar idioma":"Cambia lingua", "Assinatura":"Abbonamento", "Verificando...":"Verifica in corso...", "Conta":"Account",
        "Indique e ganhe":"Invita e guadagna", "Chame seus amigos pra aprender alemão 🇩🇪":"Invita i tuoi amici a imparare il tedesco 🇩🇪",
        "seu saldo em créditos":"il tuo saldo crediti", "① Manda seu link":"① Invia il tuo link",
        "② Seu amigo assina um plano":"② Il tuo amico si abbona a un piano",
        "③ Você ganha 20% em créditos, direto na sua carteira":"③ Guadagni il 20% in crediti, direttamente nel tuo portafoglio",
        "Seu link de indicação":"Il tuo link di invito", "Carregando...":"Caricamento...", "Copiar":"Copia", "Sair da conta":"Esci dall'account",
        "Plano grátis":"Piano gratuito", "Premium Mensal":"Premium Mensile", "Premium Anual":"Premium Annuale", "Premium Vitalício (Fundador)":"Premium a Vita (Fondatore)",
        "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"Il tuo credito arriva nel portafoglio 7 giorni dopo che il tuo amico paga (è la sua finestra di garanzia di rimborso; se annulla entro quel periodo, non viene generato alcun credito). Per usare il tuo saldo, contattaci semplicemente su ",
        "/ano":"/anno","/mês":"/mese"
        ,"Investimento":"Investimento","Escolha seu plano":"Scegli il tuo piano","Grátis":"Gratuito"
        ,"para sempre · sem cartão":"per sempre · senza carta"
        ,"Mais popular · economize 17%":"Più popolare · risparmia il 17%"
        ,"cancele quando quiser":"cancella quando vuoi","Usar grátis":"Usa gratis"
        ,"20 conteúdos de cada categoria":"20 contenuti per categoria"
        ,"Quiz de nivelamento":"Quiz di posizionamento"
        ,"Rádio lo-fi e Pomodoro":"Radio lo-fi e Pomodoro"
        ,"Sistema de XP e níveis":"Sistema di XP e livelli"
        ,"Biblioteca completa (63.000 itens)":"Libreria completa (63.000 elementi)"
        ,"Simulados Goethe completos":"Simulazioni Goethe complete"
        ,"Todos os 63.000 itens liberados":"Tutti i 63.000 elementi sbloccati"
        ,"1.225 diálogos + 1.315 verbos conjugados":"1.225 dialoghi + 1.315 verbi coniugati"
        ,"3.000 questões de quiz + simulados Goethe":"3.000 domande quiz + simulazioni Goethe"
        ,"1.509 gírias e 1.200 frases de profissões":"1.509 espressioni colloquiali + 1.200 frasi professionali"
        ,"Áudio de alta qualidade em todo o conteúdo":"Audio di alta qualità su tutti i contenuti"
        ,"Progresso sincronizado na nuvem":"Progresso sincronizzato nel cloud"
        ,"Oferta de fundador · vagas limitadas":"Offerta fondatore · posti limitati"
        ,"Garantir vaga — R$ 297":"Prenota il tuo posto — R$ 297"
        ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"Pagamento sicuro via Stripe · Garanzia 7 giorni: non sei soddisfatto? Ti rimborsiamo."
      },
      tr: {
        "Conteúdo": "İçerik", "Conteúdo ▾": "İçerik ▾", "Planos": "Planlar",
        "Clique para ouvir": "Dinlemek için tıklayın", "Música ambiente para focar": "Odaklanmak için ortam müziği",
        "🎵 Música ambiente para focar": "🎵 Odaklanmak için ortam müziği", "Clique no player para ajustar volume": "Ses düzeyini ayarlamak için oynatıcıya tıklayın",
        "Foco": "Odaklanma", "📚 Foco": "📚 Odaklanma", "Marcar como concluída": "Tamamlandı olarak işaretle",
        "Ver planos": "Planları görüntüle", "Treinar": "Pratik yap", "Acompanhar": "Takip et", "Outros": "Diğer",
        "Escrita": "Yazma", "Seu plano de jornada": "Öğrenme planınız", "Meta desta semana": "Bu haftanın hedefi",
        "dias ativos": "aktif gün", "missões": "görevler", "Um diálogo": "Bir diyalog",
        "Pratique alemão em contexto": "Almancayı bağlam içinde pratik yapın", "Um verbo em foco": "Odakta bir fiil",
        "Veja exemplos e conjugação": "Örnekleri ve çekimi görün", "Quiz curto": "Kısa test",
        "Teste o que ficou na memória": "Hatırladıklarınızı test edin", "em breve": "çok yakında",
        "Moderno, Vikings ou Aurora — troque quando quiser.": "Modern, Vikingler veya Aurora — istediğinizde değiştirin.",
        "LoFi Cafe · pausado": "LoFi Cafe · duraklatıldı", "LoFi Cafe · tocando agora": "LoFi Cafe · şu anda çalıyor",
        "pausado": "duraklatıldı", "tocando agora": "şu anda çalıyor", "Conhecer os planos": "Planları keşfedin",
        "treine redação": "yazma pratiği yapın",
        "Bom dia! 👋": "Günaydın! 👋", "Boa tarde! 👋": "İyi günler! 👋", "Boa noite! 👋": "İyi akşamlar! 👋",
        "dias seguidos": "gün üst üste",
        "Iniciante": "Başlangıç", "Básico": "Temel", "Intermediário": "Orta", "Avançado": "İleri", "Proficiente": "Yetkin", "Mestre": "Usta",
        "Ainda tem mais": "Daha fazlası var", "Desbloquear tudo": "Hepsinin kilidini aç", "Simulados Goethe-Zertifikat": "Goethe-Zertifikat Simülasyonları", "📝 Simulados Goethe-Zertifikat": "📝 Goethe-Zertifikat Simülasyonları", "Simulados Goethe": "Goethe Simülasyonları",
        "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "İstediğiniz kadar göz atmaya devam edin. Her şeyi açmak istediğinizde, Premium tüm kütüphaneyi açar ve kaldığınız yerden devam edersiniz.",
        "prova oficial": "resmi sınav", "frases profissionais": "mesleki cümleler", "frases conjugadas": "çekimli cümleler",
        "Criar conta pra não perder seu progresso": "İlerlemenizi kaybetmemek için hesap oluşturun",
        "Misturado": "Karışık", "JOGAR": "OYNA", "▶ JOGAR": "▶ OYNA", "desbloquear todas": "hepsinin kilidini aç",
        "Você está jogando com 20 questões grátis de 3.000 —": "3.000 sorudan 20 ücretsiz soruyla oynuyorsunuz —",
        "Meu perfil":"Profilim", "Nome":"Ad", "E-mail":"E-posta", "Salvar":"Kaydet", "Estatísticas":"İstatistikler",
        "XP total":"Toplam XP", "Nível":"Seviye", "Concluídos":"Tamamlanan", "Ambiente de estudo":"Çalışma ortamı",
        "Trocar ambiente":"Ortamı değiştir", "Idioma":"Dil", "Altere o idioma da interface do app.":"Uygulama arayüzü dilini değiştirin.",
        "Trocar idioma":"Dili değiştir", "Assinatura":"Abonelik", "Verificando...":"Kontrol ediliyor...", "Conta":"Hesap",
        "Indique e ganhe":"Davet et, kazan", "Chame seus amigos pra aprender alemão 🇩🇪":"Arkadaşlarını Almanca öğrenmeye davet et 🇩🇪",
        "seu saldo em créditos":"kredi bakiyeniz", "① Manda seu link":"① Bağlantını gönder",
        "② Seu amigo assina um plano":"② Arkadaşın bir plana abone olur",
        "③ Você ganha 20% em créditos, direto na sua carteira":"③ Doğrudan cüzdanına %20 kredi kazanırsın",
        "Seu link de indicação":"Davet bağlantınız", "Carregando...":"Yükleniyor...", "Copiar":"Kopyala", "Sair da conta":"Hesaptan çık",
        "Plano grátis":"Ücretsiz plan", "Premium Mensal":"Aylık Premium", "Premium Anual":"Yıllık Premium", "Premium Vitalício (Fundador)":"Ömür Boyu Premium (Kurucu)",
        "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"Arkadaşın ödeme yaptıktan 7 gün sonra kredi cüzdanına düşer (bu onun iade garantisi süresidir; bu süre içinde vazgeçerse kredi oluşturulmaz). Bakiyeni kullanmak için buradan bize ulaş: ",
        "/ano":"/yıl","/mês":"/ay"
        ,"Investimento":"Yatırım","Escolha seu plano":"Planını seç","Grátis":"Ücretsiz"
        ,"para sempre · sem cartão":"sonsuza kadar · kart gerekmez"
        ,"Mais popular · economize 17%":"En popüler · %17 tasarruf"
        ,"cancele quando quiser":"istediğiniz zaman iptal edin","Usar grátis":"Ücretsiz kullan"
        ,"20 conteúdos de cada categoria":"Her kategoriden 20 içerik"
        ,"Quiz de nivelamento":"Seviye belirleme testi"
        ,"Rádio lo-fi e Pomodoro":"Lo-fi radyo ve Pomodoro"
        ,"Sistema de XP e níveis":"XP ve seviye sistemi"
        ,"Biblioteca completa (63.000 itens)":"Tam kütüphane (63.000 öğe)"
        ,"Simulados Goethe completos":"Tam Goethe deneme sınavları"
        ,"Todos os 63.000 itens liberados":"63.000 öğenin tamamı açıldı"
        ,"1.225 diálogos + 1.315 verbos conjugados":"1.225 diyalog + 1.315 çekimli fiil"
        ,"3.000 questões de quiz + simulados Goethe":"3.000 quiz sorusu + Goethe deneme sınavları"
        ,"1.509 gírias e 1.200 frases de profissões":"1.509 argo ifade + 1.200 mesleki cümle"
        ,"Áudio de alta qualidade em todo o conteúdo":"Tüm içerikte yüksek kaliteli ses"
        ,"Progresso sincronizado na nuvem":"Bulutta senkronize ilerleme"
        ,"Oferta de fundador · vagas limitadas":"Kurucu teklifi · sınırlı kontenjan"
        ,"Garantir vaga — R$ 297":"Yerini ayır — R$ 297"
        ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"Stripe ile güvenli ödeme · 7 gün garanti: memnun kalmazsanız iade ediyoruz."
      },
      ar: {
        "Conteúdo": "المحتوى", "Conteúdo ▾": "المحتوى ▾", "Planos": "الخطط",
        "Clique para ouvir": "انقر للاستماع", "Música ambiente para focar": "موسيقى محيطية للتركيز",
        "🎵 Música ambiente para focar": "🎵 موسيقى محيطية للتركيز", "Clique no player para ajustar volume": "انقر على المشغل لضبط مستوى الصوت",
        "Foco": "التركيز", "📚 Foco": "📚 التركيز", "Marcar como concluída": "وضع علامة كمكتمل",
        "Ver planos": "عرض الخطط", "Treinar": "تدرّب", "Acompanhar": "تتبّع", "Outros": "أخرى",
        "Escrita": "الكتابة", "Seu plano de jornada": "خطة تعلّمك", "Meta desta semana": "هدف هذا الأسبوع",
        "dias ativos": "أيام نشطة", "missões": "مهام", "Um diálogo": "حوار واحد",
        "Pratique alemão em contexto": "تدرّب على الألمانية في سياق", "Um verbo em foco": "فعل واحد في التركيز",
        "Veja exemplos e conjugação": "شاهد الأمثلة والتصريف", "Quiz curto": "اختبار قصير",
        "Teste o que ficou na memória": "اختبر ما تتذكره", "em breve": "قريبًا",
        "Moderno, Vikings ou Aurora — troque quando quiser.": "حديث، فايكنغ أو أورورا — بدّل متى شئت.",
        "LoFi Cafe · pausado": "LoFi Cafe · متوقف مؤقتًا", "LoFi Cafe · tocando agora": "LoFi Cafe · قيد التشغيل الآن",
        "pausado": "متوقف مؤقتًا", "tocando agora": "قيد التشغيل الآن", "Conhecer os planos": "اكتشف الخطط",
        "treine redação": "تدرّب على الكتابة",
        "Bom dia! 👋": "صباح الخير! 👋", "Boa tarde! 👋": "مساء الخير! 👋", "Boa noite! 👋": "مساء الخير! 👋",
        "dias seguidos": "أيام متتالية",
        "Iniciante": "مبتدئ", "Básico": "أساسي", "Intermediário": "متوسط", "Avançado": "متقدم", "Proficiente": "متمكن", "Mestre": "خبير",
        "Ainda tem mais": "لا يزال هناك المزيد", "Desbloquear tudo": "فتح كل شيء", "Simulados Goethe-Zertifikat": "محاكاة Goethe-Zertifikat", "📝 Simulados Goethe-Zertifikat": "📝 محاكاة Goethe-Zertifikat", "Simulados Goethe": "محاكاة غوته",
        "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "لا تتردد في مواصلة التصفح. عندما ترغب في الوصول الكامل، تفتح النسخة المميزة المكتبة بأكملها وتستمر من حيث توقفت دون أن تفقد شيئًا.",
        "prova oficial": "امتحان رسمي", "frases profissionais": "جمل مهنية", "frases conjugadas": "جمل مصرَّفة",
        "Criar conta pra não perder seu progresso": "أنشئ حسابًا حتى لا تفقد تقدمك",
        "Misturado": "مختلط", "JOGAR": "العب", "▶ JOGAR": "▶ العب", "desbloquear todas": "فتح الكل",
        "Você está jogando com 20 questões grátis de 3.000 —": "أنت تلعب بـ 20 سؤالًا مجانيًا من أصل 3000 —",
        "Meu perfil":"ملفي الشخصي", "Nome":"الاسم", "E-mail":"البريد الإلكتروني", "Salvar":"حفظ", "Estatísticas":"الإحصائيات",
        "XP total":"XP الإجمالي", "Nível":"المستوى", "Concluídos":"مكتمل", "Ambiente de estudo":"بيئة الدراسة",
        "Trocar ambiente":"تغيير البيئة", "Idioma":"اللغة", "Altere o idioma da interface do app.":"غيّر لغة واجهة التطبيق.",
        "Trocar idioma":"تغيير اللغة", "Assinatura":"الاشتراك", "Verificando...":"جارٍ التحقق...", "Conta":"الحساب",
        "Indique e ganhe":"أحِل واربح", "Chame seus amigos pra aprender alemão 🇩🇪":"ادعُ أصدقاءك لتعلم الألمانية 🇩🇪",
        "seu saldo em créditos":"رصيدك من الأرصدة", "① Manda seu link":"① أرسل رابطك",
        "② Seu amigo assina um plano":"② يشترك صديقك في خطة",
        "③ Você ganha 20% em créditos, direto na sua carteira":"③ تربح 20% كرصيد، مباشرة إلى محفظتك",
        "Seu link de indicação":"رابط الإحالة الخاص بك", "Carregando...":"جارٍ التحميل...", "Copiar":"نسخ", "Sair da conta":"تسجيل الخروج",
        "Plano grátis":"الخطة المجانية", "Premium Mensal":"بريميوم شهري", "Premium Anual":"بريميوم سنوي", "Premium Vitalício (Fundador)":"بريميوم مدى الحياة (مؤسس)",
        "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"يصل الرصيد إلى محفظتك بعد 7 أيام من دفع صديقك (هذه فترة ضمان الاسترداد الخاصة به؛ إذا ألغى خلالها، لن يتم إنشاء رصيد). لاستخدام رصيدك، تواصل معنا عبر ",
        "/ano":"/سنة","/mês":"/شهر"
        ,"Investimento":"استثمار","Escolha seu plano":"اختر خطتك","Grátis":"مجاني"
        ,"para sempre · sem cartão":"للأبد · بدون بطاقة"
        ,"Mais popular · economize 17%":"الأكثر شعبية · وفر 17%"
        ,"cancele quando quiser":"ألغِ وقتما تشاء","Usar grátis":"استخدم مجاناً"
        ,"20 conteúdos de cada categoria":"20 محتوى من كل فئة"
        ,"Quiz de nivelamento":"اختبار تحديد المستوى"
        ,"Rádio lo-fi e Pomodoro":"راديو lo-fi وبومودورو"
        ,"Sistema de XP e níveis":"نظام XP والمستويات"
        ,"Biblioteca completa (63.000 itens)":"المكتبة الكاملة (63.000 عنصر)"
        ,"Simulados Goethe completos":"اختبارات غوته التجريبية الكاملة"
        ,"Todos os 63.000 itens liberados":"جميع العناصر الـ 63.000 مفتوحة"
        ,"1.225 diálogos + 1.315 verbos conjugados":"1.225 حوار + 1.315 فعل مصرف"
        ,"3.000 questões de quiz + simulados Goethe":"3.000 سؤال اختبار + اختبارات غوته التجريبية"
        ,"1.509 gírias e 1.200 frases de profissões":"1.509 تعبير عامي + 1.200 عبارة مهنية"
        ,"Áudio de alta qualidade em todo o conteúdo":"صوت عالي الجودة في كل المحتوى"
        ,"Progresso sincronizado na nuvem":"تقدم متزامن سحابياً"
        ,"Oferta de fundador · vagas limitadas":"عرض المؤسس · مقاعد محدودة"
        ,"Garantir vaga — R$ 297":"احجز مقعدك — R$ 297"
        ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"دفع آمن عبر Stripe · ضمان 7 أيام: غير راضٍ؟ نعيد لك المال."
      },
      he: {
        "Conteúdo": "תוכן", "Conteúdo ▾": "תוכן ▾", "Planos": "תוכניות",
        "Clique para ouvir": "לחץ להאזנה", "Música ambiente para focar": "מוזיקת רקע להתמקדות",
        "🎵 Música ambiente para focar": "🎵 מוזיקת רקע להתמקדות", "Clique no player para ajustar volume": "לחץ על הנגן כדי לכוונן את עוצמת הקול",
        "Foco": "מיקוד", "📚 Foco": "📚 מיקוד", "Marcar como concluída": "סמן כהושלם",
        "Ver planos": "צפה בתוכניות", "Treinar": "תרגל", "Acompanhar": "עקוב", "Outros": "אחר",
        "Escrita": "כתיבה", "Seu plano de jornada": "תוכנית הלמידה שלך", "Meta desta semana": "יעד השבוע",
        "dias ativos": "ימים פעילים", "missões": "משימות", "Um diálogo": "דיאלוג אחד",
        "Pratique alemão em contexto": "תרגל גרמנית בהקשר", "Um verbo em foco": "פועל אחד במרכז",
        "Veja exemplos e conjugação": "צפה בדוגמאות ובנטייה", "Quiz curto": "חידון קצר",
        "Teste o que ficou na memória": "בחן את מה שזכרת", "em breve": "בקרוב",
        "Moderno, Vikings ou Aurora — troque quando quiser.": "מודרני, ויקינגים או אורורה — החלף מתי שתרצה.",
        "LoFi Cafe · pausado": "LoFi Cafe · בהשהיה", "LoFi Cafe · tocando agora": "LoFi Cafe · מתנגן כעת",
        "pausado": "בהשהיה", "tocando agora": "מתנגן כעת", "Conhecer os planos": "גלה את התוכניות",
        "treine redação": "תרגל כתיבה",
        "Bom dia! 👋": "בוקר טוב! 👋", "Boa tarde! 👋": "צהריים טובים! 👋", "Boa noite! 👋": "ערב טוב! 👋",
        "dias seguidos": "ימים ברצף",
        "Iniciante": "מתחיל", "Básico": "בסיסי", "Intermediário": "בינוני", "Avançado": "מתקדם", "Proficiente": "בקיא", "Mestre": "מומחה",
        "Ainda tem mais": "יש עוד", "Desbloquear tudo": "פתח הכול", "Simulados Goethe-Zertifikat": "סימולציות Goethe-Zertifikat", "📝 Simulados Goethe-Zertifikat": "📝 סימולציות Goethe-Zertifikat", "Simulados Goethe": "סימולציות גתה",
        "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "אתה מוזמן להמשיך לגלוש בחופשיות. כשתרצה גישה מלאה, Premium פותח את כל הספרייה ואתה ממשיך בדיוק מהמקום שבו הפסקת.",
        "prova oficial": "מבחן רשמי", "frases profissionais": "משפטים מקצועיים", "frases conjugadas": "משפטים נטויים",
        "Criar conta pra não perder seu progresso": "צור חשבון כדי לא לאבד את ההתקדמות שלך",
        "Misturado": "מעורב", "JOGAR": "שחק", "▶ JOGAR": "▶ שחק", "desbloquear todas": "פתח את כולן",
        "Você está jogando com 20 questões grátis de 3.000 —": "אתה משחק עם 20 שאלות חינם מתוך 3,000 —",
        "Meu perfil":"הפרופיל שלי", "Nome":"שם", "E-mail":"אימייל", "Salvar":"שמור", "Estatísticas":"סטטיסטיקות",
        "XP total":"XP כולל", "Nível":"רמה", "Concluídos":"הושלמו", "Ambiente de estudo":"סביבת לימוד",
        "Trocar ambiente":"החלף סביבה", "Idioma":"שפה", "Altere o idioma da interface do app.":"שנה את שפת הממשק של האפליקציה.",
        "Trocar idioma":"החלף שפה", "Assinatura":"מנוי", "Verificando...":"בודק...", "Conta":"חשבון",
        "Indique e ganhe":"הפנה והרווח", "Chame seus amigos pra aprender alemão 🇩🇪":"הזמן את חבריך ללמוד גרמנית 🇩🇪",
        "seu saldo em créditos":"יתרת הקרדיט שלך", "① Manda seu link":"① שלח את הקישור שלך",
        "② Seu amigo assina um plano":"② החבר שלך נרשם לתוכנית",
        "③ Você ganha 20% em créditos, direto na sua carteira":"③ אתה מרוויח 20% בקרדיט, ישירות לארנק שלך",
        "Seu link de indicação":"קישור ההפניה שלך", "Carregando...":"טוען...", "Copiar":"העתק", "Sair da conta":"התנתק",
        "Plano grátis":"תוכנית חינמית", "Premium Mensal":"פרימיום חודשי", "Premium Anual":"פרימיום שנתי", "Premium Vitalício (Fundador)":"פרימיום לכל החיים (מייסד)",
        "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"הקרדיט מגיע לארנק שלך 7 ימים אחרי שהחבר שלך משלם (זהו חלון הבטחת ההחזר שלו; אם הוא מבטל בתוך פרק הזמן הזה, לא נוצר קרדיט). כדי להשתמש ביתרה שלך, פשוט צור קשר דרך ",
        "/ano":"/שנה","/mês":"/חודש"
        ,"Investimento":"השקעה","Escolha seu plano":"בחר את התוכנית שלך","Grátis":"חינם"
        ,"para sempre · sem cartão":"לתמיד · ללא כרטיס"
        ,"Mais popular · economize 17%":"הכי פופולרי · חסוך 17%"
        ,"cancele quando quiser":"בטל מתי שתרצה","Usar grátis":"השתמש בחינם"
        ,"20 conteúdos de cada categoria":"20 תכנים מכל קטגוריה"
        ,"Quiz de nivelamento":"בוחן רמה"
        ,"Rádio lo-fi e Pomodoro":"רדיו lo-fi ופומודורו"
        ,"Sistema de XP e níveis":"מערכת XP ורמות"
        ,"Biblioteca completa (63.000 itens)":"ספרייה מלאה (63.000 פריטים)"
        ,"Simulados Goethe completos":"מבחני גתה מלאים"
        ,"Todos os 63.000 itens liberados":"כל 63.000 הפריטים פתוחים"
        ,"1.225 diálogos + 1.315 verbos conjugados":"1.225 דיאלוגים + 1.315 פעלים מוטים"
        ,"3.000 questões de quiz + simulados Goethe":"3.000 שאלות בוחן + מבחני גתה"
        ,"1.509 gírias e 1.200 frases de profissões":"1.509 ביטויי סלנג + 1.200 משפטים מקצועיים"
        ,"Áudio de alta qualidade em todo o conteúdo":"שמע באיכות גבוהה בכל התכנים"
        ,"Progresso sincronizado na nuvem":"התקדמות מסונכרנת בענן"
        ,"Oferta de fundador · vagas limitadas":"הצעת מייסד · מקומות מוגבלים"
        ,"Garantir vaga — R$ 297":"הבטח את מקומך — R$ 297"
        ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"תשלום מאובטח דרך Stripe · אחריות 7 ימים: לא מרוצה? נחזיר לך את הכסף."
      },
      hi: {
        "Conteúdo": "सामग्री", "Conteúdo ▾": "सामग्री ▾", "Planos": "योजनाएँ",
        "Clique para ouvir": "सुनने के लिए क्लिक करें", "Música ambiente para focar": "ध्यान केंद्रित करने के लिए परिवेश संगीत",
        "🎵 Música ambiente para focar": "🎵 ध्यान केंद्रित करने के लिए परिवेश संगीत", "Clique no player para ajustar volume": "वॉल्यूम समायोजित करने के लिए प्लेयर पर क्लिक करें",
        "Foco": "फोकस", "📚 Foco": "📚 फोकस", "Marcar como concluída": "पूर्ण के रूप में चिह्नित करें",
        "Ver planos": "योजनाएँ देखें", "Treinar": "अभ्यास करें", "Acompanhar": "ट्रैक करें", "Outros": "अन्य",
        "Escrita": "लेखन", "Seu plano de jornada": "आपकी सीखने की योजना", "Meta desta semana": "इस सप्ताह का लक्ष्य",
        "dias ativos": "सक्रिय दिन", "missões": "मिशन", "Um diálogo": "एक संवाद",
        "Pratique alemão em contexto": "संदर्भ में जर्मन का अभ्यास करें", "Um verbo em foco": "फोकस में एक क्रिया",
        "Veja exemplos e conjugação": "उदाहरण और क्रिया रूप देखें", "Quiz curto": "संक्षिप्त क्विज़",
        "Teste o que ficou na memória": "जो याद है उसका परीक्षण करें", "em breve": "जल्द आ रहा है",
        "Moderno, Vikings ou Aurora — troque quando quiser.": "मॉडर्न, वाइकिंग्स या ऑरोरा — जब चाहें बदलें।",
        "LoFi Cafe · pausado": "LoFi Cafe · रुका हुआ", "LoFi Cafe · tocando agora": "LoFi Cafe · अभी चल रहा है",
        "pausado": "रुका हुआ", "tocando agora": "अभी चल रहा है", "Conhecer os planos": "योजनाएँ जानें",
        "treine redação": "लेखन का अभ्यास करें",
        "Bom dia! 👋": "सुप्रभात! 👋", "Boa tarde! 👋": "शुभ दोपहर! 👋", "Boa noite! 👋": "शुभ संध्या! 👋",
        "dias seguidos": "लगातार दिन",
        "Iniciante": "शुरुआती", "Básico": "बुनियादी", "Intermediário": "मध्यम", "Avançado": "उन्नत", "Proficiente": "दक्ष", "Mestre": "निपुण",
        "Ainda tem mais": "अभी और भी है", "Desbloquear tudo": "सब कुछ अनलॉक करें", "Simulados Goethe-Zertifikat": "गोएथे-सर्टिफिकेट सिमुलेशन", "📝 Simulados Goethe-Zertifikat": "📝 गोएथे-सर्टिफिकेट सिमुलेशन", "Simulados Goethe": "गोएथे सिमुलेशन",
        "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "बेझिझक ब्राउज़ करते रहें। जब भी आप पूरी पहुँच चाहें, प्रीमियम पूरी लाइब्रेरी अनलॉक कर देता है और आप ठीक वहीं से जारी रखते हैं जहाँ आपने छोड़ा था।",
        "prova oficial": "आधिकारिक परीक्षा", "frases profissionais": "व्यावसायिक वाक्य", "frases conjugadas": "क्रिया-रूपी वाक्य",
        "Criar conta pra não perder seu progresso": "अपनी प्रगति न खोने के लिए खाता बनाएं",
        "Misturado": "मिश्रित", "JOGAR": "खेलें", "▶ JOGAR": "▶ खेलें", "desbloquear todas": "सभी अनलॉक करें",
        "Você está jogando com 20 questões grátis de 3.000 —": "आप 3,000 में से 20 मुफ़्त प्रश्नों के साथ खेल रहे हैं —",
        "Meu perfil":"मेरी प्रोफ़ाइल", "Nome":"नाम", "E-mail":"ईमेल", "Salvar":"सहेजें", "Estatísticas":"आँकड़े",
        "XP total":"कुल XP", "Nível":"स्तर", "Concluídos":"पूर्ण", "Ambiente de estudo":"अध्ययन वातावरण",
        "Trocar ambiente":"वातावरण बदलें", "Idioma":"भाषा", "Altere o idioma da interface do app.":"ऐप के इंटरफ़ेस की भाषा बदलें।",
        "Trocar idioma":"भाषा बदलें", "Assinatura":"सदस्यता", "Verificando...":"जाँच हो रही है...", "Conta":"खाता",
        "Indique e ganhe":"रेफर करें और कमाएँ", "Chame seus amigos pra aprender alemão 🇩🇪":"अपने दोस्तों को जर्मन सीखने के लिए आमंत्रित करें 🇩🇪",
        "seu saldo em créditos":"आपका क्रेडिट शेष", "① Manda seu link":"① अपना लिंक भेजें",
        "② Seu amigo assina um plano":"② आपका दोस्त एक योजना सदस्यता लेता है",
        "③ Você ganha 20% em créditos, direto na sua carteira":"③ आप सीधे अपने वॉलेट में 20% क्रेडिट कमाते हैं",
        "Seu link de indicação":"आपका रेफरल लिंक", "Carregando...":"लोड हो रहा है...", "Copiar":"कॉपी करें", "Sair da conta":"लॉग आउट करें",
        "Plano grátis":"मुफ़्त योजना", "Premium Mensal":"मासिक प्रीमियम", "Premium Anual":"वार्षिक प्रीमियम", "Premium Vitalício (Fundador)":"आजीवन प्रीमियम (संस्थापक)",
        "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"आपका मित्र भुगतान करने के 7 दिन बाद क्रेडिट आपके वॉलेट में आता है (यह उसकी रिफंड-गारंटी अवधि है; यदि वह इस दौरान रद्द करता है, तो कोई क्रेडिट नहीं बनता)। अपने शेष का उपयोग करने के लिए, बस यहाँ संपर्क करें: ",
        "/ano":"/वर्ष","/mês":"/माह"
        ,"Investimento":"निवेश","Escolha seu plano":"अपनी योजना चुनें","Grátis":"मुफ़्त"
        ,"para sempre · sem cartão":"हमेशा के लिए · बिना कार्ड"
        ,"Mais popular · economize 17%":"सबसे लोकप्रिय · 17% बचत"
        ,"cancele quando quiser":"जब चाहें रद्द करें","Usar grátis":"मुफ़्त उपयोग करें"
        ,"20 conteúdos de cada categoria":"प्रत्येक श्रेणी से 20 सामग्री"
        ,"Quiz de nivelamento":"स्तर निर्धारण प्रश्नोत्तरी"
        ,"Rádio lo-fi e Pomodoro":"लो-फाई रेडियो और पोमोडोरो"
        ,"Sistema de XP e níveis":"XP और स्तर प्रणाली"
        ,"Biblioteca completa (63.000 itens)":"पूर्ण लाइब्रेरी (63,000 आइटम)"
        ,"Simulados Goethe completos":"पूर्ण गोथे अभ्यास परीक्षा"
        ,"Todos os 63.000 itens liberados":"सभी 63,000 आइटम खुले"
        ,"1.225 diálogos + 1.315 verbos conjugados":"1,225 संवाद + 1,315 संयुग्मित क्रियाएँ"
        ,"3.000 questões de quiz + simulados Goethe":"3,000 प्रश्नोत्तरी प्रश्न + गोथे अभ्यास"
        ,"1.509 gírias e 1.200 frases de profissões":"1,509 स्लैंग + 1,200 पेशेवर वाक्यांश"
        ,"Áudio de alta qualidade em todo o conteúdo":"सभी सामग्री में उच्च-गुणवत्ता ऑडियो"
        ,"Progresso sincronizado na nuvem":"क्लाउड-सिंक प्रगति"
        ,"Oferta de fundador · vagas limitadas":"संस्थापक प्रस्ताव · सीमित स्थान"
        ,"Garantir vaga — R$ 297":"अपनी जगह पक्की करें — R$ 297"
        ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"Stripe के माध्यम से सुरक्षित भुगतान · 7-दिन की गारंटी: संतुष्ट नहीं? हम रिफ़ंड करेंगे।"
      },
      pl: {
        "Conteúdo": "Treść", "Conteúdo ▾": "Treść ▾", "Planos": "Plany",
        "Clique para ouvir": "Kliknij, aby posłuchać", "Música ambiente para focar": "Muzyka w tle do skupienia",
        "🎵 Música ambiente para focar": "🎵 Muzyka w tle do skupienia", "Clique no player para ajustar volume": "Kliknij odtwarzacz, aby dostosować głośność",
        "Foco": "Skupienie", "📚 Foco": "📚 Skupienie", "Marcar como concluída": "Oznacz jako ukończone",
        "Ver planos": "Zobacz plany", "Treinar": "Ćwicz", "Acompanhar": "Śledź", "Outros": "Inne",
        "Escrita": "Pisanie", "Seu plano de jornada": "Twój plan nauki", "Meta desta semana": "Cel na ten tydzień",
        "dias ativos": "aktywne dni", "missões": "misje", "Um diálogo": "Jeden dialog",
        "Pratique alemão em contexto": "Ćwicz niemiecki w kontekście", "Um verbo em foco": "Jeden czasownik w centrum uwagi",
        "Veja exemplos e conjugação": "Zobacz przykłady i odmianę", "Quiz curto": "Krótki quiz",
        "Teste o que ficou na memória": "Sprawdź, co zapamiętałeś", "em breve": "wkrótce",
        "Moderno, Vikings ou Aurora — troque quando quiser.": "Modern, Wikingowie lub Aurora — zmień, kiedy chcesz.",
        "LoFi Cafe · pausado": "LoFi Cafe · wstrzymane", "LoFi Cafe · tocando agora": "LoFi Cafe · teraz odtwarzane",
        "pausado": "wstrzymane", "tocando agora": "teraz odtwarzane", "Conhecer os planos": "Poznaj plany",
        "treine redação": "ćwicz pisanie",
        "Bom dia! 👋": "Dzień dobry! 👋", "Boa tarde! 👋": "Dzień dobry! 👋", "Boa noite! 👋": "Dobry wieczór! 👋",
        "dias seguidos": "dni z rzędu",
        "Iniciante": "Początkujący", "Básico": "Podstawowy", "Intermediário": "Średniozaawansowany", "Avançado": "Zaawansowany", "Proficiente": "Biegły", "Mestre": "Mistrz",
        "Ainda tem mais": "Jest jeszcze więcej", "Desbloquear tudo": "Odblokuj wszystko", "Simulados Goethe-Zertifikat": "Symulacje Goethe-Zertifikat", "📝 Simulados Goethe-Zertifikat": "📝 Symulacje Goethe-Zertifikat", "Simulados Goethe": "Symulacje Goethe",
        "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Możesz swobodnie przeglądać dalej. Gdy zechcesz pełny dostęp, Premium odblokowuje całą bibliotekę, a Ty kontynuujesz dokładnie tam, gdzie skończyłeś.",
        "prova oficial": "egzamin oficjalny", "frases profissionais": "zdania zawodowe", "frases conjugadas": "odmienione zdania",
        "Criar conta pra não perder seu progresso": "Załóż konto, aby nie stracić postępów",
        "Misturado": "Mieszane", "JOGAR": "GRAJ", "▶ JOGAR": "▶ GRAJ", "desbloquear todas": "odblokuj wszystkie",
        "Você está jogando com 20 questões grátis de 3.000 —": "Grasz z 20 darmowymi pytaniami z 3000 —",
        "Meu perfil":"Mój profil", "Nome":"Imię", "E-mail":"E-mail", "Salvar":"Zapisz", "Estatísticas":"Statystyki",
        "XP total":"Łączne XP", "Nível":"Poziom", "Concluídos":"Ukończone", "Ambiente de estudo":"Środowisko nauki",
        "Trocar ambiente":"Zmień środowisko", "Idioma":"Język", "Altere o idioma da interface do app.":"Zmień język interfejsu aplikacji.",
        "Trocar idioma":"Zmień język", "Assinatura":"Subskrypcja", "Verificando...":"Sprawdzanie...", "Conta":"Konto",
        "Indique e ganhe":"Poleć i zarabiaj", "Chame seus amigos pra aprender alemão 🇩🇪":"Zaproś znajomych do nauki niemieckiego 🇩🇪",
        "seu saldo em créditos":"Twoje saldo kredytów", "① Manda seu link":"① Wyślij swój link",
        "② Seu amigo assina um plano":"② Twój znajomy subskrybuje plan",
        "③ Você ganha 20% em créditos, direto na sua carteira":"③ Zarabiasz 20% w kredytach, prosto na swoje konto",
        "Seu link de indicação":"Twój link polecający", "Carregando...":"Ładowanie...", "Copiar":"Kopiuj", "Sair da conta":"Wyloguj się",
        "Plano grátis":"Plan darmowy", "Premium Mensal":"Premium Miesięczny", "Premium Anual":"Premium Roczny", "Premium Vitalício (Fundador)":"Premium Dożywotni (Założyciel)",
        "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no ":"Twój kredyt trafia na konto 7 dni po zapłacie znajomego (to jego okno gwarancji zwrotu; jeśli zrezygnuje w tym czasie, kredyt nie zostanie naliczony). Aby wykorzystać saldo, skontaktuj się z nami przez ",
        "/ano":"/rok","/mês":"/miesiąc"
        ,"Investimento":"Inwestycja","Escolha seu plano":"Wybierz plan","Grátis":"Darmowy"
        ,"para sempre · sem cartão":"na zawsze · bez karty"
        ,"Mais popular · economize 17%":"Najpopularniejszy · oszczędź 17%"
        ,"cancele quando quiser":"anuluj kiedy chcesz","Usar grátis":"Używaj za darmo"
        ,"20 conteúdos de cada categoria":"20 treści z każdej kategorii"
        ,"Quiz de nivelamento":"Quiz poziomujący"
        ,"Rádio lo-fi e Pomodoro":"Radio lo-fi i Pomodoro"
        ,"Sistema de XP e níveis":"System XP i poziomów"
        ,"Biblioteca completa (63.000 itens)":"Pełna biblioteka (63.000 elementów)"
        ,"Simulados Goethe completos":"Pełne testy próbne Goethe"
        ,"Todos os 63.000 itens liberados":"Wszystkie 63.000 elementów odblokowane"
        ,"1.225 diálogos + 1.315 verbos conjugados":"1.225 dialogów + 1.315 czasowników odmienionych"
        ,"3.000 questões de quiz + simulados Goethe":"3.000 pytań quizowych + testy próbne Goethe"
        ,"1.509 gírias e 1.200 frases de profissões":"1.509 wyrażeń slangowych + 1.200 zwrotów zawodowych"
        ,"Áudio de alta qualidade em todo o conteúdo":"Wysokiej jakości audio we wszystkich treściach"
        ,"Progresso sincronizado na nuvem":"Postęp synchronizowany w chmurze"
        ,"Oferta de fundador · vagas limitadas":"Oferta założycielska · ograniczona liczba miejsc"
        ,"Garantir vaga — R$ 297":"Zarezerwuj miejsce — R$ 297"
        ,"Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.":"Bezpieczna płatność Stripe · 7-dniowa gwarancja: nie podoba Ci się? Zwracamy pieniądze."
      }
    };
    const activeUi = uiFallbacks[this._current] || {};
    // Fallback: se o idioma atual não tiver a tradução, usa o inglês (base ui)
    const baseUi = ui;
    const fragments = {
      " frases":" sentences"," verbos":" verbs"," por dia":" per day"," dias por semana":" days per week"," nível ":" level ",
      " de 60 min":" of 60 min"," da sua meta pessoal — sem comparar com toda a biblioteca.":" of your personal goal — without comparing yourself to the whole library.",
      " questões de simulado Goethe":" Goethe practice-test questions"," te esperando aqui dentro":" waiting for you inside",
      "Mais ":"More ","frases, quizzes e verbos":"sentences, quizzes and verbs",
      "frases profissionais":"professional phrases","frases conjugadas":"conjugated sentences",
      " ativo":" active"," indicação(ões)":" referral(s)",
      "Premium Vitalício (Fundador)":"Lifetime Premium (Founder)","Premium Mensal":"Monthly Premium","Premium Anual":"Yearly Premium",
      "Assinar anual — ":"Subscribe yearly — ","Assinar mensal — ":"Subscribe monthly — ","Garantir vaga — ":"Claim your spot — ","Acesso vitalício por ":"Lifetime access for "
    };
    const fragmentFallbacks = {
      en: fragments,
      es: {
        " frases": " frases", " verbos": " verbos", " por dia": " al día", " dias por semana": " días por semana",
        " nível ": " nivel ", " de 60 min": " de 60 min", " da sua meta pessoal — sem comparar com toda a biblioteca.": " de tu objetivo personal, sin compararte con toda la biblioteca.",
        " questões de simulado Goethe": " preguntas de simulacros Goethe", " te esperando aqui dentro": " esperándote aquí dentro",
        "Mais ": "Más ", "frases, quizzes e verbos": "frases, cuestionarios y verbos",
        "frases profissionais": "frases profesionales", "frases conjugadas": "frases conjugadas",
        " ativo": " activo", " indicação(ões)": " recomendación(es)",
        "Premium Vitalício (Fundador)": "Premium Vitalicio (Fundador)", "Premium Mensal": "Premium Mensual", "Premium Anual": "Premium Anual",
        "Assinar anual — ": "Suscribirse anual — ", "Assinar mensal — ": "Suscribirse mensual — ", "Garantir vaga — ": "Asegurar mi plaza — ", "Acesso vitalício por ": "Acceso vitalicio por "
      },
      fr: {
        " frases": " phrases", " verbos": " verbes", " por dia": " par jour", " dias por semana": " jours par semaine", " nível ": " niveau ",
        " de 60 min": " de 60 min", " da sua meta pessoal — sem comparar com toda a biblioteca.": " de votre objectif personnel — sans vous comparer à toute la bibliothèque.",
        " questões de simulado Goethe": " questions de simulation Goethe", " te esperando aqui dentro": " qui vous attendent ici",
        "Mais ": "Plus de ", "frases, quizzes e verbos": "phrases, quiz et verbes",
        "frases profissionais": "phrases professionnelles", "frases conjugadas": "phrases conjuguées",
        " ativo": " actif", " indicação(ões)": " parrainage(s)",
        "Premium Vitalício (Fundador)": "Premium à Vie (Fondateur)", "Premium Mensal": "Premium Mensuel", "Premium Anual": "Premium Annuel",
        "Assinar anual — ": "S'abonner annuel — ", "Assinar mensal — ": "S'abonner mensuel — ", "Garantir vaga — ": "Réserver ma place — ", "Acesso vitalício por ": "Accès à vie pour "
      },
      it: {
        " frases": " frasi", " verbos": " verbi", " por dia": " al giorno", " dias por semana": " giorni a settimana", " nível ": " livello ",
        " de 60 min": " di 60 min", " da sua meta pessoal — sem comparar com toda a biblioteca.": " del tuo obiettivo personale — senza confrontarti con l'intera biblioteca.",
        " questões de simulado Goethe": " domande di simulazione Goethe", " te esperando aqui dentro": " ad aspettarti qui dentro",
        "Mais ": "Altre ", "frases, quizzes e verbos": "frasi, quiz e verbi",
        "frases profissionais": "frasi professionali", "frases conjugadas": "frasi coniugate",
        " ativo": " attivo", " indicação(ões)": " invito(i)",
        "Premium Vitalício (Fundador)": "Premium a Vita (Fondatore)", "Premium Mensal": "Premium Mensile", "Premium Anual": "Premium Annuale",
        "Assinar anual — ": "Abbonati annuale — ", "Assinar mensal — ": "Abbonati mensile — ", "Garantir vaga — ": "Assicurati il posto — ", "Acesso vitalício por ": "Accesso a vita per "
      },
      tr: {
        " frases": " cümle", " verbos": " fiil", " por dia": " günde", " dias por semana": " haftada gün", " nível ": " seviye ",
        " de 60 min": " 60 dakikadan", " da sua meta pessoal — sem comparar com toda a biblioteca.": " kişisel hedefinizin — tüm kütüphaneyle karşılaştırmadan.",
        " questões de simulado Goethe": " Goethe simülasyon sorusu", " te esperando aqui dentro": " sizi burada bekliyor",
        "Mais ": "Daha fazla ", "frases, quizzes e verbos": "cümle, test ve fiil",
        "frases profissionais": "mesleki cümleler", "frases conjugadas": "çekimli cümleler",
        " ativo": " aktif", " indicação(ões)": " davet(ler)",
        "Premium Vitalício (Fundador)": "Ömür Boyu Premium (Kurucu)", "Premium Mensal": "Aylık Premium", "Premium Anual": "Yıllık Premium",
        "Assinar anual — ": "Yıllık abone ol — ", "Assinar mensal — ": "Aylık abone ol — ", "Garantir vaga — ": "Yerini garantile — ", "Acesso vitalício por ": "Ömür boyu erişim "
      },
      ar: {
        " frases": " جملة", " verbos": " فعل", " por dia": " يوميًا", " dias por semana": " أيام في الأسبوع", " nível ": " مستوى ",
        " de 60 min": " من 60 دقيقة", " da sua meta pessoal — sem comparar com toda a biblioteca.": " من هدفك الشخصي — دون مقارنة نفسك بالمكتبة بأكملها.",
        " questões de simulado Goethe": " سؤال محاكاة غوته", " te esperando aqui dentro": " في انتظارك هنا",
        "Mais ": "المزيد من ", "frases, quizzes e verbos": "جمل واختبارات وأفعال",
        "frases profissionais": "جمل مهنية", "frases conjugadas": "جمل مصرَّفة",
        " ativo": " نشط", " indicação(ões)": " إحالة(ات)",
        "Premium Vitalício (Fundador)": "بريميوم مدى الحياة (مؤسس)", "Premium Mensal": "بريميوم شهري", "Premium Anual": "بريميوم سنوي",
        "Assinar anual — ": "اشترك سنويًا — ", "Assinar mensal — ": "اشترك شهريًا — ", "Garantir vaga — ": "احجز مكانك — ", "Acesso vitalício por ": "وصول مدى الحياة مقابل "
      },
      he: {
        " frases": " משפטים", " verbos": " פעלים", " por dia": " ליום", " dias por semana": " ימים בשבוע", " nível ": " רמה ",
        " de 60 min": " מתוך 60 דקות", " da sua meta pessoal — sem comparar com toda a biblioteca.": " מהיעד האישי שלך — בלי להשוות את עצמך לכל הספרייה.",
        " questões de simulado Goethe": " שאלות סימולציית גתה", " te esperando aqui dentro": " מחכים לך כאן",
        "Mais ": "עוד ", "frases, quizzes e verbos": "משפטים, חידונים ופעלים",
        "frases profissionais": "משפטים מקצועיים", "frases conjugadas": "משפטים נטויים",
        " ativo": " פעיל", " indicação(ões)": " הפניה(ות)",
        "Premium Vitalício (Fundador)": "פרימיום לכל החיים (מייסד)", "Premium Mensal": "פרימיום חודשי", "Premium Anual": "פרימיום שנתי",
        "Assinar anual — ": "הרשמה שנתית — ", "Assinar mensal — ": "הרשמה חודשית — ", "Garantir vaga — ": "הבטח את מקומך — ", "Acesso vitalício por ": "גישה לכל החיים תמורת "
      },
      hi: {
        " frases": " वाक्य", " verbos": " क्रियाएँ", " por dia": " प्रतिदिन", " dias por semana": " दिन प्रति सप्ताह", " nível ": " स्तर ",
        " de 60 min": " 60 मिनट में से", " da sua meta pessoal — sem comparar com toda a biblioteca.": " आपके व्यक्तिगत लक्ष्य का — पूरी लाइब्रेरी से तुलना किए बिना।",
        " questões de simulado Goethe": " गोएथे सिमुलेशन प्रश्न", " te esperando aqui dentro": " यहाँ आपका इंतज़ार कर रहे हैं",
        "Mais ": "और अधिक ", "frases, quizzes e verbos": "वाक्य, क्विज़ और क्रियाएँ",
        "frases profissionais": "व्यावसायिक वाक्य", "frases conjugadas": "क्रिया-रूपी वाक्य",
        " ativo": " सक्रिय", " indicação(ões)": " रेफरल",
        "Premium Vitalício (Fundador)": "आजीवन प्रीमियम (संस्थापक)", "Premium Mensal": "मासिक प्रीमियम", "Premium Anual": "वार्षिक प्रीमियम",
        "Assinar anual — ": "वार्षिक सदस्यता लें — ", "Assinar mensal — ": "मासिक सदस्यता लें — ", "Garantir vaga — ": "अपनी जगह सुरक्षित करें — ", "Acesso vitalício por ": "आजीवन पहुँच के लिए "
      },
      pl: {
        " frases": " zdań", " verbos": " czasowników", " por dia": " dziennie", " dias por semana": " dni w tygodniu", " nível ": " poziom ",
        " de 60 min": " z 60 min", " da sua meta pessoal — sem comparar com toda a biblioteca.": " Twojego osobistego celu — bez porównywania się z całą biblioteką.",
        " questões de simulado Goethe": " pytań symulacyjnych Goethe", " te esperando aqui dentro": " czeka tu na Ciebie",
        "Mais ": "Więcej ", "frases, quizzes e verbos": "zdań, quizów i czasowników",
        "frases profissionais": "zdań zawodowych", "frases conjugadas": "odmienionych zdań",
        " ativo": " aktywny", " indicação(ões)": " polecenie(a)",
        "Premium Vitalício (Fundador)": "Premium Dożywotni (Założyciel)", "Premium Mensal": "Premium Miesięczny", "Premium Anual": "Premium Roczny",
        "Assinar anual — ": "Subskrybuj rocznie — ", "Assinar mensal — ": "Subskrybuj miesięcznie — ", "Garantir vaga — ": "Zarezerwuj miejsce — ", "Acesso vitalício por ": "Dożywotni dostęp za "
      }
    };
    const activeFragments = fragmentFallbacks[this._current] || {};
    // Numeros como "1.312" ou "38.802" usam ponto de milhar (padrao BR).
    // Fora do portugues, a convencao mais comum e virgula ("1,312"), entao
    // reformatamos qualquer numero desse formato ao traduzir a pagina.
    const reformatNumbers = text => {
      if (this._current === "pt") return text;
      return text.replace(/\b\d{1,3}(\.\d{3})+\b/g, m => m.replace(/\./g, ","));
    };
    const translateText = text => {
      const compact = text.replace(/\s+/g, " ").trim();
      if (!compact) return text;
      let translated = map[compact] || activeUi[compact] || baseUi[compact];
      if (!translated) {
        translated = compact;
        Object.entries(activeFragments)
          .sort((a, b) => b[0].length - a[0].length)
          .forEach(([source, target]) => { translated = translated.replace(source, target); });
        if (translated === compact) return reformatNumbers(text);
      }
      const start = text.match(/^\s*/)?.[0] || "";
      const end = text.match(/\s*$/)?.[0] || "";
      return reformatNumbers(start + translated + end);
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
    // Revela a página — tradução concluída
    document.documentElement.classList.remove('i18n-pending');
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
// Se idioma não for PT, esconde a página até traduzir
if (I18n._current !== 'pt') {
  document.documentElement.classList.add('i18n-pending');
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => I18n.applyPageTranslations());
} else {
  I18n.applyPageTranslations();
}
