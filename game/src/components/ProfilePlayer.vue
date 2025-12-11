<template>
  <div class="profile-content-wrapper">
    <main class="main-content">
      <div class="profile-card">
        <h1>Profil Pemain</h1>

        <div class="profile-avatar-section">
          <div class="avatar-container">
            <img :src="profileImage" alt="Profile Avatar" class="profile-avatar" />
          </div>
          <input type="file" @change="handleImageUpload" accept="image/*" class="file-input" id="avatarUpload" />
          <label for="avatarUpload" class="custom-file-upload">Pilih Avatar</label>
          <button @click="uploadImage" class="update-button">Ubah Avatar</button>
        </div>

        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="profileData.username" placeholder="Masukkan Username Baru" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="profileData.email" placeholder="Masukkan Email Baru" required />
          </div>

          <div class="form-group">
            <label for="newPassword">Password Baru</label>
            <input type="password" id="newPassword" v-model="profileData.newPassword" placeholder="Biarkan kosong jika tidak ingin mengubah" />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Konfirmasi Password Baru</label>
            <input type="password" id="confirmPassword" v-model="profileData.confirmPassword" placeholder="Konfirmasi Password Baru" />
          </div>

          <button type="submit" class="submit-button">Update Profil</button>
        </form>

        <p v-if="message" :class="messageType" class="message">{{ message }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const profileData = ref({
  username: '',
  email: '',
  newPassword: '',
  confirmPassword: '',
});

const profileImage = ref('../assets/EBT.svg');
const selectedFile = ref(null);

const message = ref('');
const messageType = ref('');

onMounted(() => {
  if (!auth.isLoggedIn || !auth.user) {
    router.push('/login');
  } else {
    profileData.value.username = auth.user.username || 'Pemain';
    profileData.value.email = auth.user.email || 'pemain@example.com';
    // Gunakan avatarUrl dari auth store jika ada, jika tidak, default ke EBT.svg
    profileImage.value = auth.user.avatarUrl || '../assets/EBT.svg';
  }
});

const handleImageUpload = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile.value);
  }
};

const uploadImage = async () => {
  if (!selectedFile.value) {
    setMessage('Pilih gambar untuk diunggah.', 'error');
    return;
  }

  setMessage('Avatar berhasil diperbarui! (Simulasi)', 'success');
  console.log('Gambar diunggah (simulasi):', selectedFile.value.name);

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  auth.updateUser({ avatarUrl: profileImage.value });

  selectedFile.value = null;
  document.getElementById('avatarUpload').value = '';
};

const updateProfile = async () => {
  if (profileData.value.newPassword && profileData.value.newPassword !== profileData.value.confirmPassword) {
    setMessage('Password baru dan konfirmasi password tidak cocok!', 'error');
    return;
  }

  setMessage('Profil berhasil diperbarui! (Simulasi)', 'success');
  profileData.value.newPassword = '';
  profileData.value.confirmPassword = '';
  console.log('Profil diperbarui (simulasi):', profileData.value.username, profileData.value.email);
  auth.updateUser({ username: profileData.value.username, email: profileData.value.email });
  await new Promise(resolve => setTimeout(resolve, 1000));
};

const setMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

:root {
  --neon-green: #0f0;
  --dark-green: #0a0;
  --dark-bg: #111;
  --card-bg: #222;
  --input-bg: #333;
  --text-color: #eee;
  --light-text: #ccc;
  --placeholder-color: #bbb;
}

.profile-content-wrapper {
  background-color: var(--dark-bg);
  color: var(--text-color);
  font-family: 'Press Start 2P', monospace;
  min-height: calc(100vh - var(--navbar-height, 0px));
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.profile-content-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 10;
  opacity: 0.1;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  z-index: 1;
}

.profile-card {
  background-color: var(--card-bg);
  border: 2px solid var(--neon-green);
  padding: 2.5rem;
  border-radius: 8px;
  text-align: center;
  max-width: 550px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg, var(--neon-green), transparent, var(--dark-green), transparent);
  background-size: 400% 400%;
  z-index: -1;
  border-radius: 10px;
  filter: blur(5px);
  animation: borderAnimation 8s linear infinite;
}

@keyframes borderAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.profile-card h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--neon-green);
  text-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
}

.profile-avatar-section {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--neon-green);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  background-color: var(--input-bg);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.file-input {
  display: none;
}

