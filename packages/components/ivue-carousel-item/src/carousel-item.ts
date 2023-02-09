import { buildProps,definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes,Ref } from 'vue';
import type CarouselItem from './carousel-item.vue';

type Label = string | number;

// props
export const carouselItemProps = buildProps({
  /**
   * 幻灯片的名字，可用作 setActiveItem 的参数
   *
   * @type {String | Number}
   */
  name: {
    type: [String, Number],
  },
  /**
   * 该幻灯片所对应指示器的文本
   *
   * @type {String | Number}
   */
  label: {
    type: definePropType<Label>([String, Number]),
    default: ''
  },
} as const);

// props 类型
export type CarouselItemProps = ExtractPropTypes<typeof carouselItemProps>;

// 组件实例
export type CarouselItemInstance = InstanceType<typeof CarouselItem>;

// CarouselItemContext
export type CarouselItemContext = {
  props: CarouselItemProps;
  uid: number;
  translateItem: (
    index: number,
    activeIndex: number,
    oldIndex?: number
  ) => void;
} & CarouselItemStates;

// CarouselItemStates
export type CarouselItemStates = {
  translate: number;
  scale: number;
  active: boolean;
  ready: boolean;
  inStage: boolean;
  animating: boolean;
  hover: boolean;
};

// WrapperStyles
export type WrapperStyles = {
  transform: string;
  zIndex?: number;
};
