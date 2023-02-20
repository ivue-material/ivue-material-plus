import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Breadcrumb from './breadcrumb.vue';

// props
export const breadcrumbProps = buildProps({
  /**
   * 分隔符
   *
   * @type {String}
   */
  divider: {
    type: String,
    default: '/',
  },
  /**
   * 中间对齐
   *
   * @type {Boolean}
   */
  justifyCenter: {
    type: Boolean,
    default: false,
  },
  /**
   * 尾部对齐
   *
   * @type {Boolean}
   */
  justifyEnd: {
    type: Boolean,
    default: false,
  },
});
// props 类型
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>;

// 组件实例
export type BreadcrumbInstance = InstanceType<typeof Breadcrumb>;
