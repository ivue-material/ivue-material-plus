import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Slider from './slider.vue';

// props
export const sliderProps = buildProps({
  /**
   * 颜色
   *
   * @type {String}
   */
  color: {
    type: String,
    default: '',
  },
  /**
   * 滑动条位置
   *
   * @type {Number}
   */
  sliderLeft: {
    type: Number,
    default: 0,
  },
  /**
   * 滑动条宽度
   *
   * @type {Number}
   */
  sliderWidth: {
    type: Number,
    default: 0,
  },
});
// props 类型
export type SliderProps = ExtractPropTypes<typeof sliderProps>;

// 组件实例
export type SliderInstance = InstanceType<typeof Slider>;
