import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type DatePickerHeader from './date-picker-header.vue';

type Color = string | string[];
type ModelValue = string | string[];

// props
export const datePickerHeaderProps = buildProps({
  /**
   * 日期时间
   *
   * @type {String}
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
   * 左边按钮图标
   *
   * @type {String}
   */
  nextIcon: {
    type: String,
    default: 'chevron_right',
  },
  /**
   * 右边按钮图标
   *
   * @type {String}
   */
  prevIcon: {
    type: String,
    default: 'chevron_left',
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
   * 是否只读
   *
   * @type {Boolean}
   */
  readonly: {
    type: Boolean,
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
   * 日期格式化
   *
   * @type {Function}
   */
  format: {
    type: Function,
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
} as const);
// props 类型
export type DatePickerHeaderProps = ExtractPropTypes<
  typeof datePickerHeaderProps
>;

// 组件实例
export type DatePickerHeaderInstance = InstanceType<typeof DatePickerHeader>;
