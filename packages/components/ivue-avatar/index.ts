import { withInstall } from '@ivue-material-plus/utils';

import Avatar from './src/avatar.vue';

export const IvueAvatar = withInstall(Avatar);
export default IvueAvatar;

export * from './src/avatar';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueAvatar: typeof import('@ivue-material-plus/components')['IvueAvatar'];
  }
}
