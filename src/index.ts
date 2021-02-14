import type { App } from 'vue'

import IvueAffix from './components/ivue-affix';

export {
    IvueAffix
}


interface InstallOptions {

}


const install = (app: App, opt: InstallOptions): void => {
    IvueAffix(app);
}

// auto install
/* istanbul ignore if */
// if (typeof window !== 'undefined' && window.Vue) {
//     install(window.Vue);
// }

const API = {
    install,
    // IvueAffix
}

export default API
