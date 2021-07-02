import {
  createApp
} from 'vue'
import App from './App'
import router from './router'
import IVue from '../src/index'
// import IVue from '../dist/ivue';

import "../src/styles/index.scss";
import "../src/styles/theme/index.scss";
import "../src/components/ivue-elevation/index";
import "../src/components/ivue-layout/index";

const app = createApp(App)


app.config.devtools = false

// // Before you create app
// Vue.config.devtools = process.env.NODE_ENV === 'development'
// // After you create app
window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
// // then had to add in ./store.js as well.
// Vue.config.devtools = process.env.NODE_ENV === 'development'


app.use(router)
app.use(IVue)


app.mount('#app')
