import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Step from './step.vue';

// props
export const stepProps = buildProps({
  /**
   * 标题
   *
   * @type {String}
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * 内容
   *
   * @type {String}
   */
  content: {
    type: String,
  },
  /**
   * 当前步骤的状态
   *
   * @type {String}
   */
  status: {
    type: String,
    values: ['wait', 'process', 'finish', 'error'],
    default: ''
  },
  /**
   * 步骤图标
   *
   * @type {String}
   */
  icon: {
    type: String,
  },
} as const);
// props 类型
export type StepProps = ExtractPropTypes<typeof stepProps>;

// emits事件类型
export const stepEmits = {};
export type StepEmits = typeof stepEmits;

// 组件实例
export type StepInstance = InstanceType<typeof Step>;
