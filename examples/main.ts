import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';

const app = createApp(App);


// import IVue from '../packages/ivue-material-plus/index';
import '../packages/styles/src/theme/default/index.less';

// app.use(IVue, {
//   capture: false,
//   loadingSpinner: () => {},
// });

app.use(router);

app.mount('#app');
