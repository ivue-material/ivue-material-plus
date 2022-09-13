import type { ExtractPropTypes, Ref, InjectionKey } from 'vue';

import type CarouselItem from './index.vue';
import type { CarouselItemContext } from '../ivue-carousel/carousel';

export const carouselItemProps = {
  name: { type: String, default: '' },
  label: {
    type: [String, Number],
    default: '',
  },
} as const;

export type CarouselItemProps = ExtractPropTypes<typeof carouselItemProps>

export type CarouselItemInstance = InstanceType<typeof CarouselItem>

export type CarouselContext = {
  wrapper: Ref<HTMLElement | undefined>
  items: Ref<CarouselItemContext[]>
  isCardType: Ref<any>
  isVertical: Ref<any>
  loop: boolean
  addItem: (item: CarouselItemContext) => void
  removeItem: (uid: number | undefined) => void
  // setActiveItem: (index: number) => void
}

export const CarouselContextKey: InjectionKey<CarouselContext> =
  Symbol('ivue-carousel');
