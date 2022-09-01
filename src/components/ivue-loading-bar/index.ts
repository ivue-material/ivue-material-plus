import { withInstallFunction } from '../../utils/install';
import LoadingBar from './loading-bar';

export const IvueLoadingBar = withInstallFunction(LoadingBar, '$LoadingBar');
export default IvueLoadingBar;

export * from './index.vue';
