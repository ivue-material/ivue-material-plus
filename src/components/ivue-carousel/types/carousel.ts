import type { Props as CarouselItemProps } from '../../ivue-carousel-item/types/carousel-item';

export type CarouselItemStates = {
  translate: number;
  scale: number;
  active: boolean;
  ready: boolean;
  inStage: boolean;
  animating: boolean;
  hover: boolean;
}

export type CarouselItemContext = {
  props: CarouselItemProps;
  states: CarouselItemStates;
  uid: number | undefined;
  translateItem: (index: number, activeIndex: number, oldIndex?: number) => void;
}

export interface Props {
  type: string;
  direction: string;
  verticalDotsDirection: string;
  height: string;
  loop: boolean;
  initialIndex: number;
  leftArrow: string;
  rightArrow: string;
  arrow: string;
  dots: string;
  radiusDot: boolean;
  throttleTime: number;
  trigger: string;
  autoplay: boolean;
  interval: number;
  pauseOnHover: boolean;
  cardScale: number;
}

export interface Data {
  items: Array<CarouselItemContext>;
  activeIndex: number;
  hover: boolean;
  timer: ReturnType<typeof setInterval> | null;
  contentHeight: number;
  init: boolean;
}
