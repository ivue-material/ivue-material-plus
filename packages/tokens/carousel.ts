import type { InjectionKey, Ref } from 'vue';

import type { CarouselItemContext } from '@ivue-material-plus/components/ivue-carousel-item';

// CarouselContext
export type CarouselContext = {
  wrapper: Ref<HTMLElement | undefined>;
  items: Ref<CarouselItemContext[]>;
  isCardType: Ref<any>;
  isVertical: Ref<any>;
  loop: boolean;
  cardScale: number;
  addItem: (item: CarouselItemContext) => void;
  removeItem: (uid: number | undefined) => void;
  setContentHeight: (height: number) => void;
  setActiveItem: (index: number) => void;
};
export const CarouselContextKey: InjectionKey<CarouselContext> =
  Symbol('ivue-carousel');
