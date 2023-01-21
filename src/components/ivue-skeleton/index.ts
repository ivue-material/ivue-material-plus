import { withInstall } from '../../utils/install';

import Skeleton from './index.vue';
import SkeletonItem from '../ivue-skeleton-item/index';

export const IvueSkeleton = withInstall(Skeleton, {
  SkeletonItem,
});

export default IvueSkeleton;

export * from './index.vue';
