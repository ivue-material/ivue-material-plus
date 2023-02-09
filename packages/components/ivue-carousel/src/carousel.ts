import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes, InjectionKey, Ref } from 'vue';
import type Carousel from './carousel.vue';
// import type { CarouselItemContext } from '../../ivue-carousel-item/src/carousel-item';

// props
export const carouselProps = buildProps({
  /**
   * carousel 的类型
   *
   * @type {String}
   */
  type: {
    type: String,
    values: ['card'],
  },
  /**
   * 展示的方向
   *
   * @type {String}
   */
  direction: {
    type: String,
    values: ['vertical', 'horizontal'],
    default: 'horizontal',
  },
  /**
   * 导航器竖向方向
   *
   * @type {String}
   */
  verticalDotsDirection: {
    type: String,
    values: ['left', 'right'],
    default: 'left',
  },
  /**
   * carousel 的高度
   *
   * @type {String}
   */
  height: {
    type: String,
  },
  /**
   * 是否循环显示
   *
   * @type {Boolean}
   */
  loop: {
    type: Boolean,
    default: true,
  },
  /**
   * 初始状态激活的幻灯片的索引，从 0 开始
   *
   * @type {Number}
   */
  initialIndex: {
    type: Number,
    default: 0,
  },
  /**
   * 左箭头图标
   *
   * @type {String}
   */
  leftArrow: {
    type: String,
    default: 'keyboard_arrow_left',
  },
  /**
   * 右箭头图标
   *
   * @type {String}
   */
  rightArrow: {
    type: String,
    default: 'keyboard_arrow_right',
  },
  /**
   * 切换箭头显示时机
   *
   * @type {String}
   *
   * hover（悬停），always（一直显示），never（不显示）
   */
  arrow: {
    type: String,
    values: ['hover', 'always', 'never'],
    default: 'always',
  },
  /**
   * 指示器的位置，可选值为 inside （内部），outside（外部），none（不显示）
   *
   * @type {String}
   */
  dots: {
    type: String,
    values: ['inside', 'outside', 'none'],
    default: 'inside',
  },
  /**
   * 是否显示圆形指示器
   *
   * @type {Boolean}
   */
  radiusDot: {
    type: Boolean,
    default: false,
  },
  /**
   * 节流时间 (作用于 prev,next,handleArrowClick 方法 )
   *
   * @type {Number}
   */
  throttleTime: {
    type: Number,
    default: 300,
  },
  /**
   * 指示器的触发方式
   *
   * @type {String}
   */
  trigger: {
    type: String,
    values: ['hover', 'click'],
    default: 'click',
  },
  /**
   * 是否自动切换
   *
   * @type {Boolean}
   */
  autoplay: {
    type: Boolean,
    default: false,
  },
  /**
   * 自动切换的时间间隔，单位为毫秒
   *
   * @type {Number}
   */
  interval: {
    type: Number,
    default: 3000,
  },
  /**
   * 鼠标悬浮时暂停自动切换
   *
   * @type {Boolean}
   */
  pauseOnHover: {
    type: Boolean,
    default: false,
  },
  /**
   * 卡片缩放大小
   *
   * @type {Number}
   */
  cardScale: {
    type: Number,
    default: 0.83,
  },
} as const);
// props 类型
export type CarouselProps = ExtractPropTypes<typeof carouselProps>;

// emits事件类型
export const carouselEmits = {
  'on-change': (current: number, prev: number) => ({
    current,
    prev,
  }),
};
export type CarouselEmits = typeof carouselEmits;

// 组件实例
export type CarouselInstance = InstanceType<typeof Carousel>;

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


  // CarouselItemContext
export type CarouselItemContext = {
  props: any;
  uid: number;
  translateItem: (
    index: number,
    activeIndex: number,
    oldIndex?: number
  ) => void;
} & CarouselItemStates;

// CarouselItemStates
export type CarouselItemStates = {
  translate: number
  scale: number;
  active: boolean
  ready: boolean
  inStage: boolean
  animating: boolean
  hover: boolean
};
