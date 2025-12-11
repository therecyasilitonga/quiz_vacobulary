<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="navbar-left">
        <div class="logo-container">
          <img src="./assets/EBT.svg" alt="Game Logo" class="logo-img" />
          <span class="logo-text">ESCAPE THE BUNKER</span>
        </div>
        <div
          class="greeting-container"
          v-if="showGreetingMessage"
        >
          <span class="greeting-text">{{ typedGreeting }}</span>
          <span class="blinking-cursor">|</span>
        </div>
      </div>

      <ul class="nav-links">
        <li v-if="auth.isLoggedIn && !showGreetingMessage">
          <router-link to="/homegame">Home</router-link>
        </li>
        <li>
          <router-link to="/info">Info Game</router-link>
        </li>
        <li>
          <router-link to="/karakter">Karakter</router-link>
        </li>
      </ul>

      <div class="navbar-right">
        <!-- GANTI ICON FONT AWESOME DENGAN GAMBAR -->
        <router-link
          v-if="auth.isLoggedIn && !showGreetingMessage"
          to="/profile"
          class="profile-icon-link"
        >
          <img
            src="../public/Profile Default.svg"
            alt="Profile"
            class="profile-image"
          />
        </router-link>

        <button
          v-if="auth.isLoggedIn && !showGreetingMessage"
          @click="handleLogout"
          class="login-button"
        >
          Logout
        </button>
        <button
          v-else
          @click="goLogin"
          class="login-button"
        >
          Login
        </button>
      </div>
    </nav>

    <main class="main-content">
      <div v-if="showGreetingMessage" class="empty-screen"></div>
      <router-view v-else />
    </main>

    <footer class="game-footer">
      <p class="version-text">Ver 0.0.1</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../src/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const fullGreeting = ref('');
const typedGreeting = ref('');
const showGreetingMessage = ref(false);
let typewriterTimeout = null;
let greetingDisplayTimeout = null;

const typeWriterEffect = (text) => {
  let i = 0;
  typedGreeting.value = '';
  showGreetingMessage.value = true;

  clearTimeout(typewriterTimeout);
  clearTimeout(greetingDisplayTimeout);

  const type = () => {
    if (i < text.length) {
      typedGreeting.value += text.charAt(i);
      i++;
      typewriterTimeout = setTimeout(type, 80);
    } else {
      greetingDisplayTimeout = setTimeout(() => {
        showGreetingMessage.value = false;
        typedGreeting.value = '';
        auth.resetGreetingTrigger();

        if (auth.isLoggedIn && router.currentRoute.value.name !== 'HomeGame') {
          router.replace('/homegame');
        }
      }, 2000);
    }
  };
  type();
};

watch(
  () => auth.shouldTriggerGreetingAndNavigate,
  (newVal) => {
    if (newVal && auth.isLoggedIn) {
      const userName = auth.user?.username || 'Player';
      fullGreeting.value = `Halo, ${userName} !`;
      typeWriterEffect(fullGreeting.value);
    }
  }
);

watch(
  () => auth.isLoggedIn,
  (newVal) => {
    if (!newVal) {
      fullGreeting.value = '';
      typedGreeting.value = '';
      showGreetingMessage.value = false;
      auth.resetGreetingTrigger();
      clearTimeout(typewriterTimeout);
      clearTimeout(greetingDisplayTimeout);
      if (
        router.currentRoute.value.path !== '/login' &&
        router.currentRoute.value.path !== '/register'
      ) {
        router.push('/');
      }
    }
  }
);

onMounted(() => {
  auth.initializeAuth();
});

const goLogin = () => {
  router.push('/login');
};

const handleLogout = () => {
  auth.logout();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.app-container {
  background-color: #111;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
  padding: 1rem 2rem;
  border-bottom: 2px solid #333;
  flex-wrap: wrap;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.logo-text {
  font-size: 0.9rem;
  white-space: nowrap;
}

.greeting-container {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.greeting-text {
  font-size: 0.9rem;
  color: red;
  white-space: nowrap;
}

.blinking-cursor {
  font-size: 0.9rem;
  color: red;
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
  margin-left: auto;
  margin-right: 2rem;
}

.nav-links li a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links li a:hover {
  color: #0f0;
}

.profile-icon-link {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0f0;
  cursor: pointer;
}

.login-button {
  background-color: #333;
  color: #fff;
  border: 2px solid #0f0;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  white-space: nowrap;
  transition: background-color 0.3s, border-color 0.3s;
}

.login-button:hover {
  background-color: #0f0;
  color: #111;
  border-color: #fff;
}

.main-content {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.empty-screen {
  flex: 1;
  background: transparent;
}

.game-footer {
  text-align: center;
  padding: 1rem;
  background-color: #222;
  border-top: 2px solid #333;
}

.version-text {
  font-size: 0.7rem;
  color: #aaa;
  margin: 0;
}
</style>
