<template>
  <div class="playing-game-content-wrapper">
    <!-- COUNTDOWN OVERLAY -->
    <div v-if="showCountdown" class="countdown-screen" @click.self.prevent>
      <div class="countdown-inner">
        <div class="countdown-number" v-if="countdown > 0">{{ countdown }}</div>
        <div class="countdown-number go" v-else>GO!</div>
      </div>
    </div>

    <main class="game-content">
      <!-- ===== MENU ===== -->
      <section v-if="gameState === 'menu'" class="menu-screen">
        <h1 class="title">🎮 Mini Games Hub</h1>
        <p class="subtitle">Choose a game to play</p>

        <div class="menu-grid">
          <button class="menu-card" @click="startGame('vocab')">
            <div class="card-icon">🐾</div>
            <h3>Vocabulary Quiz</h3>
            <p>Jungle themed vocabulary — multiple choice</p>
          </button>

          <button class="menu-card" @click="startGame('color')">
            <div class="card-icon">🎨</div>
            <h3>Color Guess</h3>
            <p>Type the color name (English / Indonesian)</p>
          </button>

          <button class="menu-card" @click="startGame('logic')">
            <div class="card-icon">🧠</div>
            <h3>Logic Puzzle</h3>
            <p>Solve number / pattern puzzles</p>
          </button>
        </div>

        <footer class="menu-footer">
          <small>Made for learning — have fun!</small>
        </footer>
      </section>

      <!-- ===== VOCAB QUIZ ===== -->
      <section v-if="gameState === 'vocab'" class="game-screen">
        <header class="game-header">
          <button class="back-btn" @click="backToMenu">← Back</button>
          <h2>🐾 Vocabulary Quiz — Jungle</h2>
          <div class="score">Score: {{ vocabScore }}</div>
        </header>

        <div class="quiz-box">
          <p class="q-index">Question {{ currentVocabIndex + 1 }} / {{ vocabQuestions.length }}</p>
          <h3 class="q-text">{{ currentVocab.question }}</h3>
          <p class="clue">Clue: {{ currentVocab.clue }}</p>

          <div class="options-container">
            <button
              v-for="(opt, idx) in currentVocab.choices"
              :key="idx"
              class="option"
              :disabled="isSubmitting"
              @click="answerVocab(idx)"
            >
              <span class="opt-label">{{ optionLabel(idx) }}</span>
              <span class="opt-text">{{ opt }}</span>
            </button>
          </div>

          <p v-if="vocabMessage" class="feedback" :class="vocabMessageType">{{ vocabMessage }}</p>

          <div class="bottom-actions" v-if="vocabFinished">
            <h4>Quiz Complete!</h4>
            <p>Your Score: {{ vocabScore }}</p>
            <div class="action-row">
              <button class="submit-btn" @click="resetAll">Back to Menu</button>
              <button class="next-btn" @click="startGame('vocab')">Play Again</button>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== COLOR GUESS ===== -->
      <section v-if="gameState === 'color'" class="game-screen">
        <header class="game-header">
          <button class="back-btn" @click="backToMenu">← Back</button>
          <h2>🎨 Color Guess</h2>
          <div class="score">Score: {{ colorScore }}</div>
        </header>

        <div class="color-box-area">
          <div class="color-box" :style="{ backgroundColor: currentColor.code }"></div>

          <div class="color-controls">
            <p class="prompt">Type color name (English / Indonesian)</p>
            <input
              v-model="colorAnswer"
              @keyup.enter="checkColorAnswer"
              class="game-input"
              placeholder="e.g. blue / biru"
            />
            <div class="color-btns">
              <button class="submit-btn" @click="checkColorAnswer">Check</button>
              <button class="next-btn" @click="nextColor">Next</button>
              <button class="skip-btn" @click="endColor">Finish</button>
            </div>

            <p v-if="colorMessage" class="feedback" :class="colorMessageType">{{ colorMessage }}</p>
          </div>
        </div>
      </section>

      <!-- ===== LOGIC PUZZLE ===== -->
      <section v-if="gameState === 'logic'" class="game-screen">
        <header class="game-header">
          <button class="back-btn" @click="backToMenu">← Back</button>
          <h2>🧩 Logic Puzzle</h2>
          <div class="score">Score: {{ logicScore }}</div>
        </header>

        <div class="logic-box">
          <p class="logic-question">{{ currentLogic.question }}</p>

          <input
            v-model="logicAnswer"
            @keyup.enter="checkLogicAnswer"
            class="game-input"
            placeholder="Type your answer..."
          />

          <div class="code-actions">
            <button class="submit-btn" @click="checkLogicAnswer">Submit</button>
            <button class="next-btn" @click="nextLogic">Next</button>
            <button class="skip-btn" @click="endLogic">Finish</button>
          </div>

          <p v-if="logicMessage" class="feedback" :class="logicMessageType">{{ logicMessage }}</p>
        </div>
      </section>

      

      <!-- ===== GAME OVER / SUMMARY ===== -->
      <section v-if="gameState === 'game_over'" class="menu-screen">
        <h2>🏁 Game Over</h2>
        <p>Result: {{ lastResult }}</p>
        <p>Score (vocab): {{ vocabScore }}</p>
        <p>Score (color): {{ colorScore }}</p>
        <p>Score (logic): {{ logicScore }}</p>
        <div class="menu-grid" style="margin-top:1rem;">
          <button class="menu-card" @click="resetAll">Play Again</button>
          <button class="menu-card" @click="backToMenu">Back to Menu</button>
        </div>
      </section>
    </main>
  </div>
