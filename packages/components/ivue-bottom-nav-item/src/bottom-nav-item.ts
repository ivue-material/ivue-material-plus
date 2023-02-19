import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type BottomNavItem from './bottom-nav-item.vue';

type Color = string | string[];

// props
export const bottomNavItemProps = buildProps({
  /**
   * 当前下标
   *
   * @type {Number, String}
   */
  name: {
    type: [Number, String],
    required: true,
  },
  /**
   * 颜色
   *
   * @type {String | Array}
   */
  color: {
    type: definePropType<Color>([String, Array]),
    default: '',
  },
} as const);
// props 类型
export type BottomNavItemProps = ExtractPropTypes<typeof bottomNavItemProps>;

// 组件实例
export type BottomNavItemInstance = InstanceType<typeof BottomNavItem>;
