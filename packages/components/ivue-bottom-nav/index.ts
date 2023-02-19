import { withInstall } from '@ivue-material-plus/utils';

import BottomNav from './src/bottom-nav.vue';

export const IvueBottomNav = withInstall(BottomNav);
export default IvueBottomNav;

export * from './src/bottom-nav';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueBottomNav: typeof import('@ivue-material-plus/components')['IvueBottomNav'];
  }
}