</template>


<PersonalitySystem ref="pSystem" @done="savePersonality" />

<script setup>
import { ref, computed, onMounted } from 'vue';

/* ===== App state ===== */
const gameState = ref('menu'); // menu | vocab | color | logic | game_over

/* Countdown overlay */
const countdown = ref(0);
const showCountdown = ref(false);

/* helpers for countdown: runs callback when countdown finishes */
function startCountdown(cb) {
  showCountdown.value = true;
  countdown.value = 3;
  const t = setInterval(() => {
    countdown.value--;
    if (countdown.value < 0) {
      clearInterval(t);
      showCountdown.value = false;
      // tiny delay so UI shows GO briefly
      setTimeout(() => { cb && cb(); }, 120);
    }
  }, 1000);
}

/* ===== NAVIGATION ===== */
function startGame(id) {
  // start countdown then initialize game
  startCountdown(() => {
    if (id === 'vocab') {
      resetVocab();
      gameState.value = 'vocab';
    } else if (id === 'color') {
      resetColor();
      gameState.value = 'color';
    } else if (id === 'logic') {
      resetLogic();
      gameState.value = 'logic';
    }
  });
}

function backToMenu() {
  // stop everything and return to menu
  gameState.value = 'menu';
}

/* ---------------------------
   VOCAB QUIZ (multiple-choice)
   --------------------------- */
