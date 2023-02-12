import { withInstall } from '@ivue-material-plus/utils';

import CarouselItem from './src/carousel-item.vue';

export const IvueCarouselItem = withInstall(CarouselItem);
export default IvueCarouselItem;

export * from './src/carousel-item';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueCarouselItem: typeof import('@ivue-material-plus/components')['IvueCarouselItem'];
  }
}
