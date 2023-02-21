import { withInstallFunction } from '@ivue-material-plus/utils';
import Spin from './src/init';

export const IvueSpin = withInstallFunction(Spin, '$IvueSpin');
export default IvueSpin;

export * from './src/spin';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $IvueSpin: typeof import('@ivue-material-plus/components')['IvueSpin'];
  }
}
