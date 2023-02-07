import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Badge from './badge.vue';

// props
export const badgeProps = buildProps({
  /**
   * 显示的数字
   *
   * @type {Number}
   */
  count: {
    type: Number,
  },
  /**
   * 自定义的class名称，dot 模式下无效
   *
   * @type {String}
   */
  className: {
    type: String,
  },
  /**
   * 封顶的数字值
   *
   * @type {Number, String}
   */
  overflowCount: {
    type: [Number, String],
    default: 99,
  },
  /**
   * 当数值为0时是否显示
   *
   * @type {Boolean}
   */
  showZero: {
    type: Boolean,
    default: false,
  },
  /**
   * 自定义内容
   *
   * @type {String}
   */
  text: {
    type: String,
    default: '',
  },
  /**
   * 颜色
   *
   * @type {String}
   */
  color: {
    type: String,
    default: '#FF617F',
  },
  /**
   * 数字偏移位置
   *
   * @type {Array}
   */
  offset: {
    type: Array,
  },
  /**
   * 显示成小红点
   *
   * @type {Boolean}
   */
  dot: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否显示徽标
   *
   * @type {Boolean}
   */
  show: {
    type: Boolean,
    default: true,
  },
  /**
   * 设置 Badge 为状态点
   *
   * @type {String}
   */
  status: {
    type: String,
  },
});
// props 类型
export type BadgeProps = ExtractPropTypes<typeof badgeProps>;

// 组件实例
export type BadgeInstance = InstanceType<typeof Badge>;

// 颜色列表
export const initColorList = [
  'blue',
  'green',
  'red',
  'yellow',
  'pink',
  'orange',
  'gold',
  'lime',
  'cyan',
  'purple',
  'success',
  'processing',
  'default',
  'error',
  'warning',
];
