import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Notice from './notice.vue';

// props
export const noticeProps = buildProps({
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
    values: ['normal', 'info', 'warning', 'success', 'error'],
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
    default: true,
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
    default: 0,
  },
  /**
   * 偏移位置
   *
   * @type {Number}
   */
  offset: {
    type: Number,
    default: 0,
  },
  /**
   * 自定义弹出位置
   *
   * @type {String}
   */
  position: {
    type: String,
    values: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    default: 'top-right',
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
   * 标题
   *
   * @type {String}
   */
  title: {
    type: String,
  },
  /**
   * 描述
   *
   * @type {String}
   */
  desc: {
    type: String,
  },
} as const);
// props 类型
export type NoticeProps = ExtractPropTypes<typeof noticeProps>;

// 组件实例
export type NoticeInstance = InstanceType<typeof Notice>;

export type SetTimeout = ReturnType<typeof setTimeout>;
