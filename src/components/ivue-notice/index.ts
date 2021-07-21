import { App } from 'vue';
import Notice from './notice';

export default (app: App): void => {
    app.config.globalProperties.$IvueNotice = Notice;
};

export { Notice };
