import { withInstall } from '@ivue-material-plus/utils';

import Skeleton from './src/skeleton.vue';
import SkeletonItem from '../ivue-skeleton-item/index';

export const IvueSkeleton = withInstall(Skeleton, {
  SkeletonItem,
});

export default IvueSkeleton;

export * from './src/skeleton';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueSkeleton: typeof import('@ivue-material-plus/components')['IvueSkeleton'];
  }
}
