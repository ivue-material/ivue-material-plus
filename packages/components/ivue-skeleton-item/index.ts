import { withNoopInstall } from '@ivue-material-plus/utils';

import SkeletonItem from './src/skeleton-item.vue';

export const IvueSkeletonItem = withNoopInstall(SkeletonItem);

export default IvueSkeletonItem;

export * from './src/skeleton-item';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueSkeletonItem: typeof import('@ivue-material-plus/components')['IvueSkeletonItem'];
  }
}
