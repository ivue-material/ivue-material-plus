import { App } from 'vue';
import Loading from './loading';
import directive from './directive';

export default (app: App): void => {
    app.directive('loading', directive);

    app.config.globalProperties.$loading = Loading;
};

export { Loading };
