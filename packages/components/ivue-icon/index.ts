import { withInstall } from '@ivue-material-plus/utils';

import Icon from './src/icon.vue';

export const IvueIcon = withInstall(Icon);
export default IvueIcon;

export * from './src/icon';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueIcon: typeof import('@ivue-material-plus/components')['IvueIcon'];
  }
}
