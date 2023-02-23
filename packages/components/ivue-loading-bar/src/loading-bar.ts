import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type LoadingBar from './loading-bar.vue';

// props
export const loadingBarProps = buildProps({
  /**
   * 颜色
   *
   * @type {String}
   */
  color: {
    type: String,
    default: 'primary',
  },
  /**
   * 错误颜色
   *
   * @type {String}
   */
  failedColor: {
    type: String,
    default: 'error',
  },
  /**
   * 进度条高度
   *
   * @type {Number}
   */
  height: {
    type: Number,
    default: 2,
  },
});
// props 类型
export type LoadingBarProps = ExtractPropTypes<typeof loadingBarProps>;

// 组件实例
export type LoadingBarInstance = InstanceType<typeof LoadingBar>;
