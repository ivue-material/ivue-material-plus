import { withInstall } from '@ivue-material-plus/utils';

import Switch from './src/switch.vue';

export const IvueSwitch = withInstall(Switch);
export default IvueSwitch;

export * from './src/switch';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueSwitch: typeof import('@ivue-material-plus/components')['IvueSwitch'];
  }
}
