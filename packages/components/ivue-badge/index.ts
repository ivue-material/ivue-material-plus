import { withInstall } from '@ivue-material-plus/utils';

import Badge from './src/badge.vue';

export const IvueBadge = withInstall(Badge);
export default IvueBadge;

export * from './src/badge';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueBadge: typeof import('@ivue-material-plus/components')['IvueBadge'];
  }
}
