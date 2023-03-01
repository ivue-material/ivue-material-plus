import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type DatePickerTitle from './date-picker-title.vue';

// props
export const datePickerTitleProps = buildProps({
  /**
   * value
   *
   * @type {String}
   */
  value: {
    type: String,
    default: '',
  },
  /**
   * 选择年份
   *
   * @type {Boolean}
   */
  selectingYear: {
    type: Boolean,
    default: false,
  },
  /**
   * 当前年份
   *
   * @type {Number, String}
   */
  year: {
    type: [Number, String],
    default: '',
  },
  /**
   * 日期
   *
   * @type {String}
   */
  date: {
    type: String,
    default: '',
  },
  /**
   * 年份图标
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
});
// props 类型
export type DatePickerTitleProps = ExtractPropTypes<
  typeof datePickerTitleProps
>;

// 组件实例
export type DatePickerTitleInstance = InstanceType<typeof DatePickerTitle>;
