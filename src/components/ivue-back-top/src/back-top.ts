import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type BackTop from './back-top.vue';

// props
export const backTopProps = buildProps({
  /**
   * 触发滚动的对象
   *
   * @type {String}
   */
  target: {
    type: String,
    default: '',
  },
  /**
   * 页面滚动高度达到该值时才显示
   *
   * @type {Number}
   */
  visibilityHeight: {
    type: Number,
    default: 200,
  },
  /**
   * 组件距离底部的距离
   *
   * @type {Number}
   */
  bottom: {
    type: Number,
    default: 30,
  },
  /**
   * 组件距离右部的距离
   *
   * @type {Number}
   */
  right: {
    type: Number,
    default: 30,
  },
  /**
   * 滚动动画持续时间，单位 毫秒
   *
   * @type {Number}
   */
  duration: {
    type: Number,
    default: 1000,
  },
  /**
   * 图标
   *
   * @type {String}
   */
  icon: {
    type: String,
    default: 'arrow_upward',
  },
});
// props 类型
export type BackTopProps = ExtractPropTypes<typeof backTopProps>;

// emits事件类型
export const backTopEmits = {
  'on-scroll-end': () => true,
  'on-click': () => true,
};
export type BackTopEmits = typeof backTopEmits;

// 组件实例
export type BackTopInstance = InstanceType<typeof BackTop>;
