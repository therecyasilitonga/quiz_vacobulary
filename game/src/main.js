import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';

// Impor Quasar
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options'; 

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass'; 

// Buat instance Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

// Gunakan Pinia dan Vue Router
app.use(pinia);
app.use(router);

// Gunakan Quasar
app.use(Quasar, quasarUserOptions); 

app.mount('#app');