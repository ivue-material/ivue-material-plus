import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';

type Color = string | string[];

// props
export const pickerProps = buildProps({
  /**
   * 强制100％宽度
   *
   * @type {Boolean}
   */
  fullWidth: {
    type: Boolean,
  },
  /**
   * 选择框宽度
   *
   * @type {Boolean}
   */
  width: {
    type: [Number, String],
    default: 290,
    validator: (value: string) => parseInt(value, 10) > 0,
  },
  transition: {
    type: String,
    default: 'ivue-picker-fade',
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
export type PickerProps = ExtractPropTypes<typeof pickerProps>;
