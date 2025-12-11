<template>
  <div class="karakter-content-wrapper">
    <main class="main-content">
      <div class="karakter-card">

        <h1>🔍 Personality Scanner</h1>
        <p class="subtitle">Pilih tes, jawab pertanyaan, dan sistem akan membaca pola jawabmu — bukan hanya skor.</p>

        <!-- GAME SELECTOR -->
        <div v-if="!started && !showResult" class="game-selector">
          <h2>Pilih Tes</h2>
          <div class="selector-list">
            <button v-for="(g,key) in games" :key="key" class="selector-btn" @click="startGame(key)">
              <div class="selector-title">{{ g.title }}</div>
              <div class="selector-desc">{{ g.short }}</div>
            </button>
          </div>
        </div>

        <!-- QUESTION PANEL -->
        <div v-else-if="started && !showResult" class="question-box">
          <div class="question-header">
            <button class="back-small" @click="cancelToMenu">← Back</button>
            <div class="progress">Question {{ currentIndex + 1 }} / {{ currentQuestions.length }}</div>
          </div>

          <h3 class="question">{{ currentQuestions[currentIndex].text }}</h3>

          <div class="choices">
            <button
              v-for="(c,i) in currentQuestions[currentIndex].choices"
              :key="i"
              class="choice-btn"
              @click="selectChoice(c.score)"
            >
              {{ c.label }}
            </button>
          </div>

          <div class="hint">
            <small>Tip: Jawabanmu disimpan sebagai pola — sistem menganalisa cara kamu memilih.</small>
          </div>
        </div>

        <!-- RESULT -->
        <div v-else-if="showResult" class="result-box">
          <h2>Hasil: <span class="type-badge">{{ result.type }}</span></h2>
          <p class="result-desc">{{ result.description }}</p>

          <div class="result-meta">
            <p><strong>Game:</strong> {{ games[currentGame].title }}</p>
            <p><strong>Skor total:</strong> {{ score }}</p>
            <p><strong>Pola jawaban:</strong> {{ answers.join(", ") }}</p>
          </div>

          <div class="result-actions">
            <button class="save-btn" @click="saveResult">Simpan Hasil</button>
            <button class="restart-btn" @click="restart">Ulang Tes</button>
            <button class="menu-btn" @click="backToMenu">Kembali ke Menu</button>
          </div>

          <p v-if="saveMessage" class="save-msg">{{ saveMessage }}</p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

/*
  Personality Scanner (single-page)
  - games: object each with questions + results thresholds
  - uses answers[] to analyze pattern (not only sum)
*/

