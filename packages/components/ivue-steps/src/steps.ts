import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Steps from './steps.vue';

// props
export const stepsProps = buildProps({
  /**
   * 当前步骤
   *
   * @type {Number}
   */
  currentStep: {
    type: Number,
    default: 0,
  },
  /**
   * 步骤条方向
   *
   * @type {string}
   * @default {horizontal}
   */
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  /**
   * 步骤状态
   *
   * @type {String}
   */
  status: {
    values: ['wait', 'process', 'finish', 'error'],
    default: 'process',
  },
  /**
   * 每个 step 的间距，不填写将自适应间距。支持百分比
   *
   * @type {Number | String}
   */
  space: {
    type: [Number, String],
    default: '',
  },
  /**
   * 文字方向
   *
   * @type {String}
   */
  textDirection: {
    type: String,
    values: ['right', 'bottom-center', 'bottom'],
    default: 'right',
  },
} as const);
// props 类型
export type StepsProps = ExtractPropTypes<typeof stepsProps>;

// 组件实例
export type StepsInstance = InstanceType<typeof Steps>;
