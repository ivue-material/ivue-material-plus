import { buildProps,definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Option from './option.vue';

type Color = string | string[];

// props
export const optionProps = buildProps({
  /**
   * 启用/禁用涟漪
   *
   * @type {Boolean}
   */
  ripple: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否禁用选项
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否选择当前项
   *
   * @type {Boolean}
   */
  selected: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否获取到焦点
   *
   * @type {Boolean}
   */
  isFocused: {
    type: Boolean,
    default: false,
  },
  /**
   * 渲染的 label
   *
   * @type {String, Number}
   */
  label: {
    type: [String, Number],
  },
  /**
   * 渲染的 value
   *
   * @type {String, Number}
   */
  value: {
    type: definePropType<string | number>([String, Number]),
    default: ''
  },
  /**
   * 选择选项时的颜色
   *
   * @type {String | Array}
   */
  selectedColor: {
    type: definePropType<Color>([String, Array]),
  },
  /**
   * hover 选择选项时的颜色
   *
   * @type {String | Array}
   */
  hoverColor: {
    type: definePropType<Color>([String, Array]),
  },
  /**
   * 是否允许用户创建新条目，需开启 filterable
   *
   * @type {Boolean}
   */
  allowCreate: {
    type: Boolean,
    default: false,
  },
  /**
   * 显示创建的选项
   *
   * @type {Boolean}
   */
  showCreateItem: {
    type: Boolean,
    default: false,
  },
  /**
   * 输入框输入数据
   *
   * @type {String}
   */
  filterQuery: {
    type: String,
    default: '',
  },
} as const);
// props 类型
export type OptionProps = ExtractPropTypes<typeof optionProps>;

// emits事件类型
export const optionEmits = {};
export type OptionEmits = typeof optionEmits;

// 组件实例
export type OptionInstance = InstanceType<typeof Option>;

// 选项数据
export interface OptionData {
  value?: string | number;
  label?: string | number;
  disabled?: boolean;
}

// Data
export interface DataOpen {
  isFocused: boolean;
  disabled: boolean;
  hasMouseHover: boolean;
  visible: boolean;
}
