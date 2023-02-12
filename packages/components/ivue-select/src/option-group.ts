import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type OptionGroup from './option-group.vue';

// props
export const optionGroupProps = buildProps({
  /**
   * 选项group标题
   *
   * @type {String}
   */
  label: {
    type: String,
  },
  /**
   * 是否禁用当选项
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
});
// props 类型
export type OptionGroupProps = ExtractPropTypes<typeof optionGroupProps>;

// 组件实例
export type OptionGroupInstance = InstanceType<typeof OptionGroup>;
