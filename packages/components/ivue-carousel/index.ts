import { withInstall } from '@ivue-material-plus/utils';

import Carousel from './src/carousel.vue';

export const IvueCarousel = withInstall(Carousel);
export default IvueCarousel;

export * from './src/carousel';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueCarousel: typeof import('@ivue-material-plus/components')['IvueCarousel'];
  }
}
