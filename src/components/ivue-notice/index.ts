import { App } from 'vue';
import IvueNotice from './notice';

export default (app: App): void => {
    app.config.globalProperties.$notice = IvueNotice;
};

export { IvueNotice };
