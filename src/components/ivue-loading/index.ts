import { App } from 'vue';
import Loading from './loading';
import directive from './directive';

export default (app: App): void => {
    app.directive('ivueloading', directive);

    app.config.globalProperties.$ivueloading = Loading;
};

export { Loading };
