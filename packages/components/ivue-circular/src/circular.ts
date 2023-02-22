import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Circular from './circular.vue';

type StrokeColor = string | string[];

// props
export const circularProps = buildProps({
  /**
   * 百分比
   *
   * @type {Number}
   */
  percent: {
    type: Number,
    default: 0,
  },
  /**
   * 圆圈大小，单位 px
   *
   * @type {String | Number}
   */
  size: {
    type: [String, Number],
    default: 120,
  },
  /**
   * 是否显示为仪表盘
   *
   * @type {Boolean}
   */
  dashboard: {
    type: Boolean,
    default: false,
  },
  /**
   * 进度环的线宽
   *
   * @type {Number}
   */
  strokeWidth: {
    type: Number,
    default: 6,
  },
  /**
   * 进度环背景的颜色
   *
   * @type {String}
   */
  trailColor: {
    type: String,
    default: '#F8F9FD',
  },
  /**
   * 进度环背景的线宽
   *
   * @type {Number}
   */
  trailWidth: {
    type: Number,
    default: 6,
  },
  /**
   * 进度环顶端的形状，可选值为square（方）和round（圆）
   *
   * @type {String}
   */
  strokeLinecap: {
    type: null,
    values: ['square', 'round'],
    default: 'round',
  },
  /**
   * 进度环的颜色
   *
   * @type {String | Array}
   */
  strokeColor: {
    type: definePropType<StrokeColor>([String, Array]),
    default: '#5B8EFF',
  },
} as const);
// props 类型
export type CircularProps = ExtractPropTypes<typeof circularProps>;

// 组件实例
export type CircularInstance = InstanceType<typeof Circular>;