// ---------- GAMES CONFIG ----------
const games = {
  survival: {
    title: "🔥 Survival Instinct Test",
    short: "Quick decisions vs caution",
    questions: [
      { text: "Jika ada bahaya, apa reaksi awalmu?", choices: [
        { label: "Langsung bertindak", score: 3 },
        { label: "Menganalisis situasi", score: 2 },
        { label: "Menjauh dulu", score: 1 }
      ]},
      { text: "Jika harus memilih, kamu lebih mengutamakan...", choices: [
        { label: "Kecepatan", score: 3 },
        { label: "Strategi", score: 2 },
        { label: "Keamanan", score: 1 }
      ]},
      { text: "Jika tersesat di tempat asing...", choices: [
        { label: "Cari jalan sendiri", score: 3 },
        { label: "Cari tempat aman dulu", score: 2 },
        { label: "Tunggu bantuan", score: 1 }
      ]}
    ],
    results: [
      { min: 8, type: "🔥 Alpha Survivor", description: "Pemimpin alami: cepat mengambil keputusan dan bertindak di saat genting." },
      { min: 5, type: "🧠 Tactical Survivor", description: "Terencana: mengutamakan strategi dan penyusunan rencana sebelum bertindak." },
      { min: 0, type: "🌙 Passive Survivor", description: "Hati-hati: memilih jalur aman dan menghindari risiko." }
    ]
  },

  emotion: {
    title: "💙 Emotional Reading Test",
    short: "Respon emosional & empati",
    questions: [
      { text: "Saat temanmu marah padamu, kamu...", choices: [
        { label: "Melawan balik", score: 3 },
        { label: "Tetap tenang", score: 2 },
        { label: "Menghindar", score: 1 }
      ]},
      { text: "Kamu menangis ketika...", choices: [
        { label: "Terlalu marah / stres", score: 3 },
        { label: "Tersentuh secara emosional", score: 2 },
        { label: "Jarang menangis", score: 1 }
      ]},
      { text: "Jika melihat seseorang sedih, kamu...", choices: [
        { label: "Langsung konfrontasi", score: 3 },
        { label: "Mendekat dan dengarkan", score: 2 },
        { label: "Memberi ruang", score: 1 }
      ]}
    ],
    results: [
      { min: 8, type: "🔥 Intense Soul", description: "Emosi kuat dan ekspresif; reaksi intens terhadap situasi emosional." },
      { min: 5, type: "🌊 Deep Feeler", description: "Peka dan empatik; memahami perasaan orang lain." },
      { min: 0, type: "🪶 Lighthearted", description: "Tenang dan stabil dalam emosi; tidak mudah terpancing." }
    ]
  },

  logic: {
    title: "🧠 Logic Pattern Test",
    short: "Problem solving & pola pikir",
    questions: [
      { text: "Jika ada puzzle sulit, kamu...", choices: [
        { label: "Langsung coba solusi", score: 3 },
        { label: "Pikirkan pola terlebih dahulu", score: 2 },
        { label: "Cari bantuan / referensi", score: 1 }
      ]},
      { text: "Kamu bekerja lebih baik saat...", choices: [
        { label: "Tertekan", score: 3 },
        { label: "Stabil & tenang", score: 2 },
        { label: "Santai tanpa deadline", score: 1 }
      ]},
      { text: "Puzzle favoritmu?", choices: [
        { label: "Rubik / matematika", score: 3 },
        { label: "Teka-teki logis", score: 2 },
        { label: "Teka-teki ringan", score: 1 }
      ]}
    ],
    results: [
      { min: 8, type: "⚡ Sharp-Mind", description: "Cepat dan agresif memecahkan masalah; suka tantangan kognitif." },
      { min: 5, type: "🔍 Analyzer", description: "Teliti dan sistematis; mencari pola sebelum bertindak." },
      { min: 0, type: "🌫 Casual Thinker", description: "Santai, memilih tingkat kesulitan yang nyaman." }
    ]
  }
};

// ---------- STATE ----------
const started = ref(false);
const currentGame = ref("");
const currentQuestions = ref([]);
const currentIndex = ref(0);
const answers = ref([]);   // pola jawaban (nilai: 1/2/3)
const score = ref(0);
const showResult = ref(false);
const result = ref({ type: "", description: "" });
const saveMessage = ref("");

// ---------- ACTIONS ----------
function startGame(key) {
  currentGame.value = key;
  currentQuestions.value = games[key].questions;
  started.value = true;
  currentIndex.value = 0;
  answers.value = [];
  score.value = 0;
  showResult.value = false;
  result.value = { type: "", description: "" };
  saveMessage.value = "";
}

function cancelToMenu() {
  // reset and return to selector
  started.value = false;
  currentGame.value = "";
  currentQuestions.value = [];
  currentIndex.value = 0;
  answers.value = [];
  score.value = 0;
  showResult.value = false;
  result.value = { type: "", description: "" };
  saveMessage.value = "";
}

function selectChoice(s) {
  // record pattern
  answers.value.push(s);
  score.value += s;

  // advance or analyze
  if (currentIndex.value < currentQuestions.value.length - 1) {
    currentIndex.value++;
  } else {
    analyzePersonality();
  }
}

