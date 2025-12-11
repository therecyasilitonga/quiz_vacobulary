<template>
  <div class="reset-password-container">
    <main class="main-content">
      <div class="form-card">
        <h1>Reset Password</h1>
        <p class="tagline" v-if="!showNewPasswordForm">Masukkan email Anda untuk reset password.</p>
        <p class="tagline" v-else>Masukkan password baru Anda.</p>

        <form @submit.prevent="showNewPasswordForm ? handleSetNewPassword() : handleVerifyEmail()" class="reset-form">
          <div class="form-group" v-if="!showNewPasswordForm">
            <label for="reset-email">Email</label>
            <input type="email" id="reset-email" v-model="email" placeholder="Masukkan Email Terdaftar Anda" required />
          </div>

          <div v-else>
            <div class="form-group">
              <label for="new-password">Password Baru</label>
              <input type="password" id="new-password" v-model="newPassword" placeholder="Masukkan Password Baru" required />
            </div>
            <div class="form-group">
              <label for="confirm-new-password">Konfirmasi Password Baru</label>
              <input type="password" id="confirm-new-password" v-model="confirmNewPassword" placeholder="Konfirmasi Password Baru" required />
            </div>
          </div>

          <button type="submit" class="submit-button" :disabled="loading">
            <span v-if="loading">Mengirim...</span>
            <span v-else-if="!showNewPasswordForm">Verifikasi Email</span>
            <span v-else>Set Password Baru</span>
          </button>
          
          <p v-if="error" class="error-message">{{ error }}</p>
          <p v-if="success" class="success-message">{{ success }}</p>
        </form>

        <p class="back-to-login">
          <router-link to="/login">Kembali ke Login</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const loading = ref(false);
const error = ref(null);
const success = ref(null);
const showNewPasswordForm = ref(false); // State untuk mengontrol form
let userToReset = null; // Menyimpan data user yang emailnya terverifikasi

// Fungsi untuk memverifikasi email
const handleVerifyEmail = async () => {
  loading.value = true;
  error.value = null;
  success.value = null;

  try {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    userToReset = registeredUsers.find(user => user.email === email.value);

    if (!userToReset) {
      throw new Error('Email tidak terdaftar.');
    }

    console.log(`Email ${email.value} terverifikasi. Siap untuk set password baru.`);
    success.value = 'Email ditemukan! Silakan masukkan password baru.';
    
    // Simulasi penundaan
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    showNewPasswordForm.value = true; // Tampilkan form password baru
    newPassword.value = ''; // Kosongkan input password baru
    confirmNewPassword.value = ''; // Kosongkan input konfirmasi password baru

  } catch (err) {
    console.error('Verifikasi email error:', err);
    error.value = err.message || 'Terjadi kesalahan saat memverifikasi email. Coba lagi.';
  } finally {
    loading.value = false;
  }
};

// Fungsi untuk mengatur password baru
const handleSetNewPassword = async () => {
  loading.value = true;
  error.value = null;
  success.value = null;

  if (newPassword.value !== confirmNewPassword.value) {
    error.value = 'Password baru dan konfirmasi password tidak cocok!';
    loading.value = false;
    return;
  }

  if (newPassword.value.length < 6) {
    error.value = 'Password minimal 6 karakter.';
    loading.value = false;
    return;
  }

  try {
    // Simulasi penundaan
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Update password di localStorage
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex(user => user.email === email.value);

    if (userIndex !== -1) {
      // Update password pengguna
      registeredUsers[userIndex].password = newPassword.value;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      success.value = 'Password berhasil direset! Anda akan diarahkan ke halaman login.';
      console.log(`Password untuk ${email.value} berhasil direset.`);
      
      // Arahkan kembali ke halaman login setelah beberapa detik
      setTimeout(() => {
        router.push('/login');
      }, 2000); 
    } else {
      // Seharusnya tidak terjadi jika handleVerifyEmail sudah berhasil
      throw new Error('Pengguna tidak ditemukan untuk reset password.');
    }

  } catch (err) {
    console.error('Set new password error:', err);
    error.value = err.message || 'Terjadi kesalahan saat mengatur password baru. Coba lagi.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Gunakan kembali gaya dari Login/Register untuk konsistensi */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.reset-password-container {
  min-height: calc(100vh - var(--navbar-height, 0px) - var(--footer-height, 0px));
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #111;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
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
  max-width: 450px;
  width: 100%;
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

.reset-form {
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
  width: calc(100% - 20px);
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

.success-message {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #0f0;
  background-color: rgba(0, 255, 0, 0.15);
  border: 1px solid #0f0;
  padding: 0.75rem;
  border-radius: 6px;
}

.back-to-login {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #aaa;
}

.back-to-login a {
  color: #0f0;
  text-decoration: none;
  transition: color 0.3s, text-decoration 0.3s;
}

.back-to-login a:hover {
  color: #0a0;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-card {
    padding: 2rem;
    max-width: 90%;
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
  .back-to-login,
  .error-message,
  .success-message {
    font-size: 0.8rem;
  }
  .submit-button {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .form-card {
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
  .back-to-login,
  .error-message,
  .success-message {
    font-size: 0.7rem;
  }
  .submit-button {
    padding: 0.8rem;
  }
}
</style>