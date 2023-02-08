import { createWebHistory, createRouter } from 'vue-router';
import Affix from '../components/affix.vue';
import Icon from '../components/icon.vue';
import Button from '../components/button.vue';

const routes = [
  {
    path: '/Affix',
    name: 'Affix',
    component: Affix,
  },
  {
    path: '/Icon',
    name: 'Icon',
    component: Icon,
  },
  {
    path: '/Button',
    name: 'Button',
    component: Button,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
