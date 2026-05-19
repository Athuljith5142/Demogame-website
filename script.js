const choices = ["rock", "paper", "scissors"];
const beats = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
};
const losesTo = {
    rock: "paper",
    paper: "scissors",
    scissors: "rock"
};
const defaultState = {
    score: { win: 0, loss: 0, tie: 0 },
    streak: 0,
    highScore: 0,
    bestStreak: 0,
    history: [],
    difficulty: "fair",
    theme: "dark",
    introSeen: false
};

const state = loadState();
let audioContext;

const elements = {
    body: document.body,
    intro: document.getElementById("intro"),
    startButton: document.getElementById("startButton"),
    themeToggle: document.getElementById("themeToggle"),
    resetButton: document.getElementById("resetButton"),
    difficulty: document.getElementById("difficulty"),
    wins: document.getElementById("wins"),
    losses: document.getElementById("losses"),
    ties: document.getElementById("ties"),
    highScore: document.getElementById("highScore"),
    bestStreak: document.getElementById("bestStreak"),
    comboText: document.getElementById("comboText"),
    resultTitle: document.getElementById("resultTitle"),
    resultDetail: document.getElementById("resultDetail"),
    resultCard: document.getElementById("resultCard"),
    resultStage: document.getElementById("resultStage"),
    playerImage: document.getElementById("playerImage"),
    computerImage: document.getElementById("computerImage"),
    playerPlaceholder: document.getElementById("playerPlaceholder"),
    computerPlaceholder: document.getElementById("computerPlaceholder"),
    historyList: document.getElementById("historyList"),
    choiceButtons: document.querySelectorAll("[data-choice]")
};

function loadState() {
    const savedArenaState = JSON.parse(localStorage.getItem("rpsArenaState") || "null");
    const legacyScore = JSON.parse(localStorage.getItem("Score") || "null");
    const merged = { ...defaultState, ...savedArenaState };

    if (!savedArenaState && legacyScore) {
        merged.score = {
            win: legacyScore.win || 0,
            loss: legacyScore.loss || 0,
            tie: legacyScore.tie || 0
        };
    }

    merged.highScore = Math.max(merged.highScore || 0, merged.score.win || 0);

    return merged;
}

function saveState() {
    localStorage.setItem("rpsArenaState", JSON.stringify(state));
    localStorage.setItem("Score", JSON.stringify(state.score));
}

function getImage(choice) {
    return `./Assets/${choice}-emoji.png`;
}

function titleCase(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function randomChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function getComputerChoice(playerChoice) {
    const difficulty = state.difficulty;

    if (difficulty === "easy" && Math.random() < 0.55) {
        return beats[playerChoice];
    }

    if (difficulty === "hard" && Math.random() < 0.55) {
        return losesTo[playerChoice];
    }

    return randomChoice();
}

function getResult(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return "tie";
    }

    return beats[playerChoice] === computerChoice ? "win" : "loss";
}

