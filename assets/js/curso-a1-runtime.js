(function () {
  "use strict";

  const audio = new Audio();
  let rate = 1;
  let runId = 0;
  let activeButton = null;

  const speaker = document.querySelector("#a1-speaker");
  const german = document.querySelector("#a1-german");
  const portuguese = document.querySelector("#a1-portuguese");
  const dialogueStage = document.querySelector(".a1-stage");

  function show(line) {
    if (!line) return;
    if (dialogueStage) {
      dialogueStage.classList.remove("speaking-anna", "speaking-lukas");
      dialogueStage.classList.add(line.dataset.speaker === "Anna" ? "speaking-anna" : "speaking-lukas");
    }
    if (speaker) speaker.textContent = line.dataset.speaker || "DeutschBloom";
    if (german) german.textContent = line.dataset.de || "";
    if (portuguese) portuguese.textContent = line.dataset.pt || "";
  }

  function stop() {
    runId += 1;
    audio.pause();
    audio.currentTime = 0;
    if (activeButton) {
      activeButton.classList.remove("is-playing");
      activeButton.setAttribute("aria-pressed", "false");
      activeButton = null;
    }
  }

  function play(src, button) {
    return new Promise((resolve, reject) => {
      if (!src) return resolve();
      audio.pause();
      audio.src = src;
      audio.playbackRate = rate;
      audio.onended = resolve;
      audio.onerror = () => reject(new Error("Áudio indisponível."));
      if (activeButton && activeButton !== button) {
        activeButton.classList.remove("is-playing");
      }
      activeButton = button || null;
      if (button) {
        button.classList.add("is-playing");
        button.setAttribute("aria-pressed", "true");
      }
      audio.play().catch(reject);
    }).finally(() => {
      if (button && activeButton === button) {
        button.classList.remove("is-playing");
        button.setAttribute("aria-pressed", "false");
        activeButton = null;
      }
    });
  }

  document.addEventListener("click", async (event) => {
    const dialogue = event.target.closest(".a1-dialogue-line");
    if (dialogue) {
      stop();
      show(dialogue);
      try {
        await play(dialogue.dataset.audio, dialogue);
      } catch (error) {
        dialogue.title = error.message;
      }
      return;
    }

    const button = event.target.closest("[data-play]");
    if (!button) return;
    stop();
    try {
      await play(button.dataset.play, button);
    } catch (error) {
      button.title = error.message;
    }
  });

  const speed = document.querySelector("#a1-speed");
  if (speed) {
    speed.addEventListener("change", () => {
      rate = Number(speed.value) || 1;
      audio.playbackRate = rate;
    });
  }

  const playDialogue = document.querySelector("#a1-play-dialogue");
  if (playDialogue) {
    playDialogue.addEventListener("click", async () => {
      stop();
      const currentRun = runId;
      const lines = Array.from(document.querySelectorAll(".a1-dialogue-line"));
      playDialogue.disabled = true;
      playDialogue.classList.add("is-playing");
      try {
        for (const line of lines) {
          if (currentRun !== runId) break;
          show(line);
          line.classList.add("is-active");
          try {
            await play(line.dataset.audio, null);
          } finally {
            line.classList.remove("is-active");
          }
        }
      } catch (error) {
        playDialogue.title = error.message;
      } finally {
        playDialogue.disabled = false;
        playDialogue.classList.remove("is-playing");
      }
    });
  }

  function renderQuiz() {
    const root = document.querySelector("#a1-quiz");
    const quiz = window.A1_LESSON && window.A1_LESSON.quiz;
    if (!root || !Array.isArray(quiz)) return;

    quiz.forEach((item, questionIndex) => {
      const card = document.createElement("article");
      card.className = "lesson-quiz-card";
      const title = document.createElement("h3");
      title.className = "lesson-quiz-question";
      title.textContent = `${questionIndex + 1}. O que significa “${item.q}”?`;
      card.appendChild(title);

      const choices = document.createElement("div");
      choices.className = "lesson-quiz-options";
      const feedback = document.createElement("p");
      feedback.className = "lesson-quiz-feedback";
      feedback.setAttribute("aria-live", "polite");

      item.options.forEach((label, index) => {
        const choice = document.createElement("button");
        choice.type = "button";
        choice.className = "lesson-quiz-option";
        choice.textContent = label;
        choice.addEventListener("click", () => {
          choices.querySelectorAll("button").forEach((node) => {
            node.classList.remove("is-correct", "is-wrong");
          });
          const correct = index === item.answer;
          choice.classList.add(correct ? "is-correct" : "is-wrong");
          feedback.textContent = correct
            ? "Muito bem! Resposta correta."
            : "Quase! Escute novamente e tente outra opção.";
          feedback.className =
            "lesson-quiz-feedback " + (correct ? "is-correct" : "is-wrong");
        });
        choices.appendChild(choice);
      });

      card.appendChild(choices);
      card.appendChild(feedback);
      root.appendChild(card);
    });
  }

  window.addEventListener("beforeunload", stop);
  renderQuiz();
})();
