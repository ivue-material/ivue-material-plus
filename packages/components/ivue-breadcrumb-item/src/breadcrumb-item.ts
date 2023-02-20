import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type BreadcrumbItem from './breadcrumb-item.vue';

// props
export const breadcrumbItemProps = buildProps({
  /**
   * 路由跳转对象，同 vue-router 的 to
   *
   * @type {String, Object}
   */
  to: {
    type: definePropType<RouteLocationRaw>([Object, String]),
  },
  /**
   * 在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录
   *
   * @type {Boolean}
   */
  replace: {
    type: Boolean,
    default: false,
  },
});
// props 类型
export type BreadcrumbItemProps = ExtractPropTypes<typeof breadcrumbItemProps>;

// 组件实例
export type BreadcrumbItemInstance = InstanceType<typeof BreadcrumbItem>;
