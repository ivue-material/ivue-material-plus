import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type BottomNav from './bottom-nav.vue';

type Color = string | string[];

// props
export const bottomNavProps = buildProps({
  /**
   * 当前激活的导航
   *
   * @type {Number, String}
   */
  modelValue: {
    type: [Number, String],
    default: null,
  },
  /**
   * 设置组件高度
   *
   * @type {Number, String}
   */
  height: {
    type: [Number, String],
    default: 56,
  },
  /**
   * 是否隐藏
   *
   * @type {Boolean}
   */
  visible: {
    type: Boolean,
    default: true,
  },
  /**
   * 导航栏固定位置
   *
   * @type {String}
   */
  position: {
    type: String,
    values: ['fixed', 'absolute'],
  },
  /**
   * 不是激活状态时隐藏按钮上的文字
   *
   * @type {Boolean}
   */
  shift: {
    type: Boolean,
    default: false,
  },
  /**
   * 导航缩放效果
   *
   * @type {Boolean}
   */
  scale: {
    type: Boolean,
    default: false,
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
});
// props 类型
export type BottomNavProps = ExtractPropTypes<typeof bottomNavProps>;

// emits事件类型
export const backTopEmits = {
  'update:modelValue': (value: number | string) => value,
  'on-change': (value: number | string) => value,
};
export type BottomNavEmits = typeof backTopEmits;

// 组件实例
export type BottomNavInstance = InstanceType<typeof BottomNav>;
