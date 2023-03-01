import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type DatePickerDate from './date-picker-date.vue';

type Color = string | string[];
type AllowedDates = (value: string) => boolean
type NoteColor = string | Record<string, any> | ((date: string) => string);

// props
export const datePickerDateProps = buildProps({
  /**
   * 一周的第一天
   *
   * @type {String,Number}
   */
  firstDayOfWeek: {
    type: [String, Number],
    default: 0,
  },
  /**
   * 年月
   *
   * @type {String}
   */
  tableDate: {
    type: String,
    default: '',
    required: true,
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
   * 当前激活的type
   *
   * @type {String}
   */
  activeType: {
    type: String,
  },
  /**
   * 日期 时间
   *
   * @type {String,Array}
   */
  value: {
    type: [String, Array],
  },
  /**
   * 最小年份或月份
   *
   * @type {String}
   */
  min: {
    type: String,
  },
  /**
   * 最大年份或月份
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
   * 当前日期
   *
   * @type {String}
   */
  current: {
    type: String,
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
   * 格式化函数
   *
   * @type {Function}
   */
  format: {
    type: Function,
  },
  /**
   * 背景颜色
   *
   * @type {Function}
   */
  backgroundColor: {
    type: Function,
  },
  /**
   * 文字颜色
   *
   * @type {Function}
   */
  textColor: {
    type: Function,
  },
  /**
   * 便签用于标记需要注意的日期
   *
   * @type {Array, Function}
   */
  note: {
    type: [Array, Function],
  },
  /**
   * 便签用于标记需要注意的日期的颜色
   *
   * @type {String, Function, Object}
   */
  noteColor: {
    type: definePropType<NoteColor>([String, Function, Object]),
    default: 'warning',
  },
  /**
   * 文字颜色
   *
   * @type {String | Array}
   */
  color: {
    type: definePropType<Color>([String, Array]),
  },
});
// props 类型
export type DatePickerDateProps = ExtractPropTypes<typeof datePickerDateProps>;

// 组件实例
export type DatePickerDateInstance = InstanceType<typeof DatePickerDate>;
