import {
  createApp
} from 'vue'
import App from './App'
import router from './router'

const app = createApp(App)

import IVue from '../src/index.ts'

// import {IvueButton} from '../dist/ivue-material-plus.min.esm'
// import IVue from '../dist/ivue-material-plus.min.esm';
import "../src/styles/index.scss";
// import "../src/styles/theme/index.scss";
// import "../src/components/ivue-elevation/index";
// import "../src/components/ivue-layout/index";

// import "../dist/styles/ivue.css";
// import "../dist/styles/color.css";
// import "../dist/styles/elevation.css";
// import "../dist/styles/layout.css";


// app.component('IvueButton', IvueButton);
// app.component('IvueIcon', IvueIcon);

app.config.devtools = false

// // Before you create app
// Vue.config.devtools = process.env.NODE_ENV === 'development'
// // After you create app
if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
// // then had to add in ./store.js as well.
// Vue.config.devtools = process.env.NODE_ENV === 'development'

app.use(router)
app.use(IVue, {
  // capture: false,
})


app.mount('#app')
