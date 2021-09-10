import { App } from 'vue';
import LoadingBar from './loading-bar';

export default (app: App): void => {
    app.config.globalProperties.$LoadingBar = LoadingBar;
};

export { LoadingBar };
