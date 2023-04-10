import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Collapse from './collapse.vue';

type ModelValue = string | string[];

// props
export const collapseProps = buildProps({
  /**
   * 当前激活的面板的 name
   *
   * @type {Array, String}
   */
  modelValue: {
    type: definePropType<ModelValue>([Array, String]),
    default: '',
  },
  /**
   * 是否开启简洁模式
   *
   * @type {Boolean}
   */
  simple: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否开启手风琴效果
   *
   * @type {Boolean}
   */
  accordion: {
    type: Boolean,
    default: false,
  },
} as const);
// props 类型
export type CollapseProps = ExtractPropTypes<typeof collapseProps>;

// emits事件类型
export const collapseEmits = {};
export type CollapseEmits = typeof collapseEmits;

// 组件实例
export type CollapseInstance = InstanceType<typeof Collapse>;
