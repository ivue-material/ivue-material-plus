import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Message from './message.vue';

// props
export const messageProps = buildProps({
  /**
   * 内容
   *
   * @type {String}
   */
  content: {
    type: String,
    default: '',
  },
  /**
   * 类型名称
   *
   * @type {String}
   */
  type: {
    type: String,
    values: ['normal', 'info', 'warning', 'success', 'error', 'loading'],
    default: 'normal',
  },
  /**
   * 样式名称
   *
   * @type {String}
   */
  className: {
    type: String,
  },
  /**
   * 是否有关闭按钮
   *
   * @type {Boolean}
   */
  closable: {
    type: Boolean,
    default: false,
  },
  /**
   * 背景颜色
   *
   * @type {Boolean}
   */
  background: {
    type: Boolean,
    default: false,
  },
  /**
   * render 渲染函数
   *
   * @type {Function}
   */
  render: {
    type: Function,
  },
  /**
   * 关闭方法
   *
   * @type {Function}
   */
  onClose: {
    type: Function,
  },
  /**
   * 组件名称
   *
   * @type {String}
   */
  id: {
    type: String,
    required: true,
  },
  /**
   * 延迟关闭时间
   *
   * @type {Function}
   */
  duration: {
    type: Number,
    default: 1500,
  },
  /**
   * 偏移位置
   *
   * @type {Number}
   */
  top: {
    type: Number,
    default: 0,
  },
  /**
   * 当前index
   *
   * @type {Number}
   */
  zIndex: {
    type: Number,
    default: 0,
  },
  /**
   * loading icon
   *
   * @type {String}
   */
  loadingIcon: {
    type: String,
  },
} as const);
// props 类型
export type MessageProps = ExtractPropTypes<typeof messageProps>;

// 组件实例
export type MessageInstance = InstanceType<typeof Message>;
