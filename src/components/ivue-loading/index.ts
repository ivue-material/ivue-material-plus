import { App } from 'vue';
import Loading from './loading';
import directive from './directive';

export const IvueLoading = {
  install(app: App) {
    app.directive('loading', directive);
    app.config.globalProperties.$loading = Loading;
  },
  directive: directive,
  service: Loading,
};

export default IvueLoading;

export {
  directive,
  directive as IvueLoadingDirective,
  Loading as IvueLoadingService,
};