const vocabQuestions = [
  {
    question: "What is the meaning of 'jungle'?",
    clue: 'A place full of plants and animals.',
    choices: [
      'A large desert',
      'A thick forest with many plants and animals',
      'A dry grassland',
      'A snowy mountain'
    ],
    answerIndex: 1
  },
  {
    question: "What is a 'vine'?",
    clue: 'It climbs.',
    choices: [
      'A small rock',
      'A long climbing plant',
      'A type of insect',
      'A large tree stump'
    ],
    answerIndex: 1
  },
  {
    question: "The word 'predator' refers to…",
    clue: 'It hunts.',
    choices: [
      'An animal that eats plants',
      'An animal that hunts other animals',
      'A baby animal',
      'A slow-moving reptile'
    ],
    answerIndex: 1
  },
  {
    question: "What is the meaning of 'wildlife'?",
    clue: 'Free animals.',
    choices: [
      'Animals kept in zoos',
      'Animals living freely in nature',
      'Farm animals',
      'Pets'
    ],
    answerIndex: 1
  },
  {
    question: "What is a 'canopy' in the jungle?",
    clue: 'A natural roof.',
    choices: [
      'The ground covered with leaves',
      'A cave where tigers live',
      'The top layer of the trees forming a roof',
      'A place with many rivers'
    ],
    answerIndex: 2
  },
  {
    question: "“Endangered” animals are animals that are…",
    clue: 'In danger.',
    choices: [
      'Very common',
      'Newly discovered',
      'At risk of extinction',
      'Safe in the jungle'
    ],
    answerIndex: 2
  },
  {
    question: "What does the word 'riverbank' mean?",
    clue: 'Beside the water.',
    choices: [
      'A bank for storing money',
      'The land along the side of a river',
      'A deep part of the river',
      'A waterfall'
    ],
    answerIndex: 1
  },
  {
    question: "The word 'habitat' means…",
    clue: 'Natural home.',
    choices: [
      'A group of animals',
      'A type of weather',
      'The natural home of a plant or animal',
      'A jungle tool'
    ],
    answerIndex: 2
  },
  {
    question: "What is a 'rainforest'?",
    clue: 'Rains a lot.',
    choices: [
      'A forest with no trees',
      'A forest covered in snow',
      'A forest with heavy rainfall and many species',
      'A forest made of bamboo'
    ],
    answerIndex: 2
  },
  {
    question: "'Claws' are…",
    clue: 'Sharp.',
    choices: [
      'Animal ears',
      'Animal tails',
      'Sharp nails of animals',
      'Animal noses'
    ],
    answerIndex: 2
  },
  {
    question: "What does 'camouflage' mean?",
    clue: 'Hide by blending.',
    choices: [
      'To run very fast',
      'To sleep during the day',
      'To blend into the environment to hide',
      'To make loud sounds'
    ],
    answerIndex: 2
  },
  {
    question: "A 'tribe' refers to…",
    clue: 'People group.',
    choices: [
      'A group of trees',
      'A group of people with the same culture',
      'A large animal',
      'A small hut in the jungle'
    ],
    answerIndex: 1
  },
  {
    question: "The word 'swamp' means…",
    clue: 'Muddy wetland.',
    choices: [
      'A rocky hill',
      'Wet, muddy land with water',
      'A dry valley',
      'A desert area'
    ],
    answerIndex: 1
  },
  {
    question: "'Poacher' means…",
    clue: 'Illegal hunter.',
    choices: [
      'A forest farmer',
      'A person who studies plants',
      'A person who hunts animals illegally',
      'A jungle guide'
    ],
    answerIndex: 2
  },
  {
    question: "What is the meaning of 'creature'?",
    clue: 'Any animal.',
    choices: [
      'A type of plant',
      'Any living animal',
      'A piece of wood',
      'A rock in the river'
    ],
    answerIndex: 1
  }
];


const currentVocabIndex = ref(0);
const vocabScore = ref(0);
const isSubmitting = ref(false);
const vocabMessage = ref('');
const vocabMessageType = ref('');

const currentVocab = computed(() => {
  return vocabQuestions[currentVocabIndex.value] || { choices: [] };
});

const vocabFinished = computed(() => currentVocabIndex.value >= vocabQuestions.length);

function optionLabel(idx) {
  return String.fromCharCode(65 + idx);
}

function resetVocab() {
  currentVocabIndex.value = 0;
  vocabScore.value = 0;
  vocabMessage.value = '';
  vocabMessageType.value = '';
  isSubmitting.value = false;
}

function answerVocab(idx) {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const correct = currentVocab.value.answerIndex;
  if (idx === correct) {
    vocabScore.value += 10;
    vocabMessage.value = 'Correct!';
    vocabMessageType.value = 'success';
  } else {
    vocabMessage.value = 'Wrong answer.';
    vocabMessageType.value = 'error';
  }

  setTimeout(() => {
    vocabMessage.value = '';
    isSubmitting.value = false;
    if (currentVocabIndex.value < vocabQuestions.length - 1) {
      currentVocabIndex.value++;
    } else {
      // finished
      lastResult.value = 'Completed Vocabulary Quiz';
      gameState.value = 'game_over';
    }
  }, 700);
}

