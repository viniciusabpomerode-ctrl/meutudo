(function () {
  "use strict";

  const player = new Audio();
  let playbackRate = 1;
  let activeSequence = 0;
  let activeButton = null;

  const stage = {
    speaker: document.querySelector("[data-stage-speaker]"),
    german: document.querySelector("[data-stage-german]"),
    translation: document.querySelector("[data-stage-translation]")
  };

  function stopPlayback() {
    activeSequence += 1;
    player.pause();
    player.currentTime = 0;
    if (activeButton) {
      activeButton.classList.remove("is-playing");
      activeButton.setAttribute("aria-pressed", "false");
      activeButton = null;
    }
  }

  function updateStage(element) {
    if (!element || !stage.german) return;
    const speaker = element.dataset.speaker || "DeutschBloom";
    const german = element.dataset.german || "";
    const translation = element.dataset.translation || "";
    if (stage.speaker) stage.speaker.textContent = speaker;
    stage.german.textContent = german;
    if (stage.translation) stage.translation.textContent = translation;
  }

  function playOnce(src, button) {
    return new Promise((resolve, reject) => {
      if (!src) {
        resolve();
        return;
      }

      player.pause();
      player.src = src;
      player.playbackRate = playbackRate;
      player.onended = () => resolve();
      player.onerror = () => reject(new Error("Não foi possível reproduzir este áudio."));
      player.play().catch(reject);

      if (activeButton && activeButton !== button) {
        activeButton.classList.remove("is-playing");
        activeButton.setAttribute("aria-pressed", "false");
      }
      activeButton = button || null;
      if (activeButton) {
        activeButton.classList.add("is-playing");
        activeButton.setAttribute("aria-pressed", "true");
      }
    }).finally(() => {
      if (activeButton === button && button) {
        button.classList.remove("is-playing");
        button.setAttribute("aria-pressed", "false");
        activeButton = null;
      }
    });
  }

  document.addEventListener("click", async (event) => {
    const playButton = event.target.closest("[data-play]");
    if (playButton) {
      event.preventDefault();
      const source = playButton.dataset.play;
      const relatedLine = playButton.closest("[data-german]");
      stopPlayback();
      updateStage(relatedLine);
      try {
        await playOnce(source, playButton);
      } catch (error) {
        playButton.title = error.message;
      }
      return;
    }

    const dialogueLine = event.target.closest("[data-dialogue-line]");
    if (dialogueLine) {
      updateStage(dialogueLine);
    }
  });

  const speedControl = document.querySelector("[data-playback-speed]");
  if (speedControl) {
    speedControl.addEventListener("change", () => {
      playbackRate = Number(speedControl.value) || 1;
      player.playbackRate = playbackRate;
    });
  }

  const fullDialogueButton = document.querySelector("[data-play-dialogue]");
  if (fullDialogueButton) {
    fullDialogueButton.addEventListener("click", async () => {
      stopPlayback();
      const sequence = activeSequence;
      const lines = Array.from(document.querySelectorAll("[data-dialogue-line]"));
      fullDialogueButton.classList.add("is-playing");
      fullDialogueButton.disabled = true;

      try {
        for (const line of lines) {
          if (sequence !== activeSequence) break;
          updateStage(line);
          line.classList.add("is-active");
          try {
            await playOnce(line.dataset.audio, null);
          } finally {
            line.classList.remove("is-active");
          }
        }
      } catch (error) {
        fullDialogueButton.title = error.message;
      } finally {
        fullDialogueButton.classList.remove("is-playing");
        fullDialogueButton.disabled = false;
      }
    });
  }

  function renderQuiz() {
    const quizRoot = document.querySelector("[data-quiz]");
    const quiz = window.A1_LESSON && window.A1_LESSON.quiz;
    if (!quizRoot || !quiz || !Array.isArray(quiz.options)) return;

    const question = document.createElement("h3");
    question.className = "lesson-quiz-question";
    question.textContent = quiz.question;
    quizRoot.appendChild(question);

    const options = document.createElement("div");
    options.className = "lesson-quiz-options";
    const feedback = document.createElement("p");
    feedback.className = "lesson-quiz-feedback";
    feedback.setAttribute("aria-live", "polite");

    quiz.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lesson-quiz-option";
      button.textContent = option;
      button.addEventListener("click", () => {
        options.querySelectorAll("button").forEach((item) => {
          item.classList.remove("is-correct", "is-wrong");
        });
        const correct = index === quiz.correct;
        button.classList.add(correct ? "is-correct" : "is-wrong");
        feedback.textContent = correct
          ? "Muito bem! Resposta correta."
          : "Quase! Ouça os exemplos novamente e tente outra opção.";
        feedback.className =
          "lesson-quiz-feedback " + (correct ? "is-correct" : "is-wrong");
      });
      options.appendChild(button);
    });

    quizRoot.appendChild(options);
    quizRoot.appendChild(feedback);
  }

  window.addEventListener("beforeunload", stopPlayback);
  renderQuiz();
})();