function playRound(playerChoice) {
    state.introSeen = true;
    elements.intro.classList.add("hidden");

    const computerChoice = getComputerChoice(playerChoice);
    const result = getResult(playerChoice, computerChoice);

    if (result === "win") {
        state.score.win += 1;
        state.streak += 1;
        state.highScore = Math.max(state.highScore, state.score.win);
        state.bestStreak = Math.max(state.bestStreak, state.streak);
    } else if (result === "loss") {
        state.score.loss += 1;
        state.streak = 0;
    } else {
        state.score.tie += 1;
    }

    state.history.unshift({
        player: playerChoice,
        computer: computerChoice,
        result,
        difficulty: state.difficulty,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    state.history = state.history.slice(0, 12);

    saveState();
    updateRoundDisplay(playerChoice, computerChoice, result);
    render();
    playSound(result);
}

function updateRoundDisplay(playerChoice, computerChoice, result) {
    setChoiceImage(elements.playerImage, elements.playerPlaceholder, playerChoice);
    setChoiceImage(elements.computerImage, elements.computerPlaceholder, computerChoice);

    const copy = {
        win: ["You win!", `${titleCase(playerChoice)} beats ${computerChoice}. Keep that combo alive.`],
        loss: ["Computer wins", `${titleCase(computerChoice)} beats ${playerChoice}. New round, fresh shot.`],
        tie: ["It is a tie", `Both picked ${playerChoice}. The streak stays at ${state.streak}x.`]
    };

    elements.resultTitle.textContent = copy[result][0];
    elements.resultDetail.textContent = copy[result][1];
    bump(elements.resultCard, "pulse");
    bump(elements.resultStage, result === "loss" ? "shake" : "pulse");
}

function setChoiceImage(image, placeholder, choice) {
    image.src = getImage(choice);
    image.alt = titleCase(choice);
    image.hidden = false;
    placeholder.hidden = true;
}

function bump(element, className) {
    element.classList.remove(className);
    window.requestAnimationFrame(() => {
        element.classList.add(className);
    });
}

function render() {
    elements.body.classList.toggle("light", state.theme === "light");
    elements.themeToggle.textContent = state.theme === "light" ? "DK" : "LT";
    elements.themeToggle.title = state.theme === "light" ? "Switch to dark mode" : "Switch to light mode";
    elements.difficulty.value = state.difficulty;
    elements.intro.classList.toggle("hidden", state.introSeen);
    elements.wins.textContent = state.score.win;
    elements.losses.textContent = state.score.loss;
    elements.ties.textContent = state.score.tie;
    elements.highScore.textContent = state.highScore;
    elements.bestStreak.textContent = state.bestStreak;
    elements.comboText.textContent = `${state.streak}x`;
    renderHistory();
}

function renderHistory() {
    if (!state.history.length) {
        elements.historyList.innerHTML = '<p class="empty-history">No rounds yet. Your latest matches will appear here.</p>';
        return;
    }

    elements.historyList.innerHTML = state.history.map((round, index) => `
        <div class="history-item">
            <span class="badge ${round.result}">${round.result}</span>
            <div>
                <strong>Round ${state.history.length - index}</strong>
                <p class="history-choices">${titleCase(round.player)} vs ${titleCase(round.computer)} on ${round.difficulty}</p>
            </div>
            <span class="history-choices">${round.time}</span>
        </div>
    `).join("");
}

function resetGame() {
    state.score = { win: 0, loss: 0, tie: 0 };
    state.streak = 0;
    state.highScore = 0;
    state.bestStreak = 0;
    state.history = [];
    state.introSeen = false;

    [elements.playerImage, elements.computerImage].forEach((image) => {
        image.hidden = true;
        image.removeAttribute("src");
        image.alt = "";
    });
    elements.playerPlaceholder.hidden = false;
    elements.computerPlaceholder.hidden = false;
    elements.resultTitle.textContent = "Ready?";
    elements.resultDetail.textContent = "Start a round to reveal the showdown.";

    saveState();
    render();
}

function playSound(result) {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();

    const notes = {
        win: [523.25, 659.25, 783.99],
        loss: [261.63, 220, 174.61],
        tie: [392, 392]
    };

    notes[result].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = result === "loss" ? "sawtooth" : "triangle";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.16, audioContext.currentTime + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + index * 0.08 + 0.18);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime + index * 0.08);
        oscillator.stop(audioContext.currentTime + index * 0.08 + 0.2);
    });
}

elements.choiceButtons.forEach((button) => {
    button.addEventListener("click", () => playRound(button.dataset.choice));
});

elements.startButton.addEventListener("click", () => {
    state.introSeen = true;
    saveState();
    render();
});

elements.themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    saveState();
    render();
});

elements.difficulty.addEventListener("change", () => {
    state.difficulty = elements.difficulty.value;
    saveState();
});

elements.resetButton.addEventListener("click", resetGame);

render();