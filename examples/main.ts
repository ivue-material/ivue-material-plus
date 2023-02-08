import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';

const app = createApp(App);

import '../packages/styles/src/theme/default/index.scss';

// import IVue from '../dist/ivue-material-plus/dist/index.full.min.mjs';
// import '../dist/ivue-material-plus/dist/index.css';

// app.use(IVue, {
//   capture: false,
//   loadingSpinner: () => {},
// });

app.use(router);

app.mount('#app');
