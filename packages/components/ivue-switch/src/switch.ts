import { isBoolean, isNumber } from '@vueuse/core';
import { isString } from '@vue/shared';
import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Switch from './switch.vue';

// props
export const switchProps = buildProps({
  /**
   * 浮雕按钮
   *
   * @type {Boolean}
   */
  emboss: {
    type: Boolean,
    default: false,
  },
  /**
   * 取消的颜色
   *
   * @type {String}
   */
  falseColor: {
    type: definePropType<string | string[]>([String, Array]),
    default: '#808695',
  },
  /**
   * 是否禁用开关
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 禁用水波纹
   *
   * @type {Boolean}
   */
  rippleDisabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 加载中的开关
   *
   * @type {Boolean}
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * 进度条颜色
   *
   * @type {String}
   */
  embossLoadingColor: {
    type: String,
    default: '#ffffff',
  },
  /**
   * 选中时的值
   *
   * @type {String,Number,Boolean}
   */
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  /**
   * 没有选中时的值
   *
   * @type {String,Number,Boolean}
   */
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  /**
   * 指定当前是否开启，可以使用 v-model 双向绑定数据
   *
   * @type {String,Number,Boolean}
   */
  modelValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  /**
   * 开关的尺寸，可选值为large、small、default或者不写。建议如果使用了2个汉字的文字，使用 large
   *
   * @type {String,Number,Boolean}
   */
  size: {
    type: String,
    values: ['large', 'default'],
    default: 'default',
  },
  /**
   * 返回 Promise 可以阻止切换
   *
   * @type {Function}
   */
  beforeChange: {
    type: Function,
  },
  /**
   * 颜色
   *
   * @type {String | Array}
   */
  color: {
    type: definePropType<string | string[]>([String, Array]),
    default: '#5b8eff',
  },
  /**
   * 文字颜色
   *
   * @type {String}
   */
  textColor: {
    type: String,
    default: '#ffffff',
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
  /**
   * id
   *
   * @type {String}
   */
  id: {
    type: String,
  },
} as const);
// props 类型
export type SwitchProps = ExtractPropTypes<typeof switchProps>;

// emits事件类型
export const switchEmits = {
  'on-change': (checked: boolean | string | number) =>
    isBoolean(checked) || isString(checked) || isNumber(checked),
  'update:modelValue': (checked: boolean | string | number) =>
    isBoolean(checked) || isString(checked) || isNumber(checked),
};
export type SwitchEmits = typeof switchEmits;

// 组件实例
export type SwitchInstance = InstanceType<typeof Switch>;
