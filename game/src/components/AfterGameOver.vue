<template>
  <div class="game-over-content-wrapper">
    <main class="main-content">
      <h1 class="game-over-title" :class="{ 'win-state': gameResult?.reason === 'win' }">
        {{ gameResult?.reason === 'win' ? 'SELAMAT! KAMU BERHASIL!' : 'GAME OVER' }}
      </h1>
      <p class="game-over-message" v-if="gameResult?.reason === 'memory_fail'">
        Kamu gagal mengingat dengan benar... Ingatan terlalu kabur.
      </p>
      <p class="game-over-message" v-else-if="gameResult?.reason === 'code_fail'">
        KAMU GAGAL MENEBUS KODE RAHASIA! Alarm bunker berbunyi keras... Kamu kehilangan kesadaran.
      </p>
      <p class="game-over-message" v-else-if="gameResult?.reason === 'win'">
        Semua kepingan ingatanmu telah tersusun menjadi satu ingatan utuh, kamu dapat mengingat semua rentetan kejadian sebelum kamu disekap dibunker itu.
      </p>

      <div class="score-summary">
        <h2>Ringkasan Game</h2>
        <p>Skor Akhir: <span class="highlight-score">{{ gameResult?.finalScore || 0 }}</span></p>
        <p>Total Pertanyaan: {{ gameResult?.totalQuestions || 0 }}</p>

        <h3>Percobaan per Pertanyaan:</h3>
        <ul class="attempts-list" v-if="gameResult?.attempts">
          <li v-for="(memAttempt, index) in gameResult.attempts.memory" :key="index">
            Pertanyaan {{ index + 1 }}:
            Ingatan: {{ memAttempt }} percobaan,
            Kode: {{ gameResult.attempts.code[index] }} percobaan
          </li>
        </ul>
        <p v-else>Data percobaan tidak tersedia.</p>
      </div>

      <div v-if="gameResult?.reason === 'win'" class="win-story-text">
  <p class="story-paragraph">
    Kamu adalah Bernadeth Calestika — agen intelijen muda dengan sandi "Detha".
  </p>
  <p class="story-paragraph">
    You are Bernadeth Calestika — a young intelligence agent known by the codename "Detha".
  </p>

  <p class="story-paragraph">
    Semua ingatanmu akhirnya kembali, termasuk misi utamamu: menyusup ke fasilitas rahasia di dalam hutan tropis Kalimantan.
  </p>
  <p class="story-paragraph">
    All your memories finally return, including your main mission: infiltrating a secret facility deep inside the Kalimantan rainforest.
  </p>

  <p class="story-paragraph">
    Kamu tidak datang sendirian. Tujuh agen dikirim bersamamu, namun hanya tiga yang tersisa.
  </p>
  <p class="story-paragraph">
    You didn't come alone. Seven agents were sent with you, but only three remain.
  </p>

  <p class="story-paragraph">
    Dua hilang di dalam hutan, dan satu lagi terperangkap di bunker lain—sama sepertimu.
  </p>
  <p class="story-paragraph">
    Two vanished in the jungle, and another is trapped in a different bunker—just like you.
  </p>

  <p class="story-paragraph">
    Ingatan terakhir yang kembali mengungkap kenyataan pahit: misi ini adalah jebakan.
  </p>
  <p class="story-paragraph">
    The final memory that returns reveals a bitter truth: this mission was a trap.
  </p>

  <p class="story-paragraph">
    Pengkhianatnya bukan ilmuwan itu, tetapi atasanmu sendiri.
  </p>
  <p class="story-paragraph">
    The traitor wasn't the scientist — it was your own superior.
  </p>

  <p class="story-paragraph">
    Kini pintu bunker terbuka, tetapi yang menunggumu di luar bukan kebebasan… melainkan awal dari sesuatu yang jauh lebih besar.
  </p>
  <p class="story-paragraph">
    Now the bunker door opens, but what awaits outside is not freedom… but the beginning of something much bigger.
  </p>

  <p class="story-paragraph final-reveal">
    Kamu membawa bukti. Kamu tahu kebenarannya.  
    Dan dia pasti sedang mencarimu—sebelum kamu mencarinya.
  </p>
  <p class="story-paragraph final-reveal">
    You carry the evidence. You know the truth.  
    And he is certainly looking for you—before you can look for him.
  </p>

  <p class="story-paragraph ending">TAMAT / THE END</p>
