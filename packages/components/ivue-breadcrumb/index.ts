import { withInstall } from '@ivue-material-plus/utils';

import Breadcrumb from './src/breadcrumb.vue';

export const IvueBreadcrumb = withInstall(Breadcrumb);
export default IvueBreadcrumb;

export * from './src/breadcrumb';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueBreadcrumb: typeof import('@ivue-material-plus/components')['IvueBreadcrumb'];
  }
}
