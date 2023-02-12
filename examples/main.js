import { createApp } from 'vue';
import App from './App';
import router from './router';

const app = createApp(App);

import IVue from '../src/index.ts';

// import IVue from '../dist/ivue-material-plus.min.esm'

// import "./__test__.scss";

import '../src/styles/components/reset.scss';
import '../src/styles/base.scss';
import '../src/styles/components/index.scss';

// 主题
import '../src/theme/default/index.scss';

// import {
//   IvueTable,
//   IvueTableColumn
// } from "../dist/unplugin-vue-components/es/ivue-table";
// import "../src/components/ivue-layout/index";

// import "../dist/unplugin-vue-components/styles/index.css";
// import "../dist/unplugin-vue-components/styles/reset.css";
// import "../dist/unplugin-vue-components/styles/ivue-switch.css";
// import "../dist/unplugin-vue-components/styles/ivue-carousel.css";
// import "../src/styles/components/ivue-cascader.scss";

// import "../dist/styles/index.css";
// import "../dist/unplugin-vue-components/styles/ivue-page.css";

import '../src/components/ivue-elevation/index';
import '../src/components/ivue-layout/index';

// app.component('IvueTable', IvueTable);
// app.component('IvueTableColumn', IvueTableColumn);

app.config.devtools = false;

// // Before you create app
// Vue.config.devtools = process.env.NODE_ENV === 'development'
// // After you create app
if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
}
// // then had to add in ./store.js as well.
// Vue.config.devtools = process.env.NODE_ENV === 'development'

app.use(router);
app.use(IVue, {
  capture: false,
  loadingSpinner: () => {},
});

app.mount('#app');
