import { App } from 'vue';
import Notice from './notice';

export default (app: App): void => {
    app.config.globalProperties.$notice = Notice;
};

export { Notice };
