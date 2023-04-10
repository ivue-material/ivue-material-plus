import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type DatePickerYears from './date-picker-years.vue';

type Color = string | string[];
type AllowedDates = (value: string) => boolean;
type ModelValue = string | string[];

// props
export const datePickerYearsProps = buildProps({
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
   * 年月
   *
   * @type {String}
   */
  tableDate: {
    type: String,
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
   * 最小年份
   *
   * @type {String}
   */
  min: {
    type: String,
  },
  /**
   * 最大年份
   *
   * @type {String}
   */
  max: {
    type: String,
  },
  /**
   * 当前年份
   *
   * @type {Number | String}
   */
  year: {
    type: [Number, String],
    default: '',
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
   * 当前日期
   *
   * @type {String}
   */
  current: {
    type: String,
  },
  /**
   * 设置背景颜色方法
   *
   * @type {Function}
   */
  backgroundColor: {
    type: Function,
    default: () => {},
  },
  /**
   * 设置文字颜色方法
   *
   * @type {Function}
   */
  textColor: {
    type: Function,
    default: () => {},
  },
  /**
   * 文字颜色
   *
   * @type {String | Array}
   */
  color: {
    type: definePropType<Color>([String, Array]),
    default: '',
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
   * 设置允许选择日期函数
   *
   * @type {Function}
   */
  allowedDates: {
    type: definePropType<AllowedDates>(Function),
  },
} as const);
// props 类型
export type DatePickerYearsProps = ExtractPropTypes<
  typeof datePickerYearsProps
>;

// 组件实例
export type DatePickerYearsInstance = InstanceType<typeof DatePickerYears>;
