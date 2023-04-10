import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type DatePicker from './date-picker.vue';

type ModelValue = string | string[];
type AllowedDates = (value: string) => boolean;

// props
export const datePickerProps = buildProps({
  /**
   * 日期时间
   *
   * @type {Array, String}
   */
  modelValue: {
    type: definePropType<ModelValue>([Array, String]),
    default: '',
  },
  /**
   * 日历方向
   *
   * @type {Boolean}
   */
  landscape: {
    type: Boolean,
  },
  /**
   * 头部颜色
   *
   * @type {String}
   */
  headerColor: {
    type: String,
  },
  /**
   * 选择框宽度
   *
   * @type {Number | String}
   */
  width: {
    type: [Number, String],
    default: 290,
    validator: (value: number | string) => parseInt(`${value}`, 10) > 0,
  },
  /**
   * 强制100％宽度
   *
   * @type {Boolean}
   */
  fullWidth: {
    type: Boolean,
  },
  /**
   * 隐藏日历头部
   *
   * @type {Boolean}
   */
  noTitle: {
    type: Boolean,
  },
  /**
   * Function formatting the year in table header and pickup title
   *
   * @type {Function}
   */
  titleYearFormat: {
    type: Function,
  },
  /**
   * Function formatting currently selected date in the picker title
   *
   * @type {Function}
   */
  titleDateFormat: {
    type: Function,
  },
  /**
   * 在日/月表头中格式化 tableDate 的函数
   *
   * @type {Function}
   */
  headerDateFormat: {
    type: Function,
  },
  /**
   * 在日期选择器表中格式化日期的函数
   *
   * @type {Function}
   */
  dayFormat: {
    type: Function,
  },
  /**
   * 函数格式化月份表中的月份
   *
   * @type {Function}
   */
  monthFormat: {
    type: Function,
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
   * 是否支持日期多选
   *
   * @type {Boolean}
   */
  multiple: {
    type: Boolean,
  },
  /**
   * 日历显示的类型 默认显示为日期
   *
   * @type {String}
   */
  type: {
    type: String,
    values: ['date', 'month'],
    default: 'date',
  },
  /**
   * 为年份标题添加图标
   *
   * @type {String}
   */
  yearIcon: {
    type: String,
  },
  /**
   * 是否只读
   *
   * @type {Boolean}
   */
  readonly: {
    type: Boolean,
  },
  /**
   * 监听pickerDate变化以便在更改时执行某些操作，当选择月/年时触发
   *
   * @type {String}
   */
  pickerDate: {
    type: String,
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
   * 头部按钮右图标
   *
   * @type {String}
   */
  nextIcon: {
    type: String,
    default: 'chevron_right',
  },
  /**
   * 头部按钮左图标
   *
   * @type {String}
   */
  prevIcon: {
    type: String,
    default: 'chevron_left',
  },
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
   * 设置允许选择日期函数
   *
   * @type {Function}
   */
  allowedDates: {
    type: definePropType<AllowedDates>(Function),
  },
  /**
   * 是否显示当前日期
   *
   * @type {Boolean}
   */
  showCurrent: {
    type: Boolean,
    default: false,
  },
  /**
   * 便签用于标记需要注意的日期
   *
   * @type {Array,Function}
   */
  note: {
    type: [Array, Function],
    default: null,
  },
  /**
   * 便签用于标记需要注意的日期的颜色
   *
   * @type {String, Function, Object}
   */
  noteColor: {
    type: [String, Function, Object],
    default: 'warning',
  },
  /**
   * 点击月份或者年份时日期月份或年份是否跟随改变
   *
   * @type {Boolean}
   */
  reactive: {
    type: Boolean,
  },
  /**
   * 颜色
   *
   * @type {String}
   */
  color: {
    type: String,
    default: '',
  },
} as const);
// props 类型
export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>;

// emits事件类型
export const datePickerEmits = {};
export type DatePickerEmits = typeof datePickerEmits;

// 组件实例
export type DatePickerInstance = InstanceType<typeof DatePicker>;

// data
export type DatePickerData = {
  inputDay: string | number;
  inputMonth: string | number;
  inputYear: string | number;
  now: Date;
  activeType: string;
  tableDate: string;
};
