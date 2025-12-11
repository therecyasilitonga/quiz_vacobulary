<template>
  <div class="home-wrapper">
    <!-- Cute floating particles -->
    <div class="bubble-layer"></div>
    <div class="bubble-layer2"></div>
    <div class="bubble-layer3"></div>

    <main class="content" aria-live="polite">
      <h1 class="title">🌿 Welcome to EBT!</h1>
      <p class="subtitle">English Brain Training — Ready to boost your skills?</p>

      <div class="controls">
        <button
          v-if="!countdownRunning"
          @click="beginCountdown"
          class="start-btn"
        >
          Start Adventure 🚀
        </button>

        <div v-else class="countdown-area">
          <div class="countdown-bubble" :class="{ go: countdownText === 'GO!' }">
            {{ countdownText }}
          </div>

          <button class="cancel-btn" @click="cancelCountdown">Cancel</button>
        </div>
      </div>

      <p class="hint">Tip: Timed mode gives bonus difficulty!</p>
    </main>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const countdownValues = [3, 2, 1, "GO!"];
const countdownIndex = ref(0);
const countdownRunning = ref(false);
const countdownText = ref("");
let countdownTimer = null;

/* ===== SOUND EFFECTS ===== */

function playTick() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.value = 600;

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
}

function playGoSound() {
  try {
    const ctx = new AudioContext();
    const o1 = ctx.createOscillator();
    const g = ctx.createGain();

    o1.type = "triangle";
    o1.frequency.value = 850;

    o1.connect(g);
    g.connect(ctx.destination);

    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

    o1.start();
    o1.stop(ctx.currentTime + 0.25);
  } catch {}
}

/* ===== COUNTDOWN LOGIC ===== */

function beginCountdown() {
  countdownRunning.value = true;
  countdownIndex.value = 0;
  countdownText.value = countdownValues[0];
  playTick();

  countdownTimer = setInterval(() => {
    countdownIndex.value++;
    if (countdownIndex.value < countdownValues.length) {
      countdownText.value = countdownValues[countdownIndex.value];
      countdownText.value === "GO!" ? playGoSound() : playTick();
    } else {
      stopCountdown();
      setTimeout(() => router.push("/PlayingGame"), 350);
    }
  }, 900);
}

function stopCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = null;
  countdownRunning.value = false;
  countdownIndex.value = 0;
  countdownText.value = "";
}

function cancelCountdown() {
  stopCountdown();
}

onUnmounted(stopCountdown);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;900&display=swap');

.home-wrapper {
  width: 100%;
  height: calc(100vh - var(--navbar-height, 0px) - var(--footer-height, 0px));
  background: linear-gradient(180deg, #0d3b2e, #06251c, #031510);
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #eafff3;
  font-family: "Nunito", sans-serif;
}

/* BUBBLE PARTICLES */
.bubble-layer,
.bubble-layer2,
.bubble-layer3 {
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(120,255,170,0.12) 1px, transparent 2px);
  animation: float 120s linear infinite;
}
.bubble-layer2 { opacity: 0.12; animation-duration: 160s; }
.bubble-layer3 { opacity: 0.07; animation-duration: 200s; }

@keyframes float {
  from { transform: translateY(0); }
  to { transform: translateY(-900px); }
}

/* CONTENT */
.content {
  text-align: center;
  padding: 1rem;
  z-index: 10;
}

.title {
  font-size: 2rem;
  color: #c9ffe1;
  text-shadow: 0 0 18px rgba(0,255,170,0.4);
}

.subtitle {
  margin-top: 8px;
  font-size: 1rem;
  opacity: 0.9;
  color: #a8ffd7;
}

/* BUTTON START */
.start-btn {
  background: linear-gradient(45deg, #00ffae, #00c97a);
  color: #003922;
  
  padding: 1rem 2.8rem;
  border-radius: 18px;

  font-size: 1rem;
  font-weight: 900;

  border: none;
  cursor: pointer;
  transition: 0.2s;
  box-shadow:
    0 0 15px rgba(0,255,150,0.6),
    inset 0 0 8px rgba(255,255,255,0.2);
}
.start-btn:hover {
  transform: scale(1.05);
  box-shadow:
    0 0 25px rgba(0,255,150,0.8),
    inset 0 0 12px rgba(255,255,255,0.3);
}

/* COUNTDOWN AREA */
.countdown-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.countdown-bubble {
  width: 215px;
  height: 215px;
  border-radius: 50%;

  background: linear-gradient(180deg, #d9ffe9, #9ef9ca);
  color: #003522;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 3.5rem;
  font-weight: 900;

  box-shadow: 0 0 35px rgba(0,255,170,0.45);
  transition: 0.25s ease;
}

/* "GO!" Explosion Style */
.countdown-bubble.go {
  background: linear-gradient(45deg, #00ffae, #00d887);
  color: white;
  font-size: 2.4rem;
  animation: pop 0.45s ease;
  box-shadow: 0 0 55px rgba(0,255,170,0.6);
}

@keyframes pop {
  0% { transform: scale(0.7); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

.cancel-btn {
  background: rgba(0,0,0,0.45);
  padding: 10px 22px;
  border: 2px solid #00ffae;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #c9ffe9;

  cursor: pointer;
  transition: .15s;
}
.cancel-btn:hover {
  background: rgba(0,0,0,0.7);
}

.hint {
  margin-top: 14px;
  font-size: 0.85rem;
  opacity: 0.85;
  color: #aaffdd;
}
</style>
