import { createWebHistory, createRouter } from 'vue-router';
import Affix from '../components/affix.vue';
import Icon from '../components/icon.vue';
import Button from '../components/button.vue';
import Loading from '../components/loading.vue';
import Elevation from '../components/elevation.vue';

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
  {
    path: '/Loading',
    name: 'Loading',
    component: Loading,
  },
  {
    path: '/elevation',
    name: 'Elevation',
    component: Elevation,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
