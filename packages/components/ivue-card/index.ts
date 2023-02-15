import { withInstall } from '@ivue-material-plus/utils';

import Card from './src/card.vue';

export const IvueCard = withInstall(Card);
export default IvueCard;

export * from './src/card';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueCard: typeof import('@ivue-material-plus/components')['IvueCard'];
  }
}