</div>


      <button @click="playAgain" class="play-again-button">Main Lagi</button>
      <button @click="goHome" class="go-home-button">Kembali ke Beranda</button>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


const gameResult = ref(null);

onMounted(() => {
  const storedResult = localStorage.getItem('gameResult');
  if (storedResult) {
    gameResult.value = JSON.parse(storedResult);
  }
});

const playAgain = () => {
  localStorage.removeItem('gameResult'); // Bersihkan data game sebelumnya
  router.push('/PlayingGame'); // Mulai game baru
};

const goHome = () => {
  localStorage.removeItem('gameResult'); // Bersihkan data game
  router.push('/'); // Kembali ke halaman utama (landing page)
};


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.game-over-content-wrapper {
  /* Nama kontainer diubah menjadi game-over-content-wrapper agar konsisten */
  background-color: #111;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  min-height: calc(100vh - var(--navbar-height, 0px)); /* Sesuaikan jika navbar punya tinggi fixed */
  display: flex;
  flex-direction: column;
  flex: 1; /* Penting agar komponen ini mengisi sisa ruang di App.vue */
}

/* Bagian CSS untuk .navbar, .logo-container, .nav-links, .login-button
   telah dihapus dari sini karena sudah global di App.vue */

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
}

.game-over-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #f00;
  text-shadow: 0 0 8px rgba(255, 0, 0, 0.7);
  animation: pulse-red 1.5s infinite alternate;
}

.game-over-title.win-state {
    color: #0f0;
    text-shadow: 0 0 8px rgba(0, 255, 0, 0.7);
    animation: pulse-green 1.5s infinite alternate;
}

.game-over-message {
  font-size: 0.9rem;
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.5;
  color: #bbb;
}

.score-summary {
  background-color: #222;
  border: 2px solid #0f0;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
}

.score-summary h2 {
    font-size: 1.2rem;
    color: #0f0;
    margin-bottom: 1rem;
}

.score-summary p {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #ddd;
}

.highlight-score {
    color: #0f0;
    font-weight: bold;
    font-size: 1.1rem;
}

.score-summary h3 {
    margin-top: 1.5rem;
    font-size: 1rem;
    color: #0f0;
    margin-bottom: 0.75rem;
}

.attempts-list {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: left;
    font-size: 0.8rem;
    color: #ccc;
}

.attempts-list li {
    margin-bottom: 0.4rem;
    background-color: #333;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #444;
}

.win-story-text {
    max-width: 700px;
    background-color: #222;
    border: 2px solid #0f0;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
    text-align: left;
    line-height: 1.8;
    white-space: pre-wrap; /* Preserve newlines */
    overflow: hidden;
    margin-bottom: 2rem;
}

.story-paragraph {
    font-size: 0.8rem;
    color: #fff;
    margin-bottom: 1rem;
}

.story-paragraph.final-reveal {
    font-size: 1rem;
    color: #0f0;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
    margin-top: 2rem;
    text-align: center;
}

.story-paragraph.ending {
    font-size: 1.5rem;
    color: #0f0;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
    margin-top: 3rem;
    text-align: center;
    animation: pulse-green 1s infinite alternate;
}

.play-again-button,
.go-home-button {
  background-color: #0f0;
  color: #111;
  border: none;
  padding: 0.8rem 1.5rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  margin: 0.5rem;
}

.play-again-button:hover,
.go-home-button:hover {
  background-color: #0a0;
  color: #fff;
}

/* Keyframe Animations */
@keyframes pulse-red {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.05); opacity: 0.9; color: #ff3333; }
}

@keyframes pulse-green {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.05); opacity: 0.9; color: #33ff33; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .game-over-title {
    font-size: 2rem;
  }
  .game-over-message, .score-summary p, .attempts-list li, .story-paragraph {
    font-size: 0.8rem;
  }
  .play-again-button, .go-home-button {
    font-size: 0.8rem;
    padding: 0.7rem 1.2rem;
  }
  .score-summary, .win-story-text {
      padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .game-over-title {
    font-size: 1.5rem;
  }
  .game-over-message, .score-summary p, .attempts-list li, .story-paragraph {
    font-size: 0.7rem;
  }
  .play-again-button, .go-home-button {
    font-size: 0.7rem;
    padding: 0.6rem 1rem;
    display: block;
    width: calc(100% - 1rem);
    margin: 0.5rem auto;
  }
  .score-summary, .win-story-text {
      padding: 1rem;
  }
}
</style>