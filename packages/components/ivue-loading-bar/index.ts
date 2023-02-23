import { withInstallFunction } from '@ivue-material-plus/utils';
import LoadingBar from './src/loading-bar-instances';

export const IvueLoadingBar = withInstallFunction(LoadingBar, '$IvueLoadingBar');
export default IvueLoadingBar;

export * from './src/loading-bar';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueLoadingBar: typeof import('@ivue-material-plus/components')['IvueLoadingBar'];
  }
}
