import { withInstall } from '@ivue-material-plus/utils';

import BackTop from './src/back-top.vue';

export const IvueBackTop = withInstall(BackTop);
export default IvueBackTop;

export * from './src/back-top.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueBackTop: typeof import('@ivue-material-plus/components')['IvueBackTop'];
  }
}
