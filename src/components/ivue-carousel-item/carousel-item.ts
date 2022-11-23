import type { Ref, InjectionKey } from 'vue';

import type CarouselItem from './index.vue';
import type { CarouselItemContext } from '../ivue-carousel/carousel';

export interface Props {
  name: string | number;
  label: string | number;
}

export type CarouselItemInstance = InstanceType<typeof CarouselItem>

export type CarouselContext = {
  wrapper: Ref<HTMLElement | undefined>
  items: Ref<CarouselItemContext[]>
  isCardType: Ref<any>
  isVertical: Ref<any>
  loop: boolean
  cardScale: number
  addItem: (item: CarouselItemContext) => void
  removeItem: (uid: number | undefined) => void
  setContentHeight: (height: number) => void
  setActiveItem: (index: number) => void
}

export const CarouselContextKey: InjectionKey<CarouselContext> =
  Symbol('ivue-carousel');
