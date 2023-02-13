import { getCurrentInstance } from 'vue';
import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes, ComponentInternalInstance } from 'vue';
import type DropDown from './drop-down.vue';

// props
export const dropDownProps = buildProps({
  /**
   * 外层样式
   *
   * @type {String}
   */
  className: {
    type: String,
  },
  /**
   * 是否将弹层放置于 body 内，在 Tabs、
   * 带有 fixed 的 Table 列内使用时，
   * 建议添加此属性，它将不受父级样式影响，
   * 从而达到更好的效果
   *
   * @type {Boolean}
   */
  transfer: {
    type: Boolean,
    default() {
      const global = (getCurrentInstance() as ComponentInternalInstance)
        .appContext.config.globalProperties;

      return !global.$IVUE || global.$IVUE.transfer === ''
        ? false
        : global.$IVUE.transfer;
    },
  },
  /**
   * 弹窗的展开方向，
   * 可选值为 top、bottom、top-start、bottom-start、top-end、bottom-end
   *
   * @type {String}
   */
  placement: {
    type: String,
    values: [
      'top',
      'bottom',
      'top-start',
      'bottom-start',
      'top-end',
      'bottom-end',
    ],
    default: 'bottom-start',
  },
} as const);
// props 类型
export type DropDownProps = ExtractPropTypes<typeof dropDownProps>;

// 组件实例
export type DropDownInstance = InstanceType<typeof DropDown>;
