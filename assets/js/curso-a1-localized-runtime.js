(function () {
  "use strict";

  const player = new Audio();
  let rate = 1;
  let sequence = 0;
  let activeButton = null;
  const speaker = document.querySelector("#a1-speaker");
  const german = document.querySelector("#a1-german");
  const translation = document.querySelector("#a1-portuguese");
  const stage = document.querySelector(".a1-stage");

  function show(line) {
    if (!line) return;
    if (stage) {
      stage.classList.remove("speaking-anna", "speaking-lukas");
      stage.classList.add(line.dataset.speaker === "Anna" ? "speaking-anna" : "speaking-lukas");
    }
    if (speaker) speaker.textContent = line.dataset.speaker || "DeutschBloom";
    if (german) german.textContent = line.dataset.de || "";
    if (translation) translation.textContent = line.dataset.pt || "";
  }

  function stop() {
    sequence += 1;
    player.pause();
    player.currentTime = 0;
    if (activeButton) {
      activeButton.classList.remove("is-playing");
      activeButton.setAttribute("aria-pressed", "false");
      activeButton = null;
    }
  }

  function play(src, button) {
    return new Promise((resolve, reject) => {
      if (!src) return resolve();
      player.pause();
      player.src = src;
      player.playbackRate = rate;
      player.onended = resolve;
      player.onerror = () => reject(new Error("Audio unavailable."));
      activeButton = button || null;
      if (button) {
        button.classList.add("is-playing");
        button.setAttribute("aria-pressed", "true");
      }
      player.play().catch(reject);
    }).finally(() => {
      if (button && activeButton === button) {
        button.classList.remove("is-playing");
        button.setAttribute("aria-pressed", "false");
        activeButton = null;
      }
    });
  }

  document.addEventListener("click", async (event) => {
    const line = event.target.closest(".a1-dialogue-line");
    if (line) {
      stop();
      show(line);
      try { await play(line.dataset.audio, line); } catch (error) { line.title = error.message; }
      return;
    }
    const button = event.target.closest("[data-play]");
    if (!button) return;
    stop();
    try { await play(button.dataset.play, button); } catch (error) { button.title = error.message; }
  });

  const speed = document.querySelector("#a1-speed");
  if (speed) speed.addEventListener("change", () => {
    rate = Number(speed.value) || 1;
    player.playbackRate = rate;
  });

  const dialogueButton = document.querySelector("#a1-play-dialogue");
  if (dialogueButton) dialogueButton.addEventListener("click", async () => {
    stop();
    const thisSequence = sequence;
    const lines = Array.from(document.querySelectorAll(".a1-dialogue-line"));
    dialogueButton.disabled = true;
    dialogueButton.classList.add("is-playing");
    try {
      for (const line of lines) {
        if (thisSequence !== sequence) break;
        show(line);
        line.classList.add("is-active");
        try { await play(line.dataset.audio, null); } finally { line.classList.remove("is-active"); }
      }
    } catch (error) {
      dialogueButton.title = error.message;
    } finally {
      dialogueButton.disabled = false;
      dialogueButton.classList.remove("is-playing");
    }
  });

  const root = document.querySelector("#a1-quiz");
  const quiz = window.A1_LESSON && window.A1_LESSON.quiz;
  const ui = window.A1_LOCALIZED_UI || {};
  if (root && Array.isArray(quiz)) quiz.forEach((item, questionIndex) => {
    const card = document.createElement("article");
    card.className = "lesson-quiz-card";
    const title = document.createElement("h3");
    title.className = "lesson-quiz-question";
    title.textContent = `${questionIndex + 1}. ${item.question}`;
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
        choices.querySelectorAll("button").forEach(node => node.classList.remove("is-correct", "is-wrong"));
        const correct = index === item.answer;
        choice.classList.add(correct ? "is-correct" : "is-wrong");
        feedback.textContent = correct ? (ui.correct || "Correct!") : (ui.wrong || "Try again");
        feedback.className = "lesson-quiz-feedback " + (correct ? "is-correct" : "is-wrong");
      });
      choices.appendChild(choice);
    });
    card.appendChild(choices);
    card.appendChild(feedback);
    root.appendChild(card);
  });

  window.addEventListener("beforeunload", stop);
})();
