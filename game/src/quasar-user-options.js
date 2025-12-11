// src/quasar-user-options.js

import '@quasar/extras/material-icons/material-icons.css';

import {
  QBtn,
  QInput,
  QCard,
  QLayout,
  QPage,
  QHeader,
  QToolbar,
  QAvatar,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QSpace,
  QDialog,
  Notify
} from 'quasar';

import {
  Dialog,
} from 'quasar';

export default {
  components: {
    QBtn,
    QInput,
    QCard,
    QLayout,
    QPage,
    QHeader,
    QToolbar,
    QAvatar,
    QList,
    QItem,
    QItemSection,
    QIcon,
    QSpace
  },
  plugins: {
    Dialog,
    Notify
  },
  config: {
    brand: {
      primary: '#0f0',
      secondary: '#333',
      accent: '#f00',
      dark: '#1a1a1a',
      'dark-page': '#111',
      positive: '#0a0',
      negative: '#f00',
      info: '#00bfff',
      warning: '#ffa500'
    },
  },
};