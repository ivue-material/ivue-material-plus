import { createWebHistory, createRouter } from 'vue-router';
import Affix from '../components/affix.vue';

const routes = [
  {
    path: '/Affix',
    name: 'Affix',
    component: Affix,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
