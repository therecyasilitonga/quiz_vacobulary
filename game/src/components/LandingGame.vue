<template>
  <div class="landing-content-wrapper">
    <main class="main-content">
      <h1>Selamat Datang di ESCAPE THE BUNKER–MEMORY TRAP GAME 👾</h1>
      <p>
        Game petualangan teks untuk memulihkan ingatan Detha dan memecahkan misteri bunker.
      </p>
      <div class="buttons">
        <button class="register-button" @click="goRegister">Register</button>
        <button class="login-button" @click="goLogin">Login Sebagai Pemain</button>
      </div>
    </main>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';


const router = useRouter();

const goLogin = () => {
  router.push('/login');
};

const goRegister = () => {
  router.push('/register');
};

// handleLogout tidak lagi diperlukan di sini karena sudah ada di navbar global App.vue
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.landing-content-wrapper {
  /*
  Container ini menggantikan .landing-container sebelumnya.
  Perhatikan bahwa background dan font family mungkin sudah diatur di body/html atau App.vue
  jadi pastikan tidak terjadi duplikasi atau override yang tidak diinginkan.
  Jika App.vue sudah mengatur background dan font, ini mungkin tidak diperlukan lagi.
  */
  min-height: calc(100vh - var(--navbar-height) - var(--footer-height)); /* Sesuaikan tinggi jika navbar/footer fixed */
  display: flex;
  flex-direction: column;
  flex: 1; /* Penting agar komponen ini mengisi sisa ruang setelah navbar/footer */
  background-color: #111; /* Tetap pertahankan jika ini unik untuk halaman landing */
  color: #fff;
  font-family: 'Press Start 2P', monospace;
}


.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
}

.main-content h1 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.main-content p {
  font-size: 0.75rem;
  max-width: 500px;
  margin-bottom: 2rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center; /* Agar tombol rata tengah di mobile */
}

.register-button,
.login-button {
  background-color: #222;
  border: 2px solid #0f0;
  color: #0f0;
  padding: 0.75rem 1rem;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  white-space: nowrap; /* Mencegah teks tombol pecah */
}

.register-button:hover,
.login-button:hover {
  background-color: #0f0;
  color: #111;
}

/* Media Queries */
@media (max-width: 768px) {
  .main-content h1 {
    font-size: 1rem;
  }
  .main-content p {
    font-size: 0.7rem;
  }
  .register-button,
  .login-button {
    font-size: 0.7rem;
    padding: 0.6rem 0.9rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 2rem 0.75rem;
  }
  .main-content h1 {
    font-size: 0.9rem;
  }
  .main-content p {
    font-size: 0.65rem;
  }
  .buttons {
    flex-direction: column;
    width: 80%; /* Agar tombol memanjang di mobile */
  }
  .register-button,
  .login-button {
    width: 100%; /* Agar tombol memanjang penuh */
  }
}
</style>