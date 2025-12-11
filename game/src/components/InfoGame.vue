<template>
  <div class="info-content-wrapper">
    <main class="main-content">

      <!-- ABOUT -->
      <section class="section">
        <h1>🎮 About EBT Character Analyzer Game</h1>
        <p>
          EBT Character Analyzer adalah game interaktif yang menganalisis
          kepribadian pemain berdasarkan cara mereka menjawab serangkaian pertanyaan.
          Setiap jawaban memiliki bobot tertentu yang mencerminkan sifat, kecenderungan,
          dan pola pengambilan keputusan pemain.
        </p>
      </section>

      <!-- HOW TO PLAY -->
      <section class="section">
        <h2>📜 How to Play</h2>
        <ul>
          <li>Baca setiap pertanyaan dengan cermat.</li>
          <li>Pilih jawaban yang paling menggambarkan diri Anda.</li>
          <li>Tidak ada jawaban benar atau salah — semua mewakili karakter Anda.</li>
          <li>Setiap pertanyaan memiliki skor unik yang menentukan tipe karakter akhir.</li>
          <li>Di akhir permainan, Anda akan melihat analisis lengkap mengenai karakter Anda.</li>
        </ul>
      </section>

      <!-- WHAT THE GAME MEASURES -->
      <section class="section">
        <h2>🧠 What This Game Measures</h2>
        <p>
          Game ini dirancang untuk membaca pola kepribadian berdasarkan:
        </p>
        <ul>
          <li>Cara Anda merespons situasi tertentu.</li>
          <li>Preferensi pribadi dalam pengambilan keputusan.</li>
          <li>Reaksi spontan terhadap pilihan cepat.</li>
          <li>Gaya berpikir dominan (logis, emosional, spontan, terstruktur).</li>
          <li>Kecenderungan karakter seperti leadership, care, adaptif, atau analytical.</li>
        </ul>
      </section>

      <!-- DEVELOPER -->
      <section class="section">
        <h2>👨‍💻 Developer</h2>
        <p>
          Game ini dikembangkan oleh <strong>KELOMPOK 1</strong> sebagai project game
          analisis kepribadian berbasis pertanyaan interaktif.
        </p>
      </section>

    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.info-content-wrapper {
  background-color: #111;
  color: #9dff9d; /* teks hijau neon muda */
  font-family: 'Press Start 2P', monospace;
  min-height: calc(100vh - var(--navbar-height, 0px) - var(--footer-height, 0px));
  display: flex;
  flex-direction: column;
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
  text-align: left;
  text-shadow: 0 0 6px rgba(0, 255, 0, 0.7);
}

.section p {
  font-size: 0.75rem;
  line-height: 1.6;
  text-align: justify;
  color: #9dff9d;
}

.section ul {
  padding-left: 1.5rem;
}

.section ul li {
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.6;
  text-align: justify;
  color: #9dff9d;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }
  .section h1,
  .section h2 {
    font-size: 0.9rem;
  }
  .section p,
  .section ul li {
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
  .section ul li {
    font-size: 0.65rem;
  }
}
</style>
