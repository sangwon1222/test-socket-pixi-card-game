import { createRouter, createWebHistory } from 'vue-router';

const history = createWebHistory();

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home.vue'),
  },
  {
    path: '/card-game',
    name: 'card-game',
    component: () => import('../views/cardGame.vue'),
  },
];
const router = createRouter({ history, routes });

export default router;