/* ---------------------------
   COLOR GUESS
   --------------------------- */
const colors = [
  { code: 'red', en: 'red', id: 'merah' },
  { code: 'blue', en: 'blue', id: 'biru' },
  { code: 'green', en: 'green', id: 'hijau' },
  { code: 'yellow', en: 'yellow', id: 'kuning' },
  { code: 'purple', en: 'purple', id: 'ungu' },
  { code: 'black', en: 'black', id: 'hitam' },
  { code: 'white', en: 'white', id: 'putih' },
  { code: 'orange', en: 'orange', id: 'oranye' }
];

const currentColor = ref(colors[0]);
const colorAnswer = ref('');
const colorMessage = ref('');
const colorMessageType = ref('');
const colorScore = ref(0);

/* choose random color; ensure not identical to current to avoid immediate repeats */
function pickRandomColorAvoidSame() {
  if (colors.length === 1) return colors[0];
  let candidate;
  let tries = 0;
  do {
    candidate = colors[Math.floor(Math.random() * colors.length)];
    tries++;
  } while (candidate.code === currentColor.value.code && tries < 8);
  return candidate;
}

function resetColor() {
  currentColor.value = pickRandomColorAvoidSame();
  colorAnswer.value = '';
  colorMessage.value = '';
  colorScore.value = 0;
}

function checkColorAnswer() {
  const user = (colorAnswer.value || '').trim().toLowerCase();
  if (!user) {
    colorMessage.value = 'Please type a color.';
    colorMessageType.value = 'error';
    return;
  }
  if (user === currentColor.value.en || user === currentColor.value.id) {
    colorMessage.value = 'Correct!';
    colorMessageType.value = 'success';
    colorScore.value += 5;
  } else {
    colorMessage.value = `Wrong — correct is "${currentColor.value.en}" / "${currentColor.value.id}"`;
    colorMessageType.value = 'error';
  }
}

function nextColor() {
  // choose new color different from current
  currentColor.value = pickRandomColorAvoidSame();
  colorAnswer.value = '';
  colorMessage.value = '';
}

function endColor() {
  // finish color game and summarize
  lastResult.value = 'Finished Color Guess';
  gameState.value = 'game_over';
}

/* ---------------------------
   LOGIC PUZZLE
   --------------------------- */
const logicQuestions = [
  { question: '2, 4, 6, 8, ... ? (next number)', answer: '10' },
  { question: '5 + 3 × 2 = ? (Use operator precedence)', answer: '11' },
  { question: '10, 20, 40, 80, ... ? (next number)', answer: '160' },
  { question: 'TRUE or FALSE: 8 > 12 ?', answer: 'false' },
  { question: '3, 9, 27, 81, ... ? (next number)', answer: '243' }
];

const currentLogicIndex = ref(0);
const logicAnswer = ref('');
const logicMessage = ref('');
const logicMessageType = ref('');
const logicScore = ref(0);

const currentLogic = computed(() => logicQuestions[currentLogicIndex.value] || { question: '', answer: '' });

function resetLogic() {
  currentLogicIndex.value = 0;
  logicAnswer.value = '';
  logicMessage.value = '';
  logicScore.value = 0;
}

function checkLogicAnswer() {
  const user = (logicAnswer.value || '').trim().toLowerCase();
  const correct = (currentLogic.value.answer || '').toLowerCase();
  if (!user) {
    logicMessage.value = 'Please enter an answer.';
    logicMessageType.value = 'error';
    return;
  }
  if (user === correct) {
    logicMessage.value = 'Correct!';
    logicMessageType.value = 'success';
    logicScore.value += 5;
  } else {
    logicMessage.value = `Wrong — correct: ${currentLogic.value.answer}`;
    logicMessageType.value = 'error';
  }
}

