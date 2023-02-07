import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes, InjectionKey } from 'vue';
import type BottomNavItem from './bottom-nav-item.vue';

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
    type: [String, Array],
    default: '',
  },
});
// props 类型
export type BottomNavItemProps = ExtractPropTypes<typeof bottomNavItemProps>;

// 组件实例
export type BottomNavItemInstance = InstanceType<typeof BottomNavItem>;

//
export type BottomNavContext = {
  updateValue: (value: number | string) => void;
  addItem: (item: any) => void;
  removeItem: (uid: number) => void;
};

export const BottomNavContextKey: InjectionKey<BottomNavContext> =
  Symbol('ivue-bottom-nav');
