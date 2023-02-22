import { withInstall } from '@ivue-material-plus/utils';

import Circular from './src/circular.vue';

export const IvueCircular = withInstall(Circular);
export default IvueCircular;

export * from './src/circular';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueCircular: typeof import('@ivue-material-plus/components')['IvueCircular'];
  }
}
