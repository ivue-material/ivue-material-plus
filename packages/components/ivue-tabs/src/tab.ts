import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Tab from './tab.vue';

// props
export const tabProps = buildProps({
  /**
   * 是否禁用当前项
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否禁用涟漪效果
   *
   * @type {Boolean}
   */
  rippleDisabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否居中涟漪效果
   *
   * @type {Boolean}
   */
  rippleCentered: {
    type: Boolean,
    default: false,
  },
  /**
   * tab 名称
   *
   * @type {String}
   */
  name: {
    type: String,
    default: '',
  },
});
// props 类型
export type TabProps = ExtractPropTypes<typeof tabProps>;

// 组件实例
export type TabInstance = InstanceType<typeof Tab>;
