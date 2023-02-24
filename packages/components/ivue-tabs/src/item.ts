import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Item from './item.vue';

// props
export const itemProps = buildProps({
  /**
   * 前进transition
   *
   * @type {String}
   */
  transition: {
    type: String,
    default: 'ivue-tabs-item-transition',
  },
  /**
   * 反向transition
   *
   * @type {String}
   */
  reverseTransition: {
    type: String,
    default: 'ivue-tabs-item-reverse-transition',
  },
});
// props 类型
export type ItemProps = ExtractPropTypes<typeof itemProps>;

// 组件实例
export type ItemInstance = InstanceType<typeof Item>;
