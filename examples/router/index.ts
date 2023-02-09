import { createWebHistory, createRouter } from 'vue-router';
import Affix from '../components/affix.vue';
import Icon from '../components/icon.vue';
import Button from '../components/button.vue';
import Loading from '../components/loading.vue';
import Elevation from '../components/elevation.vue';
import Layout from '../components/layout.vue';
import avatar from '../components/avatar.vue';
import backTop from '../components/back-top.vue';
import badge from '../components/badge.vue';

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
    path: '/Elevation',
    name: 'Elevation',
    component: Elevation,
  },
  {
    path: '/Layout',
    name: 'Layout',
    component: Layout,
  },
  {
    path: '/avatar',
    name: 'avatar',
    component: avatar,
  },
  {
    path: '/back-top',
    name: 'backTop',
    component: backTop,
  },
  {
    path: '/badge',
    name: 'badge',
    component: badge,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
