import { withInstall } from '@ivue-material-plus/utils';

import Affix from './src/affix.vue';

export const IvueAffix = withInstall(Affix);
export default IvueAffix;

export * from './src/affix';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueAffix: typeof import('@ivue-material-plus/components')['IvueAffix'];
  }
}
