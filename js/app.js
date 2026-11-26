(() => {
  "use strict";

  const STORAGE_KEY = "ip-el-desafio-progress-v1";
  const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  const MAX_LEVELS = window.GAME_LEVELS.length;

  const elements = {
    welcome: document.querySelector("#welcome-screen"),
    game: document.querySelector("#game-screen"),
    result: document.querySelector("#result-screen"),
    final: document.querySelector("#final-screen"),
    headerLevel: document.querySelector("#header-level"),
    headerLevelValue: document.querySelector("#header-level-value"),
    startButton: document.querySelector("#start-button"),
    startButtonLabel: document.querySelector("#start-button-label"),
    levelCategory: document.querySelector("#level-category"),
    levelTitle: document.querySelector("#level-title"),
    difficulty: document.querySelector("#difficulty-badge"),
    clue: document.querySelector("#clue-text"),
    word: document.querySelector("#word-area"),
    keyboard: document.querySelector("#keyboard"),
    attemptsLeft: document.querySelector("#attempts-left"),
    attemptsTotal: document.querySelector("#attempts-total"),
    attemptMessage: document.querySelector("#attempt-message"),
    score: document.querySelector("#score-value"),
    progress: document.querySelector("#progress-value"),
    progressBar: document.querySelector("#progress-bar"),
    progressFill: document.querySelector("#progress-fill"),
    levelDots: document.querySelector("#level-dots"),
    tip: document.querySelector("#level-tip"),
    resultSymbol: document.querySelector("#result-symbol"),
    resultEyebrow: document.querySelector("#result-eyebrow"),
    resultTitle: document.querySelector("#result-title"),
    resultAnswer: document.querySelector("#result-answer"),
    resultDefinition: document.querySelector("#result-definition"),
    resultImportance: document.querySelector("#result-importance"),
    resultPoints: document.querySelector("#result-points"),
    resultActions: document.querySelector("#result-actions"),
    finalScore: document.querySelector("#final-score-value"),
    restartButton: document.querySelector("#restart-button"),
    resetButton: document.querySelector("#reset-progress-button"),
    saveNotice: document.querySelector("#save-notice")
  };

  const state = {
    levelIndex: 0,
    score: 0,
    guessed: [],
    scoredLetters: [],
    mistakes: 0,
    completed: 0,
    phase: "welcome",
    noticeTimer: null
  };

  function normalizeLetter(letter) {
    return letter.replace(/ñ/gi, "\u0000")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u0000/g, "Ñ")
      .toUpperCase();
  }

  function currentLevel() {
    return window.GAME_LEVELS[state.levelIndex];
  }

  function saveProgress() {
    const savedState = {
      levelIndex: state.levelIndex,
      score: state.score,
      guessed: state.guessed,
      scoredLetters: state.scoredLetters,
      mistakes: state.mistakes,
      completed: state.completed,
      phase: state.phase
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      elements.saveNotice.hidden = true;
    } catch (error) {
      showSaveError("No se pudo guardar tu progreso. Revisa el almacenamiento del navegador.");
      console.error("No fue posible guardar el progreso del juego.", error);
    }
  }

  function loadProgress() {
    let rawProgress;
    try {
      rawProgress = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      showSaveError("No se pudo leer el progreso guardado. Puedes jugar, pero no se conservarán tus avances.");
      console.error("No fue posible leer el progreso del juego.", error);
      return;
    }

    if (!rawProgress) return;

    try {
      const saved = JSON.parse(rawProgress);
      const valid = Number.isInteger(saved.levelIndex)
        && saved.levelIndex >= 0
        && saved.levelIndex <= MAX_LEVELS
        && Number.isFinite(saved.score)
        && Number.isInteger(saved.completed)
        && saved.completed >= 0
        && saved.completed <= MAX_LEVELS
        && Array.isArray(saved.guessed)
        && Number.isInteger(saved.mistakes)
        && saved.mistakes >= 0;

      if (!valid) throw new Error("El formato del progreso guardado no es válido.");

      state.levelIndex = saved.levelIndex;
      state.score = saved.score;
      state.completed = saved.completed;
      state.guessed = saved.guessed.filter((letter) => ALPHABET.includes(letter));
      state.scoredLetters = Array.isArray(saved.scoredLetters)
        ? saved.scoredLetters.filter((letter) => ALPHABET.includes(letter))
        : state.levelIndex < MAX_LEVELS
          ? state.guessed.filter((letter) => wordContains(letter))
          : [];
      state.mistakes = saved.mistakes;
      state.phase = ["welcome", "playing", "won", "lost", "finished"].includes(saved.phase)
        ? saved.phase
        : "welcome";

      if (state.levelIndex === MAX_LEVELS || state.phase === "finished") {
        state.levelIndex = MAX_LEVELS;
        state.phase = "finished";
      } else {
        const level = currentLevel();
        const maxMistakes = level.attempts;
        if (state.mistakes > maxMistakes) throw new Error("El progreso guardado excede los intentos del nivel.");
        if (state.phase === "playing" && state.mistakes >= maxMistakes) state.phase = "lost";
        if (state.phase === "playing" && isWordComplete()) state.phase = "won";
      }
    } catch (error) {
      console.error("El progreso guardado está dañado y no se pudo cargar.", error);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (storageError) {
        console.error("No fue posible quitar el progreso dañado.", storageError);
      }
      showSaveError("El progreso guardado no era válido y se reinició para proteger tu partida.");
      resetState();
    }
  }

  function showSaveError(message) {
    elements.saveNotice.textContent = message;
    elements.saveNotice.hidden = false;
    window.clearTimeout(state.noticeTimer);
    state.noticeTimer = window.setTimeout(() => {
      elements.saveNotice.hidden = true;
    }, 7000);
  }

  function resetState() {
    state.levelIndex = 0;
    state.score = 0;
    state.completed = 0;
    state.guessed = [];
    state.scoredLetters = [];
    state.mistakes = 0;
    state.phase = "welcome";
  }

  function isWordComplete() {
    return [...currentLevel().word].every((character) => {
      return !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(character)
        || state.guessed.includes(normalizeLetter(character));
    });
  }

  function renderProgress() {
    const progressPercent = Math.round((state.completed / MAX_LEVELS) * 100);
    elements.score.textContent = String(state.score);
    elements.progress.textContent = `${progressPercent}%`;
    elements.progressFill.style.width = `${progressPercent}%`;
    elements.progressBar.setAttribute("aria-valuenow", String(state.completed));
    elements.levelDots.replaceChildren();

    for (let index = 0; index < MAX_LEVELS; index += 1) {
      const dot = document.createElement("span");
      dot.className = `level-dot${index < state.completed ? " is-complete" : ""}`;
      dot.setAttribute("aria-label", `Nivel ${index + 1}${index < state.completed ? ", completado" : ""}`);
      elements.levelDots.append(dot);
    }
  }

  function renderWelcome() {
    elements.welcome.hidden = false;
    elements.game.hidden = true;
    elements.result.hidden = true;
    elements.final.hidden = true;
    elements.headerLevel.hidden = true;
    elements.resetButton.hidden = state.completed === 0;
    elements.startButtonLabel.textContent = state.completed > 0 ? "Continuar partida" : "Comenzar";
    renderProgress();
  }

  function renderGame() {
    const level = currentLevel();
    elements.welcome.hidden = true;
    elements.game.hidden = false;
    elements.result.hidden = true;
    elements.final.hidden = true;
    elements.headerLevel.hidden = false;
    elements.headerLevelValue.textContent = `${String(state.levelIndex + 1).padStart(2, "0")} / ${MAX_LEVELS}`;
    elements.levelCategory.textContent = `CONCEPTO ${String(state.levelIndex + 1).padStart(2, "0")}`;
    elements.levelTitle.textContent = "Descubre el concepto";
    elements.difficulty.textContent = level.difficulty;
    elements.clue.textContent = level.clue;
    elements.tip.textContent = level.tip;
    elements.attemptsLeft.textContent = String(level.attempts - state.mistakes);
    elements.attemptsTotal.textContent = String(level.attempts);
    elements.attemptMessage.textContent = state.mistakes === 0
      ? "Cada acierto te acerca a la respuesta."
      : `${state.mistakes} ${state.mistakes === 1 ? "error" : "errores"} · sigue con atención.`;
    renderWord();
    renderKeyboard();
    renderHangman();
    renderProgress();
  }

  function renderWord() {
    const fragment = document.createDocumentFragment();
    [...currentLevel().word].forEach((character) => {
      if (character === " ") {
        const space = document.createElement("span");
        space.className = "word-space";
        space.setAttribute("aria-hidden", "true");
        fragment.append(space);
        return;
      }

      const slot = document.createElement("span");
      const isRevealed = !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(character)
        || state.guessed.includes(normalizeLetter(character));
      slot.className = `word-slot${isRevealed ? " is-revealed" : ""}`;
      slot.textContent = isRevealed ? character : "";
      slot.setAttribute("aria-hidden", "true");
      fragment.append(slot);
    });

    elements.word.replaceChildren(fragment);
    elements.word.setAttribute("aria-label", [...currentLevel().word].map((character) => {
      if (character === " ") return "espacio";
      return state.guessed.includes(normalizeLetter(character)) || !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(character)
        ? character
        : "guion";
    }).join(" "));
  }

  function renderKeyboard() {
    const fragment = document.createDocumentFragment();
    ALPHABET.forEach((letter) => {
      const key = document.createElement("button");
      key.type = "button";
      key.className = "key";
      key.textContent = letter;
      key.setAttribute("aria-label", `Letra ${letter}`);
      key.disabled = state.guessed.includes(letter) || state.phase !== "playing";
      if (state.guessed.includes(letter)) {
        key.classList.add(wordContains(letter) ? "is-correct" : "is-incorrect");
      }
      key.addEventListener("click", () => guessLetter(letter));
      fragment.append(key);
    });
    elements.keyboard.replaceChildren(fragment);
  }

  function wordContains(letter) {
    return [...currentLevel().word].some((character) => normalizeLetter(character) === letter);
  }

  function renderHangman() {
    document.querySelectorAll(".body-part").forEach((part) => {
      part.classList.toggle("is-visible", Number(part.dataset.part) <= state.mistakes);
    });
  }

  function guessLetter(rawLetter) {
    if (state.phase !== "playing") return;
    const letter = normalizeLetter(rawLetter);
    if (!ALPHABET.includes(letter) || state.guessed.includes(letter)) return;

    state.guessed.push(letter);
    if (wordContains(letter)) {
      if (!state.scoredLetters.includes(letter)) {
        const occurrences = [...currentLevel().word]
          .filter((character) => normalizeLetter(character) === letter).length;
        state.score += occurrences * 10;
        state.scoredLetters.push(letter);
      }
      if (isWordComplete()) {
        finishLevel(true);
        return;
      }
    } else {
      state.mistakes += 1;
    }

    saveProgress();
    renderGame();
  }

  function finishLevel(won) {
    const level = currentLevel();
    let earned = 0;

    if (won) {
      earned = 30 + (level.attempts - state.mistakes) * 5;
      if (state.mistakes === 0) earned += 30;
      state.score += earned;
      state.completed = Math.max(state.completed, state.levelIndex + 1);
      state.phase = "won";
    } else {
      state.phase = "lost";
    }

    saveProgress();
    renderResult(won, earned);
  }

  function createAction(label, action, secondary = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `button ${secondary ? "button--secondary" : "button--primary"}`;
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
  }

  function renderResult(won, earned) {
    const level = currentLevel();
    elements.welcome.hidden = true;
    elements.game.hidden = true;
    elements.result.hidden = false;
    elements.final.hidden = true;
    elements.headerLevel.hidden = false;
    elements.headerLevelValue.textContent = `${String(state.levelIndex + 1).padStart(2, "0")} / ${MAX_LEVELS}`;
    elements.resultSymbol.textContent = won ? "✓" : "×";
    elements.resultSymbol.classList.toggle("is-loss", !won);
    elements.resultEyebrow.textContent = won ? "NIVEL COMPLETADO" : "SE ACABARON LOS INTENTOS";
    elements.resultTitle.textContent = won ? "¡Muy bien!" : "Esta vez no se logró";
    elements.resultAnswer.hidden = won;
    elements.resultAnswer.textContent = `La respuesta era: ${level.word}`;
    elements.resultDefinition.textContent = level.definition;
    elements.resultImportance.textContent = level.importance;
    elements.resultPoints.textContent = won && earned > 0
      ? `+${earned} puntos de bonificación · ${state.score} puntos acumulados`
      : `Puntuación acumulada: ${state.score} puntos`;
    elements.resultActions.replaceChildren();

    if (won && state.levelIndex === MAX_LEVELS - 1) {
      elements.resultActions.append(createAction("Ver resultado final", showFinal));
    } else if (won) {
      elements.resultActions.append(createAction("Siguiente nivel", advanceLevel));
    } else {
      elements.resultActions.append(
        createAction("Intentar de nuevo", retryLevel, true),
        createAction("Continuar al siguiente", advanceLevel)
      );
    }
    renderProgress();
  }

  function beginLevel(keepScoredLetters = false) {
    state.guessed = [];
    if (!keepScoredLetters) state.scoredLetters = [];
    state.mistakes = 0;
    state.phase = "playing";
    saveProgress();
    renderGame();
  }

  function retryLevel() {
    beginLevel(true);
  }

  function advanceLevel() {
    state.levelIndex += 1;
    if (state.levelIndex >= MAX_LEVELS) {
      state.levelIndex = MAX_LEVELS;
      state.phase = "finished";
      saveProgress();
      showFinal();
      return;
    }
    beginLevel();
  }

  function showFinal() {
    state.phase = "finished";
    state.levelIndex = MAX_LEVELS;
    state.completed = MAX_LEVELS;
    saveProgress();
    elements.welcome.hidden = true;
    elements.game.hidden = true;
    elements.result.hidden = true;
    elements.final.hidden = false;
    elements.headerLevel.hidden = true;
    elements.resetButton.hidden = false;
    elements.finalScore.textContent = String(state.score);
    renderProgress();
  }

  function startOrContinue() {
    if (state.phase === "finished" || state.levelIndex >= MAX_LEVELS) {
      showFinal();
      return;
    }

    if (state.phase === "won") {
      renderResult(true, 0);
      return;
    }
    if (state.phase === "lost") {
      renderResult(false, 0);
      return;
    }
    if (state.phase === "playing") {
      renderGame();
      return;
    }
    beginLevel();
  }

  function resetProgress() {
    const confirmed = window.confirm("¿Reiniciar todo el progreso y la puntuación?");
    if (!confirmed) return;
    resetState();
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      showSaveError("No se pudo borrar el progreso guardado en este navegador.");
      console.error("No fue posible borrar el progreso guardado.", error);
    }
    renderWelcome();
  }

  elements.startButton.addEventListener("click", startOrContinue);
  elements.restartButton.addEventListener("click", resetProgress);
  elements.resetButton.addEventListener("click", resetProgress);

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    if (/^[a-zñ]$/i.test(event.key)) guessLetter(event.key);
  });

  loadProgress();
  renderWelcome();
})();
