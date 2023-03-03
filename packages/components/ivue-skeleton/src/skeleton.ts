import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Skeleton from './skeleton.vue';

type Paragraph =
  | number
  | {
      rows: number;
      width: (number | string)[];
    };

// props
export const skeletonProps = buildProps({
  /**
   * 是否显示加载结束后的 DOM 结构
   *
   * @type {Boolean}
   */
  loading: {
    type: Boolean,
    default: true,
  },
  /**
   * 渲染延迟（以毫秒为单位）
   *
   * @type {Number}
   */
  throttle: {
    type: Number,
    default: 0,
  },
  /**
   * 渲染多少个 template, 建议使用尽可能小的数字
   *
   * @type {Number}
   */
  total: {
    type: Number,
    default: 1,
  },
  /**
   * 骨架屏段落数量
   *
   * @type {Number | Object}
   */
  paragraph: {
    type: definePropType<Paragraph>([Number, Object]),
    default: 4,
  },
  /**
   * 是否使用动画
   *
   * @type {Boolean}
   */
  animated: {
    type: Boolean,
    default: false,
  },
} as const);
// props 类型
export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>;

// 组件实例
export type SkeletonInstance = InstanceType<typeof Skeleton>;
