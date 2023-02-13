import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Input from './input.vue';

type AutoHeight = {
  minRows: number;
  maxRows: number;
};

// props
export const inputProps = buildProps({
  /**
   * 绑定的值，可使用 v-model 双向绑定
   *
   * @type {String | Number}
   */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  /**
   * 输入框类型
   *
   * @type {String}
   */
  type: {
    type: String,
    default: 'text',
  },
  /**
   * 占位文本
   *
   * @type {String}
   */
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * 原生的 spellcheck 属性
   *
   * @type {Boolean}
   */
  spellcheck: {
    type: Boolean,
    default: false,
  },
  /**
   * 设置输入框为禁用状态
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 原生的自动完成功能
   *
   * @type {String}
   */
  autocomplete: {
    type: String,
    default: 'off',
  },
  /**
   * 设置输入框为只读
   *
   * @type {Boolean}
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * 输入框name
   *
   * @type {String}
   */
  name: {
    type: String,
  },
  /**
   * 最大输入长度
   *
   * @type {Number}
   */
  maxlength: {
    type: Number,
  },
  /**
   * id
   *
   * @type {String}
   */
  id: {
    type: String,
  },
  /**
   * 自动获取焦点
   *
   * @type {Boolean}
   */
  autofocus: {
    type: Boolean,
    default: false,
  },
  /**
   * 只允许用户输入number
   *
   * @type {Boolean}
   */
  number: {
    type: Boolean,
    default: false,
  },
  /**
   * prepend前置内容背景颜色
   *
   * @type {String}
   */
  prependBgColor: {
    type: String,
    default: '#f8f8f9',
  },
  /**
   * append前后置内容背景颜色
   *
   * @type {String}
   */
  appendBgColor: {
    type: String,
    default: '#f8f8f9',
  },
  /**
   * 输入框头部图标
   *
   * @type {String}
   */
  prefix: {
    type: String,
    default: '',
  },
  /**
   * 输入框尾部图标
   *
   * @type {String}
   */
  suffix: {
    type: String,
    default: '',
  },
  /**
   * 输入框尺寸，可选值为large、small、default或者不设置
   *
   *
   * @type {String}
   */
  size: {
    type: String,
    values: ['small', 'large', 'default'],
    default() {
      return 'default';
    },
  },
  /**
   * 是否显示清除按钮
   *
   * @type {Boolean}
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * 输入框清除图标
   *
   * @type {String}
   */
  clearIcon: {
    type: String,
    default: 'cancel',
  },
  /**
   * 是否显示输入字数统计，可以配合 maxlength 使用
   *
   * @type {Boolean}
   */
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否显示切换密码图标
   *
   * @type {Boolean}
   */
  password: {
    type: Boolean,
    default: false,
  },
  /**
   * 密码图标
   *
   * @type {Object}
   */
  passwordIcon: {
    type: Object,
    default: () => {
      return {
        on: 'visibility',
        off: 'visibility_off',
      };
    },
  },
  /**
   * 是否显示为搜索型输入框
   *
   * @type {Boolean}
   */
  search: {
    type: Boolean,
    default: false,
  },
  /**
   * 开启 search 时可用，是否有确认按钮，可设为按钮文字
   *
   * @type {Boolean, String}
   */
  enterButton: {
    type: [Boolean, String],
    default: false,
  },
  /**
   * 文本域默认行数，仅在 textarea 类型下有效
   *
   * @type {Number}
   */
  rows: {
    type: Number,
    default: 2,
  },
  /**
   * 自适应内容高度，仅在 textarea 类型下有效
   * 指定最小行数和最大行数
   *
   * @type {Object}
   */
  autoHeight: {
    type: definePropType<AutoHeight>([Object, Boolean]),
  },
  /**
   * 是否显示边框
   *
   * @type {Boolean}
   */
  border: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否使用纯value
   *
   * @type {Boolean}
   */
  isValue: {
    type: Boolean,
    default: false,
  },
  /**
   * 原生的 wrap 属性，可选值为 hard 和 soft，仅在 textarea 下生效
   *
   * @type {String}
   */
  wrap: {
    values: ['hard', 'soft'],
    default: 'soft',
  },
  /**
   * 自定义输入方法
   *
   * @type {Boolean}
   */
  inputFunction: {
    type: Function,
  },
  /**
   * 输入时是否触发表单的校验
   *
   * @type {Boolean}
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const);

// props 类型
export type InputProps = ExtractPropTypes<typeof inputProps>;

// emits事件类型
export const inputEmits = {
  'on-enter': (event: Event) => event,
  'on-keyup': (event: Event) => event,
  'on-keypress': (event: Event) => event,
  'on-keydown': (event: Event) => event,
  'on-suffix': (event: Event) => event,
  'on-change': (value: string) => value,
  'on-focus': (event: Event) => event,
  'on-blur': (event: Event) => event,
  'on-clear': () => true,
  'on-search': (value: string | number) => value,
  'update:modelValue': (value: string) => value,
};
export type InputEmits = typeof inputEmits;

// 组件实例
export type InputInstance = InstanceType<typeof Input>;

// 文本框样式
export type TextareaStyles = {
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  overflowY?: any;
};
