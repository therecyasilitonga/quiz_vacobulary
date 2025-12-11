<template>
  <div class="register-container">
    <main class="main-content">
      <div class="form-card">
        <h1>Selamat datang di laman Register EBT Game</h1>
        <p class="tagline">Break the mys!</p>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="regUsername">Username</label>
            <input
              type="text"
              id="regUsername"
              v-model="username"
              placeholder="Buat Username Anda"
              required
            />
          </div>
          <div class="form-group">
            <label for="regEmail">Email</label>
            <input
              type="email"
              id="regEmail"
              v-model="email"
              placeholder="Masukkan Email Anda"
              required
            />
          </div>
          <div class="form-group">
            <label for="regPassword">Password</label>
            <input
              type="password"
              id="regPassword"
              v-model="password"
              placeholder="Buat Password Anda"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Konfirmasi Password Anda"
              required
            />
          </div>
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? 'Mendaftar...' : 'Daftar' }}
          </button>
          <p v-if="error" class="error-message">{{ error }}</p>
          <p v-if="success" class="success-message">{{ success }}</p>
        </form>
        <p class="login-link">
          Sudah punya akun?
          <router-link to="/login">Login sekarang</router-link>
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

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref(null);
const success = ref(null);

const handleRegister = async () => {
  loading.value = true;
  error.value = null;
  success.value = null;

  if (password.value !== confirmPassword.value) {
    error.value = 'Password dan konfirmasi password tidak cocok!';
    loading.value = false;
    return;
  }

  if (username.value.length < 3) {
    error.value = 'Username minimal 3 karakter.';
    loading.value = false;
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Format email tidak valid.';
    loading.value = false;
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password minimal 6 karakter.';
    loading.value = false;
    return;
  }

  try {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const isExisting = existingUsers.some(
      user => user.username === username.value || user.email === email.value
    );

    if (isExisting) {
      throw new Error('Username atau Email sudah terdaftar.');
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newUser = {
      id: Date.now(),
      username: username.value,
      email: email.value,
      password: password.value
    };

    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    success.value = 'Pendaftaran berhasil! Mengarahkan Anda ke halaman utama...';

    const loginSuccess = await auth.login(newUser.email, newUser.password);

    if (loginSuccess) {
      auth.triggerGreetingAndNavigate();
    } else {
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    }
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.message || 'Terjadi kesalahan saat mendaftar. Coba lagi.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.register-container {
  background-color: #111;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  padding: 2.5rem 2rem;
  border-radius: 12px;
  text-align: center;
  width: 95%;         /* Lebih lebar dari sebelumnya */
  max-width: 1100px;  /* Maksimal lebih panjang */
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

.register-form {
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

.success-message {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #0f0;
  background-color: rgba(0, 255, 0, 0.15);
  border: 1px solid #0f0;
  padding: 0.75rem;
  border-radius: 6px;
}

.login-link {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #aaa;
}

.login-link a {
  color: #0f0;
  text-decoration: none;
  transition: color 0.3s, text-decoration 0.3s;
}

.login-link a:hover {
  color: #0a0;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-card {
    width: 95%;
  }
}

@media (max-width: 480px) {
  .form-card {
    width: 95%;
  }
}
</style>
