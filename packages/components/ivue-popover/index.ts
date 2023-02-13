import { withInstall } from '@ivue-material-plus/utils';

import Popover from './src/popover.vue';

export const IvuePopover = withInstall(Popover);
export default IvuePopover;

export * from './src/popover';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvuePopover: typeof import('@ivue-material-plus/components')['IvuePopover'];
  }
}
