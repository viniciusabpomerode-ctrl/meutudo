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

const DEEP_TRANSLATIONS = {
  en: {"+1.500 expressões coloquiais do alemão real": "+1,500 colloquial expressions in real-life German", "1.225 diálogos + 1.315 verbos conjugados": "1,225 dialogs + 1,315 conjugated verbs", "1.509 gírias e 1.200 frases de profissões": "1,509 slang terms and 1,200 phrases related to professions", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "2,500 everyday words, organized into 25 categories — with plurals and example sentences in audio format.", "20 conteúdos de cada categoria": "20 items in each category", "3.000 questões de quiz + simulados Goethe": "3,000 quiz questions + Goethe practice tests", "A cobra bateu nela mesma!": "The snake bit itself!", "A transcrição usa o recurso de voz do navegador": "The transcript uses the browser’s voice feature", "A → Z": "A → Z", "Abrindo...": "Loading...", "Acompanhar": "Follow", "Ainda tem mais": "There’s more", "Altere o idioma da interface do app.": "Change the app interface language.", "Ambiente de estudo": "Study environment", "Analisar resposta": "Analyze answer", "Anotações:": "Notes:", "Análises disponíveis hoje": "Analyses available today", "Aprenda alemão com letras traduzidas, linha por linha.": "Learn German with translated lyrics, line by line.", "Assinatura": "Subscribe", "Avançado": "Advanced", "Biblioteca completa (63.000 itens)": "Complete library (63,000 items)", "Biblioteca completa liberada": "Complete library unlocked", "Boa noite! 👋": "Good night! 👋", "Boa tarde! 👋": "Good afternoon! 👋", "Bom dia! 👋": "Good morning! 👋", "Básico": "Basic", "Cancelar": "Cancel", "Carregando quizzes...": "Loading quizzes...", "Carregando seu progresso": "Loading your progress", "Carregando...": "Loading...", "Chame seus amigos pra aprender alemão 🇩🇪": "Invite your friends to learn German 🇩🇪", "Clique no player para ajustar volume": "Click the player to adjust the volume", "Clique para ouvir": "Click to listen", "Clique para ver traducao": "Click to see the translation", "Começar": "Get started", "Começar do zero": "Start from scratch", "Complete": "Complete", "Concluídos": "Completed", "Conectores": "Connectors", "Conjugação": "Conjugation", "Conta": "Account", "Conteúdo": "Content", "Conteúdo deste nível chegando em breve": "Content for this level coming soon", "Conteúdo ▾": "Content ▾", "Continuar": "Continue", "Conversar no dia a dia": "Everyday conversation", "Conversas sobre assuntos conhecidos": "Conversations about familiar topics", "Copiado!": "Copied!", "Copiar": "Copy", "Criar conta pra não perder seu progresso": "Create an account so you don’t lose your progress", "Cursos": "Courses", "Desbloquear tudo": "Unlock everything", "Descartar e regravar": "Discard and re-record", "Descubra em dois minutos um bom ponto de partida": "Find a good starting point in two minutes", "Dicas de gramática": "Grammar tips", "Digite a frase em alemao aqui...": "Type the sentence in German here...", "E-mail": "Email", "Em breve!": "Coming soon!", "Encerrar e salvar XP": "Shut down and save XP", "Encontre em alemão:": "Find it in German:", "Entrando, seu limite fica protegido": "When you log in, your limit is protected", "Escolha a resposta correta": "Choose the correct answer", "Escolha seu nível": "Choose your level", "Escolha seu plano": "Choose your plan", "Escolha um nível para ver diálogos e verbos.": "Choose a level to view dialogs and verbs.", "Escolha uma alternativa": "Choose an option", "Escreva em alemão...": "Write in German...", "Escrita": "Writing", "Estatísticas": "Statistics", "Este teste é uma orientação de estudo": "This test is a study guide", "Estrutura sugerida": "Suggested structure", "Estudar": "Study", "Estude mais um pouco!": "Study a little more!", "Excluir todas": "Clear all", "Exemplo": "Example", "Explorar livremente": "Explore freely", "Fale, pense e construa em alemão": "Speak, think, and construct sentences in German", "Faltam": "Missing", "Fazer outra": "Take another one", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Feel free to keep browsing. When you want to unlock everything at once, Premium unlocks the entire library—and you stay right where you are, without missing a thing.", "Finalizar mesmo assim?": "Still want to finish?", "Foco": "Focus", "Frase curta": "Short phrase", "Frases": "Phrases", "Gabarito:": "Answer key:", "Gerenciar assinatura": "Manage subscription", "Gravar resposta": "Record answer", "Gravações salvas neste aparelho": "Recordings saved on this device", "Grátis": "Free", "Idioma": "Language", "Incrível! Alemão afiado!": "Amazing! Your German is sharp!", "Indique e ganhe": "Refer a friend and earn", "Iniciante": "Beginner", "Intermediário": "Intermediate", "Investimento": "Investment", "JOGAR": "PLAY", "Já concluído": "Already completed", "Letra": "Lyrics", "Mais popular · economize 17%": "Most popular · save 17%", "Marcar como concluída": "Mark as completed", "Marcar como concluído": "Mark as completed", "Marcar como estudado": "Mark as studied", "Mestre": "Master", "Meta desta semana": "This week’s goal", "Meu perfil": "My profile", "Misturado": "Mixed", "Montando sua sessão": "Setting up your session", "Montando sua sessão com dados reais...": "Setting up your session with real data...", "Muito bem! Resposta correta.": "Very good! Correct answer.", "Muito bom!": "Great!", "Música": "Music", "Música ambiente para focar": "Background music to help you focus", "Música não encontrada.": "Music not found.", "Nenhum item.": "No items.", "Nenhuma encontrada.": "None found.", "Nenhuma gravacao ainda": "No recordings yet", "Nome": "Name", "Nome atualizado!": "Name updated!", "Não conseguimos montar a sessão agora": "We couldn’t set up the session right now", "Não deu pra abrir agora": "Couldn’t open it right now", "Não deu pra gerar o link agora": "Couldn’t generate the link right now", "Não foi possível atualizar": "Couldn’t update", "Nível": "Level", "Nível (A1→C2)": "Level (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "The credit is added to your account 7 days after your friend pays (this is their money-back guarantee; if they cancel within that period, the credit isn’t generated). To use your balance, just call the number at", "O que significa": "What does this mean?", "O áudio fica só neste aparelho": "The audio is stored only on this device", "Oferta de fundador · vagas limitadas": "Founder’s offer · limited spots", "Os quizzes ainda não terminaram de carregar": "The quizzes haven’t finished loading yet", "Outra pergunta": "Another question", "Outros": "Others", "Ouvir exemplo": "Listen to an example", "Pagamento confirmado": "Payment confirmed", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "Payment securely processed via Stripe · 7-day guarantee: if you don’t like it, we’ll refund you.", "Palavras e frases bem simples": "Very simple words and phrases", "Parar": "Stop", "Pelos direitos autorais": "Copyright", "Pergunta": "Question", "Permita o microfone!": "Enable your microphone!", "Plano grátis": "Free plan", "Planos": "Plans", "Plural:": "Plural:", "Podcast não encontrado.": "Podcast not found.", "Pontos:": "Points:", "Pontuação final:": "Final score:", "Pratique alemão em contexto": "Practice German in context", "Pratique com questões no estilo do exame oficial": "Practice with questions in the style of the official exam", "Prefiro explorar livremente": "I’d rather explore freely", "Premium Anual": "Annual Premium", "Premium Mensal": "Monthly Premium", "Premium Vitalício (Fundador)": "Lifetime Premium (Founder)", "Preparar uma prova Goethe": "Prepare for a Goethe exam", "Proficiente": "Proficient", "Progresso sincronizado na nuvem": "Progress synced to the cloud", "Pronome": "Pronoun", "Pronuncia:": "Pronunciation:", "Próxima rodada": "Next round", "Qual frase está gramaticalmente correta": "Which sentence is grammatically correct?", "Qual resposta parece mais natural": "Which answer sounds more natural?", "Qual é o seu principal objetivo com o alemão": "What is your main goal with German?", "Quanto você já consegue compreender": "How much can you already understand?", "Quase nada ainda": "Almost nothing yet", "Quase! Veja a resposta correta.": "Almost! See the correct answer.", "Quiz curto": "Short quiz", "Quiz de nivelamento": "Placement quiz", "Quiz relâmpago": "Lightning quiz", "Remover?": "Remove?", "Responda situações reais": "Answer real-life situations", "Rodada": "Round", "Rádio lo-fi e Pomodoro": "Lo-fi radio and Pomodoro", "Sair da conta": "Log out", "Salvar": "Save", "Salvar gravação": "Save recording", "Salve frases clicando 💛!": "Save phrases by clicking 💛!", "Selecionar Idioma": "Select Language", "Sem plural (substantivo abstrato)": "No plural (abstract noun)", "Sem título": "Untitled", "Sessão concluída": "Session completed", "Sessão rápida": "Quick session", "Seu link de indicação": "Your referral link", "Seu pagamento está sendo confirmado": "Your payment is being confirmed", "Seu plano de jornada": "Your learning plan", "Seu primeiro caminho, sem pressão": "Your first path, no pressure", "Seus atalhos, anotações e revisões.": "Your shortcuts, notes, and reviews.", "Simulados Goethe": "Goethe Practice Tests", "Simulados Goethe completos": "Complete Goethe Practice Tests", "Simulados Goethe-Zertifikat": "Goethe-Zertifikat Practice Tests", "Sistema de XP e níveis": "XP and Level System", "Streak": "Streak", "Sua resposta:": "Your response:", "Talvez você goste de começar pelo": "You might want to start with", "Tempo esgotado!": "Time’s up!", "Tenta atualizar a página": "Try refreshing the page", "Tentar novamente": "Try again", "Teste de Criatividade": "Creativity Test", "Teste o que ficou na memória": "Test what you’ve retained", "Teste rápido": "Quick Test", "Teste seus reflexos no alemão": "Test your reflexes in German", "Textos e conversas mais complexos": "More complex texts and conversations", "Todos": "All", "Todos os 63.000 itens liberados": "All 63,000 items available", "Trabalhar ou fazer entrevistas": "Work or conduct interviews", "Treinar": "Practice", "Trocar ambiente": "Change the setting", "Trocar idioma": "Switch languages", "Um diálogo": "A dialogue", "Um verbo em foco": "A verb in focus", "Uma prática curta para avançar": "A short exercise to help you advance", "Uma sugestão, não um rótulo": "A suggestion— not a label", "Usar esta recomendação": "Use this recommendation", "Usar grátis": "Use for free", "Use Chrome para reconhecimento de voz.": "Use Chrome for voice recognition.", "Use as setas do teclado": "Use the arrow keys", "Veja exemplos e conjugação": "See examples and conjugation", "Ver planos": "View plans", "Ver progresso completo": "View full progress", "Verbo em foco": "Verb in focus", "Verbo não encontrado.": "Verb not found.", "Verificando...": "Checking...", "Verifique sua conexão e tente novamente": "Check your connection and try again", "Vocabulario": "Vocabulary", "Vocabulário": "Vocabulary", "Vocabulário útil": "Useful vocabulary", "Você está jogando com 20 questões grátis de 3.000 —": "You’re playing with 20 free questions out of 3,000 —", "Você manteve o alemão em movimento.": "You’ve kept German moving.", "Você também pode responder falando": "You can also answer by speaking", "XP ganho:": "XP earned:", "XP total": "Total XP", "ativo": "active", "cancele quando quiser": "cancel anytime", "desbloquear todas": "unlock all", "dias ativos": "active days", "dias seguidos": "consecutive days", "em breve": "coming soon", "experimentar agora": "try it now", "expressão": "expression", "frases conjugadas": "conjugated phrases", "frases disponiveis": "available phrases", "frases profissionais": "professional phrases", "missões": "missions", "mínimo sugerido": "suggested minimum", "palavra": "word", "palavras": "words", "para sempre · sem cartão": "forever · no card", "planos": "plans", "prova oficial": "official exam", "questões": "questions", "resultado(s)": "result(s)", "revisão concluída": "review completed", "seu saldo em créditos": "your credit balance", "teste seus reflexos": "test your reflexes", "verbo": "verb", "Áudio de alta qualidade em todo o conteúdo": "High-quality audio throughout all content", "← Voltar para Cursos": "← Back to Courses", "← Voltar para Música": "← Back to Music", "← Voltar para categorias": "← Back to Categories", "⏯️ Pausar": "⏯️ Pause", "⏹ Parar gravacao": "⏹ Stop recording", "① Manda seu link": "① Send your link", "② Seu amigo assina um plano": "② Your friend signs up for a plan", "③ Você ganha 20% em créditos, direto na sua carteira": "③ You earn 20% in credits, straight to your wallet", "▶ Frase": "▶ Phrase", "▶ JOGAR": "▶ PLAY", "▶ Ouvir podcast completo": "▶ Listen to the full podcast", "▶ Palavra": "▶ Word", "▶ Plural": "▶ Plural", "▶ Proxima": "▶ Next", "▶️ Continuar": "▶️ Continue", "☀️ Hoje": "☀️ Today", "⚡ Quiz Rápido": "⚡ Quick Quiz", "✅ Concluído": "✅ Completed", "✅ Conferir resposta": "✅ Check answer", "✅ Correto!": "✅ Correct!", "✅ Enviar": "✅ Submit", "✅ Verificar": "✅ Check", "✍️ Escrita": "✍️ Write", "✏️ Anotar": "✏️ Take Notes", "✏️ Editar": "✏️ Edit", "✓ Respondida": "✓ Answered", "❌ Tente de novo": "❌ Try Again", "⬅ Escolher Nível": "⬅ Choose Level", "⬅ Voltar": "⬅ Back", "🎉 Parabéns!": "🎉 Congratulations!", "🎉 Você passaria!": "🎉 You would pass!", "🎉 Você subiu para o nível": "🎉 You’ve moved up to level", "🎙️ Minhas Gravacoes": "🎙️ My Recordings", "🎤 Falar em alemão": "🎤 Speak German", "🎤 Gravar minha pronuncia": "🎤 Record my pronunciation", "🎤 Letras": "🎤 Lyrics", "🎤 Ouvindo...": "🎤 Listening...", "🎤 Pronuncia": "🎤 Pronunciation", "🎤 Tentar de novo": "🎤 Try again", "🎧 Ouvir áudio": "🎧 Listen to audio", "🎧 Sua gravacao:": "🎧 Your recording:", "🎲 Aleatorio": "🎲 Random", "🎵 Música ambiente para focar": "🎵 Background music to help you focus", "🎵 Músicas": "🎵 Songs", "🏆 Recorde:": "🏆 Record:", "🐍 Caçando Vocabulário": "🐍 Vocabulary Hunt", "💬 Frases": "💬 Phrases", "💼 Profissões": "💼 Professions", "💾 Salvar": "💾 Save", "📅 Qualquer data": "📅 Any date", "📅 Tudo": "📅 All", "📆 7 dias": "📆 7 days", "📋 Finalizar Prova": "📋 Finish Quiz", "📖 Gramática": "📖 Grammar", "📚 Continue estudando!": "📚 Keep studying!", "📚 Foco": "📚 Focus", "📚 Vocabulário em Alemão": "📚 German Vocabulary", "📝 Caderno de Estudos": "📝 Study Notebook", "📝 Modelo:": "📝 Template:", "📝 Simulados Goethe-Zertifikat": "📝 Goethe-Zertifikat Practice Tests", "🔄 Nova Prova": "🔄 New Test", "🔄 Novo Quiz": "🔄 New Quiz", "🔊 Ouvir": "🔊 Listen", "🔊 Ouvir original": "🔊 Listen to the original", "🔍 Buscar em todas as categorias...": "🔍 Search all categories...", "🔍 Buscar nesta categoria...": "🔍 Search in this category...", "🔎 Escolher uma data...": "🔎 Choose a date...", "🔤 Palavras": "🔤 Words", "🔤 Verbos": "🔤 Verbs", "🔥 Melhor sequência:": "🔥 Best sequence:", "🗑️ Descartar": "🗑️ Clear", "🗓️ 30 dias": "🗓️ 30 days", "🗣️ Expressões & Gírias": "🗣️ Phrases & Slang", "🗣️ Gírias": "🗣️ Slang", "🗣️ Você disse:": "🗣️ You said:"},
  es: {"+1.500 expressões coloquiais do alemão real": "Más de 1.500 expresiones coloquiales del alemán real", "1.225 diálogos + 1.315 verbos conjugados": "1.225 diálogos + 1.315 verbos conjugados", "1.509 gírias e 1.200 frases de profissões": "1.509 expresiones de jerga y 1.200 frases relacionadas con profesiones", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "2.500 palabras de uso cotidiano, organizadas en 25 categorías — con plural y frase de ejemplo en audio.", "20 conteúdos de cada categoria": "20 contenidos de cada categoría", "3.000 questões de quiz + simulados Goethe": "3.000 preguntas de cuestionarios + exámenes de prueba del Goethe", "A cobra bateu nela mesma!": "¡La serpiente se mordió a sí misma!", "A transcrição usa o recurso de voz do navegador": "La transcripción utiliza la función de voz del navegador", "A → Z": "De la A a la Z", "Abrindo...": "Abriendo...", "Acompanhar": "Seguir", "Ainda tem mais": "Y aún hay más", "Altere o idioma da interface do app.": "Cambia el idioma de la interfaz de la app.", "Ambiente de estudo": "Entorno de estudio", "Analisar resposta": "Analizar respuesta", "Anotações:": "Notas:", "Análises disponíveis hoje": "Análisis disponibles hoy", "Aprenda alemão com letras traduzidas, linha por linha.": "Aprende alemán con letras traducidas, línea por línea.", "Assinatura": "Suscripción", "Avançado": "Avanzado", "Biblioteca completa (63.000 itens)": "Biblioteca completa (63 000 elementos)", "Biblioteca completa liberada": "Biblioteca completa gratuita", "Boa noite! 👋": "¡Buenas noches! 👋", "Boa tarde! 👋": "¡Buenas tardes! 👋", "Bom dia! 👋": "¡Buenos días! 👋", "Básico": "Básico", "Cancelar": "Cancelar", "Carregando quizzes...": "Cargando cuestionarios...", "Carregando seu progresso": "Cargando tu progreso", "Carregando...": "Cargando...", "Chame seus amigos pra aprender alemão 🇩🇪": "Invita a tus amigos a aprender alemán 🇩🇪", "Clique no player para ajustar volume": "Haz clic en el reproductor para ajustar el volumen", "Clique para ouvir": "Haz clic para escuchar", "Clique para ver traducao": "Haz clic para ver la traducción", "Começar": "Empezar", "Começar do zero": "Empezar desde cero", "Complete": "Completar", "Concluídos": "Completados", "Conectores": "Conectores", "Conjugação": "Conjugación", "Conta": "Cuenta", "Conteúdo": "Contenido", "Conteúdo deste nível chegando em breve": "El contenido de este nivel estará disponible próximamente", "Conteúdo ▾": "Contenido ▾", "Continuar": "Continuar", "Conversar no dia a dia": "Conversar en el día a día", "Conversas sobre assuntos conhecidos": "Conversaciones sobre temas conocidos", "Copiado!": "¡Copiado!", "Copiar": "Copiar", "Criar conta pra não perder seu progresso": "Crear una cuenta para no perder tu progreso", "Cursos": "Cursos", "Desbloquear tudo": "Desbloquear todo", "Descartar e regravar": "Borrar y volver a grabar", "Descubra em dois minutos um bom ponto de partida": "Descubre en dos minutos un buen punto de partida", "Dicas de gramática": "Consejos de gramática", "Digite a frase em alemao aqui...": "Escribe aquí la frase en alemán...", "E-mail": "Correo electrónico", "Em breve!": "¡Próximamente!", "Encerrar e salvar XP": "Cerrar y guardar en XP", "Encontre em alemão:": "Busca en alemán:", "Entrando, seu limite fica protegido": "Al iniciar sesión, tu límite queda protegido", "Escolha a resposta correta": "Elige la respuesta correcta", "Escolha seu nível": "Elige tu nivel", "Escolha seu plano": "Elige tu plan", "Escolha um nível para ver diálogos e verbos.": "Elige un nivel para ver diálogos y verbos.", "Escolha uma alternativa": "Elige una opción", "Escreva em alemão...": "Escribe en alemán...", "Escrita": "Escritura", "Estatísticas": "Estadísticas", "Este teste é uma orientação de estudo": "Esta prueba es una guía de estudio", "Estrutura sugerida": "Estructura sugerida", "Estudar": "Estudiar", "Estude mais um pouco!": "¡Estudia un poco más!", "Excluir todas": "Eliminar todo", "Exemplo": "Ejemplo", "Explorar livremente": "Explora libremente", "Fale, pense e construa em alemão": "Habla, piensa y construye en alemán", "Faltam": "Faltan", "Fazer outra": "Hacer otra", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Siéntete libre de seguir navegando. Si quieres acceder a todo de una vez, la versión Premium te da acceso a toda la biblioteca, y sigues en el mismo sitio, sin perder nada.", "Finalizar mesmo assim?": "¿Aún así quieres salir?", "Foco": "Concentración", "Frase curta": "Frase corta", "Frases": "Frases", "Gabarito:": "Soluciones:", "Gerenciar assinatura": "Gestionar suscripción", "Gravar resposta": "Grabar respuesta", "Gravações salvas neste aparelho": "Grabaciones guardadas en este dispositivo", "Grátis": "Gratis", "Idioma": "Idioma", "Incrível! Alemão afiado!": "¡Increíble! ¡Tu alemán es impecable!", "Indique e ganhe": "Recomienda y gana", "Iniciante": "Principiante", "Intermediário": "Intermedio", "Investimento": "Inversión", "JOGAR": "JUGAR", "Já concluído": "Ya completado", "Letra": "Letra", "Mais popular · economize 17%": "Lo más popular · ahorra un 17 %", "Marcar como concluída": "Marcar como completado", "Marcar como concluído": "Marcar como completado", "Marcar como estudado": "Marcar como estudiado", "Mestre": "Maestro", "Meta desta semana": "Objetivo de esta semana", "Meu perfil": "Mi perfil", "Misturado": "Mezclado", "Montando sua sessão": "Preparando tu sesión", "Montando sua sessão com dados reais...": "Preparando tu sesión con datos reales...", "Muito bem! Resposta correta.": "¡Muy bien! Respuesta correcta.", "Muito bom!": "¡Muy bien!", "Música": "Música", "Música ambiente para focar": "Música de fondo para concentrarse", "Música não encontrada.": "No se ha encontrado la música.", "Nenhum item.": "Ningún elemento.", "Nenhuma encontrada.": "No se ha encontrado nada.", "Nenhuma gravacao ainda": "Aún no hay grabaciones", "Nome": "Nombre", "Nome atualizado!": "¡Nombre actualizado!", "Não conseguimos montar a sessão agora": "No hemos podido crear la sesión ahora", "Não deu pra abrir agora": "No se ha podido abrir ahora", "Não deu pra gerar o link agora": "No se ha podido generar el enlace ahora", "Não foi possível atualizar": "No se ha podido actualizar", "Nível": "Nivel", "Nível (A1→C2)": "Nivel (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "El crédito se ingresará en tu monedero 7 días después de que tu amigo haya pagado (es su garantía de reembolso; si se da de baja dentro de ese plazo, no se genera el crédito). Para usar tu saldo, solo tienes que llamar al", "O que significa": "¿Qué significa", "O áudio fica só neste aparelho": "El audio solo se guarda en este dispositivo", "Oferta de fundador · vagas limitadas": "Oferta para fundadores · plazas limitadas", "Os quizzes ainda não terminaram de carregar": "Los cuestionarios aún no han terminado de cargarse", "Outra pergunta": "Otra pregunta", "Outros": "Otros", "Ouvir exemplo": "Escuchar ejemplo", "Pagamento confirmado": "Pago confirmado", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "Pago procesado de forma segura a través de Stripe · Garantía de 7 días: si no te gusta, te lo devolvemos.", "Palavras e frases bem simples": "Palabras y frases muy sencillas", "Parar": "Detener", "Pelos direitos autorais": "Por derechos de autor", "Pergunta": "Pregunta", "Permita o microfone!": "¡Activa el micrófono!", "Plano grátis": "Plan gratuito", "Planos": "Planes", "Plural:": "Plural:", "Podcast não encontrado.": "Podcast no encontrado.", "Pontos:": "Puntos:", "Pontuação final:": "Puntuación final:", "Pratique alemão em contexto": "Practica alemán en contexto", "Pratique com questões no estilo do exame oficial": "Practica con preguntas al estilo del examen oficial", "Prefiro explorar livremente": "Prefiero explorar libremente", "Premium Anual": "Premium anual", "Premium Mensal": "Premium mensual", "Premium Vitalício (Fundador)": "Premium de por vida (Fundador)", "Preparar uma prova Goethe": "Prepárate para un examen Goethe", "Proficiente": "Nivel avanzado", "Progresso sincronizado na nuvem": "Progreso sincronizado en la nube", "Pronome": "Pronombre", "Pronuncia:": "Pronuncia:", "Próxima rodada": "Próxima ronda", "Qual frase está gramaticalmente correta": "¿Qué frase es gramaticalmente correcta?", "Qual resposta parece mais natural": "¿Qué respuesta te parece más natural?", "Qual é o seu principal objetivo com o alemão": "¿Cuál es tu principal objetivo con el alemán?", "Quanto você já consegue compreender": "¿Cuánto eres capaz de entender ya?", "Quase nada ainda": "¡Casi nada todavía!", "Quase! Veja a resposta correta.": "¡Casi! Mira la respuesta correcta.", "Quiz curto": "Cuestionario corto", "Quiz de nivelamento": "Cuestionario de nivel", "Quiz relâmpago": "Cuestionario relámpago", "Remover?": "¿Eliminar?", "Responda situações reais": "Responde a situaciones reales", "Rodada": "Ronda", "Rádio lo-fi e Pomodoro": "Radio lo-fi y Pomodoro", "Sair da conta": "Cerrar sesión", "Salvar": "Guardar", "Salvar gravação": "Guardar grabación", "Salve frases clicando 💛!": "¡Guarda frases haciendo clic en 💛!", "Selecionar Idioma": "Seleccionar idioma", "Sem plural (substantivo abstrato)": "Sin plural (sustantivo abstracto)", "Sem título": "Sin título", "Sessão concluída": "Sesión finalizada", "Sessão rápida": "Sesión rápida", "Seu link de indicação": "Tu enlace de recomendación", "Seu pagamento está sendo confirmado": "Se está confirmando tu pago", "Seu plano de jornada": "Tu plan de aprendizaje", "Seu primeiro caminho, sem pressão": "Tu primer paso, sin presión", "Seus atalhos, anotações e revisões.": "Tus atajos, notas y revisiones.", "Simulados Goethe": "Simulacros de Goethe", "Simulados Goethe completos": "Simulacros completos de Goethe", "Simulados Goethe-Zertifikat": "Simulacros de Goethe-Zertifikat", "Sistema de XP e níveis": "Sistema de XP y niveles", "Streak": "Streak", "Sua resposta:": "Tu respuesta:", "Talvez você goste de começar pelo": "Quizás te apetezca empezar por", "Tempo esgotado!": "¡Tiempo agotado!", "Tenta atualizar a página": "Intenta actualizar la página", "Tentar novamente": "Inténtalo de nuevo", "Teste de Criatividade": "Test de creatividad", "Teste o que ficou na memória": "Comprueba lo que has retenido", "Teste rápido": "Test rápido", "Teste seus reflexos no alemão": "Pon a prueba tus reflejos en alemán", "Textos e conversas mais complexos": "Textos y conversaciones más complejos", "Todos": "Todos", "Todos os 63.000 itens liberados": "Los 63 000 elementos disponibles", "Trabalhar ou fazer entrevistas": "Trabajar o hacer entrevistas", "Treinar": "Entrenar", "Trocar ambiente": "Cambiar de ambiente", "Trocar idioma": "Cambiar de idioma", "Um diálogo": "Un diálogo", "Um verbo em foco": "Un verbo en primer plano", "Uma prática curta para avançar": "Un ejercicio breve para avanzar", "Uma sugestão, não um rótulo": "Una sugerencia, no una etiqueta", "Usar esta recomendação": "Sigue esta recomendación", "Usar grátis": "Úsalo gratis", "Use Chrome para reconhecimento de voz.": "Usa Chrome para el reconocimiento de voz.", "Use as setas do teclado": "Usa las flechas del teclado", "Veja exemplos e conjugação": "Ver ejemplos y conjugaciones", "Ver planos": "Ver planes", "Ver progresso completo": "Ver progreso completo", "Verbo em foco": "Verbo destacado", "Verbo não encontrado.": "Verbo no encontrado.", "Verificando...": "Comprobando...", "Verifique sua conexão e tente novamente": "Comprueba tu conexión e inténtalo de nuevo", "Vocabulario": "Vocabulario", "Vocabulário": "Vocabulario", "Vocabulário útil": "Vocabulario útil", "Você está jogando com 20 questões grátis de 3.000 —": "Estás jugando con 20 preguntas gratis de 3.000 —", "Você manteve o alemão em movimento.": "Has mantenido vivo el alemán.", "Você também pode responder falando": "También puedes responder hablando", "XP ganho:": "XP ganado:", "XP total": "XP total", "ativo": "activo", "cancele quando quiser": "cancela cuando quieras", "desbloquear todas": "desbloquear todo", "dias ativos": "días activos", "dias seguidos": "días seguidos", "em breve": "próximamente", "experimentar agora": "pruébalo ahora", "expressão": "expresión", "frases conjugadas": "frases conjugadas", "frases disponiveis": "frases disponibles", "frases profissionais": "frases profesionales", "missões": "misiones", "mínimo sugerido": "mínimo sugerido", "palavra": "palabra", "palavras": "palabras", "para sempre · sem cartão": "para siempre · sin tarjeta", "planos": "planes", "prova oficial": "examen oficial", "questões": "preguntas", "resultado(s)": "resultado(s)", "revisão concluída": "revisión completada", "seu saldo em créditos": "tu saldo en créditos", "teste seus reflexos": "pon a prueba tus reflejos", "verbo": "verbo", "Áudio de alta qualidade em todo o conteúdo": "Audio de alta calidad en todo el contenido", "← Voltar para Cursos": "← Volver a Cursos", "← Voltar para Música": "← Volver a Música", "← Voltar para categorias": "← Volver a categorías", "⏯️ Pausar": "⏯️ Pausar", "⏹ Parar gravacao": "⏹ Detener grabación", "① Manda seu link": "① Envía tu enlace", "② Seu amigo assina um plano": "② Tu amigo se suscribe a un plan", "③ Você ganha 20% em créditos, direto na sua carteira": "③ Ganas un 20 % en créditos, directamente en tu monedero", "▶ Frase": "▶ Frase", "▶ JOGAR": "▶ JUGAR", "▶ Ouvir podcast completo": "▶ Escuchar el podcast completo", "▶ Palavra": "▶ Palabra", "▶ Plural": "▶ Plural", "▶ Proxima": "▶ Siguiente", "▶️ Continuar": "▶️ Continuar", "☀️ Hoje": "☀️ Hoy", "⚡ Quiz Rápido": "⚡ Quiz rápido", "✅ Concluído": "✅ Completado", "✅ Conferir resposta": "✅ Ver respuesta", "✅ Correto!": "✅ ¡Correcto!", "✅ Enviar": "✅ Enviar", "✅ Verificar": "✅ Comprobar", "✍️ Escrita": "✍️ Escribir", "✏️ Anotar": "✏️ Anotar", "✏️ Editar": "✏️ Editar", "✓ Respondida": "✓ Respondida", "❌ Tente de novo": "❌ Inténtalo de nuevo", "⬅ Escolher Nível": "⬅ Elegir nivel", "⬅ Voltar": "⬅ Volver", "🎉 Parabéns!": "🎉 ¡Enhorabuena!", "🎉 Você passaria!": "🎉 ¡Lo has superado!", "🎉 Você subiu para o nível": "🎉 Has subido al nivel", "🎙️ Minhas Gravacoes": "🎙️ Mis grabaciones", "🎤 Falar em alemão": "🎤 Hablar en alemán", "🎤 Gravar minha pronuncia": "🎤 Grabar mi pronunciación", "🎤 Letras": "🎤 Letras", "🎤 Ouvindo...": "🎤 Escuchando...", "🎤 Pronuncia": "🎤 Pronunciación", "🎤 Tentar de novo": "🎤 Inténtalo de nuevo", "🎧 Ouvir áudio": "🎧 Escuchar audio", "🎧 Sua gravacao:": "🎧 Tu grabación:", "🎲 Aleatorio": "🎲 Aleatorio", "🎵 Música ambiente para focar": "🎵 Música de fondo para concentrarse", "🎵 Músicas": "🎵 Canciones", "🏆 Recorde:": "🏆 Récord:", "🐍 Caçando Vocabulário": "🐍 A la caza de vocabulario", "💬 Frases": "💬 Frases", "💼 Profissões": "💼 Profesiones", "💾 Salvar": "💾 Guardar", "📅 Qualquer data": "📅 Cualquier fecha", "📅 Tudo": "📅 Todo", "📆 7 dias": "📆 7 días", "📋 Finalizar Prova": "📋 Finalizar prueba", "📖 Gramática": "📖 Gramática", "📚 Continue estudando!": "📚 ¡Sigue estudiando!", "📚 Foco": "📚 Concentración", "📚 Vocabulário em Alemão": "📚 Vocabulario en alemán", "📝 Caderno de Estudos": "📝 Cuaderno de estudio", "📝 Modelo:": "📝 Plantilla:", "📝 Simulados Goethe-Zertifikat": "📝 Simulacros del Goethe-Zertifikat", "🔄 Nova Prova": "🔄 Nuevo examen", "🔄 Novo Quiz": "🔄 Nuevo cuestionario", "🔊 Ouvir": "🔊 Escuchar", "🔊 Ouvir original": "🔊 Escuchar el original", "🔍 Buscar em todas as categorias...": "🔍 Buscar en todas las categorías...", "🔍 Buscar nesta categoria...": "🔍 Buscar en esta categoría...", "🔎 Escolher uma data...": "🔎 Elegir una fecha...", "🔤 Palavras": "🔤 Palabras", "🔤 Verbos": "🔤 Verbos", "🔥 Melhor sequência:": "🔥 Mejor secuencia:", "🗑️ Descartar": "🗑️ Descartar", "🗓️ 30 dias": "🗓️ 30 días", "🗣️ Expressões & Gírias": "🗣️ Expresiones y jerga", "🗣️ Gírias": "🗣️ Jerga", "🗣️ Você disse:": "🗣️ Has dicho:"},
  fr: {"+1.500 expressões coloquiais do alemão real": "+1 500 expressions familières de l'allemand courant", "1.225 diálogos + 1.315 verbos conjugados": "1 225 dialogues + 1 315 verbes conjugués", "1.509 gírias e 1.200 frases de profissões": "1 509 mots d'argot et 1 200 expressions liées aux métiers", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "2 500 mots de la vie quotidienne, classés en 25 catégories — avec le pluriel et un exemple de phrase en audio.", "20 conteúdos de cada categoria": "20 contenus par catégorie", "3.000 questões de quiz + simulados Goethe": "3 000 questions de quiz + examens blancs Goethe", "A cobra bateu nela mesma!": "Le serpent s’est mordu la queue !", "A transcrição usa o recurso de voz do navegador": "La transcription utilise la fonctionnalité vocale du navigateur", "A → Z": "A → Z", "Abrindo...": "Ouverture…", "Acompanhar": "Suivre", "Ainda tem mais": "Et ce n’est pas tout", "Altere o idioma da interface do app.": "Modifier la langue de l’interface de l’application.", "Ambiente de estudo": "Environnement d’étude", "Analisar resposta": "Analyser la réponse", "Anotações:": "Notes :", "Análises disponíveis hoje": "Analyses disponibles aujourd’hui", "Aprenda alemão com letras traduzidas, linha por linha.": "Apprenez l’allemand avec des paroles traduites, ligne par ligne.", "Assinatura": "Abonnement", "Avançado": "Avancé", "Biblioteca completa (63.000 itens)": "Bibliothèque complète (63 000 éléments)", "Biblioteca completa liberada": "Bibliothèque complète en accès libre", "Boa noite! 👋": "Bonne nuit ! 👋", "Boa tarde! 👋": "Bon après-midi ! 👋", "Bom dia! 👋": "Bonjour ! 👋", "Básico": "Basique", "Cancelar": "Se désabonner", "Carregando quizzes...": "Chargement des quiz…", "Carregando seu progresso": "Chargement de votre progression", "Carregando...": "Chargement…", "Chame seus amigos pra aprender alemão 🇩🇪": "Invitez vos amis à apprendre l'allemand 🇩🇪", "Clique no player para ajustar volume": "Cliquez sur le lecteur pour régler le volume", "Clique para ouvir": "Cliquez pour écouter", "Clique para ver traducao": "Cliquez pour voir la traduction", "Começar": "Commencer", "Começar do zero": "Commencer à zéro", "Complete": "Terminer", "Concluídos": "Terminés", "Conectores": "Conjonctions", "Conjugação": "Conjugaison", "Conta": "Compte", "Conteúdo": "Contenu", "Conteúdo deste nível chegando em breve": "Contenu de ce niveau bientôt disponible", "Conteúdo ▾": "Contenu ▾", "Continuar": "Continuer", "Conversar no dia a dia": "Conversations quotidiennes", "Conversas sobre assuntos conhecidos": "Conversations sur des sujets familiers", "Copiado!": "Copié !", "Copiar": "Copier", "Criar conta pra não perder seu progresso": "Créer un compte pour ne pas perdre votre progression", "Cursos": "Cours", "Desbloquear tudo": "Tout débloquer", "Descartar e regravar": "Effacer et réenregistrer", "Descubra em dois minutos um bom ponto de partida": "Découvrez en deux minutes un bon point de départ", "Dicas de gramática": "Conseils de grammaire", "Digite a frase em alemao aqui...": "Saisissez ici votre phrase en allemand...", "E-mail": "E-mail", "Em breve!": "Bientôt disponible !", "Encerrar e salvar XP": "Fermer et enregistrer XP", "Encontre em alemão:": "Trouver en allemand :", "Entrando, seu limite fica protegido": "En vous connectant, votre limite est protégée", "Escolha a resposta correta": "Choisissez la bonne réponse", "Escolha seu nível": "Choisissez votre niveau", "Escolha seu plano": "Choisissez votre forfait", "Escolha um nível para ver diálogos e verbos.": "Choisissez un niveau pour voir les dialogues et les verbes.", "Escolha uma alternativa": "Choisissez une alternative", "Escreva em alemão...": "Écrivez en allemand...", "Escrita": "Écriture", "Estatísticas": "Statistiques", "Este teste é uma orientação de estudo": "Ce test sert de guide d’étude", "Estrutura sugerida": "Structure suggérée", "Estudar": "Étudier", "Estude mais um pouco!": "Étudiez encore un peu !", "Excluir todas": "Tout effacer", "Exemplo": "Exemple", "Explorar livremente": "Explorez librement", "Fale, pense e construa em alemão": "Parlez, réfléchissez et construisez en allemand", "Faltam": "Il en manque", "Fazer outra": "En faire une autre", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "N’hésitez pas à continuer à naviguer. Si vous souhaitez tout débloquer d’un seul coup, l’abonnement Premium vous donne accès à l’intégralité de la bibliothèque — et vous restez au même endroit, sans rien perdre.", "Finalizar mesmo assim?": "Vous souhaitez tout de même terminer ?", "Foco": "Concentration", "Frase curta": "Phrase courte", "Frases": "Phrases", "Gabarito:": "Modèle :", "Gerenciar assinatura": "Gérer l’abonnement", "Gravar resposta": "Enregistrer la réponse", "Gravações salvas neste aparelho": "Enregistrements sauvegardés sur cet appareil", "Grátis": "Gratuit", "Idioma": "Langue", "Incrível! Alemão afiado!": "Incroyable ! Un allemand impeccable !", "Indique e ganhe": "Parrainez et gagnez", "Iniciante": "Débutant", "Intermediário": "Intermédiaire", "Investimento": "Investissement", "JOGAR": "JOUER", "Já concluído": "Déjà terminé", "Letra": "Paroles", "Mais popular · economize 17%": "Les plus populaires · économisez 17 %", "Marcar como concluída": "Marquer comme terminé", "Marcar como concluído": "Marquer comme terminé", "Marcar como estudado": "Marquer comme étudié", "Mestre": "Maître", "Meta desta semana": "Objectif de la semaine", "Meu perfil": "Mon profil", "Misturado": "Mélange", "Montando sua sessão": "Préparation de votre session", "Montando sua sessão com dados reais...": "Préparation de votre session avec des données réelles...", "Muito bem! Resposta correta.": "Très bien ! Réponse correcte.", "Muito bom!": "Très bien !", "Música": "Musique", "Música ambiente para focar": "Musique d’ambiance pour se concentrer", "Música não encontrada.": "Musique introuvable.", "Nenhum item.": "Aucun élément.", "Nenhuma encontrada.": "Aucun élément trouvé.", "Nenhuma gravacao ainda": "Aucun enregistrement pour l'instant", "Nome": "Nom", "Nome atualizado!": "Nom mis à jour !", "Não conseguimos montar a sessão agora": "Impossible de créer la session pour le moment", "Não deu pra abrir agora": "Impossible d'ouvrir pour le moment", "Não deu pra gerar o link agora": "Impossible de générer le lien pour le moment", "Não foi possível atualizar": "Impossible de mettre à jour", "Nível": "Niveau", "Nível (A1→C2)": "Niveau (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "Le crédit est crédité sur votre compte 7 jours après le paiement de votre ami (c'est sa garantie de remboursement : s'il se désiste dans ce délai, le crédit n'est pas généré). Pour utiliser votre solde, il suffit de passer un appel sur", "O que significa": "Que signifie", "O áudio fica só neste aparelho": "L’enregistrement audio reste uniquement sur cet appareil", "Oferta de fundador · vagas limitadas": "Offre du fondateur · places limitées", "Os quizzes ainda não terminaram de carregar": "Les quiz n’ont pas encore fini de se charger", "Outra pergunta": "Une autre question", "Outros": "Autres", "Ouvir exemplo": "Écouter un exemple", "Pagamento confirmado": "Paiement confirmé", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "Paiement traité en toute sécurité via Stripe · Garantie de 7 jours : si vous n’êtes pas satisfait, nous vous remboursons.", "Palavras e frases bem simples": "Mots et expressions très simples", "Parar": "Arrêter", "Pelos direitos autorais": "Droits d’auteur", "Pergunta": "Question", "Permita o microfone!": "Activez le micro !", "Plano grátis": "Formule gratuite", "Planos": "Formules", "Plural:": "Pluriel :", "Podcast não encontrado.": "Podcast introuvable.", "Pontos:": "Points :", "Pontuação final:": "Note finale :", "Pratique alemão em contexto": "Pratiquez l’allemand en contexte", "Pratique com questões no estilo do exame oficial": "Entraînez-vous avec des questions inspirées de l’examen officiel", "Prefiro explorar livremente": "Je préfère explorer librement", "Premium Anual": "Abonnement Premium annuel", "Premium Mensal": "Abonnement Premium mensuel", "Premium Vitalício (Fundador)": "Abonnement Premium à vie (Fondateur)", "Preparar uma prova Goethe": "Se préparer à un examen Goethe", "Proficiente": "Niveau avancé", "Progresso sincronizado na nuvem": "Progrès synchronisés dans le cloud", "Pronome": "Pronom", "Pronuncia:": "Prononcez :", "Próxima rodada": "Prochaine série", "Qual frase está gramaticalmente correta": "Quelle phrase est grammaticalement correcte ?", "Qual resposta parece mais natural": "Quelle réponse semble la plus naturelle ?", "Qual é o seu principal objetivo com o alemão": "Quel est votre objectif principal en allemand ?", "Quanto você já consegue compreender": "Que comprenez-vous déjà ?", "Quase nada ainda": "Presque rien pour l’instant", "Quase! Veja a resposta correta.": "Presque ! Voir la bonne réponse.", "Quiz curto": "Petit quiz", "Quiz de nivelamento": "Quiz de niveau", "Quiz relâmpago": "Quiz éclair", "Remover?": "Supprimer ?", "Responda situações reais": "Répondez à des situations réelles", "Rodada": "Tour", "Rádio lo-fi e Pomodoro": "Radio lo-fi et Pomodoro", "Sair da conta": "Se déconnecter", "Salvar": "Enregistrer", "Salvar gravação": "Enregistrer la session", "Salve frases clicando 💛!": "Enregistrez des phrases en cliquant sur 💛 !", "Selecionar Idioma": "Sélectionner la langue", "Sem plural (substantivo abstrato)": "Pas de pluriel (nom abstrait)", "Sem título": "Sans titre", "Sessão concluída": "Session terminée", "Sessão rápida": "Session rapide", "Seu link de indicação": "Votre lien de parrainage", "Seu pagamento está sendo confirmado": "Votre paiement est en cours de confirmation", "Seu plano de jornada": "Votre plan de parcours", "Seu primeiro caminho, sem pressão": "Votre premier parcours, sans pression", "Seus atalhos, anotações e revisões.": "Vos raccourcis, notes et révisions.", "Simulados Goethe": "Simulations Goethe", "Simulados Goethe completos": "Simulations Goethe complètes", "Simulados Goethe-Zertifikat": "Simulations Goethe-Zertifikat", "Sistema de XP e níveis": "Système de XP et de niveaux", "Streak": "Streak", "Sua resposta:": "Votre réponse :", "Talvez você goste de começar pelo": "Vous aimeriez peut-être commencer par", "Tempo esgotado!": "Temps écoulé !", "Tenta atualizar a página": "Essayez d’actualiser la page", "Tentar novamente": "Réessayez", "Teste de Criatividade": "Test de créativité", "Teste o que ficou na memória": "Testez ce que vous avez retenu", "Teste rápido": "Test rapide", "Teste seus reflexos no alemão": "Testez vos réflexes en allemand", "Textos e conversas mais complexos": "Textes et conversations plus complexes", "Todos": "Tous", "Todos os 63.000 itens liberados": "Les 63 000 éléments débloqués", "Trabalhar ou fazer entrevistas": "Travailler ou passer des entretiens", "Treinar": "S’entraîner", "Trocar ambiente": "Changer d’environnement", "Trocar idioma": "Changer de langue", "Um diálogo": "Un dialogue", "Um verbo em foco": "Un verbe à l’honneur", "Uma prática curta para avançar": "Un petit exercice pour progresser", "Uma sugestão, não um rótulo": "Une suggestion, pas une étiquette", "Usar esta recomendação": "Suivre cette recommandation", "Usar grátis": "Utilisation gratuite", "Use Chrome para reconhecimento de voz.": "Utilisez Chrome pour la reconnaissance vocale.", "Use as setas do teclado": "Utilisez les flèches du clavier", "Veja exemplos e conjugação": "Voir des exemples et la conjugaison", "Ver planos": "Voir les plans", "Ver progresso completo": "Voir la progression complète", "Verbo em foco": "Verbe à l'honneur", "Verbo não encontrado.": "Verbe introuvable.", "Verificando...": "Vérification en cours...", "Verifique sua conexão e tente novamente": "Vérifiez votre connexion et réessayez", "Vocabulario": "Vocabulaire", "Vocabulário": "Vocabulaire", "Vocabulário útil": "Vocabulaire utile", "Você está jogando com 20 questões grátis de 3.000 —": "Vous jouez avec 20 questions gratuites sur 3 000 —", "Você manteve o alemão em movimento.": "Vous avez fait progresser l'allemand.", "Você também pode responder falando": "Vous pouvez également répondre à l’oral", "XP ganho:": "XP gagnés :", "XP total": "XP total", "ativo": "actif", "cancele quando quiser": "résiliez quand vous le souhaitez", "desbloquear todas": "tout débloquer", "dias ativos": "jours actifs", "dias seguidos": "jours consécutifs", "em breve": "bientôt", "experimentar agora": "essayez dès maintenant", "expressão": "expression", "frases conjugadas": "phrases conjuguées", "frases disponiveis": "phrases disponibles", "frases profissionais": "phrases professionnelles", "missões": "missions", "mínimo sugerido": "minimum suggéré", "palavra": "mot", "palavras": "mots", "para sempre · sem cartão": "pour toujours · sans carte", "planos": "abonnements", "prova oficial": "examen officiel", "questões": "questions", "resultado(s)": "résultat(s)", "revisão concluída": "révision terminée", "seu saldo em créditos": "votre solde de crédits", "teste seus reflexos": "testez vos réflexes", "verbo": "verbe", "Áudio de alta qualidade em todo o conteúdo": "Audio de haute qualité sur l’ensemble du contenu", "← Voltar para Cursos": "← Retour aux cours", "← Voltar para Música": "← Retour à la musique", "← Voltar para categorias": "← Retour aux catégories", "⏯️ Pausar": "⏯️ Mettre en pause", "⏹ Parar gravacao": "⏹ Arrêter l’enregistrement", "① Manda seu link": "① Envoyez votre lien", "② Seu amigo assina um plano": "② Votre ami souscrit à un abonnement", "③ Você ganha 20% em créditos, direto na sua carteira": "③ Vous gagnez 20 % de crédits, directement dans votre portefeuille", "▶ Frase": "▶ Phrase", "▶ JOGAR": "▶ JOUER", "▶ Ouvir podcast completo": "▶ Écouter le podcast complet", "▶ Palavra": "▶ Mot", "▶ Plural": "▶ Pluriel", "▶ Proxima": "▶ Suivant", "▶️ Continuar": "▶️ Continuer", "☀️ Hoje": "☀️ Aujourd’hui", "⚡ Quiz Rápido": "⚡ Quiz rapide", "✅ Concluído": "✅ Terminé", "✅ Conferir resposta": "✅ Vérifier la réponse", "✅ Correto!": "✅ Correct !", "✅ Enviar": "✅ Envoyer", "✅ Verificar": "✅ Vérifier", "✍️ Escrita": "✍️ Écrire", "✏️ Anotar": "✏️ Noter", "✏️ Editar": "✏️ Modifier", "✓ Respondida": "✓ Répondu", "❌ Tente de novo": "❌ Réessayer", "⬅ Escolher Nível": "⬅ Choisir un niveau", "⬅ Voltar": "⬅ Retour", "🎉 Parabéns!": "🎉 Félicitations !", "🎉 Você passaria!": "🎉 Vous auriez réussi !", "🎉 Você subiu para o nível": "🎉 Vous êtes passé au niveau", "🎙️ Minhas Gravacoes": "🎙️ Mes enregistrements", "🎤 Falar em alemão": "🎤 Parler en allemand", "🎤 Gravar minha pronuncia": "🎤 Enregistrer ma prononciation", "🎤 Letras": "🎤 Paroles", "🎤 Ouvindo...": "🎤 Écouter...", "🎤 Pronuncia": "🎤 Prononciation", "🎤 Tentar de novo": "🎤 Réessayer", "🎧 Ouvir áudio": "🎧 Écouter l'audio", "🎧 Sua gravacao:": "🎧 Votre enregistrement :", "🎲 Aleatorio": "🎲 Aléatoire", "🎵 Música ambiente para focar": "🎵 Musique d'ambiance pour se concentrer", "🎵 Músicas": "🎵 Chansons", "🏆 Recorde:": "🏆 Record :", "🐍 Caçando Vocabulário": "🐍 À la chasse au vocabulaire", "💬 Frases": "💬 Phrases", "💼 Profissões": "💼 Métiers", "💾 Salvar": "💾 Enregistrer", "📅 Qualquer data": "📅 N'importe quelle date", "📅 Tudo": "📅 Tout", "📆 7 dias": "📆 7 jours", "📋 Finalizar Prova": "📋 Terminer le test", "📖 Gramática": "📖 Grammaire", "📚 Continue estudando!": "📚 Continuez à étudier !", "📚 Foco": "📚 Concentration", "📚 Vocabulário em Alemão": "📚 Vocabulaire allemand", "📝 Caderno de Estudos": "📝 Cahier d'études", "📝 Modelo:": "📝 Modèle :", "📝 Simulados Goethe-Zertifikat": "📝 Simulations d'examen Goethe-Zertifikat", "🔄 Nova Prova": "🔄 Nouvel examen", "🔄 Novo Quiz": "🔄 Nouveau quiz", "🔊 Ouvir": "🔊 Écouter", "🔊 Ouvir original": "🔊 Écouter l'original", "🔍 Buscar em todas as categorias...": "🔍 Rechercher dans toutes les catégories...", "🔍 Buscar nesta categoria...": "🔍 Rechercher dans cette catégorie...", "🔎 Escolher uma data...": "🔎 Choisir une date...", "🔤 Palavras": "🔤 Mots", "🔤 Verbos": "🔤 Verbes", "🔥 Melhor sequência:": "🔥 Meilleure série :", "🗑️ Descartar": "🗑️ Éliminer", "🗓️ 30 dias": "🗓️ 30 jours", "🗣️ Expressões & Gírias": "🗣️ Expressions et argot", "🗣️ Gírias": "🗣️ Argot", "🗣️ Você disse:": "🗣️ Vous avez dit :"},
  it: {"+1.500 expressões coloquiais do alemão real": "+1.500 espressioni colloquiali del tedesco di tutti i giorni", "1.225 diálogos + 1.315 verbos conjugados": "1.225 dialoghi + 1.315 verbi coniugati", "1.509 gírias e 1.200 frases de profissões": "1.509 espressioni gergali e 1.200 frasi relative alle professioni", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "2.500 parole di uso quotidiano, organizzate in 25 categorie — con plurale ed esempio di frase in formato audio.", "20 conteúdos de cada categoria": "20 contenuti per ogni categoria", "3.000 questões de quiz + simulados Goethe": "3.000 domande di quiz + simulazioni Goethe", "A cobra bateu nela mesma!": "Il serpente si è morso la coda!", "A transcrição usa o recurso de voz do navegador": "La trascrizione utilizza la funzione vocale del browser", "A → Z": "Dalla A alla Z", "Abrindo...": "Si sta aprendo...", "Acompanhar": "Segui", "Ainda tem mais": "C'è ancora di più", "Altere o idioma da interface do app.": "Modifica la lingua dell'interfaccia dell'app.", "Ambiente de estudo": "Ambiente di studio", "Analisar resposta": "Analizza la risposta", "Anotações:": "Appunti:", "Análises disponíveis hoje": "Analisi disponibili oggi", "Aprenda alemão com letras traduzidas, linha por linha.": "Impara il tedesco con i testi tradotti, riga per riga.", "Assinatura": "Abbonamento", "Avançado": "Avanzato", "Biblioteca completa (63.000 itens)": "Libreria completa (63.000 voci)", "Biblioteca completa liberada": "Libreria completa gratuita", "Boa noite! 👋": "Buona notte! 👋", "Boa tarde! 👋": "Buon pomeriggio! 👋", "Bom dia! 👋": "Buongiorno! 👋", "Básico": "Base", "Cancelar": "Annulla", "Carregando quizzes...": "Caricamento dei quiz...", "Carregando seu progresso": "Caricamento dei tuoi progressi", "Carregando...": "Caricamento in corso...", "Chame seus amigos pra aprender alemão 🇩🇪": "Invita i tuoi amici a imparare il tedesco 🇩🇪", "Clique no player para ajustar volume": "Clicca sul lettore per regolare il volume", "Clique para ouvir": "Clicca per ascoltare", "Clique para ver traducao": "Clicca per vedere la traduzione", "Começar": "Inizia", "Começar do zero": "Inizia da zero", "Complete": "Completa", "Concluídos": "Completati", "Conectores": "Connettori", "Conjugação": "Coniugazione", "Conta": "Conta", "Conteúdo": "Contenuto", "Conteúdo deste nível chegando em breve": "Il contenuto di questo livello sarà disponibile a breve", "Conteúdo ▾": "Contenuto ▾", "Continuar": "Continua", "Conversar no dia a dia": "Conversazioni quotidiane", "Conversas sobre assuntos conhecidos": "Conversazioni su argomenti familiari", "Copiado!": "Copiato!", "Copiar": "Copia", "Criar conta pra não perder seu progresso": "Crea un account per non perdere i tuoi progressi", "Cursos": "Corsi", "Desbloquear tudo": "Sblocca tutto", "Descartar e regravar": "Cancella e registra di nuovo", "Descubra em dois minutos um bom ponto de partida": "Scopri in due minuti un buon punto di partenza", "Dicas de gramática": "Consigli di grammatica", "Digite a frase em alemao aqui...": "Digita qui la frase in tedesco...", "E-mail": "E-mail", "Em breve!": "Prossimamente!", "Encerrar e salvar XP": "Chiudi e salva XP", "Encontre em alemão:": "Trova in tedesco:", "Entrando, seu limite fica protegido": "Effettuando l’accesso, il tuo limite rimane protetto", "Escolha a resposta correta": "Scegli la risposta corretta", "Escolha seu nível": "Scegli il tuo livello", "Escolha seu plano": "Scegli il tuo piano", "Escolha um nível para ver diálogos e verbos.": "Scegli un livello per visualizzare dialoghi e verbi.", "Escolha uma alternativa": "Scegli un'alternativa", "Escreva em alemão...": "Scrivi in tedesco...", "Escrita": "Scrittura", "Estatísticas": "Statistiche", "Este teste é uma orientação de estudo": "Questo test è un orientamento allo studio", "Estrutura sugerida": "Struttura suggerita", "Estudar": "Studia", "Estude mais um pouco!": "Studia ancora un po'!", "Excluir todas": "Elimina tutto", "Exemplo": "Esempio", "Explorar livremente": "Esplora liberamente", "Fale, pense e construa em alemão": "Parla, pensa e costruisci in tedesco", "Faltam": "Ne mancano", "Fazer outra": "Fanne un altro", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Sentiti libero di continuare a navigare. Quando vuoi sbloccare tutto in una volta, l’abbonamento Premium sblocca l’intera libreria — e rimani nello stesso punto, senza perdere nulla.", "Finalizar mesmo assim?": "Vuoi comunque terminare?", "Foco": "Concentrazione", "Frase curta": "Frase breve", "Frases": "Frasi", "Gabarito:": "Soluzione:", "Gerenciar assinatura": "Gestisci l’abbonamento", "Gravar resposta": "Registra la risposta", "Gravações salvas neste aparelho": "Registrazioni salvate su questo dispositivo", "Grátis": "Gratis", "Idioma": "Lingua", "Incrível! Alemão afiado!": "Incredibile! Tedesco impeccabile!", "Indique e ganhe": "Invita un amico e guadagna", "Iniciante": "Principiante", "Intermediário": "Intermedio", "Investimento": "Investimento", "JOGAR": "GIOCA", "Já concluído": "Già completato", "Letra": "Testo", "Mais popular · economize 17%": "Più popolare · risparmia il 17%", "Marcar como concluída": "Contrassegna come completato", "Marcar como concluído": "Contrassegna come completato", "Marcar como estudado": "Contrassegna come studiato", "Mestre": "Maestro", "Meta desta semana": "Obiettivo di questa settimana", "Meu perfil": "Il mio profilo", "Misturado": "Misto", "Montando sua sessão": "Creazione della sessione", "Montando sua sessão com dados reais...": "Creazione della sessione con dati reali...", "Muito bem! Resposta correta.": "Ben fatto! Risposta corretta.", "Muito bom!": "Ottimo!", "Música": "Musica", "Música ambiente para focar": "Musica di sottofondo per concentrarsi", "Música não encontrada.": "Musica non trovata.", "Nenhum item.": "Nessun elemento.", "Nenhuma encontrada.": "Nessuna trovata.", "Nenhuma gravacao ainda": "Nessuna registrazione al momento", "Nome": "Nome", "Nome atualizado!": "Nome aggiornato!", "Não conseguimos montar a sessão agora": "Non siamo riusciti a creare la sessione al momento", "Não deu pra abrir agora": "Impossibile aprire al momento", "Não deu pra gerar o link agora": "Impossibile generare il link al momento", "Não foi possível atualizar": "Impossibile aggiornare", "Nível": "Livello", "Nível (A1→C2)": "Livello (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "Il credito viene accreditato sul tuo portafoglio 7 giorni dopo il pagamento da parte del tuo amico (è la sua garanzia di rimborso; se rinuncia entro tale termine, il credito non viene generato). Per utilizzare il tuo saldo, basta chiamare l'", "O que significa": "Cosa significa", "O áudio fica só neste aparelho": "L'audio rimane solo su questo dispositivo", "Oferta de fundador · vagas limitadas": "Offerta per i fondatori · posti limitati", "Os quizzes ainda não terminaram de carregar": "I quiz non hanno ancora finito di caricarsi", "Outra pergunta": "Un'altra domanda", "Outros": "Altri", "Ouvir exemplo": "Ascolta un esempio", "Pagamento confirmado": "Pagamento confermato", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "Pagamento elaborato in modo sicuro tramite Stripe · Garanzia di 7 giorni: se non ti piace, ti rimborsiamo.", "Palavras e frases bem simples": "Parole e frasi molto semplici", "Parar": "Interrompi", "Pelos direitos autorais": "Per motivi di copyright", "Pergunta": "Domanda", "Permita o microfone!": "Abilita il microfono!", "Plano grátis": "Abbonamento gratuito", "Planos": "Abbonamenti", "Plural:": "Plurale:", "Podcast não encontrado.": "Podcast non trovato.", "Pontos:": "Punti:", "Pontuação final:": "Punteggio finale:", "Pratique alemão em contexto": "Esercitati con il tedesco in contesti reali", "Pratique com questões no estilo do exame oficial": "Esercitati con domande in stile esame ufficiale", "Prefiro explorar livremente": "Preferisco esplorare liberamente", "Premium Anual": "Abbonamento Premium annuale", "Premium Mensal": "Abbonamento Premium mensile", "Premium Vitalício (Fundador)": "Abbonamento Premium a vita (Fondatore)", "Preparar uma prova Goethe": "Prepararsi a un esame Goethe", "Proficiente": "Livello avanzato", "Progresso sincronizado na nuvem": "Progressi sincronizzati sul cloud", "Pronome": "Pronome", "Pronuncia:": "Pronuncia:", "Próxima rodada": "Prossimo round", "Qual frase está gramaticalmente correta": "Quale frase è grammaticalmente corretta", "Qual resposta parece mais natural": "Quale risposta sembra più naturale", "Qual é o seu principal objetivo com o alemão": "Qual è il tuo obiettivo principale con il tedesco", "Quanto você já consegue compreender": "Quanto riesci già a capire", "Quase nada ainda": "Quasi nulla per ora", "Quase! Veja a resposta correta.": "Quasi! Guarda la risposta corretta.", "Quiz curto": "Breve quiz", "Quiz de nivelamento": "Quiz di valutazione del livello", "Quiz relâmpago": "Quiz lampo", "Remover?": "Rimuovere?", "Responda situações reais": "Rispondi a situazioni reali", "Rodada": "Round", "Rádio lo-fi e Pomodoro": "Radio lo-fi e Pomodoro", "Sair da conta": "Esci dall'account", "Salvar": "Salva", "Salvar gravação": "Salva registrazione", "Salve frases clicando 💛!": "Salva le frasi cliccando su 💛!", "Selecionar Idioma": "Seleziona lingua", "Sem plural (substantivo abstrato)": "Senza plurale (sostantivo astratto)", "Sem título": "Senza titolo", "Sessão concluída": "Sessione completata", "Sessão rápida": "Sessione veloce", "Seu link de indicação": "Il tuo link di riferimento", "Seu pagamento está sendo confirmado": "Il tuo pagamento è in fase di conferma", "Seu plano de jornada": "Il tuo piano di percorso", "Seu primeiro caminho, sem pressão": "Il tuo primo percorso, senza pressioni", "Seus atalhos, anotações e revisões.": "I tuoi collegamenti rapidi, appunti e revisioni.", "Simulados Goethe": "Simulazioni Goethe", "Simulados Goethe completos": "Simulazioni Goethe complete", "Simulados Goethe-Zertifikat": "Simulazioni Goethe-Zertifikat", "Sistema de XP e níveis": "Sistema XP e livelli", "Streak": "Streak", "Sua resposta:": "La tua risposta:", "Talvez você goste de começar pelo": "Forse ti piacerebbe iniziare da", "Tempo esgotado!": "Tempo scaduto!", "Tenta atualizar a página": "Prova ad aggiornare la pagina", "Tentar novamente": "Riprova", "Teste de Criatividade": "Test di creatività", "Teste o que ficou na memória": "Verifica cosa ti è rimasto in memoria", "Teste rápido": "Test veloce", "Teste seus reflexos no alemão": "Metti alla prova i tuoi riflessi in tedesco", "Textos e conversas mais complexos": "Testi e conversazioni più complessi", "Todos": "Tutti", "Todos os 63.000 itens liberados": "Tutti i 63.000 elementi sbloccati", "Trabalhar ou fazer entrevistas": "Lavorare o sostenere colloqui", "Treinar": "Allenarsi", "Trocar ambiente": "Cambiare ambiente", "Trocar idioma": "Cambiare lingua", "Um diálogo": "Un dialogo", "Um verbo em foco": "Un verbo in primo piano", "Uma prática curta para avançar": "Un breve esercizio per progredire", "Uma sugestão, não um rótulo": "Un suggerimento, non un'etichetta", "Usar esta recomendação": "Segui questo consiglio", "Usar grátis": "Usa gratuitamente", "Use Chrome para reconhecimento de voz.": "Usa Chrome per il riconoscimento vocale.", "Use as setas do teclado": "Usa le frecce della tastiera", "Veja exemplos e conjugação": "Guarda esempi e coniugazioni", "Ver planos": "Visualizza i piani", "Ver progresso completo": "Visualizza i progressi completi", "Verbo em foco": "Verbo in primo piano", "Verbo não encontrado.": "Verbo non trovato.", "Verificando...": "Verifica in corso...", "Verifique sua conexão e tente novamente": "Controlla la tua connessione e riprova", "Vocabulario": "Vocabolario", "Vocabulário": "Vocabolario", "Vocabulário útil": "Vocabolario utile", "Você está jogando com 20 questões grátis de 3.000 —": "Stai giocando con 20 domande gratuite su 3.000 —", "Você manteve o alemão em movimento.": "Hai mantenuto vivo il tedesco.", "Você também pode responder falando": "Puoi anche rispondere a voce", "XP ganho:": "XP guadagnati:", "XP total": "XP totali", "ativo": "attivo", "cancele quando quiser": "annulla quando vuoi", "desbloquear todas": "sblocca tutto", "dias ativos": "giorni attivi", "dias seguidos": "giorni consecutivi", "em breve": "presto", "experimentar agora": "prova ora", "expressão": "espressione", "frases conjugadas": "frasi coniugate", "frases disponiveis": "frasi disponibili", "frases profissionais": "frasi professionali", "missões": "missioni", "mínimo sugerido": "minimo suggerito", "palavra": "parola", "palavras": "parole", "para sempre · sem cartão": "per sempre · senza tessera", "planos": "piani", "prova oficial": "prova ufficiale", "questões": "domande", "resultado(s)": "risultato(i)", "revisão concluída": "revisione completata", "seu saldo em créditos": "il tuo saldo in crediti", "teste seus reflexos": "metti alla prova i tuoi riflessi", "verbo": "verbo", "Áudio de alta qualidade em todo o conteúdo": "Audio di alta qualità in tutti i contenuti", "← Voltar para Cursos": "← Torna ai corsi", "← Voltar para Música": "← Torna alla musica", "← Voltar para categorias": "← Torna alle categorie", "⏯️ Pausar": "⏯️ Metti in pausa", "⏹ Parar gravacao": "⏹ Interrompi la registrazione", "① Manda seu link": "① Invia il tuo link", "② Seu amigo assina um plano": "② Il tuo amico si abbona a un piano", "③ Você ganha 20% em créditos, direto na sua carteira": "③ Ricevi il 20% in crediti, direttamente nel tuo portafoglio", "▶ Frase": "▶ Frase", "▶ JOGAR": "▶ GIOCA", "▶ Ouvir podcast completo": "▶ Ascolta il podcast completo", "▶ Palavra": "▶ Parola", "▶ Plural": "▶ Plurale", "▶ Proxima": "▶ Prossima", "▶️ Continuar": "▶️ Continua", "☀️ Hoje": "☀️ Oggi", "⚡ Quiz Rápido": "⚡ Quiz veloce", "✅ Concluído": "✅ Completato", "✅ Conferir resposta": "✅ Controlla la risposta", "✅ Correto!": "✅ Giusto!", "✅ Enviar": "✅ Invia", "✅ Verificar": "✅ Verifica", "✍️ Escrita": "✍️ Scrivi", "✏️ Anotar": "✏️ Prendi nota", "✏️ Editar": "✏️ Modifica", "✓ Respondida": "✓ Risposta data", "❌ Tente de novo": "❌ Riprova", "⬅ Escolher Nível": "⬅ Scegli il livello", "⬅ Voltar": "⬅ Torna indietro", "🎉 Parabéns!": "🎉 Congratulazioni!", "🎉 Você passaria!": "🎉 Ce l'avresti fatta!", "🎉 Você subiu para o nível": "🎉 Sei passato al livello", "🎙️ Minhas Gravacoes": "🎙️ Le mie registrazioni", "🎤 Falar em alemão": "🎤 Parlare in tedesco", "🎤 Gravar minha pronuncia": "🎤 Registrare la mia pronuncia", "🎤 Letras": "🎤 Testi", "🎤 Ouvindo...": "🎤 Ascoltando...", "🎤 Pronuncia": "🎤 Pronuncia", "🎤 Tentar de novo": "🎤 Riprova", "🎧 Ouvir áudio": "🎧 Ascolta l'audio", "🎧 Sua gravacao:": "🎧 La tua registrazione:", "🎲 Aleatorio": "🎲 Casuale", "🎵 Música ambiente para focar": "🎵 Musica di sottofondo per concentrarsi", "🎵 Músicas": "🎵 Canzoni", "🏆 Recorde:": "🏆 Record:", "🐍 Caçando Vocabulário": "🐍 A caccia di vocaboli", "💬 Frases": "💬 Frasi", "💼 Profissões": "💼 Professioni", "💾 Salvar": "💾 Salva", "📅 Qualquer data": "📅 Qualsiasi data", "📅 Tudo": "📅 Tutto", "📆 7 dias": "📆 7 giorni", "📋 Finalizar Prova": "📋 Termina il test", "📖 Gramática": "📖 Grammatica", "📚 Continue estudando!": "📚 Continua a studiare!", "📚 Foco": "📚 Concentrazione", "📚 Vocabulário em Alemão": "📚 Vocabolario in tedesco", "📝 Caderno de Estudos": "📝 Quaderno di studio", "📝 Modelo:": "📝 Modello:", "📝 Simulados Goethe-Zertifikat": "📝 Simulazioni Goethe-Zertifikat", "🔄 Nova Prova": "🔄 Nuovo test", "🔄 Novo Quiz": "🔄 Nuovo quiz", "🔊 Ouvir": "🔊 Ascolta", "🔊 Ouvir original": "🔊 Ascolta l'originale", "🔍 Buscar em todas as categorias...": "🔍 Cerca in tutte le categorie...", "🔍 Buscar nesta categoria...": "🔍 Cerca in questa categoria...", "🔎 Escolher uma data...": "🔎 Scegli una data...", "🔤 Palavras": "🔤 Parole", "🔤 Verbos": "🔤 Verbi", "🔥 Melhor sequência:": "🔥 Migliore sequenza:", "🗑️ Descartar": "🗑️ Elimina", "🗓️ 30 dias": "🗓️ 30 giorni", "🗣️ Expressões & Gírias": "🗣️ Espressioni e slang", "🗣️ Gírias": "🗣️ Slang", "🗣️ Você disse:": "🗣️ Hai detto:"},
  tr: {"+1.500 expressões coloquiais do alemão real": "+1.500 gerçek Almanca konuşma ifadesi", "1.225 diálogos + 1.315 verbos conjugados": "1.225 diyalog + 1.315 çekimlenmiş fiil", "1.509 gírias e 1.200 frases de profissões": "1.509 argo kelime ve 1.200 meslek ile ilgili cümle", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "25 kategoriye ayrılmış 2.500 günlük kelime — çoğul halleri ve sesli örnek cümlelerle birlikte.", "20 conteúdos de cada categoria": "Her kategoriden 20 içerik", "3.000 questões de quiz + simulados Goethe": "3.000 test sorusu + Goethe deneme sınavları", "A cobra bateu nela mesma!": "Yılan kendi kuyruğuna vurdu!", "A transcrição usa o recurso de voz do navegador": "Transkripsiyon, tarayıcının ses özelliğini kullanır", "A → Z": "A → Z", "Abrindo...": "Açılıyor...", "Acompanhar": "Takip et", "Ainda tem mais": "Dahası da var", "Altere o idioma da interface do app.": "Uygulamanın arayüz dilini değiştirin.", "Ambiente de estudo": "Çalışma ortamı", "Analisar resposta": "Cevabı analiz et", "Anotações:": "Notlar:", "Análises disponíveis hoje": "Bugün mevcut analizler", "Aprenda alemão com letras traduzidas, linha por linha.": "Satır satır çevrilmiş metinlerle Almanca öğrenin.", "Assinatura": "Abonelik", "Avançado": "Gelişmiş", "Biblioteca completa (63.000 itens)": "Tam kütüphane (63.000 öğe)", "Biblioteca completa liberada": "Tam kütüphane ücretsiz", "Boa noite! 👋": "İyi geceler! 👋", "Boa tarde! 👋": "İyi günler! 👋", "Bom dia! 👋": "Günaydın! 👋", "Básico": "Temel", "Cancelar": "İptal et", "Carregando quizzes...": "Testler yükleniyor...", "Carregando seu progresso": "İlerlemenizi yüklüyor", "Carregando...": "Yükleniyor...", "Chame seus amigos pra aprender alemão 🇩🇪": "Arkadaşlarınızı Almanca öğrenmeye davet edin 🇩🇪", "Clique no player para ajustar volume": "Ses seviyesini ayarlamak için oynatıcıya tıklayın", "Clique para ouvir": "Dinlemek için tıklayın", "Clique para ver traducao": "Çeviriyi görmek için tıklayın", "Começar": "Başlayın", "Começar do zero": "Sıfırdan başlayın", "Complete": "Tamamlayın", "Concluídos": "Tamamlananlar", "Conectores": "Bağlaçlar", "Conjugação": "Çekim", "Conta": "Hesap", "Conteúdo": "İçerik", "Conteúdo deste nível chegando em breve": "Bu seviyenin içeriği yakında geliyor", "Conteúdo ▾": "İçerik ▾", "Continuar": "Devam et", "Conversar no dia a dia": "Günlük konuşmalar", "Conversas sobre assuntos conhecidos": "Tanıdık konular hakkında sohbetler", "Copiado!": "Kopyalandı!", "Copiar": "Kopyala", "Criar conta pra não perder seu progresso": "İlerlemenizi kaybetmemek için hesap oluşturun", "Cursos": "Kurslar", "Desbloquear tudo": "Her şeyi aç", "Descartar e regravar": "Sil ve yeniden kaydet", "Descubra em dois minutos um bom ponto de partida": "İki dakikada iyi bir başlangıç noktası bulun", "Dicas de gramática": "Dilbilgisi ipuçları", "Digite a frase em alemao aqui...": "Almanca cümleyi buraya yazın...", "E-mail": "E-posta", "Em breve!": "Yakında!", "Encerrar e salvar XP": "XP'yi kapat ve kaydet", "Encontre em alemão:": "Almanca'da bul:", "Entrando, seu limite fica protegido": "Giriş yaptığınızda, limitiniz korunur", "Escolha a resposta correta": "Doğru cevabı seçin", "Escolha seu nível": "Seviyenizi seçin", "Escolha seu plano": "Planınızı seçin", "Escolha um nível para ver diálogos e verbos.": "Diyalogları ve fiilleri görmek için bir seviye seçin.", "Escolha uma alternativa": "Bir seçenek seçin", "Escreva em alemão...": "Almanca yazın...", "Escrita": "Yazma", "Estatísticas": "İstatistikler", "Este teste é uma orientação de estudo": "Bu test bir çalışma kılavuzudur", "Estrutura sugerida": "Önerilen yapı", "Estudar": "Çalışın", "Estude mais um pouco!": "Biraz daha çalışın!", "Excluir todas": "Hepsini sil", "Exemplo": "Örnek", "Explorar livremente": "Serbestçe keşfedin", "Fale, pense e construa em alemão": "Almanca konuşun, düşünün ve cümleler kurun", "Faltam": "Eksik olanlar", "Fazer outra": "Başka bir tane yapın", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Dilediğiniz gibi gezinmeye devam edebilirsiniz. Hepsini bir kerede açmak istediğinizde, Premium tüm kütüphaneyi açar — ve hiçbir şeyi kaçırmadan aynı yerde devam edersiniz.", "Finalizar mesmo assim?": "Yine de bitirmek mi istiyorsunuz?", "Foco": "Odaklanma", "Frase curta": "Kısa cümle", "Frases": "Cümleler", "Gabarito:": "Cevap anahtarı:", "Gerenciar assinatura": "Aboneliği yönet", "Gravar resposta": "Cevabı kaydet", "Gravações salvas neste aparelho": "Bu cihazda kaydedilen kayıtlar", "Grátis": "Ücretsiz", "Idioma": "Dil", "Incrível! Alemão afiado!": "İnanılmaz! Almancanız çok iyi!", "Indique e ganhe": "Tavsiye et ve kazan", "Iniciante": "Başlangıç seviyesi", "Intermediário": "Orta seviye", "Investimento": "Yatırım", "JOGAR": "OYNA", "Já concluído": "Tamamlandı", "Letra": "Şarkı sözleri", "Mais popular · economize 17%": "En popüler · %17 tasarruf edin", "Marcar como concluída": "Tamamlandı olarak işaretle", "Marcar como concluído": "Tamamlandı olarak işaretle", "Marcar como estudado": "Çalışıldı olarak işaretle", "Mestre": "Usta", "Meta desta semana": "Bu haftanın hedefi", "Meu perfil": "Profilim", "Misturado": "Karışık", "Montando sua sessão": "Oturumunuzu oluşturuyor", "Montando sua sessão com dados reais...": "Gerçek verilerle oturumunuzu oluşturuyor...", "Muito bem! Resposta correta.": "Aferin! Doğru cevap.", "Muito bom!": "Çok iyi!", "Música": "Müzik", "Música ambiente para focar": "Odaklanmak için arka plan müziği", "Música não encontrada.": "Müzik bulunamadı.", "Nenhum item.": "Hiçbir öğe yok.", "Nenhuma encontrada.": "Hiçbiri bulunamadı.", "Nenhuma gravacao ainda": "Henüz kayıt yok", "Nome": "Ad", "Nome atualizado!": "Ad güncellendi!", "Não conseguimos montar a sessão agora": "Şu anda oturumu açamadık", "Não deu pra abrir agora": "Şu anda açılamadı", "Não deu pra gerar o link agora": "Şu anda bağlantı oluşturulamadı", "Não foi possível atualizar": "Güncellenemedi", "Nível": "Seviye", "Nível (A1→C2)": "Seviye (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "Kredi, arkadaşınız ödeme yaptıktan 7 gün sonra cüzdanınıza aktarılır (bu, onun para iade garantisidir; bu süre içinde vazgeçerse kredi oluşturulmaz). Bakiyenizi kullanmak için", "O que significa": "adresinden arama yapmanız yeterlidir. Anlamı", "O áudio fica só neste aparelho": "Ses kaydı sadece bu cihazda kalır", "Oferta de fundador · vagas limitadas": "Kurucu teklifi · sınırlı kontenjan", "Os quizzes ainda não terminaram de carregar": "Testler henüz yüklenmedi", "Outra pergunta": "Başka bir soru", "Outros": "Diğerleri", "Ouvir exemplo": "Örnek dinle", "Pagamento confirmado": "Ödeme onaylandı", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "Ödeme Stripe aracılığıyla güvenli bir şekilde işlendi · 7 gün garanti: beğenmezseniz iade ederiz.", "Palavras e frases bem simples": "Çok basit kelimeler ve cümleler", "Parar": "Dur", "Pelos direitos autorais": "Telif hakkı nedeniyle", "Pergunta": "Soru", "Permita o microfone!": "Mikrofonu etkinleştirin!", "Plano grátis": "Ücretsiz plan", "Planos": "Planlar", "Plural:": "Çoğul:", "Podcast não encontrado.": "Podcast bulunamadı.", "Pontos:": "Puanlar:", "Pontuação final:": "Son puan:", "Pratique alemão em contexto": "Bağlam içinde Almanca pratik yapın", "Pratique com questões no estilo do exame oficial": "Resmi sınav tarzında sorularla pratik yapın", "Prefiro explorar livremente": "Serbestçe keşfetmeyi tercih ederim", "Premium Anual": "Yıllık Premium", "Premium Mensal": "Aylık Premium", "Premium Vitalício (Fundador)": "Ömür Boyu Premium (Kurucu)", "Preparar uma prova Goethe": "Goethe sınavına hazırlanın", "Proficiente": "İleri seviye", "Progresso sincronizado na nuvem": "Bulutta senkronize ilerleme", "Pronome": "Zamir", "Pronuncia:": "Telaffuz:", "Próxima rodada": "Bir sonraki tur", "Qual frase está gramaticalmente correta": "Hangi cümle gramer açısından doğru?", "Qual resposta parece mais natural": "Hangi cevap daha doğal görünüyor?", "Qual é o seu principal objetivo com o alemão": "Almanca öğrenmedeki ana hedefiniz nedir?", "Quanto você já consegue compreender": "Şu ana kadar ne kadarını anlayabiliyorsunuz?", "Quase nada ainda": "Henüz neredeyse hiçbir şey", "Quase! Veja a resposta correta.": "Neredeyse! Doğru cevabı görün.", "Quiz curto": "Kısa test", "Quiz de nivelamento": "Seviye belirleme testi", "Quiz relâmpago": "Hızlı test", "Remover?": "Silmek mi istiyorsunuz?", "Responda situações reais": "Gerçek durumlara cevap verin", "Rodada": "Tur", "Rádio lo-fi e Pomodoro": "Lo-fi radyo ve Pomodoro", "Sair da conta": "Hesaptan çık", "Salvar": "Kaydet", "Salvar gravação": "Kaydı kaydet", "Salve frases clicando 💛!": "💛'ye tıklayarak cümleleri kaydedin!", "Selecionar Idioma": "Dil seç", "Sem plural (substantivo abstrato)": "Çoğul yok (soyut isim)", "Sem título": "Başlıksız", "Sessão concluída": "Oturum tamamlandı", "Sessão rápida": "Hızlı oturum", "Seu link de indicação": "Tavsiye bağlantınız", "Seu pagamento está sendo confirmado": "Ödemeniz onaylanıyor", "Seu plano de jornada": "Yolculuk planınız", "Seu primeiro caminho, sem pressão": "İlk yolunuz, baskı yok", "Seus atalhos, anotações e revisões.": "Kısayollarınız, notlarınız ve gözden geçirmeleriniz.", "Simulados Goethe": "Goethe deneme sınavları", "Simulados Goethe completos": "Tam Goethe deneme sınavları", "Simulados Goethe-Zertifikat": "Goethe-Zertifikat deneme sınavları", "Sistema de XP e níveis": "XP ve seviye sistemi", "Streak": "Streak", "Sua resposta:": "Cevabınız:", "Talvez você goste de começar pelo": "Belki de", "Tempo esgotado!": "ile başlamak istersiniz. Süre doldu!", "Tenta atualizar a página": "Sayfayı yenilemeyi deneyin", "Tentar novamente": "Tekrar deneyin", "Teste de Criatividade": "Yaratıcılık Testi", "Teste o que ficou na memória": "Hafızanızda ne kaldığını test edin", "Teste rápido": "Hızlı test", "Teste seus reflexos no alemão": "Almanca'da reflekslerinizi test edin", "Textos e conversas mais complexos": "Daha karmaşık metinler ve konuşmalar", "Todos": "Hepsi", "Todos os 63.000 itens liberados": "Yayınlanan 63.000 öğenin tamamı", "Trabalhar ou fazer entrevistas": "Çalışmak veya mülakatlara hazırlanmak", "Treinar": "Antrenman yapmak", "Trocar ambiente": "Ortam değiştirmek", "Trocar idioma": "Dil değiştirmek", "Um diálogo": "Bir diyalog", "Um verbo em foco": "Odak noktasında bir fiil", "Uma prática curta para avançar": "İlerlemek için kısa bir alıştırma", "Uma sugestão, não um rótulo": "Bir öneri, etiket değil", "Usar esta recomendação": "Bu öneriyi kullanın", "Usar grátis": "Ücretsiz kullanın", "Use Chrome para reconhecimento de voz.": "Ses tanıma için Chrome'u kullanın.", "Use as setas do teclado": "Klavye ok tuşlarını kullanın", "Veja exemplos e conjugação": "Örnekleri ve çekimleri görün", "Ver planos": "Planları görün", "Ver progresso completo": "Tam ilerlemeyi görün", "Verbo em foco": "Odak noktasında olan fiil", "Verbo não encontrado.": "Fiil bulunamadı.", "Verificando...": "Kontrol ediliyor...", "Verifique sua conexão e tente novamente": "Bağlantınızı kontrol edin ve tekrar deneyin", "Vocabulario": "Kelime dağarcığı", "Vocabulário": "Kelime dağarcığı", "Vocabulário útil": "Yararlı kelime dağarcığı", "Você está jogando com 20 questões grátis de 3.000 —": "3.000 sorudan 20'sini ücretsiz olarak çözüyorsunuz —", "Você manteve o alemão em movimento.": "Almanca'yı canlı tuttunuz.", "Você também pode responder falando": "Ayrıca konuşarak da cevap verebilirsiniz", "XP ganho:": "Kazanılan XP:", "XP total": "Toplam XP", "ativo": "aktif", "cancele quando quiser": "istediğiniz zaman iptal edin", "desbloquear todas": "hepsini aç", "dias ativos": "aktif günler", "dias seguidos": "arka arkaya günler", "em breve": "yakında", "experimentar agora": "şimdi deneyin", "expressão": "ifade", "frases conjugadas": "çekimlenmiş cümleler", "frases disponiveis": "mevcut cümleler", "frases profissionais": "profesyonel cümleler", "missões": "görevler", "mínimo sugerido": "önerilen minimum", "palavra": "kelime", "palavras": "kelimeler", "para sempre · sem cartão": "sonsuza kadar · kart olmadan", "planos": "planlar", "prova oficial": "resmi sınav", "questões": "sorular", "resultado(s)": "sonuç(lar)", "revisão concluída": "gözden geçirme tamamlandı", "seu saldo em créditos": "kredi bakiyeniz", "teste seus reflexos": "reflekslerinizi test edin", "verbo": "fiil", "Áudio de alta qualidade em todo o conteúdo": "Tüm içerikte yüksek kaliteli ses", "← Voltar para Cursos": "← Kurslara Geri Dön", "← Voltar para Música": "← Müziğe Geri Dön", "← Voltar para categorias": "← Kategorilere Geri Dön", "⏯️ Pausar": "⏯️ Duraklat", "⏹ Parar gravacao": "⏹ Kaydı durdur", "① Manda seu link": "① Linkinizi gönderin", "② Seu amigo assina um plano": "② Arkadaşınız bir plana abone olsun", "③ Você ganha 20% em créditos, direto na sua carteira": "③ Cüzdanınıza doğrudan %20 kredi kazanın", "▶ Frase": "▶ Cümle", "▶ JOGAR": "▶ OYNA", "▶ Ouvir podcast completo": "▶ Podcast'in tamamını dinle", "▶ Palavra": "▶ Kelime", "▶ Plural": "▶ Çoğul", "▶ Proxima": "▶ Sonraki", "▶️ Continuar": "▶️ Devam et", "☀️ Hoje": "☀️ Bugün", "⚡ Quiz Rápido": "⚡ Hızlı Test", "✅ Concluído": "✅ Tamamlandı", "✅ Conferir resposta": "✅ Cevabı kontrol et", "✅ Correto!": "✅ Doğru!", "✅ Enviar": "✅ Gönder", "✅ Verificar": "✅ Kontrol et", "✍️ Escrita": "✍️ Yazma", "✏️ Anotar": "✏️ Not al", "✏️ Editar": "✏️ Düzenle", "✓ Respondida": "✓ Cevaplandı", "❌ Tente de novo": "❌ Tekrar dene", "⬅ Escolher Nível": "⬅ Seviye seç", "⬅ Voltar": "⬅ Geri dön", "🎉 Parabéns!": "🎉 Tebrikler!", "🎉 Você passaria!": "🎉 Geçerdiniz!", "🎉 Você subiu para o nível": "🎉", "🎙️ Minhas Gravacoes": "seviyesine yükseldiniz 🎙️ Kayıtlarım", "🎤 Falar em alemão": "🎤 Almanca konuşma", "🎤 Gravar minha pronuncia": "🎤 Telaffuzumu kaydet", "🎤 Letras": "🎤 Şarkı sözleri", "🎤 Ouvindo...": "🎤 Dinliyorum...", "🎤 Pronuncia": "🎤 Telaffuz", "🎤 Tentar de novo": "🎤 Tekrar dene", "🎧 Ouvir áudio": "🎧 Ses dosyasını dinle", "🎧 Sua gravacao:": "🎧 Kayıt:", "🎲 Aleatorio": "🎲 Rastgele", "🎵 Música ambiente para focar": "🎵 Odaklanmak için arka plan müziği", "🎵 Músicas": "🎵 Şarkılar", "🏆 Recorde:": "🏆 Rekor:", "🐍 Caçando Vocabulário": "🐍 Kelime Avı", "💬 Frases": "💬 İfadeler", "💼 Profissões": "💼 Meslekler", "💾 Salvar": "💾 Kaydet", "📅 Qualquer data": "📅 Herhangi bir tarih", "📅 Tudo": "📅 Hepsi", "📆 7 dias": "📆 7 gün", "📋 Finalizar Prova": "📋 Sınavı Bitir", "📖 Gramática": "📖 Dilbilgisi", "📚 Continue estudando!": "📚 Çalışmaya devam et!", "📚 Foco": "📚 Odaklanma", "📚 Vocabulário em Alemão": "📚 Almanca Kelime Dağarcığı", "📝 Caderno de Estudos": "📝 Çalışma Defteri", "📝 Modelo:": "📝 Şablon:", "📝 Simulados Goethe-Zertifikat": "📝 Goethe-Zertifikat Deneme Sınavları", "🔄 Nova Prova": "🔄 Yeni Sınav", "🔄 Novo Quiz": "🔄 Yeni Test", "🔊 Ouvir": "🔊 Dinle", "🔊 Ouvir original": "🔊 Orijinalini Dinle", "🔍 Buscar em todas as categorias...": "🔍 Tüm kategorilerde ara...", "🔍 Buscar nesta categoria...": "🔍 Bu kategoride ara...", "🔎 Escolher uma data...": "🔎 Bir tarih seç...", "🔤 Palavras": "🔤 Kelimeler", "🔤 Verbos": "🔤 Fiiller", "🔥 Melhor sequência:": "🔥 En iyi sıra:", "🗑️ Descartar": "🗑️ Sil", "🗓️ 30 dias": "🗓️ 30 gün", "🗣️ Expressões & Gírias": "🗣️ Deyimler ve Argo", "🗣️ Gírias": "🗣️ Argo", "🗣️ Você disse:": "🗣️ Dediğin şey:"},
  ar: {"+1.500 expressões coloquiais do alemão real": "+1,500 تعبير عامي من اللغة الألمانية الحقيقية", "1.225 diálogos + 1.315 verbos conjugados": "1,225 حوارًا + 1,315 فعلًا مُصَرَّفًا", "1.509 gírias e 1.200 frases de profissões": "1,509 مصطلحًا عاميًا و1,200 عبارة متعلقة بالمهن", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "2,500 كلمة من الحياة اليومية، مُصنَّفة في 25 فئة — مع صيغة الجمع وعبارة مثال صوتية.", "20 conteúdos de cada categoria": "20 محتوى من كل فئة", "3.000 questões de quiz + simulados Goethe": "3,000 سؤال اختبار + اختبارات محاكاة Goethe", "A cobra bateu nela mesma!": "الأفعى عضت نفسها!", "A transcrição usa o recurso de voz do navegador": "يستخدم النص ميزة الصوت في المتصفح", "A → Z": "من A إلى Z", "Abrindo...": "قيد الفتح...", "Acompanhar": "متابعة", "Ainda tem mais": "وهناك المزيد", "Altere o idioma da interface do app.": "قم بتغيير لغة واجهة التطبيق.", "Ambiente de estudo": "بيئة الدراسة", "Analisar resposta": "تحليل الإجابة", "Anotações:": "الملاحظات:", "Análises disponíveis hoje": "التحليلات المتاحة اليوم", "Aprenda alemão com letras traduzidas, linha por linha.": "تعلم اللغة الألمانية مع ترجمة الحروف، سطراً سطراً.", "Assinatura": "الاشتراك", "Avançado": "متقدم", "Biblioteca completa (63.000 itens)": "المكتبة الكاملة (63.000 عنصر)", "Biblioteca completa liberada": "المكتبة الكاملة متاحة مجانًا", "Boa noite! 👋": "طابت ليلتكم! 👋", "Boa tarde! 👋": "طاب مسائكم! 👋", "Bom dia! 👋": "صباح الخير! 👋", "Básico": "أساسي", "Cancelar": "إلغاء", "Carregando quizzes...": "يتم تحميل الاختبارات...", "Carregando seu progresso": "يتم تحميل تقدمك", "Carregando...": "يتم التحميل...", "Chame seus amigos pra aprender alemão 🇩🇪": "ادعُ أصدقاءك لتعلم اللغة الألمانية 🇩🇪", "Clique no player para ajustar volume": "انقر على المشغل لضبط مستوى الصوت", "Clique para ouvir": "انقر للاستماع", "Clique para ver traducao": "انقر لعرض الترجمة", "Começar": "ابدأ", "Começar do zero": "ابدأ من الصفر", "Complete": "أكمل", "Concluídos": "تم إكمالها", "Conectores": "أدوات الربط", "Conjugação": "التصريف", "Conta": "الحساب", "Conteúdo": "المحتوى", "Conteúdo deste nível chegando em breve": "محتوى هذا المستوى قريبًا", "Conteúdo ▾": "المحتوى ▾", "Continuar": "تابع", "Conversar no dia a dia": "المحادثات اليومية", "Conversas sobre assuntos conhecidos": "محادثات حول مواضيع مألوفة", "Copiado!": "تم النسخ!", "Copiar": "نسخ", "Criar conta pra não perder seu progresso": "إنشاء حساب حتى لا تفقد تقدمك", "Cursos": "الدورات التدريبية", "Desbloquear tudo": "فتح كل شيء", "Descartar e regravar": "حذف وإعادة التسجيل", "Descubra em dois minutos um bom ponto de partida": "اكتشف في دقيقتين نقطة انطلاق جيدة", "Dicas de gramática": "نصائح نحوية", "Digite a frase em alemao aqui...": "اكتب الجملة بالألمانية هنا...", "E-mail": "البريد الإلكتروني", "Em breve!": "قريبًا!", "Encerrar e salvar XP": "إغلاق وحفظ XP", "Encontre em alemão:": "ابحث باللغة الألمانية:", "Entrando, seu limite fica protegido": "عند تسجيل الدخول، يتم حماية حدودك", "Escolha a resposta correta": "اختر الإجابة الصحيحة", "Escolha seu nível": "اختر مستواك", "Escolha seu plano": "اختر خطتك", "Escolha um nível para ver diálogos e verbos.": "اختر مستوىً لمشاهدة الحوارات والأفعال.", "Escolha uma alternativa": "اختر خيارًا", "Escreva em alemão...": "اكتب باللغة الألمانية...", "Escrita": "الكتابة", "Estatísticas": "الإحصائيات", "Este teste é uma orientação de estudo": "هذا الاختبار هو دليل دراسي", "Estrutura sugerida": "الهيكل المقترح", "Estudar": "ادرس", "Estude mais um pouco!": "ادرس قليلاً أكثر!", "Excluir todas": "حذف الكل", "Exemplo": "مثال", "Explorar livremente": "استكشف بحرية", "Fale, pense e construa em alemão": "تحدث وفكر وصغ جملًا باللغة الألمانية", "Faltam": "ما زال هناك", "Fazer outra": "قم باختبار آخر", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "لا تتردد في مواصلة التصفح. عندما ترغب في فتح كل شيء دفعة واحدة، يتيح لك الاشتراك المميز الوصول إلى المكتبة بأكملها — وتبقى في نفس المكان، دون أن تفقد أي شيء.", "Finalizar mesmo assim?": "هل تريد الإنهاء مع ذلك؟", "Foco": "التركيز", "Frase curta": "جملة قصيرة", "Frases": "جمل", "Gabarito:": "نموذج الإجابة:", "Gerenciar assinatura": "إدارة الاشتراك", "Gravar resposta": "تسجيل الإجابة", "Gravações salvas neste aparelho": "التسجيلات المحفوظة على هذا الجهاز", "Grátis": "مجانًا", "Idioma": "اللغة", "Incrível! Alemão afiado!": "مذهل! لغتك الألمانية ممتازة!", "Indique e ganhe": "أوصِ واكسب", "Iniciante": "مبتدئ", "Intermediário": "متوسط", "Investimento": "استثمار", "JOGAR": "العب", "Já concluído": "اكتمل بالفعل", "Letra": "النص", "Mais popular · economize 17%": "الأكثر شعبية · وفر 17%", "Marcar como concluída": "ضع علامة \"مكتمل\"", "Marcar como concluído": "ضع علامة \"مكتمل\"", "Marcar como estudado": "ضع علامة \"تم دراسته\"", "Mestre": "خبير", "Meta desta semana": "هدف هذا الأسبوع", "Meu perfil": "ملفي الشخصي", "Misturado": "مختلط", "Montando sua sessão": "يتم إعداد جلستك", "Montando sua sessão com dados reais...": "يتم إعداد جلستك باستخدام بيانات حقيقية...", "Muito bem! Resposta correta.": "أحسنت! إجابة صحيحة.", "Muito bom!": "جيد جدًا!", "Música": "موسيقى", "Música ambiente para focar": "موسيقى خلفية للتركيز", "Música não encontrada.": "لم يتم العثور على الموسيقى.", "Nenhum item.": "لا توجد عناصر.", "Nenhuma encontrada.": "لم يتم العثور على أي شيء.", "Nenhuma gravacao ainda": "لا توجد تسجيلات حتى الآن", "Nome": "الاسم", "Nome atualizado!": "تم تحديث الاسم!", "Não conseguimos montar a sessão agora": "لم نتمكن من إنشاء الجلسة الآن", "Não deu pra abrir agora": "تعذر فتحها الآن", "Não deu pra gerar o link agora": "تعذر إنشاء الرابط الآن", "Não foi possível atualizar": "تعذر التحديث", "Nível": "المستوى", "Nível (A1→C2)": "المستوى (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "تضاف الرصيد إلى محفظتك بعد 7 أيام من دفع صديقك (وهذا هو ضمان استرداد أمواله، فإذا انسحب خلال هذه المدة، لن يتم إنشاء الرصيد). لاستخدام رصيدك، ما عليك سوى الاتصال بـ", "O que significa": "ماذا يعني", "O áudio fica só neste aparelho": "يبقى التسجيل الصوتي على هذا الجهاز فقط", "Oferta de fundador · vagas limitadas": "عرض المؤسس · أماكن محدودة", "Os quizzes ainda não terminaram de carregar": "لم تنتهِ عملية تحميل الاختبارات بعد", "Outra pergunta": "سؤال آخر", "Outros": "أخرى", "Ouvir exemplo": "الاستماع إلى مثال", "Pagamento confirmado": "تم تأكيد الدفع", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "تمت معالجة الدفع بأمان عبر Stripe · ضمان لمدة 7 أيام: إذا لم يعجبك، سنعيد المبلغ.", "Palavras e frases bem simples": "كلمات وجمل بسيطة جدًا", "Parar": "توقف", "Pelos direitos autorais": "حقوق النشر", "Pergunta": "سؤال", "Permita o microfone!": "قم بتفعيل الميكروفون!", "Plano grátis": "الخطة المجانية", "Planos": "الخطط", "Plural:": "صيغة الجمع:", "Podcast não encontrado.": "لم يتم العثور على البودكاست.", "Pontos:": "النقاط:", "Pontuação final:": "النتيجة النهائية:", "Pratique alemão em contexto": "تدرب على اللغة الألمانية في سياقها", "Pratique com questões no estilo do exame oficial": "تدرب على أسئلة على غرار الامتحان الرسمي", "Prefiro explorar livremente": "أفضل الاستكشاف بحرية", "Premium Anual": "الاشتراك السنوي المميز", "Premium Mensal": "الاشتراك الشهري المميز", "Premium Vitalício (Fundador)": "الاشتراك المميز مدى الحياة (المؤسس)", "Preparar uma prova Goethe": "الاستعداد لاختبار غوته", "Proficiente": "مستوى متقدم", "Progresso sincronizado na nuvem": "التقدم المتزامن في السحابة", "Pronome": "الضمير", "Pronuncia:": "النطق:", "Próxima rodada": "الجولة التالية", "Qual frase está gramaticalmente correta": "أي جملة صحيحة نحويًا", "Qual resposta parece mais natural": "أي إجابة تبدو أكثر طبيعية", "Qual é o seu principal objetivo com o alemão": "ما هو هدفك الرئيسي من تعلم اللغة الألمانية", "Quanto você já consegue compreender": "ما مدى فهمك الحالي", "Quase nada ainda": "لا شيء تقريبًا حتى الآن", "Quase! Veja a resposta correta.": "تقريبًا! انظر الإجابة الصحيحة.", "Quiz curto": "اختبار قصير", "Quiz de nivelamento": "اختبار تحديد المستوى", "Quiz relâmpago": "اختبار سريع", "Remover?": "إزالة؟", "Responda situações reais": "أجب عن مواقف حقيقية", "Rodada": "جولة", "Rádio lo-fi e Pomodoro": "راديو lo-fi و Pomodoro", "Sair da conta": "الخروج من الحساب", "Salvar": "حفظ", "Salvar gravação": "حفظ التسجيل", "Salve frases clicando 💛!": "احفظ العبارات بالنقر على 💛!", "Selecionar Idioma": "تحديد اللغة", "Sem plural (substantivo abstrato)": "بدون جمع (اسم مجرد)", "Sem título": "بدون عنوان", "Sessão concluída": "انتهت الجلسة", "Sessão rápida": "جلسة سريعة", "Seu link de indicação": "رابط التوصية الخاص بك", "Seu pagamento está sendo confirmado": "يتم تأكيد دفعتك", "Seu plano de jornada": "خطة رحلتك", "Seu primeiro caminho, sem pressão": "مسارك الأول، بدون ضغوط", "Seus atalhos, anotações e revisões.": "اختصاراتك وملاحظاتك ومراجعاتك.", "Simulados Goethe": "اختبارات Goethe التجريبية", "Simulados Goethe completos": "اختبارات Goethe التجريبية الكاملة", "Simulados Goethe-Zertifikat": "اختبارات Goethe-Zertifikat التجريبية", "Sistema de XP e níveis": "نظام XP والمستويات", "Streak": "Streak", "Sua resposta:": "إجابتك:", "Talvez você goste de começar pelo": "ربما ترغب في البدء من هنا", "Tempo esgotado!": "انتهى الوقت!", "Tenta atualizar a página": "حاول تحديث الصفحة", "Tentar novamente": "حاول مرة أخرى", "Teste de Criatividade": "اختبار الإبداع", "Teste o que ficou na memória": "اختبر ما بقي في ذاكرتك", "Teste rápido": "اختبار سريع", "Teste seus reflexos no alemão": "اختبر ردود أفعالك باللغة الألمانية", "Textos e conversas mais complexos": "نصوص ومحادثات أكثر تعقيدًا", "Todos": "الكل", "Todos os 63.000 itens liberados": "جميع العناصر الـ 63.000 التي تم فتحها", "Trabalhar ou fazer entrevistas": "العمل أو إجراء المقابلات", "Treinar": "التدريب", "Trocar ambiente": "تغيير البيئة", "Trocar idioma": "تغيير اللغة", "Um diálogo": "حوار", "Um verbo em foco": "فعل محدد", "Uma prática curta para avançar": "تمرين قصير للتقدم", "Uma sugestão, não um rótulo": "اقتراح، وليس تصنيفًا", "Usar esta recomendação": "استخدم هذه التوصية", "Usar grátis": "استخدم مجانًا", "Use Chrome para reconhecimento de voz.": "استخدم Chrome للتعرف على الصوت.", "Use as setas do teclado": "استخدم أسهم لوحة المفاتيح", "Veja exemplos e conjugação": "شاهد الأمثلة والتصريف", "Ver planos": "شاهد الخطط", "Ver progresso completo": "شاهد التقدم الكامل", "Verbo em foco": "الفعل في بؤرة التركيز", "Verbo não encontrado.": "لم يتم العثور على الفعل.", "Verificando...": "قيد التحقق...", "Verifique sua conexão e tente novamente": "تحقق من اتصالك وحاول مرة أخرى", "Vocabulario": "المفردات", "Vocabulário": "المفردات", "Vocabulário útil": "مفردات مفيدة", "Você está jogando com 20 questões grátis de 3.000 —": "أنت تلعب بـ 20 سؤالًا مجانيًا من أصل 3,000 —", "Você manteve o alemão em movimento.": "لقد حافظت على استمرار تعلم اللغة الألمانية.", "Você também pode responder falando": "يمكنك أيضًا الإجابة شفهيًا", "XP ganho:": "نقاط XP المكتسبة:", "XP total": "إجمالي نقاط XP", "ativo": "نشط", "cancele quando quiser": "قم بالإلغاء متى شئت", "desbloquear todas": "فتح كل شيء", "dias ativos": "أيام نشطة", "dias seguidos": "أيام متتالية", "em breve": "قريبًا", "experimentar agora": "جرب الآن", "expressão": "تعبير", "frases conjugadas": "جمل مُصَرَّفة", "frases disponiveis": "جمل متاحة", "frases profissionais": "جمل مهنية", "missões": "مهام", "mínimo sugerido": "الحد الأدنى المقترح", "palavra": "كلمة", "palavras": "كلمات", "para sempre · sem cartão": "إلى الأبد · بدون بطاقة", "planos": "باقات", "prova oficial": "اختبار رسمي", "questões": "أسئلة", "resultado(s)": "النتيجة (النتائج)", "revisão concluída": "المراجعة اكتملت", "seu saldo em créditos": "رصيدك من النقاط", "teste seus reflexos": "اختبر ردود أفعالك", "verbo": "فعل", "Áudio de alta qualidade em todo o conteúdo": "صوت عالي الجودة في جميع المحتويات", "← Voltar para Cursos": "← العودة إلى الدورات التدريبية", "← Voltar para Música": "← العودة إلى الموسيقى", "← Voltar para categorias": "← العودة إلى الفئات", "⏯️ Pausar": "⏯️ إيقاف مؤقت", "⏹ Parar gravacao": "⏹ إيقاف التسجيل", "① Manda seu link": "① أرسل الرابط الخاص بك", "② Seu amigo assina um plano": "② صديقك يشترك في باقة", "③ Você ganha 20% em créditos, direto na sua carteira": "③ تحصل على 20% من النقاط، مباشرة في محفظتك", "▶ Frase": "▶ العبارة", "▶ JOGAR": "▶ اللعب", "▶ Ouvir podcast completo": "▶ الاستماع إلى البودكاست كاملاً", "▶ Palavra": "▶ الكلمة", "▶ Plural": "▶ الجمع", "▶ Proxima": "▶ التالي", "▶️ Continuar": "▶️ متابعة", "☀️ Hoje": "☀️ اليوم", "⚡ Quiz Rápido": "⚡ اختبار سريع", "✅ Concluído": "✅ اكتمل", "✅ Conferir resposta": "✅ التحقق من الإجابة", "✅ Correto!": "✅ صحيح!", "✅ Enviar": "✅ إرسال", "✅ Verificar": "✅ التحقق", "✍️ Escrita": "✍️ الكتابة", "✏️ Anotar": "✏️ تدوين", "✏️ Editar": "✏️ تعديل", "✓ Respondida": "✓ تمت الإجابة", "❌ Tente de novo": "❌ حاول مرة أخرى", "⬅ Escolher Nível": "⬅ اختيار المستوى", "⬅ Voltar": "⬅ العودة", "🎉 Parabéns!": "🎉 تهانينا!", "🎉 Você passaria!": "🎉 كنت ستنجح!", "🎉 Você subiu para o nível": "🎉 لقد انتقلت إلى المستوى", "🎙️ Minhas Gravacoes": "🎙️ تسجيلاتي", "🎤 Falar em alemão": "🎤 التحدث باللغة الألمانية", "🎤 Gravar minha pronuncia": "🎤 تسجيل نطقي", "🎤 Letras": "🎤 كلمات الأغاني", "🎤 Ouvindo...": "🎤 الاستماع...", "🎤 Pronuncia": "🎤 النطق", "🎤 Tentar de novo": "🎤 المحاولة مرة أخرى", "🎧 Ouvir áudio": "🎧 الاستماع إلى الصوت", "🎧 Sua gravacao:": "🎧 تسجيلك:", "🎲 Aleatorio": "🎲 عشوائي", "🎵 Música ambiente para focar": "🎵 موسيقى خلفية للتركيز", "🎵 Músicas": "🎵 الأغاني", "🏆 Recorde:": "🏆 الرقم القياسي:", "🐍 Caçando Vocabulário": "🐍 البحث عن المفردات", "💬 Frases": "💬 العبارات", "💼 Profissões": "💼 المهن", "💾 Salvar": "💾 حفظ", "📅 Qualquer data": "📅 أي تاريخ", "📅 Tudo": "📅 الكل", "📆 7 dias": "📆 7 أيام", "📋 Finalizar Prova": "📋 إنهاء الاختبار", "📖 Gramática": "📖 القواعد", "📚 Continue estudando!": "📚 استمر في الدراسة!", "📚 Foco": "📚 التركيز", "📚 Vocabulário em Alemão": "📚 المفردات الألمانية", "📝 Caderno de Estudos": "📝 دفتر الدراسة", "📝 Modelo:": "📝 نموذج:", "📝 Simulados Goethe-Zertifikat": "📝 اختبارات تجريبية لشهادة غوته", "🔄 Nova Prova": "🔄 اختبار جديد", "🔄 Novo Quiz": "🔄 اختبار قصير جديد", "🔊 Ouvir": "🔊 الاستماع", "🔊 Ouvir original": "🔊 الاستماع إلى النص الأصلي", "🔍 Buscar em todas as categorias...": "🔍 البحث في جميع الفئات...", "🔍 Buscar nesta categoria...": "🔍 البحث في هذه الفئة...", "🔎 Escolher uma data...": "🔎 اختيار تاريخ...", "🔤 Palavras": "🔤 الكلمات", "🔤 Verbos": "🔤 الأفعال", "🔥 Melhor sequência:": "🔥 أفضل تسلسل:", "🗑️ Descartar": "🗑️ استبعاد", "🗓️ 30 dias": "🗓️ 30 يومًا", "🗣️ Expressões & Gírias": "🗣️ التعبيرات والمصطلحات العامية", "🗣️ Gírias": "🗣️ المصطلحات العامية", "🗣️ Você disse:": "🗣️ قلت:"},
  he: {"+1.500 expressões coloquiais do alemão real": "+1,500 ביטויים סלנג מהגרמנית המדוברת", "1.225 diálogos + 1.315 verbos conjugados": "1,225 דיאלוגים + 1,315 פעלים בהטיה", "1.509 gírias e 1.200 frases de profissões": "1,509 מילות סלנג ו-1,200 ביטויים הקשורים למקצועות", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "2,500 מילים יומיומיות, מסודרות ב-25 קטגוריות — כולל צורות הרבים ומשפט דוגמה מוקלט.", "20 conteúdos de cada categoria": "20 תכנים מכל קטגוריה", "3.000 questões de quiz + simulados Goethe": "3,000 שאלות חידון + מבחני סימולציה של גתה", "A cobra bateu nela mesma!": "הנחש הכיש את עצמו!", "A transcrição usa o recurso de voz do navegador": "התמלול משתמש במנגנון הקול של הדפדפן", "A → Z": "A → Z", "Abrindo...": "נפתח...", "Acompanhar": "עקוב אחרי", "Ainda tem mais": "ויש עוד", "Altere o idioma da interface do app.": "שנה את שפת ממשק האפליקציה.", "Ambiente de estudo": "סביבת לימוד", "Analisar resposta": "ניתוח תשובה", "Anotações:": "הערות:", "Análises disponíveis hoje": "ניתוחים זמינים היום", "Aprenda alemão com letras traduzidas, linha por linha.": "למד גרמנית עם אותיות מתורגמות, שורה אחר שורה.", "Assinatura": "מנוי", "Avançado": "מתקדם", "Biblioteca completa (63.000 itens)": "ספרייה מלאה (63,000 פריטים)", "Biblioteca completa liberada": "ספרייה מלאה זמינה בחינם", "Boa noite! 👋": "לילה טוב! 👋", "Boa tarde! 👋": "אחר צהריים טובים! 👋", "Bom dia! 👋": "בוקר טוב! 👋", "Básico": "בסיסי", "Cancelar": "ביטול", "Carregando quizzes...": "טוען חידונים...", "Carregando seu progresso": "טוען את ההתקדמות שלך", "Carregando...": "טוען...", "Chame seus amigos pra aprender alemão 🇩🇪": "הזמן את החברים שלך ללמוד גרמנית 🇩🇪", "Clique no player para ajustar volume": "לחץ על הנגן כדי לכוון את עוצמת הקול", "Clique para ouvir": "לחץ כדי להאזין", "Clique para ver traducao": "לחץ כדי לראות תרגום", "Começar": "התחל", "Começar do zero": "התחל מאפס", "Complete": "השלם", "Concluídos": "הושלמו", "Conectores": "מילות קישור", "Conjugação": "הנטייה", "Conta": "חשבון", "Conteúdo": "תוכן", "Conteúdo deste nível chegando em breve": "תוכן ברמה זו יפורסם בקרוב", "Conteúdo ▾": "תוכן ▾", "Continuar": "המשך", "Conversar no dia a dia": "שיחות יומיומיות", "Conversas sobre assuntos conhecidos": "שיחות על נושאים מוכרים", "Copiado!": "הועתק!", "Copiar": "העתק", "Criar conta pra não perder seu progresso": "צור חשבון כדי לא לאבד את ההתקדמות שלך", "Cursos": "קורסים", "Desbloquear tudo": "בטל את הנעילה של הכל", "Descartar e regravar": "מחק והקלט מחדש", "Descubra em dois minutos um bom ponto de partida": "גלה תוך שתי דקות נקודת התחלה טובה", "Dicas de gramática": "טיפים לדקדוק", "Digite a frase em alemao aqui...": "הקלד כאן את המשפט בגרמנית...", "E-mail": "דוא\"ל", "Em breve!": "בקרוב!", "Encerrar e salvar XP": "סגור ושמור XP", "Encontre em alemão:": "מצא בגרמנית:", "Entrando, seu limite fica protegido": "עם הכניסה, הגבול שלך מוגן", "Escolha a resposta correta": "בחר את התשובה הנכונה", "Escolha seu nível": "בחר את הרמה שלך", "Escolha seu plano": "בחר את התוכנית שלך", "Escolha um nível para ver diálogos e verbos.": "בחר רמה כדי לראות דיאלוגים ופועלים.", "Escolha uma alternativa": "בחר חלופה", "Escreva em alemão...": "כתוב בגרמנית...", "Escrita": "כתיבה", "Estatísticas": "סטטיסטיקות", "Este teste é uma orientação de estudo": "מבחן זה נועד להנחות את הלימוד", "Estrutura sugerida": "מבנה מוצע", "Estudar": "ללמוד", "Estude mais um pouco!": "למד עוד קצת!", "Excluir todas": "מחק הכל", "Exemplo": "דוגמה", "Explorar livremente": "גלה באופן חופשי", "Fale, pense e construa em alemão": "דבר, חשב ובנה בגרמנית", "Faltam": "חסרים", "Fazer outra": "נסה שוב", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "אתה מוזמן להמשיך לגלוש. כשרוצים לפתוח הכל בבת אחת, המנוי הפרימיום פותח את הספרייה כולה — ואתם נשארים באותו המקום, בלי לאבד כלום.", "Finalizar mesmo assim?": "בכל זאת לסיים?", "Foco": "מיקוד", "Frase curta": "משפט קצר", "Frases": "משפטים", "Gabarito:": "תשובות נכונות:", "Gerenciar assinatura": "ניהול מנוי", "Gravar resposta": "הקלט תשובה", "Gravações salvas neste aparelho": "הקלטות שנשמרו במכשיר זה", "Grátis": "חינם", "Idioma": "שפה", "Incrível! Alemão afiado!": "מדהים! גרמנית מושלמת!", "Indique e ganhe": "המלץ וזכה", "Iniciante": "מתחיל", "Intermediário": "בינוני", "Investimento": "השקעה", "JOGAR": "לשחק", "Já concluído": "כבר הושלם", "Letra": "מילים", "Mais popular · economize 17%": "הפופולרי ביותר · חסוך 17%", "Marcar como concluída": "סמן כהושלם", "Marcar como concluído": "סמן כהושלם", "Marcar como estudado": "סמן כנשנה", "Mestre": "מאסטר", "Meta desta semana": "יעד השבוע", "Meu perfil": "הפרופיל שלי", "Misturado": "מעורב", "Montando sua sessão": "מרכיב את הסשן שלך", "Montando sua sessão com dados reais...": "מרכיב את הסשן שלך עם נתונים אמיתיים...", "Muito bem! Resposta correta.": "כל הכבוד! תשובה נכונה.", "Muito bom!": "מצוין!", "Música": "מוזיקה", "Música ambiente para focar": "מוזיקת רקע להתרכז", "Música não encontrada.": "לא נמצאה מוזיקה.", "Nenhum item.": "אין פריטים.", "Nenhuma encontrada.": "לא נמצא אף פריט.", "Nenhuma gravacao ainda": "עדיין אין הקלטות", "Nome": "שם", "Nome atualizado!": "השם עודכן!", "Não conseguimos montar a sessão agora": "לא הצלחנו להקים את המפגש כרגע", "Não deu pra abrir agora": "לא הצלחנו לפתוח כרגע", "Não deu pra gerar o link agora": "לא הצלחנו ליצור את הקישור כרגע", "Não foi possível atualizar": "לא ניתן היה לעדכן", "Nível": "רמה", "Nível (A1→C2)": "רמה (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "הזיכוי יועבר לארנק שלך 7 ימים לאחר שהחבר שלך ישלם (זוהי ערבות ההחזר שלו; אם הוא יבטל בתוך פרק זמן זה, הזיכוי לא ייווצר). כדי להשתמש ביתרתך, פשוט התקשר ל-", "O que significa": "מה זה אומר?", "O áudio fica só neste aparelho": "האודיו נשמר רק במכשיר זה", "Oferta de fundador · vagas limitadas": "מבצע מייסד · מקומות מוגבלים", "Os quizzes ainda não terminaram de carregar": "החידונים עדיין לא סיימו להיטען", "Outra pergunta": "שאלה נוספת", "Outros": "אחרים", "Ouvir exemplo": "האזן לדוגמה", "Pagamento confirmado": "תשלום אושר", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "התשלום עבר בבטחה דרך Stripe · אחריות ל-7 ימים: לא אהבת? נחזיר לך את הכסף.", "Palavras e frases bem simples": "מילים וביטויים פשוטים מאוד", "Parar": "לעצור", "Pelos direitos autorais": "זכויות יוצרים", "Pergunta": "שאלה", "Permita o microfone!": "אפשר את המיקרופון!", "Plano grátis": "תוכנית חינמית", "Planos": "תוכניות", "Plural:": "רבים:", "Podcast não encontrado.": "לא נמצא פודקאסט.", "Pontos:": "נקודות:", "Pontuação final:": "ציון סופי:", "Pratique alemão em contexto": "תרגול גרמנית בהקשר", "Pratique com questões no estilo do exame oficial": "תרגול עם שאלות בסגנון הבחינה הרשמית", "Prefiro explorar livremente": "מעדיף לחקור בחופשיות", "Premium Anual": "פרימיום שנתי", "Premium Mensal": "פרימיום חודשי", "Premium Vitalício (Fundador)": "פרימיום לכל החיים (מייסד)", "Preparar uma prova Goethe": "הכנה למבחן גתה", "Proficiente": "רמה מתקדמת", "Progresso sincronizado na nuvem": "התקדמות מסונכרנת בענן", "Pronome": "כינוי גוף", "Pronuncia:": "הגייה:", "Próxima rodada": "הסיבוב הבא", "Qual frase está gramaticalmente correta": "איזה משפט נכון מבחינה דקדוקית", "Qual resposta parece mais natural": "איזו תשובה נשמעת טבעית יותר", "Qual é o seu principal objetivo com o alemão": "מה המטרה העיקרית שלך בלימוד גרמנית", "Quanto você já consegue compreender": "עד כמה אתה כבר מצליח להבין", "Quase nada ainda": "עדיין כמעט כלום", "Quase! Veja a resposta correta.": "כמעט! ראה את התשובה הנכונה.", "Quiz curto": "חידון קצר", "Quiz de nivelamento": "חידון מיון רמות", "Quiz relâmpago": "חידון בזק", "Remover?": "להסיר?", "Responda situações reais": "ענה על מצבים אמיתיים", "Rodada": "סיבוב", "Rádio lo-fi e Pomodoro": "רדיו lo-fi ופומודורו", "Sair da conta": "צא מהחשבון", "Salvar": "שמור", "Salvar gravação": "שמור הקלטה", "Salve frases clicando 💛!": "שמור משפטים בלחיצה על 💛!", "Selecionar Idioma": "בחר שפה", "Sem plural (substantivo abstrato)": "ללא צורת רבים (שם עצם מופשט)", "Sem título": "ללא כותרת", "Sessão concluída": "הסשן הסתיים", "Sessão rápida": "סשן מהיר", "Seu link de indicação": "קישור ההפניה שלך", "Seu pagamento está sendo confirmado": "התשלום שלך מאושר", "Seu plano de jornada": "תוכנית המסע שלך", "Seu primeiro caminho, sem pressão": "הדרך הראשונה שלך, ללא לחץ", "Seus atalhos, anotações e revisões.": "קיצורי הדרך, ההערות והחזרות שלך.", "Simulados Goethe": "מבחני תרגול של גתה", "Simulados Goethe completos": "מבחני תרגול מלאים של גתה", "Simulados Goethe-Zertifikat": "מבחני תרגול של Goethe-Zertifikat", "Sistema de XP e níveis": "מערכת XP ורמות", "Streak": "רצף", "Sua resposta:": "התשובה שלך:", "Talvez você goste de começar pelo": "אולי תרצה להתחיל ב-", "Tempo esgotado!": "הזמן נגמר!", "Tenta atualizar a página": "נסה לרענן את הדף", "Tentar novamente": "נסה שוב", "Teste de Criatividade": "מבחן יצירתיות", "Teste o que ficou na memória": "בדוק מה נותר בזיכרון", "Teste rápido": "מבחן מהיר", "Teste seus reflexos no alemão": "בדוק את הרפלקסים שלך בגרמנית", "Textos e conversas mais complexos": "טקסטים ושיחות מורכבים יותר", "Todos": "כולם", "Todos os 63.000 itens liberados": "כל 63,000 הפריטים שפורסמו", "Trabalhar ou fazer entrevistas": "לעבוד או לערוך ראיונות", "Treinar": "להתאמן", "Trocar ambiente": "להחליף סביבה", "Trocar idioma": "להחליף שפה", "Um diálogo": "דיאלוג", "Um verbo em foco": "פועל במוקד", "Uma prática curta para avançar": "תרגול קצר כדי להתקדם", "Uma sugestão, não um rótulo": "הצעה, לא תווית", "Usar esta recomendação": "השתמש בהמלצה זו", "Usar grátis": "השתמש בחינם", "Use Chrome para reconhecimento de voz.": "השתמש ב-Chrome לזיהוי קולי.", "Use as setas do teclado": "השתמש בחצי המקלדת", "Veja exemplos e conjugação": "ראה דוגמאות והטייה", "Ver planos": "ראה תוכניות", "Ver progresso completo": "ראה התקדמות מלאה", "Verbo em foco": "פועל במוקד", "Verbo não encontrado.": "לא נמצא פועל.", "Verificando...": "בודק...", "Verifique sua conexão e tente novamente": "בדוק את החיבור שלך ונסה שוב", "Vocabulario": "אוצר מילים", "Vocabulário": "אוצר מילים", "Vocabulário útil": "אוצר מילים שימושי", "Você está jogando com 20 questões grátis de 3.000 —": "אתה משחק עם 20 שאלות חינמיות מתוך 3,000 —", "Você manteve o alemão em movimento.": "שמרת על הגרמנית בתנועה.", "Você também pode responder falando": "אתה יכול גם לענות בעל פה", "XP ganho:": "XP שנצבר:", "XP total": "XP סה\"כ", "ativo": "פעיל", "cancele quando quiser": "בטל מתי שתרצה", "desbloquear todas": "פתח את הכל", "dias ativos": "ימים פעילים", "dias seguidos": "ימים ברצף", "em breve": "בקרוב", "experimentar agora": "נסה עכשיו", "expressão": "ביטוי", "frases conjugadas": "משפטים מנוקדים", "frases disponiveis": "משפטים זמינים", "frases profissionais": "משפטים מקצועיים", "missões": "משימות", "mínimo sugerido": "מינימום מומלץ", "palavra": "מילה", "palavras": "מילים", "para sempre · sem cartão": "לנצח · ללא כרטיס", "planos": "תוכניות", "prova oficial": "מבחן רשמי", "questões": "שאלות", "resultado(s)": "תוצאות", "revisão concluída": "סקירה הושלמה", "seu saldo em créditos": "יתרת הזיכויים שלך", "teste seus reflexos": "בדוק את הרפלקסים שלך", "verbo": "פועל", "Áudio de alta qualidade em todo o conteúdo": "אודיו באיכות גבוהה בכל התכנים", "← Voltar para Cursos": "← חזרה לקורסים", "← Voltar para Música": "← חזרה למוזיקה", "← Voltar para categorias": "← חזרה לקטגוריות", "⏯️ Pausar": "⏯️ השהה", "⏹ Parar gravacao": "⏹ עצור הקלטה", "① Manda seu link": "① שלח את הקישור שלך", "② Seu amigo assina um plano": "② החבר שלך נרשם לתוכנית", "③ Você ganha 20% em créditos, direto na sua carteira": "③ אתה מקבל 20% בזיכויים, ישירות לארנק שלך", "▶ Frase": "▶ משפט", "▶ JOGAR": "▶ לשחק", "▶ Ouvir podcast completo": "▶ להאזין לפודקאסט המלא", "▶ Palavra": "▶ מילה", "▶ Plural": "▶ רבים", "▶ Proxima": "▶ הבא", "▶️ Continuar": "▶️ להמשיך", "☀️ Hoje": "☀️ היום", "⚡ Quiz Rápido": "⚡ חידון מהיר", "✅ Concluído": "✅ הושלם", "✅ Conferir resposta": "✅ לבדוק את התשובה", "✅ Correto!": "✅ נכון!", "✅ Enviar": "✅ שלח", "✅ Verificar": "✅ בדוק", "✍️ Escrita": "✍️ כתיבה", "✏️ Anotar": "✏️ רשום", "✏️ Editar": "✏️ ערוך", "✓ Respondida": "✓ נענה", "❌ Tente de novo": "❌ נסה שוב", "⬅ Escolher Nível": "⬅ בחר רמה", "⬅ Voltar": "⬅ חזור", "🎉 Parabéns!": "🎉 מזל טוב!", "🎉 Você passaria!": "🎉 היית עובר!", "🎉 Você subiu para o nível": "🎉 עלית לרמה", "🎙️ Minhas Gravacoes": "🎙️ ההקלטות שלי", "🎤 Falar em alemão": "🎤 לדבר בגרמנית", "🎤 Gravar minha pronuncia": "🎤 להקליט את ההגייה שלי", "🎤 Letras": "🎤 מילים", "🎤 Ouvindo...": "🎤 מאזין...", "🎤 Pronuncia": "🎤 הגייה", "🎤 Tentar de novo": "🎤 לנסות שוב", "🎧 Ouvir áudio": "🎧 להאזין לאודיו", "🎧 Sua gravacao:": "🎧 ההקלטה שלך:", "🎲 Aleatorio": "🎲 אקראי", "🎵 Música ambiente para focar": "🎵 מוזיקת רקע להתרכז", "🎵 Músicas": "🎵 שירים", "🏆 Recorde:": "🏆 שיא:", "🐍 Caçando Vocabulário": "🐍 ציד אוצר מילים", "💬 Frases": "💬 ביטויים", "💼 Profissões": "💼 מקצועות", "💾 Salvar": "💾 שמור", "📅 Qualquer data": "📅 תאריך כלשהו", "📅 Tudo": "📅 הכל", "📆 7 dias": "📆 7 ימים", "📋 Finalizar Prova": "📋 סיים את המבחן", "📖 Gramática": "📖 דקדוק", "📚 Continue estudando!": "📚 המשך ללמוד!", "📚 Foco": "📚 מיקוד", "📚 Vocabulário em Alemão": "📚 אוצר מילים בגרמנית", "📝 Caderno de Estudos": "📝 מחברת לימודים", "📝 Modelo:": "📝 תבנית:", "📝 Simulados Goethe-Zertifikat": "📝 מבחני הדמיה ל-Goethe-Zertifikat", "🔄 Nova Prova": "🔄 מבחן חדש", "🔄 Novo Quiz": "🔄 חידון חדש", "🔊 Ouvir": "🔊 האזנה", "🔊 Ouvir original": "🔊 האזנה למקור", "🔍 Buscar em todas as categorias...": "🔍 חפש בכל הקטגוריות...", "🔍 Buscar nesta categoria...": "🔍 חפש בקטגוריה זו...", "🔎 Escolher uma data...": "🔎 בחר תאריך...", "🔤 Palavras": "🔤 מילים", "🔤 Verbos": "🔤 פעלים", "🔥 Melhor sequência:": "🔥 הרצף הטוב ביותר:", "🗑️ Descartar": "🗑️ הסר", "🗓️ 30 dias": "🗓️ 30 ימים", "🗣️ Expressões & Gírias": "🗣️ ביטויים וסלנג", "🗣️ Gírias": "🗣️ סלנג", "🗣️ Você disse:": "🗣️ אמרת:"},
  hi: {"+1.500 expressões coloquiais do alemão real": "+1,500 वास्तविक जीवन में प्रयुक्त जर्मन बोलचाल के मुहावरे", "1.225 diálogos + 1.315 verbos conjugados": "1,225 संवाद + 1,315 क्रियाओं के रूप", "1.509 gírias e 1.200 frases de profissões": "1,509 स्लैंग शब्द और 1,200 पेशों से संबंधित वाक्यांश", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "2,500 रोजमर्रा के शब्द, 25 श्रेणियों में व्यवस्थित — बहुवचन और ऑडियो प्रारूप में उदाहरण वाक्यों के साथ।", "20 conteúdos de cada categoria": "प्रत्येक श्रेणी में 20 आइटम", "3.000 questões de quiz + simulados Goethe": "3,000 क्विज़ प्रश्न + गोएथे मॉक परीक्षाएँ", "A cobra bateu nela mesma!": "सांप ने खुद को काट लिया!", "A transcrição usa o recurso de voz do navegador": "ट्रांसक्रिप्ट ब्राउज़र की वॉयस सुविधा का उपयोग करता है", "A → Z": "A → Z", "Abrindo...": "लोड हो रहा है...", "Ainda tem mais": "को फॉलो करें। और भी बहुत कुछ", "Altere o idioma da interface do app.": "ऐप इंटरफ़ेस की भाषा बदलें।", "Ambiente de estudo": "अध्ययन वातावरण", "Analisar resposta": "उत्तर का विश्लेषण करें", "Anotações:": "नोट्स:", "Análises disponíveis hoje": "आज उपलब्ध विश्लेषण", "Aprenda alemão com letras traduzidas, linha por linha.": "अनुवादित बोलियों के साथ, पंक्ति-दर-पंक्ति जर्मन सीखें।", "Assinatura": "सब्सक्राइब करें", "Avançado": "उन्नत", "Biblioteca completa (63.000 itens)": "पूरी लाइब्रेरी (63,000 आइटम)", "Biblioteca completa liberada": "पूरी लाइब्रेरी अनलॉक", "Boa noite! 👋": "शुभ संध्या! 👋", "Boa tarde! 👋": "शुभ अपराह्न! 👋", "Bom dia! 👋": "शुभ प्रभात! 👋", "Básico": "बुनियादी", "Cancelar": "रद्द करें", "Carregando quizzes...": "प्रश्नोत्तरी लोड हो रही हैं...", "Carregando seu progresso": "आपकी प्रगति लोड हो रही है", "Carregando...": "लोड हो रहा है...", "Chame seus amigos pra aprender alemão 🇩🇪": "अपने दोस्तों को जर्मन सीखने के लिए आमंत्रित करें 🇩🇪", "Clique no player para ajustar volume": "वॉल्यूम समायोजित करने के लिए प्लेयर पर क्लिक करें", "Clique para ouvir": "सुनने के लिए क्लिक करें", "Clique para ver traducao": "अनुवाद देखने के लिए क्लिक करें", "Começar": "शुरू करें", "Começar do zero": "शून्य से शुरू करें", "Complete": "पूरा करें", "Concluídos": "पूरा हुआ", "Conectores": "कनेक्टर्स", "Conjugação": "संयोग", "Conta": "खाता", "Conteúdo": "सामग्री", "Conteúdo deste nível chegando em breve": "इस स्तर के लिए सामग्री जल्द ही आ रही है", "Conteúdo ▾": "सामग्री ▾", "Continuar": "जारी रखें", "Conversar no dia a dia": "दैनिक बातचीत", "Conversas sobre assuntos conhecidos": "परिचित विषयों पर बातचीत", "Copiado!": "कॉपी हो गया!", "Criar conta pra não perder seu progresso": "एक खाता बनाएँ ताकि आप अपनी प्रगति न खोएँ", "Cursos": "पाठ्यक्रम", "Desbloquear tudo": "सब कुछ अनलॉक करें", "Descartar e regravar": "हटाएँ और फिर से रिकॉर्ड करें", "Descubra em dois minutos um bom ponto de partida": "दो मिनट में एक अच्छी शुरुआत खोजें", "Dicas de gramática": "व्याकरण टिप्स", "Digite a frase em alemao aqui...": "अपना जर्मन वाक्य यहाँ टाइप करें...", "E-mail": "ईमेल", "Em breve!": "जल्द ही आ रहा है!", "Encerrar e salvar XP": "XP को बंद करें और सहेजें", "Encontre em alemão:": "इसे जर्मन में खोजें:", "Entrando, seu limite fica protegido": "जब आप लॉग इन करते हैं, तो आपकी सीमा सुरक्षित रहती है", "Escolha a resposta correta": "सही उत्तर चुनें", "Escolha seu nível": "अपना स्तर चुनें", "Escolha seu plano": "अपनी योजना चुनें", "Escolha um nível para ver diálogos e verbos.": "संवाद और क्रियाएँ देखने के लिए एक स्तर चुनें", "Escolha uma alternativa": "एक विकल्प चुनें", "Escreva em alemão...": "जर्मन में लिखें...", "Escrita": "लेखन", "Estatísticas": "सांख्यिकी", "Este teste é uma orientação de estudo": "यह परीक्षण एक अध्ययन मार्गदर्शिका है", "Estrutura sugerida": "सुझाया गया ढांचा", "Estudar": "अध्ययन", "Estude mais um pouco!": "थोड़ा और अध्ययन करें!", "Excluir todas": "सब साफ़ करें", "Exemplo": "उदाहरण", "Explorar livremente": "स्वतंत्र रूप से अन्वेषण करें", "Fale, pense e construa em alemão": "जर्मन में बोलें, सोचें और वाक्य बनाएं", "Faltam": "गायब", "Fazer outra": "एक और आज़माएं", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "ब्राउज़िंग जारी रखने के लिए स्वतंत्र महसूस करें। यदि आप एक साथ सब कुछ अनलॉक करना चाहते हैं, तो प्रीमियम पूरी लाइब्रेरी को अनलॉक कर देता है — और आप बिना कुछ भी चूकें वहीं बने रहेंगे।", "Finalizar mesmo assim?": "अभी भी खत्म करना चाहते हैं?", "Foco": "ध्यान केंद्रित करें", "Frase curta": "छोटा वाक्यांश", "Frases": "वाक्यांश", "Gabarito:": "उत्तर कुंजी:", "Gerenciar assinatura": "सदस्यता प्रबंधित करें", "Gravar resposta": "उत्तर रिकॉर्ड करें", "Gravações salvas neste aparelho": "इस डिवाइस पर रिकॉर्डिंग सहेजी गई हैं", "Grátis": "मुफ्त", "Idioma": "भाषा", "Incrível! Alemão afiado!": "अद्भुत! आपकी जर्मन भाषा एकदम सटीक है!", "Indique e ganhe": "दोस्त को रेफर करें और कमाएँ", "Iniciante": "शुरुआती", "Intermediário": "मध्यवर्ती", "Investimento": "निवेश", "JOGAR": "चलाएँ", "Já concluído": "पहले ही पूरा हो चुका है", "Letra": "बोलियाँ", "Mais popular · economize 17%": "सबसे लोकप्रिय · 17% बचाएँ", "Marcar como concluída": "पूरा हुआ चिह्नित करें", "Marcar como concluído": "पूरा हुआ चिह्नित करें", "Marcar como estudado": "पढ़ा हुआ चिह्नित करें", "Mestre": "मास्टर", "Meta desta semana": "इस सप्ताह का लक्ष्य", "Meu perfil": "मेरा प्रोफ़ाइल", "Misturado": "मिश्रित", "Montando sua sessão": "अपना सत्र सेट कर रहे हैं", "Montando sua sessão com dados reais...": "वास्तविक डेटा के साथ अपना सत्र सेट कर रहे हैं...", "Muito bem! Resposta correta.": "बहुत बढ़िया! सही उत्तर।", "Muito bom!": "बहुत अच्छा!", "Música": "संगीत", "Música ambiente para focar": "ध्यान केंद्रित करने में मदद के लिए पृष्ठभूमि संगीत", "Música não encontrada.": "संगीत नहीं मिला।", "Nenhum item.": "कोई आइटम नहीं।", "Nenhuma encontrada.": "कुछ भी नहीं मिला।", "Nenhuma gravacao ainda": "अभी तक कोई रिकॉर्डिंग नहीं", "Nome": "नाम", "Nome atualizado!": "नाम अपडेट किया गया!", "Não conseguimos montar a sessão agora": "हम अभी सत्र स्थापित नहीं कर सके", "Não deu pra abrir agora": "इसे अभी खोल नहीं सके", "Não deu pra gerar o link agora": "लिंक अभी उत्पन्न नहीं हो सका", "Não foi possível atualizar": "अपडेट नहीं कर सके", "Nível": "स्तर", "Nível (A1→C2)": "स्तर (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "आपका क्रेडिट आपके वॉलेट में आपके मित्र द्वारा भुगतान करने के 7 दिन बाद जुड़ जाता है (यह उनकी मनी-बैक गारंटी है; यदि वे इस अवधि के भीतर रद्द करते हैं, तो क्रेडिट उत्पन्न नहीं होता)। अपने बैलेंस का उपयोग करने के लिए, बस", "O que significa": "पर कॉल करें। इसका क्या मतलब है?", "O áudio fica só neste aparelho": "ऑडियो केवल इस डिवाइस पर संग्रहीत है", "Oferta de fundador · vagas limitadas": "संस्थापक की पेशकश · सीमित स्थान", "Os quizzes ainda não terminaram de carregar": "क्विज़ अभी तक लोड नहीं हुए हैं", "Outra pergunta": "एक और प्रश्न", "Outros": "अन्य", "Ouvir exemplo": "एक उदाहरण सुनें", "Pagamento confirmado": "भुगतान की पुष्टि हुई", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "भुगतान Stripe के माध्यम से सुरक्षित रूप से संसाधित किया गया · 7-दिन की गारंटी: यदि आप संतुष्ट नहीं हैं, तो हम आपको रिफंड देंगे।", "Palavras e frases bem simples": "बहुत सरल शब्द और वाक्यांश", "Parar": "रुकें", "Pelos direitos autorais": "कॉपीराइट", "Pergunta": "प्रश्न", "Permita o microfone!": "अपना माइक्रोफ़ोन चालू करें!", "Plano grátis": "मुफ्त योजना", "Planos": "योजनाएँ", "Plural:": "बहुवचन:", "Podcast não encontrado.": "पॉडकास्ट नहीं मिला।", "Pontos:": "अंक:", "Pontuação final:": "अंतिम स्कोर:", "Pratique alemão em contexto": "संदर्भ में जर्मन का अभ्यास करें", "Pratique com questões no estilo do exame oficial": "आधिकारिक परीक्षा की शैली में प्रश्नों के साथ अभ्यास करें", "Prefiro explorar livremente": "मैं स्वतंत्र रूप से अन्वेषण करना पसंद करूँगा", "Premium Anual": "वार्षिक प्रीमियम", "Premium Mensal": "मासिक प्रीमियम", "Premium Vitalício (Fundador)": "आजीवन प्रीमियम (संस्थापक)", "Preparar uma prova Goethe": "गोएथे परीक्षा की तैयारी", "Proficiente": "प्रवीण", "Progresso sincronizado na nuvem": "प्रगति क्लाउड से सिंक", "Pronome": "सर्वनाम", "Pronuncia:": "उच्चारण:", "Próxima rodada": "अगला दौर", "Qual frase está gramaticalmente correta": "कौन सा वाक्य व्याकरण की दृष्टि से सही है?", "Qual resposta parece mais natural": "कौन सा उत्तर सबसे स्वाभाविक लगता है?", "Qual é o seu principal objetivo com o alemão": "जर्मन के साथ आपका मुख्य लक्ष्य क्या है?", "Quanto você já consegue compreender": "आप पहले से कितना समझ सकते हैं?", "Quase nada ainda": "अभी तक लगभग कुछ भी नहीं", "Quase! Veja a resposta correta.": "लगभग! सही उत्तर देखें।", "Quiz curto": "छोटा क्विज़", "Quiz de nivelamento": "प्लेसमेंट क्विज़", "Quiz relâmpago": "लाइटनिंग क्विज़", "Remover?": "हटाएँ?", "Responda situações reais": "वास्तविक जीवन की स्थितियों का उत्तर दें", "Rodada": "राउंड", "Rádio lo-fi e Pomodoro": "लो-फाई रेडियो और पोमोडोरो", "Sair da conta": "लॉग आउट", "Salvar": "सहेजें", "Salvar gravação": "रिकॉर्डिंग सहेजें", "Salve frases clicando 💛!": "वाक्यांशों को 💛 पर क्लिक करके सहेजें!", "Selecionar Idioma": "भाषा चुनें", "Sem plural (substantivo abstrato)": "बहुवचन नहीं (अमूर्त संज्ञा)", "Sem título": "शीर्षक रहित", "Sessão concluída": "सत्र पूरा हुआ", "Sessão rápida": "त्वरित सत्र", "Seu link de indicação": "आपका रेफ़रल लिंक", "Seu pagamento está sendo confirmado": "आपका भुगतान पुष्टि किया जा रहा है", "Seu plano de jornada": "आपकी सीखने की योजना", "Seu primeiro caminho, sem pressão": "आपका पहला कदम, कोई दबाव नहीं", "Seus atalhos, anotações e revisões.": "आपके शॉर्टकट, नोट्स और संशोधन।", "Simulados Goethe": "Goethe अभ्यास परीक्षण", "Simulados Goethe completos": "पूर्ण Goethe अभ्यास परीक्षण", "Simulados Goethe-Zertifikat": "Goethe-Zertifikat अभ्यास परीक्षण", "Sistema de XP e níveis": "XP और स्तर प्रणाली", "Streak": "स्ट्रीक", "Sua resposta:": "आपका उत्तर:", "Talvez você goste de começar pelo": "आप", "Tempo esgotado!": "से शुरू करना चाह सकते हैं समय समाप्त!", "Tenta atualizar a página": "पृष्ठ को रिफ्रेश करने का प्रयास करें", "Tentar novamente": "फिर से प्रयास करें", "Teste de Criatividade": "रचनात्मकता परीक्षण", "Teste o que ficou na memória": "आपने जो याद रखा है उसका परीक्षण करें", "Teste rápido": "त्वरित परीक्षण", "Teste seus reflexos no alemão": "जर्मन में अपनी प्रतिक्रियाओं का परीक्षण करें", "Textos e conversas mais complexos": "अधिक जटिल पाठ और संवाद", "Todos": "सभी", "Todos os 63.000 itens liberados": "सभी 63,000 जारी किए गए आइटम", "Trabalhar ou fazer entrevistas": "काम करें या साक्षात्कार करें", "Treinar": "अभ्यास करें", "Trocar ambiente": "वातावरण बदलें", "Trocar idioma": "भाषा बदलें", "Um diálogo": "एक संवाद", "Um verbo em foco": "एक क्रिया पर ध्यान केंद्रित", "Uma prática curta para avançar": "आपकी प्रगति में मदद के लिए एक छोटी अभ्यास", "Uma sugestão, não um rótulo": "एक सुझाव, लेबल नहीं", "Usar esta recomendação": "इस सिफारिश का उपयोग करें", "Usar grátis": "मुफ्त में उपयोग करें", "Use Chrome para reconhecimento de voz.": "स्पीच रिकग्निशन के लिए Chrome का उपयोग करें।", "Use as setas do teclado": "एरो कीज़ का उपयोग करें", "Veja exemplos e conjugação": "उदाहरण और रूप-परिवर्तन देखें", "Ver planos": "प्लान देखें", "Ver progresso completo": "पूरी प्रगति देखें", "Verbo em foco": "फोकस में क्रिया", "Verbo não encontrado.": "क्रिया नहीं मिली।", "Verificando...": "जाँच कर रहा है...", "Verifique sua conexão e tente novamente": "अपना कनेक्शन जाँचें और फिर से प्रयास करें", "Vocabulario": "शब्दावली", "Vocabulário": "शब्दावली", "Vocabulário útil": "उपयोगी शब्दावली", "Você está jogando com 20 questões grátis de 3.000 —": "आप 3,000 में से 20 मुफ्त प्रश्नों के साथ खेल रहे हैं —", "Você manteve o alemão em movimento.": "आपने अपनी जर्मन भाषा की क्षमता को तीक्ष्ण बनाए रखा है।", "Você também pode responder falando": "आप बोलकर भी उत्तर दे सकते हैं", "XP ganho:": "अर्जित XP:", "XP total": "कुल XP", "ativo": "सक्रिय", "cancele quando quiser": "जब चाहें रद्द करें", "desbloquear todas": "सभी अनलॉक करें", "dias ativos": "सक्रिय दिन", "dias seguidos": "लगातार दिन", "em breve": "जल्द ही आ रहा है", "experimentar agora": "अभी आजमाएं", "expressão": "अभिव्यक्ति", "frases conjugadas": "संयुग्मित वाक्यांश", "frases disponiveis": "उपलब्ध वाक्यांश", "frases profissionais": "पेशेवर वाक्यांश", "missões": "मिशन", "mínimo sugerido": "सुझाया गया न्यूनतम", "palavra": "शब्द", "palavras": "शब्द", "para sempre · sem cartão": "हमेशा के लिए · नो कार्ड", "planos": "योजनाएँ", "prova oficial": "आधिकारिक परीक्षा", "questões": "प्रश्न", "resultado(s)": "परिणाम(एँ)", "revisão concluída": "संशोधन पूरा हुआ", "seu saldo em créditos": "आपका क्रेडिट बैलेंस", "teste seus reflexos": "अपने रिफ्लेक्स का परीक्षण करें", "verbo": "क्रिया", "Áudio de alta qualidade em todo o conteúdo": "सभी सामग्री में उच्च-गुणवत्ता वाला ऑडियो", "← Voltar para Cursos": "← पाठ्यक्रमों पर वापस जाएँ", "← Voltar para Música": "← संगीत पर वापस जाएँ", "← Voltar para categorias": "← श्रेणियों पर वापस जाएँ", "⏯️ Pausar": "⏯️ पॉज़ करें", "⏹ Parar gravacao": "⏹ रिकॉर्डिंग रोकें", "① Manda seu link": "① अपना लिंक भेजें", "② Seu amigo assina um plano": "② आपका मित्र एक योजना के लिए साइन अप करता है", "③ Você ganha 20% em créditos, direto na sua carteira": "③ आप 20% क्रेडिट कमाते हैं, सीधे अपने वॉलेट में", "▶ Frase": "▶ वाक्यांश", "▶ JOGAR": "▶ प्ले", "▶ Ouvir podcast completo": "▶ पूरा पॉडकास्ट सुनें", "▶ Palavra": "▶ शब्द", "▶ Plural": "▶ बहुवचन", "▶ Proxima": "▶ अगला", "▶️ Continuar": "▶️ जारी रखें", "☀️ Hoje": "☀️ आज", "⚡ Quiz Rápido": "⚡ त्वरित प्रश्नोत्तरी", "✅ Concluído": "✅ पूरा हुआ", "✅ Conferir resposta": "✅ अपना उत्तर जांचें", "✅ Correto!": "✅ सही!", "✅ Enviar": "✅ भेजें", "✅ Verificar": "✅ जांचें", "✍️ Escrita": "✍️ लिखें", "✏️ Anotar": "✏️ नोट करें", "✏️ Editar": "✏️ संपादित करें", "✓ Respondida": "✓ उत्तर दिया", "❌ Tente de novo": "❌ फिर से प्रयास करें", "⬅ Escolher Nível": "⬅ स्तर चुनें", "⬅ Voltar": "⬅ वापस", "🎉 Parabéns!": "🎉 बहुत बढ़िया!", "🎉 Você passaria!": "🎉 आप पास हो गए!", "🎉 Você subiu para o nível": "🎉 आप अगले स्तर पर पहुँच गए हैं", "🎙️ Minhas Gravacoes": "🎙️ मेरी रिकॉर्डिंग्स", "🎤 Falar em alemão": "🎤 जर्मन बोलें", "🎤 Gravar minha pronuncia": "🎤 मेरा उच्चारण रिकॉर्ड करें", "🎤 Letras": "🎤 गीत के बोल", "🎤 Ouvindo...": "🎤 सुनना...", "🎤 Pronuncia": "🎤 उच्चारण", "🎤 Tentar de novo": "🎤 फिर से प्रयास करें", "🎧 Ouvir áudio": "🎧 ऑडियो सुनें", "🎧 Sua gravacao:": "🎧 आपकी रिकॉर्डिंग:", "🎲 Aleatorio": "🎲 यादृच्छिक", "🎵 Música ambiente para focar": "🎵 ध्यान केंद्रित करने में मदद के लिए पृष्ठभूमि संगीत", "🎵 Músicas": "🎵 गीत", "🏆 Recorde:": "🏆 रिकॉर्ड:", "🐍 Caçando Vocabulário": "🐍 शब्दावली शिकार", "💬 Frases": "💬 वाक्यांश", "💼 Profissões": "💼 व्यवसाय", "💾 Salvar": "💾 सहेजें", "📅 Qualquer data": "📅 कोई तारीख", "📅 Tudo": "📅 सभी", "📆 7 dias": "📆 7 दिन", "📋 Finalizar Prova": "📋 क्विज़ पूरा करें", "📖 Gramática": "📖 व्याकरण", "📚 Continue estudando!": "📚 पढ़ते रहें!", "📚 Foco": "📚 ध्यान", "📚 Vocabulário em Alemão": "📚 जर्मन शब्दावली", "📝 Caderno de Estudos": "📝 अध्ययन नोटबुक", "📝 Modelo:": "📝 टेम्पलेट:", "📝 Simulados Goethe-Zertifikat": "📝 गोएथे-ज़र्टिफ़िकेट अभ्यास परीक्षण", "🔄 Nova Prova": "🔄 नया परीक्षण", "🔄 Novo Quiz": "🔄 नया क्विज़", "🔊 Ouvir": "🔊 सुनें", "🔊 Ouvir original": "🔊 मूल सुनें", "🔍 Buscar em todas as categorias...": "🔍 सभी श्रेणियों में खोजें...", "🔍 Buscar nesta categoria...": "🔍 इस श्रेणी में खोजें...", "🔎 Escolher uma data...": "🔎 एक तारीख चुनें...", "🔤 Palavras": "🔤 संज्ञाएँ", "🔤 Verbos": "🔤 क्रियाएँ", "🔥 Melhor sequência:": "🔥 सर्वश्रेष्ठ अनुक्रम:", "🗑️ Descartar": "🗑️ साफ़ करें", "🗓️ 30 dias": "🗓️ 30 दिन", "🗣️ Expressões & Gírias": "🗣️ वाक्यांश और स्लैंग", "🗣️ Gírias": "🗣️ स्लैंग", "🗣️ Você disse:": "🗣️ आपने कहा:"},
  pl: {"+1.500 expressões coloquiais do alemão real": "+1 500 potocznych wyrażeń z prawdziwego języka niemieckiego", "1.225 diálogos + 1.315 verbos conjugados": "1 225 dialogów + 1 315 koniugowanych czasowników", "1.509 gírias e 1.200 frases de profissões": "1 509 slangowych zwrotów i 1 200 zwrotów związanych z zawodami", "2.500 palavras do dia a dia, organizadas em 25 categorias — com plural e frase de exemplo em áudio.": "2 500 słów z życia codziennego, podzielonych na 25 kategorii — wraz z liczbą mnogą i przykładowym zdaniem w wersji audio.", "20 conteúdos de cada categoria": "20 treści z każdej kategorii", "3.000 questões de quiz + simulados Goethe": "3 000 pytań quizowych + testy próbne Goethe", "A cobra bateu nela mesma!": "Wąż ugryzł sam siebie!", "A transcrição usa o recurso de voz do navegador": "Transkrypcja wykorzystuje funkcję rozpoznawania głosu przeglądarki", "A → Z": "A → Z", "Abrindo...": "Otwieranie...", "Acompanhar": "Śledź", "Ainda tem mais": "To jeszcze nie wszystko", "Altere o idioma da interface do app.": "Zmień język interfejsu aplikacji.", "Ambiente de estudo": "Środowisko nauki", "Analisar resposta": "Analiza odpowiedzi", "Anotações:": "Notatki:", "Análises disponíveis hoje": "Analizy dostępne dzisiaj", "Aprenda alemão com letras traduzidas, linha por linha.": "Ucz się niemieckiego z przetłumaczonymi tekstami, wiersz po wierszu.", "Assinatura": "Subskrypcja", "Avançado": "Poziom zaawansowany", "Biblioteca completa (63.000 itens)": "Pełna biblioteka (63 000 pozycji)", "Biblioteca completa liberada": "Pełna biblioteka udostępniona bezpłatnie", "Boa noite! 👋": "Dobranoc! 👋", "Boa tarde! 👋": "Dzień dobry! 👋", "Bom dia! 👋": "Dzień dobry! 👋", "Básico": "Poziom podstawowy", "Cancelar": "Anuluj", "Carregando quizzes...": "Ładowanie quizów...", "Carregando seu progresso": "Ładowanie Twoich postępów", "Carregando...": "Ładowanie...", "Chame seus amigos pra aprender alemão 🇩🇪": "Zaproś znajomych do nauki niemieckiego 🇩🇪", "Clique no player para ajustar volume": "Kliknij odtwarzacz, aby wyregulować głośność", "Clique para ouvir": "Kliknij, aby odsłuchać", "Clique para ver traducao": "Kliknij, aby wyświetlić tłumaczenie", "Começar": "Rozpocznij", "Começar do zero": "Zacznij od zera", "Complete": "Ukończ", "Concluídos": "Ukończone", "Conectores": "Spójniki", "Conjugação": "Koniugacja", "Conta": "Konto", "Conteúdo": "Treści", "Conteúdo deste nível chegando em breve": "Treści z tego poziomu wkrótce", "Conteúdo ▾": "Treści ▾", "Continuar": "Kontynuuj", "Conversar no dia a dia": "Codzienne rozmowy", "Conversas sobre assuntos conhecidos": "Rozmowy na znane tematy", "Copiado!": "Skopiowano!", "Copiar": "Skopiuj", "Criar conta pra não perder seu progresso": "Utwórz konto, aby nie stracić postępów", "Cursos": "Kursy", "Desbloquear tudo": "Odblokuj wszystko", "Descartar e regravar": "Usuń i nagraj ponownie", "Descubra em dois minutos um bom ponto de partida": "Odkryj w dwie minuty dobry punkt wyjścia", "Dicas de gramática": "Wskazówki gramatyczne", "Digite a frase em alemao aqui...": "Wpisz tutaj zdanie po niemiecku...", "E-mail": "E-mail", "Em breve!": "Już wkrótce!", "Encerrar e salvar XP": "Zamknij i zapisz XP", "Encontre em alemão:": "Znajdź po niemiecku:", "Entrando, seu limite fica protegido": "Po zalogowaniu się Twoje limity są chronione", "Escolha a resposta correta": "Wybierz prawidłową odpowiedź", "Escolha seu nível": "Wybierz swój poziom", "Escolha seu plano": "Wybierz swój plan", "Escolha um nível para ver diálogos e verbos.": "Wybierz poziom, aby zobaczyć dialogi i czasowniki.", "Escolha uma alternativa": "Wybierz jedną z opcji", "Escreva em alemão...": "Napisz po niemiecku...", "Escrita": "Pisanie", "Estatísticas": "Statystyki", "Este teste é uma orientação de estudo": "Ten test ma charakter orientacyjny", "Estrutura sugerida": "Sugerowana struktura", "Estudar": "Ucz się", "Estude mais um pouco!": "Ucz się jeszcze trochę!", "Excluir todas": "Usuń wszystko", "Exemplo": "Przykład", "Explorar livremente": "Swobodne odkrywanie", "Fale, pense e construa em alemão": "Mów, myśl i twórz po niemiecku", "Faltam": "Brakuje", "Fazer outra": "Zrób jeszcze jedno", "Fica à vontade pra continuar navegando. Quando quiser abrir tudo de uma vez, o Premium libera a biblioteca inteira — e você continua no mesmo lugar, sem perder nada.": "Możesz swobodnie kontynuować przeglądanie. Jeśli chcesz odblokować wszystko naraz, subskrypcja Premium udostępnia całą bibliotekę — a Ty pozostajesz w tym samym miejscu, niczego nie tracąc.", "Finalizar mesmo assim?": "Czy na pewno chcesz zakończyć?", "Foco": "Skupienie", "Frase curta": "Krótkie zdanie", "Frases": "Zdania", "Gabarito:": "Klucz odpowiedzi:", "Gerenciar assinatura": "Zarządzaj subskrypcją", "Gravar resposta": "Nagraj odpowiedź", "Gravações salvas neste aparelho": "Nagrania zapisane na tym urządzeniu", "Grátis": "Bezpłatnie", "Idioma": "Język", "Incrível! Alemão afiado!": "Niesamowite! Doskonały niemiecki!", "Indique e ganhe": "Poleć i wygraj", "Iniciante": "Początkujący", "Intermediário": "Poziom średniozaawansowany", "Investimento": "Inwestycja", "JOGAR": "ZAGRAJ", "Já concluído": "Już ukończone", "Letra": "Tekst piosenki", "Mais popular · economize 17%": "Najpopularniejsze · zaoszczędź 17%", "Marcar como concluída": "Oznacz jako ukończone", "Marcar como concluído": "Oznacz jako ukończone", "Marcar como estudado": "Oznacz jako przerobione", "Mestre": "Mistrz", "Meta desta semana": "Cel na ten tydzień", "Meu perfil": "Mój profil", "Misturado": "Mieszane", "Montando sua sessão": "Tworzenie sesji", "Montando sua sessão com dados reais...": "Tworzenie sesji z prawdziwymi danymi...", "Muito bem! Resposta correta.": "Świetnie! Prawidłowa odpowiedź.", "Muito bom!": "Bardzo dobrze!", "Música": "Muzyka", "Música ambiente para focar": "Muzyka w tle sprzyjająca skupieniu", "Música não encontrada.": "Nie znaleziono utworu.", "Nenhum item.": "Brak pozycji.", "Nenhuma encontrada.": "Nie znaleziono żadnych.", "Nenhuma gravacao ainda": "Jeszcze żadnych nagrań", "Nome": "Imię i nazwisko", "Nome atualizado!": "Imię i nazwisko zaktualizowane!", "Não conseguimos montar a sessão agora": "Nie udało się teraz utworzyć sesji", "Não deu pra abrir agora": "Nie udało się teraz otworzyć", "Não deu pra gerar o link agora": "Nie udało się teraz wygenerować linku", "Não foi possível atualizar": "Nie udało się zaktualizować", "Nível": "Poziom", "Nível (A1→C2)": "Poziom (A1→C2)", "O crédito cai na sua carteira 7 dias depois que seu amigo pagar (é a garantia de reembolso dele, se ele desistir dentro desse prazo o crédito não é gerado). Pra usar seu saldo, é só chamar no": "Środki pojawią się na Twoim koncie 7 dni po dokonaniu płatności przez Twojego znajomego (jest to gwarancja zwrotu pieniędzy dla niego; jeśli zrezygnuje w tym terminie, środki nie zostaną przyznane). Aby wykorzystać saldo, wystarczy zadzwonić na numer", "O que significa": "Co to oznacza", "O áudio fica só neste aparelho": "Nagranie audio pozostaje wyłącznie na tym urządzeniu", "Oferta de fundador · vagas limitadas": "Oferta założycielska · ograniczona liczba miejsc", "Os quizzes ainda não terminaram de carregar": "Quizy nie zostały jeszcze w pełni załadowane", "Outra pergunta": "Kolejne pytanie", "Outros": "Inne", "Ouvir exemplo": "Posłuchaj przykładu", "Pagamento confirmado": "Płatność potwierdzona", "Pagamento processado com segurança via Stripe · Garantia de 7 dias: não gostou, devolvemos.": "Płatność przetworzona bezpiecznie przez Stripe · 7-dniowa gwarancja: jeśli nie spodobało się, zwracamy pieniądze.", "Palavras e frases bem simples": "Bardzo proste słowa i zwroty", "Parar": "Zatrzymaj", "Pelos direitos autorais": "Prawa autorskie", "Pergunta": "Pytanie", "Permita o microfone!": "Włącz mikrofon!", "Plano grátis": "Plan bezpłatny", "Planos": "Plany", "Plural:": "Liczba mnoga:", "Podcast não encontrado.": "Nie znaleziono podcastu.", "Pontos:": "Punkty:", "Pontuação final:": "Wynik końcowy:", "Pratique alemão em contexto": "Ćwicz niemiecki w kontekście", "Pratique com questões no estilo do exame oficial": "Ćwicz na pytaniach w stylu oficjalnego egzaminu", "Prefiro explorar livremente": "Wolę swobodnie odkrywać", "Premium Anual": "Roczna subskrypcja Premium", "Premium Mensal": "Miesięczna subskrypcja Premium", "Premium Vitalício (Fundador)": "Dożywotnia subskrypcja Premium (Założyciel)", "Preparar uma prova Goethe": "Przygotuj się do egzaminu Goethe", "Proficiente": "Biegły", "Progresso sincronizado na nuvem": "Postępy synchronizowane w chmurze", "Pronome": "Zaimek", "Pronuncia:": "Wymowa:", "Próxima rodada": "Następna runda", "Qual frase está gramaticalmente correta": "Które zdanie jest poprawne gramatycznie", "Qual resposta parece mais natural": "Która odpowiedź brzmi bardziej naturalnie", "Qual é o seu principal objetivo com o alemão": "Jaki jest Twój główny cel w nauce niemieckiego", "Quanto você já consegue compreender": "Ile już rozumiesz", "Quase nada ainda": "Prawie nic", "Quase! Veja a resposta correta.": "Prawie! Zobacz poprawną odpowiedź.", "Quiz curto": "Krótki quiz", "Quiz de nivelamento": "Quiz poziomujący", "Quiz relâmpago": "Błyskawiczny quiz", "Remover?": "Usunąć?", "Responda situações reais": "Odpowiedz na pytania z życia wzięte", "Rodada": "Runda", "Rádio lo-fi e Pomodoro": "Radio lo-fi i Pomodoro", "Sair da conta": "Wyloguj się", "Salvar": "Zapisz", "Salvar gravação": "Zapisz nagranie", "Salve frases clicando 💛!": "Zapisz zwroty, klikając 💛!", "Selecionar Idioma": "Wybierz język", "Sem plural (substantivo abstrato)": "Bez liczby mnogiej (rzeczownik abstrakcyjny)", "Sem título": "Bez tytułu", "Sessão concluída": "Sesja zakończona", "Sessão rápida": "Szybka sesja", "Seu link de indicação": "Twój link polecający", "Seu pagamento está sendo confirmado": "Twoja płatność jest w trakcie potwierdzania", "Seu plano de jornada": "Twój plan nauki", "Seu primeiro caminho, sem pressão": "Twoja pierwsza ścieżka, bez presji", "Seus atalhos, anotações e revisões.": "Twoje skróty, notatki i powtórki.", "Simulados Goethe": "Testy próbne Goethe", "Simulados Goethe completos": "Kompletne testy próbne Goethe", "Simulados Goethe-Zertifikat": "Testy próbne Goethe-Zertifikat", "Sistema de XP e níveis": "System XP i poziomy", "Streak": "Streak", "Sua resposta:": "Twoja odpowiedź:", "Talvez você goste de começar pelo": "Być może zechcesz zacząć od", "Tempo esgotado!": "Czas się skończył!", "Tenta atualizar a página": "Spróbuj odświeżyć stronę", "Tentar novamente": "Spróbuj ponownie", "Teste de Criatividade": "Test kreatywności", "Teste o que ficou na memória": "Sprawdź, co zapamiętałeś", "Teste rápido": "Szybki test", "Teste seus reflexos no alemão": "Sprawdź swój refleks w języku niemieckim", "Textos e conversas mais complexos": "Bardziej złożone teksty i rozmowy", "Todos": "Wszystkie", "Todos os 63.000 itens liberados": "Wszystkie 63 000 udostępnionych pozycji", "Trabalhar ou fazer entrevistas": "Praca lub rozmowy kwalifikacyjne", "Treinar": "Trening", "Trocar ambiente": "Zmiana otoczenia", "Trocar idioma": "Zmiana języka", "Um diálogo": "Dialog", "Um verbo em foco": "Czasownik w centrum uwagi", "Uma prática curta para avançar": "Krótkie ćwiczenie, by pójść dalej", "Uma sugestão, não um rótulo": "Sugestia, a nie etykietka", "Usar esta recomendação": "Skorzystaj z tej rekomendacji", "Usar grátis": "Korzystaj za darmo", "Use Chrome para reconhecimento de voz.": "Użyj przeglądarki Chrome do rozpoznawania głosu.", "Use as setas do teclado": "Użyj strzałek na klawiaturze", "Veja exemplos e conjugação": "Zobacz przykłady i koniugację", "Ver planos": "Zobacz plany", "Ver progresso completo": "Zobacz pełny postęp", "Verbo em foco": "Czasownik w centrum uwagi", "Verbo não encontrado.": "Nie znaleziono czasownika.", "Verificando...": "Sprawdzanie...", "Verifique sua conexão e tente novamente": "Sprawdź połączenie i spróbuj ponownie", "Vocabulario": "Słownictwo", "Vocabulário": "Słownictwo", "Vocabulário útil": "Przydatne słownictwo", "Você está jogando com 20 questões grátis de 3.000 —": "Rozwiązujesz 20 darmowych pytań z 3 000 —", "Você manteve o alemão em movimento.": "Utrzymałeś swoją znajomość niemieckiego na wysokim poziomie.", "Você também pode responder falando": "Możesz również odpowiadać ustnie", "XP ganho:": "Zdobyte XP:", "XP total": "Łączne XP", "ativo": "aktywne", "cancele quando quiser": "anuluj w dowolnym momencie", "desbloquear todas": "odblokuj wszystkie", "dias ativos": "dni aktywne", "dias seguidos": "dni z rzędu", "em breve": "wkrótce", "experimentar agora": "wypróbuj teraz", "expressão": "wyrażenia", "frases conjugadas": "zdania z koniugacją", "frases disponiveis": "dostępne zdania", "frases profissionais": "zdania profesjonalne", "missões": "misje", "mínimo sugerido": "sugerowane minimum", "palavra": "słowo", "palavras": "słowa", "para sempre · sem cartão": "na zawsze · bez karty", "planos": "plany", "prova oficial": "oficjalny egzamin", "questões": "pytania", "resultado(s)": "wyniki", "revisão concluída": "powtórka zakończona", "seu saldo em créditos": "saldo kredytów", "teste seus reflexos": "sprawdź swój refleks", "verbo": "czasownik", "Áudio de alta qualidade em todo o conteúdo": "Wysokiej jakości dźwięk we wszystkich treściach", "← Voltar para Cursos": "← Powrót do kursów", "← Voltar para Música": "← Powrót do muzyki", "← Voltar para categorias": "← Powrót do kategorii", "⏯️ Pausar": "⏯️ Wstrzymaj", "⏹ Parar gravacao": "⏹ Zatrzymaj nagrywanie", "① Manda seu link": "① Wyślij link", "② Seu amigo assina um plano": "② Twój znajomy wykupi plan", "③ Você ganha 20% em créditos, direto na sua carteira": "③ Otrzymasz 20% kredytów bezpośrednio do portfela", "▶ Frase": "▶ Fraza", "▶ JOGAR": "▶ ZAGRAJ", "▶ Ouvir podcast completo": "▶ Posłuchaj całego podcastu", "▶ Palavra": "▶ Słowo", "▶ Plural": "▶ Liczba mnoga", "▶ Proxima": "▶ Następne", "▶️ Continuar": "▶️ Kontynuuj", "☀️ Hoje": "☀️ Dzisiaj", "⚡ Quiz Rápido": "⚡ Szybki quiz", "✅ Concluído": "✅ Ukończone", "✅ Conferir resposta": "✅ Sprawdź odpowiedź", "✅ Correto!": "✅ Prawidłowo!", "✅ Enviar": "✅ Wyślij", "✅ Verificar": "✅ Sprawdź", "✍️ Escrita": "✍️ Pisanie", "✏️ Anotar": "✏️ Zanotuj", "✏️ Editar": "✏️ Edytuj", "✓ Respondida": "✓ Odpowiedziano", "❌ Tente de novo": "❌ Spróbuj ponownie", "⬅ Escolher Nível": "⬅ Wybierz poziom", "⬅ Voltar": "⬅ Wróć", "🎉 Parabéns!": "🎉 Gratulacje!", "🎉 Você passaria!": "🎉 Zdałbyś!", "🎉 Você subiu para o nível": "🎉 Awansowałeś na poziom", "🎙️ Minhas Gravacoes": "🎙️ Moje nagrania", "🎤 Falar em alemão": "🎤 Mów po niemiecku", "🎤 Gravar minha pronuncia": "🎤 Nagraj moją wymowę", "🎤 Letras": "🎤 Teksty piosenek", "🎤 Ouvindo...": "🎤 Słucham...", "🎤 Pronuncia": "🎤 Wymowa", "🎤 Tentar de novo": "🎤 Spróbuj ponownie", "🎧 Ouvir áudio": "🎧 Odtwórz plik audio", "🎧 Sua gravacao:": "🎧 Twoje nagranie:", "🎲 Aleatorio": "🎲 Losowo", "🎵 Música ambiente para focar": "🎵 Muzyka w tle sprzyjająca koncentracji", "🎵 Músicas": "🎵 Utwory", "🏆 Recorde:": "🏆 Rekord:", "🐍 Caçando Vocabulário": "🐍 Polowanie na słówka", "💬 Frases": "💬 Zwroty", "💼 Profissões": "💼 Zawody", "💾 Salvar": "💾 Zapisz", "📅 Qualquer data": "📅 Dowolna data", "📅 Tudo": "📅 Wszystko", "📆 7 dias": "📆 7 dni", "📋 Finalizar Prova": "📋 Zakończ test", "📖 Gramática": "📖 Gramatyka", "📚 Continue estudando!": "📚 Ucz się dalej!", "📚 Foco": "📚 Skupienie", "📚 Vocabulário em Alemão": "📚 Słownictwo niemieckie", "📝 Caderno de Estudos": "📝 Zeszyt ćwiczeń", "📝 Modelo:": "📝 Szablon:", "📝 Simulados Goethe-Zertifikat": "📝 Testy próbne Goethe-Zertifikat", "🔄 Nova Prova": "🔄 Nowy test", "🔄 Novo Quiz": "🔄 Nowy quiz", "🔊 Ouvir": "🔊 Słuchaj", "🔊 Ouvir original": "🔊 Słuchaj oryginału", "🔍 Buscar em todas as categorias...": "🔍 Szukaj we wszystkich kategoriach...", "🔍 Buscar nesta categoria...": "🔍 Szukaj w tej kategorii...", "🔎 Escolher uma data...": "🔎 Wybierz datę...", "🔤 Palavras": "🔤 Słowa", "🔤 Verbos": "🔤 Czasowniki", "🔥 Melhor sequência:": "🔥 Najlepsza sekwencja:", "🗑️ Descartar": "🗑️ Odrzuć", "🗓️ 30 dias": "🗓️ 30 dni", "🗣️ Expressões & Gírias": "🗣️ Wyrażenia i slang", "🗣️ Gírias": "🗣️ Slang", "🗣️ Você disse:": "🗣️ Powiedziałeś:"},
};
const AFB_LANG_KEY = "afb_language";

const I18n = {
  _current: "pt",
  _listeners: [],
  _contentTranslations: null,
  _translationPromise: null,

  // ── Inicialização ──
  init() {
    const requested = new URLSearchParams(location.search).get("lang");
    // Em localhost, usa português por padrão (geo não funciona sem Netlify
    // Dev), mas aceita ?lang= para testar os idiomas sem gastar deploy.
    const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (isLocal) {
      this._current = requested && AppLanguage[requested] ? requested : "pt";
      document.documentElement.dir = this.getCurrentLang().rtl ? "rtl" : "ltr";
      return;
    }

    const saved = localStorage.getItem(AFB_LANG_KEY);
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
    // Campos estruturais controlam filtros, agrupamentos e arquivos. Eles nao
    // sao texto visivel e precisam continuar identicos em qualquer idioma.
    // Ex.: verbo.html agrupa exemplos por tense="passado|presente|futuro";
    // traduzir esses valores fazia todas as sentencas (e seus audios) sumirem.
    const structuralField = /^(?:id|.*_id|tense|pronoun|code|slug|status|audio_url|audio_path|image_url|image_path|url|href)$/i;
    const visit = (item, key = "") => {
      if (typeof item === "string") return map["" + item.replace(/\s+/g, " ").trim()] || item;
      if (Array.isArray(item)) return item.map(child => visit(child, key));
      if (item && typeof item === "object") {
        Object.keys(item).forEach(childKey => {
          if (!germanField.test(childKey) && !structuralField.test(childKey)) {
            item[childKey] = visit(item[childKey], childKey);
          }
        });
      }
      return item;
    };
    return visit(value);
  },

  async applyPageTranslations(root = document.body) {
    if (this._current === "pt" || !root) return;
    // O mapa de traducao de conteudo pode ter 7-12MB — nunca deixa a pagina
    // inteira invisivel esperando isso baixar. A traducao da INTERFACE (ui/
    // DEEP_TRANSLATIONS/fragments) e local, nao depende de rede — revela a
    // pagina com ela na hora (sem "flash" de portugues, sem espera), e so
    // traduz o CONTEUDO dos cursos (que precisa do arquivo grande) numa
    // segunda passada, por cima, quando ele chegar.
    const contentPromise = this.loadContentTranslations();
    const timeout = new Promise(resolve => setTimeout(() => resolve(this._contentTranslations || {}), 0));
    const map = await Promise.race([contentPromise, timeout]);
    const mapWasIncomplete = map !== this._contentTranslations;
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
    const activeUi = { ...(uiFallbacks[this._current] || {}), ...(DEEP_TRANSLATIONS[this._current] || {}) };
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
      // A primeira passagem acontece antes de o arquivo grande terminar de
      // baixar. Use sempre o mapa mais recente para que o observer criado
      // agora tambem traduza cards e listas renderizados mais tarde.
      const liveMap = this._contentTranslations || map;
      let translated = liveMap[compact] || activeUi[compact];
      if (!translated) {
        // Nao traduza apenas pedacos enquanto o mapa completo ainda carrega.
        // Isso preserva o texto original para que a segunda passagem consiga
        // encontra-lo como chave e aplicar a traducao integral.
        if (!this._contentTranslations) return reformatNumbers(text);
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
    // Revela a página — tradução (pelo menos a da interface) concluída
    document.documentElement.classList.remove('i18n-pending');
    // O mapa de conteudo ainda nao tinha chegado — quando chegar, traduz
    // de novo por cima (o texto ja visivel em portugues vira traduzido).
    if (mapWasIncomplete) {
      // Chama o método de novo, em vez de reutilizar `apply`: ele fecha
      // sobre o mapa vazio da primeira passada. Na segunda, o mapa já está
      // carregado e todo conteúdo pendente recebe sua tradução.
      contentPromise.then(() => {
        if (this._current !== 'pt') this.applyPageTranslations(root);
      });
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
// Se idioma não for PT, esconde a página até traduzir
if (I18n._current !== 'pt') {
  document.documentElement.classList.add('i18n-pending');
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => I18n.applyPageTranslations());
} else {
  I18n.applyPageTranslations();
}
