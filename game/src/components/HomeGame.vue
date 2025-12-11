<template>
  <div class="home-content-wrapper">
    <main class="main-content">
      <h1 class="welcome-title">Welcome, Player !</h1>
      <p class="tagline">Siap untuk memecahkan misteri?</p>
      <button @click="startGame" class="game-start-button">
        Game Start
      </button>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const startGame = () => {
  router.push('/PlayingGame'); // Pastikan rute ini sesuai di router/index.js
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.home-content-wrapper {
  background-color: #111;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  min-height: calc(100vh - var(--navbar-height, 0px) - var(--footer-height, 0px)); /* Sesuaikan tinggi agar tidak tumpang tindih dengan navbar/footer jika fixed */
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

.welcome-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #0f0;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
}

.tagline {
  font-size: 1rem;
  margin-bottom: 3rem;
  color: #aaa;
}

.game-start-button {
  background-color: #0f0;
  color: #111;
  border: 3px solid #0a0;
  padding: 1.5rem 3rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.7);
}

.game-start-button:hover {
  background-color: #0a0;
  color: #fff;
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.4rem;
  }
  .tagline {
    font-size: 0.9rem;
  }
  .game-start-button {
    font-size: 1.2rem;
    padding: 1.2rem 2.5rem;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.2rem;
  }
  .tagline {
    font-size: 0.75rem;
  }
  .game-start-button {
    font-size: 1rem;
    padding: 1rem 2rem;
  }
}
</style>