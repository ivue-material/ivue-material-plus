import { App } from 'vue';
import Loading from './loading';

export default (app: App): void => {
    app.config.globalProperties.$loading = Loading;
};

export { Loading };
