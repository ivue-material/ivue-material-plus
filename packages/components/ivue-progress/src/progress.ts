import { isString } from '@vue/shared';
import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Progress from './progress.vue';

type Color = string | string[];

// props
export const progressProps = buildProps({
  /**
   * 状态，可选值为normal、active、wrong、success
   *
   * @type {String}
   */
  status: {
    type: String,
    values: ['normal', 'active', 'wrong', 'success', 'warning'],
    default: 'normal',
  },
  /**
   * 隐藏数值或状态图标
   *
   * @type  {Boolean}
   */
  hideInfo: {
    type: Boolean,
    default: false,
  },
  /**
   * 百分比是否置于进度条内
   *
   * @type  {Boolean}
   */
  textInside: {
    type: Boolean,
    default: false,
  },
  /**
   * 已完成的分段百分比
   *
   * @type {Number}
   */
  successPercent: {
    type: Number,
    default: 0,
  },
  /**
   * 百分比
   *
   * @type {Number}
   */
  percent: {
    type: Number,
    default: 0,
  },
  /**
   * 进度条的线宽，单位 px
   *
   * @type {Number}
   */
  strokeWidth: {
    type: Number,
    default: 10,
  },
  /**
   * 是否在垂直方向显示
   *
   * @type {Boolean}
   */
  vertical: {
    type: Boolean,
    default: false,
  },
  /**
   * 进度条的颜色
   *
   * @type {String | Array}
   */
  strokeColor: {
    type: definePropType<Color>([String, Array]),
  },
  /**
   * 进度条阴影颜色
   *
   * @type {String}
   */
  boxShadowColor: {
    type: String,
  },
  /**
   * 状态图标
   *
   * @type {String}
   */
  icon: {
    type: String,
  },
  /**
   * 是否为动画进度条
   *
   * @type {Boolean}
   */
  indeterminate: {
    type: Boolean,
    default: false,
  },
  /**
   * 控制动画进度条速度
   *
   * @type {Number}
   */
  duration: {
    type: Number,
    default: 3,
  },
} as const);
// props 类型
export type ProgressProps = ExtractPropTypes<typeof progressProps>;

// emits事件类型
export const progressEmits = {
  'on-status-change': (value: string) => isString(value),
};
export type ProgressEmits = typeof progressEmits;

// 组件实例
export type ProgressInstance = InstanceType<typeof Progress>;
