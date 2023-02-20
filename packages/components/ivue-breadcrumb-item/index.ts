import { withInstall } from '@ivue-material-plus/utils';

import BreadcrumbItem from './src/breadcrumb-item.vue';

export const IvueBreadcrumbItem = withInstall(BreadcrumbItem);
export default IvueBreadcrumbItem;

export * from  './src/breadcrumb-item';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueBreadcrumbItem: typeof import('@ivue-material-plus/components')['IvueBreadcrumbItem'];
  }
}
