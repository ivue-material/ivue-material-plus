import { getCurrentInstance } from 'vue';
import { buildProps } from '@ivue-material-plus/utils';
import {
  popperProps,
  popperEmits,
} from '@ivue-material-plus/utils/mixins/popper';

// type
import type { ExtractPropTypes } from 'vue';
import type Popover from './popover.vue';
import type { PopperProps } from '@ivue-material-plus/utils/mixins/popper';

// props
export const popoverProps = buildProps({
  ...popperProps,
  /**
   * 显示的标题
   *
   * @type {String, Number}
   */
  title: {
    type: [String, Number],
  },
  /**
   * 提示框的内容
   *
   * @type {String, Number}
   */
  content: {
    type: [String, Number],
    default: '',
  },
  /**
   * 触发方式，
   * 可选值为hover（悬停）click（点击）focus（聚焦）,
   * 在 confirm 模式下，只有 click 有效
   *
   * @type {String}
   */
  trigger: {
    values: ['click', 'focus', 'hover'],
    default: 'click',
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
      const global = getCurrentInstance()!.appContext.config.globalProperties;

      return !global.$IVUE || global.$IVUE.transfer === ''
        ? false
        : global.$IVUE.transfer;
    },
  },
  /**
   * 开启 transfer 时，给浮层添加额外的 class 名称
   *
   * @type {String}
   */
  transferClassName: {
    type: String,
  },
  /**
   * 主题，可选值为 dark 或 light
   *
   * @type {String}
   */
  theme: {
    type: String,
    values: ['dark', 'light'],
    default: 'dark',
  },
  /**
   * 宽度，最小宽度为 150px，在 confirm 模式下，默认最大宽度为 300px
   *
   * @type {String | Number}
   */
  width: {
    type: [String, Number],
  },
  /**
   * 开启后，超出指定宽度文本将自动换行，并两端对齐
   *
   * @type {Boolean}
   */
  wordWrap: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否开启对话框模式
   *
   * @type {Boolean}
   */
  confirm: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否禁用
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 延迟显示，单位毫秒
   *
   * @type {Number}
   */
  delay: {
    type: Number,
    default: 100,
  },
  /**
   * 弹窗的展开方向
   *
   * @type {String}
   */
  placement: {
    type: String,
    values: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
    default: 'bottom',
  },
  /**
   * 是否开启外部点击的 capture 模式，可通过全局配置
   *
   * @type {Boolean}
   */
  capture: {
    type: Boolean,
    default() {
      const global = getCurrentInstance()!.appContext.config.globalProperties;
      return !global.$IVUE ? true : global.$IVUE.capture;
    },
  },
  /**
   * 关闭按钮文案
   *
   * @type {String}
   */
  cancelText: {
    type: String,
    default: '取消',
  },
  /**
   * 确定按钮文案
   *
   * @type {String}
   */
  confirmText: {
    type: String,
    default: '确认',
  },
} as const);
// props 类型
export type PopoverProps = PopperProps & ExtractPropTypes<typeof popoverProps>;

// emits事件类型
export const popoverEmits = {
  // 点击取消的回调，只在 confirm 模式下有效
  'on-cancel': () => true,
  // 点击确定的回调，只在 confirm 模式下有效
  'on-confirm': () => true,
  ...popperEmits,
};
export type PopoverEmits = typeof popoverEmits;

// 组件实例
export type PopoverInstance = InstanceType<typeof Popover>;

// Status
export type Status = {
  disableCloseUnderTransfer: boolean;
  closeDelay: number;
};