// ---------- ANALYSIS BASED ON PATTERN ----------
function analyzePersonality() {
  showResult.value = true;

  const arr = answers.value.slice(); // copy
  const sum = score.value;

  const high = arr.filter(x => x === 3).length;
  const mid = arr.filter(x => x === 2).length;
  const low = arr.filter(x => x === 1).length;

  // 1) semua tinggi
  if (high === arr.length) {
    result.value = {
      type: "🔥 Pure Alpha",
      description: "Kamu konsisten memilih jawaban paling agresif/aktif — sifat dominan dan cepat bertindak."
    };
    return;
  }

  // 2) semua rendah
  if (low === arr.length) {
    result.value = {
      type: "🌙 Ultra Cautious",
      description: "Kamu memilih opsi paling aman. Sangat berhati-hati dan menghindari risiko."
    };
    return;
  }

  // 3) semua tengah
  if (mid === arr.length) {
    result.value = {
      type: "🧠 Balanced Thinker",
      description: "Kamu stabil, rasional, dan konsisten. Keputusan yang seimbang dan terencana."
    };
    return;
  }

  // 4) pola naik→turun→naik (contoh)
  if (arr.length >= 3 && arr[0] < arr[1] && arr[1] > arr[2]) {
    result.value = {
      type: "⚡ Unpredictable",
      description: "Gaya jawabanmu naik turun — spontan dan sulit ditebak. Energi tinggi tapi fluktuatif."
    };
    return;
  }

  // 5) awal ragu (1) -> akhir agresif (3)
  if (arr[0] === 1 && arr[arr.length - 1] === 3) {
    result.value = {
      type: "🌅 Rising Confidence",
      description: "Kepercayaan dirimu tumbuh seiring pertanyaan. Kamu menjadi lebih berani saat diuji."
    };
    return;
  }

  // 6) awal agresif (3) -> akhir ragu (1)
  if (arr[0] === 3 && arr[arr.length - 1] === 1) {
    result.value = {
      type: "🌫 Hidden Doubt",
      description: "Kamu terlihat tegas di awal tetapi menjadi lebih berhati-hati seiring waktu — mungkin ada keraguan tersembunyi."
    };
    return;
  }

  // 7) campuran tanpa pola khas -> fallback ke thresholds per game
  calculateResultScore(sum);
}

function calculateResultScore(sum) {
  const resList = games[currentGame.value].results;
  // choose first matching threshold (resList should be sorted desc by min)
  for (let r of resList) {
    if (sum >= r.min) {
      result.value = { type: r.type, description: r.description };
      return;
    }
  }
  // fallback generic
  result.value = {
    type: "🔎 Undefined",
    description: "Hasil sulit ditentukan — kombinasi jawabanmu unik."
  };
}

// ---------- SAVE / RESTART ----------
function saveResult() {
  try {
    const saved = JSON.parse(localStorage.getItem("personality_results_v1") || "[]");
    saved.unshift({
      game: currentGame.value,
      type: result.value.type,
      description: result.value.description,
      score: score.value,
      answers: answers.value.slice(),
      ts: Date.now()
    });
    // keep last 50
    localStorage.setItem("personality_results_v1", JSON.stringify(saved.slice(0,50)));
    saveMessage.value = "Hasil disimpan ke localStorage.";
  } catch (e) {
    saveMessage.value = "Gagal menyimpan hasil.";
  }
}

function restart() {
  // restart same test
  currentIndex.value = 0;
  answers.value = [];
  score.value = 0;
  showResult.value = false;
  result.value = { type: "", description: "" };
  saveMessage.value = "";
}

