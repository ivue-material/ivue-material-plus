import { App } from 'vue';
import Loading from './src/loading';
import vLoading from './src/directive';

export const IvueLoading = {
  install(app: App) {
    app.directive('loading', vLoading);
    app.config.globalProperties.$IvueLoading = Loading;
  },
  directive: vLoading,
  service: Loading,
};

export default IvueLoading;

export {
  vLoading,
  vLoading as IvueLoadingDirective,
  Loading as IvueLoadingService,
};

export * from './src/types';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $IvueLoading: typeof import('@ivue-material-plus/components')['IvueLoadingService'];
  }
}
