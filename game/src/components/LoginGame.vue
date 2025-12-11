<template>
  <div class="login-content-wrapper">
    <main class="main-content">
      <div class="form-card">
        <h1>Selamat datang di laman Login EBT Game</h1>
        <p class="tagline">Break the mystery immediately!</p>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="identifier">Username atau Email</label>
            <input
              type="text"
              id="identifier"
              v-model="identifier"
              placeholder="Masukkan Username atau Email Anda"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Masukkan Password Anda"
              required
            />
          </div>
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? 'Memuat...' : 'Masuk' }}
          </button>
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
        <p class="forgot-password-link">
          Lupa Password? <router-link to="/reset-password">Reset di sini</router-link>
        </p>
        <p class="register-link">
          Belum punya akun? <router-link to="/register">Daftar sekarang</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const identifier = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    const success = await auth.login(identifier.value, password.value);

    if (success) {
      auth.triggerGreetingAndNavigate();
    } else {
      error.value = 'Username/Email atau password salah.';
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan saat login. Coba lagi.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.login-content-wrapper {
  background-color: #111;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  min-height: calc(100vh - var(--navbar-height, 0px) - var(--footer-height, 0px));
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.form-card {
  background-color: #222;
  border: 2px solid #0f0;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  width: 95%;          /* Lebih panjang */
  max-width: 1000px;   /* Maksimal lebih lebar */
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.7);
  transition: transform 0.3s ease-in-out;
}

.form-card:hover {
  transform: translateY(-5px);
}

.form-card h1 {
  font-size: 1.5rem;
  margin-bottom: 1.2rem;
  color: #0f0;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.form-card .tagline {
  font-size: 0.9rem;
  margin-bottom: 2rem;
  color: #aaa;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  color: #fff;
}

.form-group input {
  width: 100%;
  padding: 0.85rem 10px;
  border: 2px solid #0f0;
  background-color: #333;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #0a0;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
}

.form-group input::placeholder {
  color: #bbb;
  opacity: 0.7;
}

.submit-button {
  background-color: #0f0;
  color: #111;
  border: none;
  padding: 1.2rem;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: background-color 0.3s, color 0.3s, transform 0.2s, box-shadow 0.3s;
  margin-top: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);
}

.submit-button:hover:not(:disabled) {
  background-color: #0a0;
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 255, 0, 0.6);
}

.submit-button:disabled {
  background-color: #555;
  color: #aaa;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}

.error-message {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #f00;
  background-color: rgba(255, 0, 0, 0.15);
  border: 1px solid #f00;
  padding: 0.75rem;
  border-radius: 6px;
}

.forgot-password-link {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #aaa;
}

.forgot-password-link a {
  color: #0f0;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password-link a:hover {
  color: #0a0;
  text-decoration: underline;
}

.register-link {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #aaa;
}

.register-link a {
  color: #0f0;
  text-decoration: none;
  transition: color 0.3s, text-decoration 0.3s;
}

.register-link a:hover {
  color: #0a0;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-card {
    width: 95%;
    padding: 2rem;
  }
  .form-card h1 {
    font-size: 1.3rem;
  }
  .form-card .tagline {
    font-size: 0.8rem;
  }
  .form-group label,
  .form-group input,
  .submit-button,
  .register-link,
  .error-message {
    font-size: 0.8rem;
  }
  .submit-button {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .form-card {
    width: 95%;
    padding: 1.5rem;
  }
  .form-card h1 {
    font-size: 1.1rem;
  }
  .form-card .tagline {
    font-size: 0.7rem;
  }
  .form-group label,
  .form-group input,
  .submit-button,
  .register-link,
  .error-message {
    font-size: 0.7rem;
  }
  .submit-button {
    padding: 0.8rem;
  }
}
</style>
