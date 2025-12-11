<template>
  <div class="game-over-content-wrapper">
    <main class="main-content">
      <h1 class="game-over-title" :class="{ 'win-state': gameResult?.reason === 'win' }">
        {{ gameResult?.reason === 'win' ? 'SELAMAT! KAMU BERHASIL!' : 'GAME OVER' }}
      </h1>

      <!--===== GAME RESULT MESSAGE =====-->
      <p class="game-over-message" v-if="gameResult?.reason === 'memory_fail'">
        Kamu gagal mengingat dengan benar... Ingatan terlalu kabur.
      </p>
      <p class="game-over-message" v-else-if="gameResult?.reason === 'code_fail'">
        KAMU GAGAL MENEBUS KODE RAHASIA! Alarm bunker berbunyi keras... Kamu kehilangan kesadaran.
      </p>
      <p class="game-over-message" v-else-if="gameResult?.reason === 'win'">
        Semua kepingan ingatanmu telah tersusun menjadi satu ingatan utuh, kamu dapat mengingat semua rentetan kejadian sebelum kamu disekap dibunker itu.
      </p>

      <!--===== SCORE SUMMARY =====-->
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

      <!--===== AFTER GAME – ENCOURAGEMENT TEXT (FAIL STATE ONLY) =====-->
      <div v-if="gameResult?.reason !== 'win'" class="encouragement-box">
        <h3>Don't Give Up, Agent.</h3>
        <p>
          Every failure sharpens your instincts.  
          Every mistake teaches you something the enemy doesn't want you to know.  
          You are stronger than this setback.
        </p>
        <p>
          Your mind is a weapon — sometimes it misfires, but it never breaks.  
          Take a breath, refocus, and dive back in.  
          The bunker didn’t beat you… not yet.
        </p>
        <p class="encouragement-strong">
          Get up. Try again.  
          Agents fall — legends rise.
        </p>
      </div>

      <!--===== WIN STORY =====-->
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
  localStorage.removeItem('gameResult');
  router.push('/PlayingGame');
};

const goHome = () => {
  localStorage.removeItem('gameResult');
  router.push('/');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* ====================== GENERAL STYLE ====================== */
.game-over-content-wrapper {
  background-color: #111;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  min-height: calc(100vh - var(--navbar-height, 0px));
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
}

/* ====================== HEADERS ====================== */
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

/* ====================== SCORE SUMMARY ====================== */
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

/* ====================== ENCOURAGEMENT BOX (FAIL ONLY) ====================== */
.encouragement-box {
  background-color: #222;
  border: 2px solid #f00;
  padding: 1.5rem;
  max-width: 600px;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
}

.encouragement-box h3 {
  color: #f00;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.encouragement-box p {
  color: #ddd;
  font-size: 0.8rem;
  line-height: 1.6;
}

.encouragement-strong {
  margin-top: 1rem;
  color: #fff;
  font-size: 0.9rem;
  text-shadow: 0 0 6px rgba(255, 0, 0, 0.8);
}

/* ====================== WIN STORY ====================== */
.win-story-text {
  max-width: 700px;
  background-color: #222;
  border: 2px solid #0f0;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  text-align: left;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.story-paragraph {
  font-size: 0.8rem;
  margin-bottom: 1rem;
  color: #fff;
}

.story-paragraph.final-reveal {
  font-size: 1rem;
  color: #0f0;
  text-align: center;
}

.story-paragraph.ending {
  font-size: 1.5rem;
  color: #0f0;
  text-align: center;
  animation: pulse-green 1s infinite alternate;
}

/* ====================== BUTTONS ====================== */
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

/* ====================== ANIMATIONS ====================== */
@keyframes pulse-red {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.9; transform: scale(1.05); }
}

@keyframes pulse-green {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.9; transform: scale(1.05); }
}
</style>
