import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type SkeletonItem from './skeleton-item.vue';

// props
export const skeletonItemProps = buildProps({
  type: {
    type: String,
    values: [
      'circle',
      'square',
      'rect',
      'h1',
      'h3',
      'text',
      'caption',
      'p',
      'image',
      'button',
    ],
    default: 'text',
  },
} as const);
// props 类型
export type SkeletonItemProps = ExtractPropTypes<typeof skeletonItemProps>;

// 组件实例
export type SkeletonItemInstance = InstanceType<typeof SkeletonItem>;
