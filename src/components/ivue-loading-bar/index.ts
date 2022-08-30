import { App } from 'vue';
import IvueLoadingBar from './loading-bar';

export default (app: App): void => {
    app.config.globalProperties.$LoadingBar = IvueLoadingBar;
};

export { IvueLoadingBar };
