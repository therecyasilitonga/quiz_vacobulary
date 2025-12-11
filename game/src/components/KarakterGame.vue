<template>
  <div class="karakter-content-wrapper">
    <main class="main-content">
      <div class="karakter-card">
        <h1>Karakter: Detha (Roblox Style)</h1>
        <div class="character-3d-display">
          <div class="three-container" ref="threeContainer"></div>
        </div>

        <div class="karakter-description">
          <h2>Tentang Detha</h2>
          <p>
            Detha adalah penyelidik muda yang berani, kini direpresentasikan dalam gaya karakter Roblox.
            Ia memiliki rambut wolfcut pendek yang dibuat dalam bentuk blocky khas Roblox.
          </p>
          <p>
            Seragamnya berupa outfit investigasi bergaya Roblox yang tampak compang-camping,
            lengkap dengan noda lumpur dan efek darah yang ditampilkan menggunakan tekstur.
          </p>
          <h3>Ciri-ciri Fisik (Roblox Version):</h3>
          <ul>
            <li>Rambut: Wolfcut pendek berbentuk blok 3D khas Roblox.</li>
            <li>Seragam: Seragam investigasi robek-robek, tekstur dengan noda darah & lumpur.</li>
            <li>Wajah: Ekspresi babak belur menggunakan decal Roblox-style.</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const threeContainer = ref(null);
let scene, camera, renderer, controls, model;
// Roblox style model sesuai deskripsi
const dethaModelPath = '/models/detha_roblox_style.glb';
const autoRotate = true;
const rotationSpeed = 0.003;

onMounted(() => {
  initThree();
  loadModel();
  animate();
  window.addEventListener('resize', onWindowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  if (renderer) renderer.dispose();
  if (controls) controls.dispose();
  if (scene) {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material?.dispose();
        }
      }
    });
  }
});

const initThree = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  camera = new THREE.PerspectiveCamera(
    75,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  threeContainer.value.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1;
  controls.maxDistance = 5;
  controls.target.set(0, 1, 0);
  controls.update();
};

const loadModel = () => {
  const loader = new GLTFLoader();
  loader.load(
    dethaModelPath,
    (gltf) => {
      model = gltf.scene;
      model.scale.set(1.2, 1.2, 1.2); // ukuran lebih besar khas karakter Roblox
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error);
      const geometry = new THREE.BoxGeometry(1, 2, 1); // fallback karakter blocky
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      model = new THREE.Mesh(geometry, material);
      scene.add(model);
    }
  );
};

const animate = () => {
  requestAnimationFrame(animate);
  if (autoRotate && model) model.rotation.y += rotationSpeed;
  controls.update();
  renderer.render(scene, camera);
};

const onWindowResize = () => {
  if (threeContainer.value) {
    camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
  }
};
</script>

<style scoped>
.karakter-content-wrapper {
  background-color: #111;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  min-height: calc(100vh - var(--navbar-height, 0px));
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

.karakter-card {
  background-color: #222;
  border: 2px solid #0f0;
  padding: 2rem;
  border-radius: 8px;
  width: 95%;
  max-width: 1000px;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.karakter-card h1 {
  font-size: 1.8rem;
  color: #0f0;
  text-align: center;
}

.character-3d-display {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.three-container {
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  border: 2px solid #0f0;
  border-radius: 8px;
  overflow: hidden;
}

.karakter-description p {
  font-size: 0.95rem;
  color: #ccc;
  margin-bottom: 1rem;
  text-align: justify;
}
</style>
