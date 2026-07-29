(() => {
  const audio = new Audio();
  let speed = 1;
  let queue = [];
  let queueIndex = 0;
  let currentSourceButton = null;

  const dock = document.getElementById("audio-dock");
  const dockToggle = document.getElementById("dock-toggle");
  const dockClose = document.getElementById("dock-close");
  const dockLabel = document.getElementById("dock-label");
  const dockProgress = document.getElementById("dock-progress");
  const dockSpeed = document.getElementById("dock-speed");
  const stage = document.querySelector(".dialogue-stage");
  const activeSpeaker = document.getElementById("active-speaker");
  const activeGerman = document.getElementById("active-german");
  const activeTranslation = document.getElementById("active-portuguese");
  const toast = document.getElementById("lesson-toast");

  const courseThemeButtons = [...document.querySelectorAll("[data-env]")];
  const savedCourseTheme = localStorage.getItem("afb_theme") || "aurora";
  const applyCourseTheme = theme => {
    const allowed = ["moderno", "vikings", "aurora"];
    const next = allowed.includes(theme) ? theme : "aurora";
    document.documentElement.dataset.theme = next;
    document.documentElement.dataset.mode = "day";
    localStorage.setItem("afb_theme", next);
    courseThemeButtons.forEach(button => button.classList.toggle("active", button.dataset.env === next));
  };
  courseThemeButtons.forEach(button => button.addEventListener("click", () => applyCourseTheme(button.dataset.env)));
  applyCourseTheme(savedCourseTheme);

  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const closeSidebar = () => document.body.classList.remove("sidebar-open");
  sidebarToggle?.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
  sidebarOverlay?.addEventListener("click", closeSidebar);
  document.querySelectorAll(".platform-menu a").forEach(link => link.addEventListener("click", closeSidebar));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeSidebar(); });

  const dialogue = [...document.querySelectorAll(".dialogue-line")];
  const slowDialogue = [
  [
    "Anna",
    "Hallo! Guten Morgen!",
    "Hello! Good morning!",
    "/assets/curso-a1-piloto/audio/014_de_f.mp3"
  ],
  [
    "Lukas",
    "Guten Morgen! Wie geht es dir?",
    "Good morning! How are you?",
    "/assets/curso-a1-piloto/audio/015_de_m.mp3"
  ],
  [
    "Anna",
    "Mir geht es gut, danke. Und dir?",
    "I'm fine, thank you. And you?",
    "/assets/curso-a1-piloto/audio/016_de_f.mp3"
  ],
  [
    "Lukas",
    "Sehr gut, danke.",
    "Very well, thank you.",
    "/assets/curso-a1-piloto/audio/017_de_m.mp3"
  ],
  [
    "Anna",
    "Dann bis bald!",
    "See you soon, then!",
    "/assets/curso-a1-piloto/audio/018_de_f.mp3"
  ],
  [
    "Lukas",
    "Tschüss!",
    "Bye!",
    "/assets/curso-a1-piloto/audio/019_de_m.mp3"
  ]
];

  const quizzes = [
  {
    "question": "How do you say “Good morning!” in German?",
    "options": [
      "Gute Nacht!",
      "Guten Morgen!",
      "Bis bald!",
      "Danke!"
    ],
    "answer": 1
  },
  {
    "question": "Which expression informally asks “How are you?”",
    "options": [
      "Wie geht es dir?",
      "Guten Abend!",
      "Und Sie heißen?",
      "Sehr gut!"
    ],
    "answer": 0
  },
  {
    "question": "You arrive at a restaurant at 8 p.m. Which greeting fits best?",
    "options": [
      "Guten Morgen!",
      "Gute Nacht!",
      "Guten Abend!",
      "Bis morgen!"
    ],
    "answer": 2
  },
  {
    "question": "Complete the sentence: “Mir geht es ___.”",
    "options": [
      "Tag",
      "bald",
      "gut",
      "Morgen"
    ],
    "answer": 2
  },
  {
    "question": "Which farewell means “See you soon”?",
    "options": [
      "Bis bald!",
      "Hallo!",
      "Guten Tag!",
      "Danke!"
    ],
    "answer": 0
  }
];

  function setDock(label) {
    dock.hidden = false;
    dockLabel.textContent = label || "Playing audio";
    dockSpeed.textContent = `${String(speed)}×`;
    dockToggle.textContent = "❚❚";
  }

  function clearSpeaking() {
    stage?.classList.remove("speaking-anna", "speaking-lukas");
    dialogue.forEach(line => line.classList.remove("playing"));
    document.querySelectorAll("[data-play].playing, [data-audio].playing").forEach(el => el.classList.remove("playing"));
  }

  function showLine(speaker, de, pt, sourceButton) {
    clearSpeaking();
    if (stage) stage.classList.add(speaker === "Anna" ? "speaking-anna" : "speaking-lukas");
    if (activeSpeaker) activeSpeaker.textContent = speaker;
    if (activeGerman) activeGerman.textContent = de;
    if (activeTranslation) activeTranslation.textContent = pt;
    sourceButton?.classList.add("playing");
  }

  function playItem(item) {
    const normalized = typeof item === "string" ? { src: item } : item;
    audio.src = normalized.src;
    audio.playbackRate = normalized.rate || speed;
    currentSourceButton = normalized.button || null;
    if (normalized.speaker) showLine(normalized.speaker, normalized.de, normalized.pt, normalized.button);
    else {
      clearSpeaking();
      normalized.button?.classList.add("playing");
    }
    setDock(normalized.label || normalized.de || "Lesson explanation");
    audio.play().catch(() => showToast("Click again to allow audio in your browser."));
  }

  function playQueue(items) {
    queue = items;
    queueIndex = 0;
    if (queue.length) playItem(queue[0]);
  }

  function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
    queue = [];
    queueIndex = 0;
    dock.hidden = true;
    dockProgress.style.width = "0";
    clearSpeaking();
  }

  audio.addEventListener("timeupdate", () => {
    const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    dockProgress.style.width = `${percent}%`;
  });

  audio.addEventListener("ended", () => {
    clearSpeaking();
    if (queue.length && queueIndex < queue.length - 1) {
      queueIndex += 1;
      window.setTimeout(() => playItem(queue[queueIndex]), 280);
    } else {
      queue = [];
      dock.hidden = true;
      markProgress();
    }
  });

  dockToggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      dockToggle.textContent = "❚❚";
    } else {
      audio.pause();
      dockToggle.textContent = "▶";
    }
  });
  dockClose.addEventListener("click", stopAudio);

  document.querySelectorAll("[data-play]").forEach(button => {
    button.addEventListener("click", () => {
      playQueue([{ src: button.dataset.play, button, label: button.closest(".phrase-card")?.querySelector("h3")?.textContent || "Lesson explanation" }]);
      if (button.dataset.scroll) {
        window.setTimeout(() => document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth" }), 650);
      }
    });
  });

  document.querySelectorAll("[data-audio]").forEach(button => {
    button.addEventListener("click", () => {
      playQueue([{
        src: button.dataset.audio,
        button,
        speaker: button.dataset.speaker,
        de: button.dataset.de || button.querySelector("b")?.textContent,
        pt: button.dataset.pt || button.querySelector("small")?.textContent,
        label: button.dataset.de || button.querySelector("b")?.textContent
      }]);
    });
  });

  document.querySelectorAll("[data-play-sequence]").forEach(button => {
    button.addEventListener("click", () => {
      const labels = ["German culture note"];
      playQueue(button.dataset.playSequence.split(",").map((src, index) => ({ src, label: labels[index], button })));
    });
  });

  document.querySelectorAll("[data-speed]").forEach(button => {
    button.addEventListener("click", () => {
      speed = Number(button.dataset.speed);
      audio.playbackRate = speed;
      dockSpeed.textContent = `${String(speed)}×`;
      document.querySelectorAll("[data-speed]").forEach(item => item.classList.toggle("active", item === button));
      localStorage.setItem("deutschbloomLessonSpeed", String(speed));
    });
  });

  const savedSpeed = Number(localStorage.getItem("deutschbloomLessonSpeed"));
  if ([0.75, 1, 1.25].includes(savedSpeed)) {
    speed = savedSpeed;
    document.querySelectorAll("[data-speed]").forEach(item => item.classList.toggle("active", Number(item.dataset.speed) === speed));
  }

  document.getElementById("play-dialogue").addEventListener("click", () => {
    playQueue(dialogue.map(button => ({
      src: button.dataset.audio,
      button,
      speaker: button.dataset.speaker,
      de: button.dataset.de,
      pt: button.dataset.pt,
      label: `${button.dataset.speaker}: ${button.dataset.de}`
    })));
  });

  document.getElementById("play-slow-dialogue").addEventListener("click", () => {
    playQueue(slowDialogue.map(([speaker, de, pt, src]) => ({ src, speaker, de, pt, label: `${speaker}: ${de}`, rate: 1 })));
  });

  const secondDialogueButtons = [...document.querySelectorAll(".mini-dialogue button")];
  document.getElementById("play-second-dialogue").addEventListener("click", () => {
    playQueue(secondDialogueButtons.map(button => ({
      src: button.dataset.audio,
      button,
      label: button.querySelector("b").textContent
    })));
  });

  const quizRoot = document.getElementById("quiz-root");
  quizRoot.innerHTML = quizzes.map((quiz, index) => `
    <article class="quiz-question" data-question="${index}">
      <span>Question ${index + 1}</span>
      <h3>${quiz.question}</h3>
      <div class="quiz-options">
        ${quiz.options.map((option, optionIndex) => `<button class="quiz-option" type="button" data-option="${optionIndex}">${option}</button>`).join("")}
      </div>
    </article>
  `).join("");

  quizRoot.addEventListener("click", event => {
    const option = event.target.closest(".quiz-option");
    if (!option) return;
    option.parentElement.querySelectorAll(".quiz-option").forEach(item => item.classList.remove("selected", "correct", "wrong"));
    option.classList.add("selected");
  });

  document.getElementById("check-answers").addEventListener("click", () => {
    let score = 0;
    let answered = 0;
    quizzes.forEach((quiz, index) => {
      const question = quizRoot.querySelector(`[data-question="${index}"]`);
      const selected = question.querySelector(".quiz-option.selected");
      question.querySelectorAll(".quiz-option").forEach((option, optionIndex) => {
        option.classList.remove("correct", "wrong");
        if (optionIndex === quiz.answer) option.classList.add("correct");
      });
      if (selected) {
        answered += 1;
        if (Number(selected.dataset.option) === quiz.answer) score += 1;
        else selected.classList.add("wrong");
      }
    });
    const result = document.getElementById("quiz-result");
    document.getElementById("score-number").textContent = score;
    result.hidden = false;
    if (answered < quizzes.length) {
      result.textContent = `You answered ${answered} of ${quizzes.length}. Complete the remaining questions and try again.`;
    } else if (score === quizzes.length) {
      result.textContent = "Sehr gut! You answered everything correctly and completed Lesson 1.";
      localStorage.setItem("deutschbloomA1Lesson1Complete", "true");
      setProgress(100);
    } else {
      result.textContent = `You answered ${score} of ${quizzes.length} correctly. Review your answers and try again.`;
      setProgress(Math.max(55, score * 15));
    }
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  function setProgress(value) {
    document.getElementById("lesson-progress").style.width = `${value}%`;
    document.getElementById("progress-label").textContent = `${value}%`;
  }

  function markProgress() {
    const current = Number(document.getElementById("progress-label").textContent.replace("%", "")) || 0;
    setProgress(Math.min(85, current + 8));
  }

  if (localStorage.getItem("deutschbloomA1Lesson1Complete") === "true") {
    setProgress(100);
    document.getElementById("score-number").textContent = "5";
  }

  const outlineLinks = [...document.querySelectorAll(".lesson-outline a")];
  const observedSections = [...document.querySelectorAll("[data-section]")];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    outlineLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, .2, .6] });
  observedSections.forEach(section => observer.observe(section));

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3500);
  }

  document.getElementById("next-lesson").addEventListener("click", () => {
    stopAudio();
    window.location.href = "/en/german-a1-course/lesson-02.html"; return;
    document.getElementById("lesson-one").hidden = true;
    document.getElementById("lesson-placeholder").hidden = false;
    document.getElementById("top-lesson-number").textContent = "2";
    document.getElementById("top-progress").style.width = "6.66%";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("back-to-pilot").addEventListener("click", () => {
    history.pushState({ lesson: 1 }, "", location.pathname);
    document.getElementById("lesson-one").hidden = false;
    document.getElementById("lesson-placeholder").hidden = true;
    document.getElementById("top-lesson-number").textContent = "1";
    document.getElementById("top-progress").style.width = "3.33%";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (new URLSearchParams(location.search).get("aula") === "2") {
    document.getElementById("lesson-one").hidden = true;
    document.getElementById("lesson-placeholder").hidden = false;
    document.getElementById("top-lesson-number").textContent = "2";
    document.getElementById("top-progress").style.width = "6.66%";
  }
})();
