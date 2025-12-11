// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// IMPORT SEMUA KOMPONEN DARI FOLDER components/
import LandingPage from '../components/LandingGame.vue';
import LoginPage from '../components/LoginGame.vue';
import RegisterPage from '../components/RegisterGame.vue';
import ResetPasswordPage from '../components/ResetPassword.vue'; 
import HomeGame from '../components/HomeGame.vue';
import InfoGame from '../components/InfoGame.vue';
import Karakter from '../components/KarakterGame.vue';
import PlayingGame from '../components/PlayingGame.vue';
import AfterGameOver from '../components/AfterGameOver.vue';
import ProfilePlayer from '../components/ProfilePlayer.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { guestOnly: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { guestOnly: true }
  },
  {
    path: '/reset-password', // <-- Tambahkan rute ini
    name: 'ResetPassword',
    component: ResetPasswordPage,
    meta: { guestOnly: true }
  },
  {
    path: '/homegame',
    name: 'HomeGame',
    component: HomeGame,
    meta: { requiresAuth: true }
  },
  {
    path: '/info',
    name: 'InfoGame',
    component: InfoGame
  },
  {
    path: '/karakter',
    name: 'Karakter',
    component: Karakter
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePlayer,
    meta: { requiresAuth: true }
  },
  {
    path: '/PlayingGame',
    name: 'PlayingGame',
    component: PlayingGame,
    meta: { requiresAuth: true }
  },
  {
    path: '/aftergameover',
    name: 'AfterGameOver',
    component: AfterGameOver,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  // initializeAuth dipanggil di sini untuk memastikan state auth selalu diperbarui
  // sebelum navigasi. Ini penting untuk cek requiresAuth/guestOnly.
  auth.initializeAuth(); 
  const isLoggedIn = auth.isLoggedIn;

  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log(`Redirecting to /login from ${to.path} (requires auth, not logged in)`);
    next('/login');
  }
  // Redirect guestOnly pages (landing, login, register, reset-password) if user is already logged in
  else if (to.meta.guestOnly && isLoggedIn) {
    console.log(`Redirecting to /homegame from ${to.path} (guest only, already logged in)`);
    next('/homegame');
  }
  else {
    console.log(`Allowing navigation to ${to.path}`);
    next();
  }
});

export default router;