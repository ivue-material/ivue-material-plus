import { App } from 'vue';
import IvueLoading from './loading';
import directive from './directive';

export default (app: App): void => {
    app.directive('loading', directive);

    app.config.globalProperties.$loading = IvueLoading;
};

export { IvueLoading };
