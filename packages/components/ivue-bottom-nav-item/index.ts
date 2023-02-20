import { withInstall } from '@ivue-material-plus/utils';

import BottomNavItem from './src/bottom-nav-item.vue';

export const IvueBottomNavItem = withInstall(BottomNavItem);
export default IvueBottomNavItem;

export * from './src/bottom-nav-item';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueBottomNavItem: typeof import('@ivue-material-plus/components')['IvueBottomNavItem'];
  }
}
