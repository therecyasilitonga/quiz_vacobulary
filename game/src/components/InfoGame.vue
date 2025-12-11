<template>
  <div class="info-content-wrapper">
    <main class="main-content">
      <section class="section">
        <h1>🎮 About Escape The Bunker – Memory Trap</h1>
        <p>
          A text-based adventure game where you help Bernadeth Calestika (Detha) 
          recover her lost memories to uncover the mystery inside the bunker.
        </p>
      </section>

      <section class="section">
        <h2>📜 How to Play</h2>
        <ul>
          <li>Read the story carefully.</li>
          <li>Answer memory questions to help Detha recover her past.</li>
          <li>Solve secret codes using logic and clues.</li>
          <li>Find Zayden and uncover the truth behind the mission.</li>
        </ul>
      </section>

      <section class="section">
        <h2>🕵️‍♀️ Background Story</h2>
        <p>
          Bernadeth Calestika, a 29-year-old undercover agent known as Detha, is sent deep 
          into the southern forests of Kalimantan to investigate illegal experiments conducted 
          by four dangerous scientists: Robert, Max, and the twin brothers Julian and Axel Cathrich.
          She is not alone—her mission team includes young agents Olivia, Patricia, Winona, Kenzo, Rafael, 
          and Zayden, all operating under the command of Leonard Paul Gabriel. But the mission turns into 
          a disaster when a violent confrontation results in the deaths of four teammates—Olivia, Kenzo, Rafael, 
          and Patricia—while Winona escapes into the jungle. Detha and Zayden are captured separately, and during 
          a brutal fight with the Cathrich twins, Detha suffers a severe head injury that wipes out her memory.
          She wakes up alone inside an underground bunker, confused and unable to remember who she is or what happened. 
          The player must help her recover her memories, uncover the truth, find Zayden, and escape the bunker—without 
          realizing that the greatest enemy is not the scientists, but someone from her own side.
        </p>
        <p>
          Kamu akan membantu Detha memulihkan ingatan,
          keluar dari bunker, menyelamatkan Zayden,
          dan menguak rahasia besar bahwa Komandan Paul adalah dalang di balik semua ini.
        </p>
      </section>

      <section class="section">
        <h2>👨‍💻 Developer</h2>
        <p>
          Game ini dikembangkan oleh .
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
// useRouter dan useAuthStore tidak lagi diperlukan di sini karena
// navbar dan logika login/logout sudah ditangani di App.vue.
// Komponen InfoGame.vue ini hanya menampilkan konten statis.
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.info-content-wrapper {
  background-color: #111;
  color: #eee;
  font-family: 'Press Start 2P', monospace;
  min-height: calc(100vh - var(--navbar-height, 0px) - var(--footer-height, 0px));
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.section {
  margin-bottom: 2rem;
}

.section h1,
.section h2 {
  color: #0f0;
  font-size: 1rem;
  margin-bottom: 1rem;
  /* Judul tetap rata kiri secara default atau eksplisit jika diperlukan */
  text-align: left; /* Menjamin rata kiri */
}

.section p {
  font-size: 0.75rem;
  line-height: 1.6;
  text-align: justify; /* PENTING: Membuat paragraf rata kiri-kanan (justify) */
}

.section ul {
  list-style-type: square;
  padding-left: 1.5rem;
  /* text-align: justify; TIDAK DIAPLIKASIKAN DI SINI, tapi akan diterapkan pada LI */
}

.section ul li {
  margin-bottom: 0.5rem;
  font-size: 0.75rem; /* Pastikan font-size sama dengan p */
  line-height: 1.6; /* Pastikan line-height sama dengan p */
  text-align: justify; /* PENTING: Membuat list item rata kiri-kanan (justify) */
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }
  .section h1,
  .section h2 {
    font-size: 0.9rem;
  }
  .section p,
  .section ul li { /* Terapkan juga pada li di media query */
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem;
  }
  .section h1,
  .section h2 {
    font-size: 0.8rem;
  }
  .section p,
  .section ul li { /* Terapkan juga pada li di media query */
    font-size: 0.65rem;
  }
}
</style>