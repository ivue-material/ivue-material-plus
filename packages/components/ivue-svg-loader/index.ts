import { withInstall } from '@ivue-material-plus/utils';

import SvgLoader from './src/svg-loader.vue';

export const IvueSvgLoader = withInstall(SvgLoader);
export default IvueSvgLoader;

export * from './src/svg-loader';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueSvgLoader: typeof import('@ivue-material-plus/components')['IvueSvgLoader'];
  }
}