function nextLogic() {
  logicAnswer.value = '';
  logicMessage.value = '';
  if (currentLogicIndex.value < logicQuestions.length - 1) {
    currentLogicIndex.value++;
  } else {
    lastResult.value = 'Finished Logic Puzzles';
    gameState.value = 'game_over';
  }
}

function endLogic() {
  lastResult.value = 'Ended Logic Puzzles';
  gameState.value = 'game_over';
}

/* ---------------------------
   GAME OVER / UTIL
   --------------------------- */
const lastResult = ref('');

function gameOverLocal(reason) {
  lastResult.value = reason || 'Game Over';
  gameState.value = 'game_over';
}

function resetAll() {
  resetVocab();
  resetColor();
  resetLogic();
  gameState.value = 'menu';
}

/* ---------------------------
   INIT
   --------------------------- */
onMounted(() => {
  // initial seeds
  currentColor.value = colors[Math.floor(Math.random() * colors.length)];
});
</script>

<style scoped>
/* ---- Theme ---- */
:root {
  --bg: #0b0b0b;
  --panel: #91b49a;
  --accent: #22ff88;
  --accent-soft: rgba(185, 206, 195, 0.22);
  --muted: #9aa0a6;
  --glass: rgba(255,255,255,0.06);
  --radius: 14px;
  --card-bg: rgba(255,255,255,0.04);
  --transition: 0.22s cubic-bezier(.25,.46,.45,.94);
}

/* ===== FIX CARD VISIBILITY ===== */
.menu-card {
  background: rgba(255, 255, 255, 0.08); /* lebih terang */
  border: 1px solid rgba(255,255,255,0.14);
  color: #f4fff7; /* teks jadi putih */
}

/* Hover lebih bersih */
.menu-card:hover {
  background: rgba(142, 170, 156, 0.12);
  border-color: var(--accent);
  transform: translateY(-6px) scale(1.02);
}

/* ===== FIX TITLE ===== */
.title {
  color: #ffffff;
  font-size: 2.8rem;
  font-weight: 800;
  text-shadow: 0 0 12px rgba(187, 199, 193, 0.35);
}

.subtitle {
  color: #d6f5dd;
  font-size: 1.15rem;
  margin-top: 6px;
}

/* ===== FIX ICON IN CARD ===== */
.card-icon {
  font-size: 2.4rem;
  color: var(--accent);
  filter: drop-shadow(0 0 6px var(--accent-soft));
}

/* ===== TEXT INSIDE CARD ===== */
.menu-card h2 {
  font-size: 1.65rem;
  color: #eaffef;
  margin-bottom: 4px;
}

.menu-card p {
  font-size: 0.95rem;
  color: #c8e6d3;
}

/* ===== CARD GRID ===== */
.menu-grid {
  gap: 26px;
  padding: 0 12px;
  margin-top: 40px;
}

/* ===== PAGE CENTER FIX ===== */
.playing-game-content-wrapper {
  padding-top: 80px;
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 720px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
  .title {
    font-size: 2.2rem;
  }
  .menu-card {
    padding: 20px;
  }
  .card-icon {
    font-size: 2.2rem;
  }
}


/* ---- Main Wrapper ---- */
.playing-game-content-wrapper {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #0f2e21 0%, #06130b 100%);
  color: #e9fff0;
  font-family: Inter, system-ui, "Segoe UI", Roboto, Arial;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
}

