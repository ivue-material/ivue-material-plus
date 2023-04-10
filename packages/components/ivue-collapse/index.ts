import { withInstall } from '@ivue-material-plus/utils';

import Collapse from './src/collapse.vue';

export const IvueCollapse = withInstall(Collapse);
export default IvueCollapse;

export * from './src/collapse';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueCollapse: typeof import('@ivue-material-plus/components')['IvueCollapse'];
  }
}
