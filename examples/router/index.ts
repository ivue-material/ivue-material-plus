import { createWebHistory, createRouter } from 'vue-router';
import Affix from '../components/affix.vue';
import Animation from '../components/animation.vue';

const routes = [
  {
    path: '/Affix',
    name: 'Affix',
    component: Affix,
  },
  {
    path: '/Animation',
    name: 'Animation',
    component: Animation,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
