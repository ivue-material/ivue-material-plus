import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Button from './button.vue';

type Color = string | string[];

// props
export const buttonProps = buildProps({
  /**
   * 当前下标
   *
   * @type {Number, string}
   */
  index: {
    type: [Number, String],
  },
  /**
   * 在按钮上创建一个锚点。在这种情况下，生成的标签将是 a
   *
   * @type {String}
   */
  href: {
    type: String,
    default: null,
  },
  /**
   * 将类型应用于按钮 - 它不会影响链接
   *
   * @type {String}
   */
  type: {
    type: String,
    default: 'button',
  },
  /**
   * 禁用该按钮并阻止其操作
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 激活涟漪效果
   *
   * @type {Boolean}
   */
  ripple: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否扁平按钮
   *
   * @type {Boolean}
   */
  flat: {
    type: Boolean,
    default: false,
  },
  /**
   * 凹陷的按钮依然保持其背景色，但没有框阴影
   *
   * @type {Boolean}
   */
  depressed: {
    type: Boolean,
    default: false,
  },
  /**
   * 圆形图标
   *
   * @type {Boolean}
   */
  icon: {
    type: Boolean,
    default: false,
  },
  /**
   * 轮廓按钮从当前色彩应用继承他们的边框颜色。
   *
   * @type {Boolean}
   */
  outline: {
    type: Boolean,
    default: false,
  },
  /**
   * 当使用中心选项时，纹波将始终来自目标的中心。
   *
   * @type {Boolean}
   */
  center: {
    type: Boolean,
    default: false,
  },
  /**
   * 圆角
   *
   * @type {Boolean}
   */
  radius: {
    type: Boolean,
    default: false,
  },
  /**
   * 按钮是否激活状态
   *
   * @type {Boolean}
   */
  isActive: {
    type: Boolean,
    default: false,
  },
  /**
   * 按钮状态
   *
   * @type {String}
   */
  status: {
    type: String,
    values: [
      'primary',
      'light-primary',
      'dark-primary',
      'success',
      'warning',
      'error',
    ],
  },
  /**
   * 显示loading
   *
   * @type {Boolean}
   */
  loading: {
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
} as const);
// props 类型
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;

// emits事件类型
export const buttonEmits = {
  click: (
    rippleActive: boolean | TouchEvent | Event,
    index?: number | string
  ) => ({ rippleActive, index }),
};
export type ButtonEmits = typeof buttonEmits;

// 组件实例
export type ButtonInstance = InstanceType<typeof Button>;

// 按钮属性
export interface ButtonAttrs {
  class?: Record<string, any>;
  href?: string;
  type: string;
  disabled?: boolean;
  onTouchstart: (event: TouchEvent) => void;
  onTouchmove: (event: TouchEvent) => void;
  onClick: (event: Event) => void;
}
