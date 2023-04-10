import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type DatePickerMonth from './date-picker-month.vue';

type Color = string | string[];
type AllowedDates = (value: string) => boolean;
type ModelValue = string | string[];

// props
export const datePickerMonthProps = buildProps({
  /**
   * 日期时间
   *
   * @type {String,Array}
   */
  value: {
    type: definePropType<ModelValue>([Array, String]),
    default: '',
    required: true,
  },
  /**
   * 格式化函数
   *
   * @type {Function}
   */
  format: {
    type: Function,
    default: null,
  },
  /**
   * 年月
   *
   * @type {String}
   */
  tableDate: {
    type: String,
    required: true,
  },
  /**
   * 当前激活的类型
   *
   * @type {String}
   */
  activeType: {
    type: String,
  },
  /**
   * 语言
   *
   * @type {String}
   */
  locale: {
    type: String,
    default: 'en-us',
  },
  /**
   * 当前日期
   *
   * @type {String}
   */
  current: {
    type: String,
  },
  /**
   * 设置背景颜色函数
   *
   * @type {Function}
   */
  setBackgroundColor: {
    type: Function,
    default: () => {},
  },
  /**
   * 设置文字颜色函数
   *
   * @type {Function}
   */
  setTextColor: {
    type: Function,
    default: () => {},
  },
  /**
   * 只读
   *
   * @type {Boolean}
   */
  readonly: {
    type: Boolean,
  },
  /**
   * 最小月份
   *
   * @type {String}
   */
  min: {
    type: String,
  },
  /**
   * 最大月份
   *
   * @type {String}
   */
  max: {
    type: String,
  },
  /**
   * 设置允许选择日期函数
   *
   * @type {Function}
   */
  allowedDates: {
    type: definePropType<AllowedDates>(Function),
  },
  /**
   * 颜色
   *
   * @type {String | Array}
   */
  color: {
    type: definePropType<Color>([String, Array]),
    default: '',
  },
} as const);
// props 类型
export type DatePickerMonthProps = ExtractPropTypes<
  typeof datePickerMonthProps
>;

// 组件实例
export type DatePickerMonthInstance = InstanceType<typeof DatePickerMonth>;
