import type { CarouselItemProps } from '../ivue-carousel-item/carousel-item';

export type CarouselItemStates = {
  translate: number
  scale: number
  active: boolean
  ready: boolean
  inStage: boolean
  animating: boolean
}

export type CarouselItemContext = {
  props: CarouselItemProps
  states: CarouselItemStates
  uid: number | undefined
  translateItem: (index: number, activeIndex: number, oldIndex?: number) => void
}