function backToMenu() {
  // go back to selector
  started.value = false;
  currentGame.value = "";
  currentQuestions.value = [];
  currentIndex.value = 0;
  answers.value = [];
  score.value = 0;
  showResult.value = false;
  result.value = { type: "", description: "" };
  saveMessage.value = "";
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.karakter-content-wrapper {
  background-color: #bdc5b4;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 18px;
  font-family: 'Press Start 2P', monospace;
  color: #e9fff0;
}

.main-content {
  width: 100%;
  max-width: 820px;
}

.karakter-card {
  background: linear-gradient(180deg, rgba(4,6,4,0.9), rgba(8,10,8,0.98));
  border: 2px solid #0f0;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0,255,0,0.3);
  text-align: center;
}

/* TITLE */
h1 {
  color: #22ff88;
  text-align: center;
  margin-bottom: 6px;
  text-shadow: 0 0 8px rgba(0,255,0,0.4);
  font-size: 1.1rem;
}

.subtitle {
  text-align: center;
  color: #9fdab0;
  margin-bottom: 18px;
  font-size: 0.7rem;
}

/* SELECTOR */
.game-selector { text-align: center; }
.selector-list {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap: 12px;
  margin-top: 14px;
}
.selector-btn {
  background: #111;
  border: 2px solid #0f0;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  color: #dfffe0;
  transition: transform .15s ease, box-shadow .15s ease, border-color .2s;
  font-family: 'Press Start 2P', monospace;
}
.selector-btn:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 20px rgba(0,255,0,0.6);
  border-color: #0f0;
}
.selector-title {
  font-weight: 800;
  color: #eaffef;
  margin-bottom: 6px;
  font-size: .75rem;
}
.selector-desc {
  color: #bfe7c4;
  font-size: 0.6rem;
}

/* QUESTION SECTION */
.question-box { margin-top: 12px; }
.question-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom: 12px;
}
.back-small {
  background: transparent;
  color: #0f0;
  border: 2px solid #0f0;
  padding: 6px 10px;
  border-radius:8px;
  cursor:pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: .6rem;
}
.progress { color: #bfe7c4; font-size: .65rem; }
.question {
  color: #dfffe0;
  font-size: 0.75rem;
  margin-bottom: 12px;
}
.choices { display:flex; flex-direction:column; gap:10px; }
.choice-btn {
  background: #111;
  border: 2px solid #0f0;
  color: #cfdccf;
  font-weight: 700;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: .7rem;
}
.choice-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 20px rgba(0,255,0,0.5);
}

/* RESULT */
.result-box { margin-top: 12px; text-align: center; }
.type-badge {
  display:inline-block;
  background: rgba(34,255,136,0.06);
  color: #22ff88;
  padding: 6px 12px;
  border-radius: 999px;
  border: 2px solid #0f0;
  font-weight: 800;
  font-size: .7rem;
}
.result-desc {
  margin: 12px auto;
  color:#d9fbd3;
  max-width:720px;
  line-height:1.6;
  font-size: .65rem;
}
.result-meta {
  margin-top: 10px;
  color:#b8eac0;
  font-size: .6rem;
}

.result-actions {
  display:flex;
  gap:10px;
  justify-content:center;
  margin-top:14px;
  flex-wrap:wrap;
}

.save-btn, .restart-btn, .menu-btn {
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  font-weight:700;
  font-family: 'Press Start 2P', monospace;
  font-size: .7rem;
}

.save-btn {
  background: #0f0;
  color:#041004;
  border: 2px solid #0a0;
  box-shadow: 0 0 12px rgba(0,255,0,0.4);
}
.restart-btn, .menu-btn {
  background: transparent;
  border: 2px solid #0f0;
  color:#dfffe0;
}
.restart-btn:hover, .menu-btn:hover {
  background: rgba(0,255,0,0.1);
}

.save-msg {
  margin-top:10px;
  color:#0f0;
  font-size: .6rem;
}

/* small helpers */
.hint {
  margin-top: 12px;
  color: #a8f6bb;
  font-size: .6rem;
}

/* responsive */
@media (max-width:720px) {
  .selector-list { grid-template-columns: 1fr; }
  .karakter-card { padding: 18px;}
}
</style>