.custom-file-upload {
  display: inline-block;
  background-color: var(--input-bg);
  color: var(--neon-green);
  border: 1px solid var(--neon-green);
  padding: 0.8rem 1.5rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.custom-file-upload:hover {
  background-color: var(--neon-green);
  color: var(--dark-bg);
  box-shadow: 0 0 10px var(--neon-green);
}

.update-button {
  background-color: var(--neon-green);
  color: var(--dark-bg);
  border: none;
  padding: 0.8rem 1.5rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.update-button:hover {
  background-color: var(--dark-green);
  color: var(--text-color);
  box-shadow: 0 0 10px var(--neon-green);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 90%;
  margin: 0 auto;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  color: var(--neon-green);
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.form-group input {
  width: 100%;
  padding: 0.9rem;
  border: 2px solid var(--neon-green);
  background-color: var(--input-bg);
  color: var(--text-color);
  font-family: 'Press Start 2P', monospace;
  border-radius: 4px;
  font-size: 0.85rem;
  box-shadow: inset 0 0 5px rgba(0, 255, 0, 0.3);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--dark-green);
  box-shadow: inset 0 0 8px rgba(0, 255, 0, 0.5), 0 0 10px var(--neon-green);
}

.form-group input::placeholder {
  color: var(--placeholder-color);
}

.submit-button {
  background-color: var(--neon-green);
  color: var(--dark-bg);
  border: none;
  padding: 1.2rem;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s, text-shadow 0.3s; /* Tambahkan text-shadow */
  margin-top: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  /* Efek Neon Glow untuk Background dan Text */
  box-shadow: 
    0 0 10px var(--neon-green),   /* Glow lebih dekat */
    0 0 20px var(--neon-green),   /* Glow sedang */
    0 0 30px var(--neon-green);   /* Glow lebih jauh */
  text-shadow: 
    0 0 5px var(--text-color),    /* Sedikit glow pada teks */
    0 0 10px var(--neon-green);   /* Glow neon pada teks */
}

.submit-button:hover {
  background-color: var(--green); /* Warna sedikit lebih gelap saat hover */
  color: var(--text-color); /* Teks sedikit lebih terang saat hover */
  /* Efek Glow saat Hover (lebih kuat) */
  box-shadow: 
    0 0 15px var(--neon-green), 
    0 0 25px var(--neon-green), 
    0 0 40px var(--neon-green);
  text-shadow: 
    0 0 8px var(--text-color), 
    0 0 15px var(--neon-green);
}

.message {
  margin-top: 2rem;
  font-size: 0.9rem;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Press Start 2P', monospace;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.message.success {
  background-color: rgba(0, 255, 0, 0.15);
  color: var(--neon-green);
  border: 1px solid var(--neon-green);
}

.message.error {
  background-color: rgba(255, 0, 0, 0.15);
  color: #f00;
  border: 1px solid #f00;
  text-shadow: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-card {
    padding: 2rem;
  }
  .profile-card h1 {
    font-size: 1.6rem;
  }
  .profile-avatar-section {
    gap: 0.8rem;
  }
  .avatar-container {
    width: 100px;
    height: 100px;
  }
  .custom-file-upload, .update-button {
    font-size: 0.75rem;
    padding: 0.7rem 1.3rem;
  }
  .profile-form {
    width: 95%;
  }
  .form-group label {
    font-size: 0.8rem;
  }
  .form-group input {
    font-size: 0.75rem;
    padding: 0.8rem;
  }
  .submit-button {
    font-size: 1rem;
    padding: 1rem;
  }
  .message {
    font-size: 0.8rem;
    padding: 0.8rem;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 1.5rem;
  }
  .profile-card h1 {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }
  .profile-avatar-section {
    gap: 0.6rem;
  }
  .avatar-container {
    width: 80px;
    height: 80px;
  }
  .custom-file-upload, .update-button {
    font-size: 0.65rem;
    padding: 0.6rem 1rem;
  }
  .profile-form {
    width: 100%;
    gap: 1rem;
  }
  .form-group label {
    font-size: 0.75rem;
  }
  .form-group input {
    font-size: 0.7rem;
    padding: 0.7rem;
  }
  .submit-button {
    font-size: 0.9rem;
    padding: 0.9rem;
    letter-spacing: 1px;
  }
  .message {
    font-size: 0.75rem;
    padding: 0.7rem;
  }
}
</style>