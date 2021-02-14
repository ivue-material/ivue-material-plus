import {
    createWebHashHistory,
  createRouter
} from "vue-router";
import Affix from '../components/affix';
import Input from '../components/input';

const routes = [,
  {
    path: "/Affix",
    name: "Affix",
    component: Affix,
  },
  {
    path: "/Input",
    name: "Input",
    component: Input,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