/* ---- Countdown Overlay ---- */
.countdown-screen {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.countdown-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

.countdown-number {
  font-size: 5.2rem;
  font-weight: 900;
  color: var(--accent);
  text-shadow: 0 0 28px var(--accent-soft);
}

.countdown-number.go {
  font-size: 4.2rem;
}

/* ---- Content ---- */
.game-content {
  width: 100%;
  max-width: 980px;
  backdrop-filter: blur(12px);
}

/* ---- Menu ---- */
.menu-screen {
  text-align: center;
}

.title {
  font-size: 2.6rem;
  margin-bottom: .3rem;
  color: var(--accent);
  font-weight: 700;
  text-shadow: 0 0 18px var(--accent-soft);
}

.subtitle {
  color: var(--muted);
  font-size: 1.05rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 18px;
  margin-top: 24px;
}

.menu-card {
  background: var(--card-bg);
  border: 1px solid var(--accent-soft);
  padding: 24px;
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: 10px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 18px rgba(0,0,0,0.35);
}

.menu-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 35px rgba(0,0,0,0.65);
  border-color: var(--accent);
}

.card-icon {
  font-size: 1.9rem;
  color: var(--accent);
}

/* ---- Game Screen ---- */
.game-screen {
  background: var(--card-bg);
  padding: 24px;
  border-radius: var(--radius);
  border: 1px solid var(--accent-soft);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.back-btn {
  background: var(--glass);
  border: 1px solid rgba(255,255,255,0.08);
  color: var(--accent);
  padding: 8px 14px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.back-btn:hover {
  border-color: var(--accent);
  background: rgba(154, 187, 168, 0.08);
}

.score {
  color: var(--accent);
  font-weight: 700;
  font-size: 1.05rem;
}

/* ---- Quiz ---- */
.quiz-box {
  background: rgba(0,0,0,0.4);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.04);
  backdrop-filter: blur(6px);
}

.q-index {
  font-size: .9rem;
  color: var(--muted);
  margin-bottom: 8px;
}

.q-text {
  color: var(--accent);
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.clue {
  font-size: .95rem;
  color: var(--muted);
  margin-bottom: 16px;
}

.options-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.option {
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 2px solid var(--accent-soft);
  color: #dfffe0;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  font-size: .98rem;
}

.option:hover {
  transform: translateY(-6px);
  background: rgba(233, 248, 240, 0.1);
  border-color: var(--accent);
  color: #3f5645;
}

.opt-label {
  font-weight: 800;
  color: var(--accent);
}

/* ---- Inputs & Buttons ---- */
.game-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.05);
  color: #eaffea;
  margin-bottom: 12px;
  transition: var(--transition);
}

.game-input:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(233, 255, 243, 0.08);
}

.code-actions, .color-btns {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.submit-btn, .next-btn, .skip-btn {
  padding: 10px 16px;
  border-radius: var(--radius);
  cursor: pointer;
  font-weight: 700;
  font-size: .95rem;
  transition: var(--transition);
}

.submit-btn {
  background: var(--accent);
  color: #8fd58f;
}

.submit-btn:hover {
  filter: brightness(1.15);
}

.next-btn, .skip-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: #e9fff0;
}

.next-btn:hover, .skip-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: var(--accent);
}

/* ---- Feedback ---- */
.feedback {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: .95rem;
}

.feedback.success {
  background: rgba(44, 221, 126, 0.12);
  color: var(--accent);
  border: 1px solid var(--accent-soft);
}

.feedback.error {
  background: rgba(255,0,0,0.08);
  color: #ff9e9e;
  border: 1px solid rgba(255,0,0,0.2);
}

/* ---- Color Box ---- */
.color-box-area {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
  flex-wrap: wrap;
}

.color-box {
  width: 240px;
  height: 170px;
  border-radius: var(--radius);
  border: 3px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 0 40px rgba(0,0,0,0.45);
  transition: var(--transition);
}

.color-box:hover {
  transform: scale(1.03);
}

/* ---- Logic Box ---- */
.logic-box {
  background: rgba(0,0,0,0.4);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.04);
}

/* ---- Responsive ---- */
@media (max-width: 720px) {
  .options-container {
    grid-template-columns: 1fr;
  }
  .menu-grid {
    grid-template-columns: 1fr;
  }
  .color-box {
    width: 100%;
    height: 150px;
  }
  .game-content {
    padding: 12px;
  }
  .title {
    font-size: 2.2rem;
  }
}
</style>
