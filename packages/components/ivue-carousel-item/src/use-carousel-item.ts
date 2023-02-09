import {
  ref,
  unref,
  onMounted,
  inject,
  nextTick,
  getCurrentInstance,
  onUnmounted,
} from 'vue';

// utils
import { isUndefined } from '@ivue-material-plus/utils';
// carousel
import {
  CarouselContextKey,
  CarouselContext,
} from '../../ivue-carousel/src/carousel';

// type
import type { ComponentInternalInstance } from 'vue';
import type { CarouselItemProps } from './carousel-item';

export const useCarouselItem = (props: CarouselItemProps) => {
  // instance
  const { uid } = getCurrentInstance() as ComponentInternalInstance;

  // inject
  const {
    // dom
    wrapper,

    // data
    items,
    loop,
    cardScale,

    // computed
    // 是否是垂直
    isVertical,
    // 是否是卡片类型
    isCardType,

    // methods
    // 添加选项
    addItem,
    // 删除选项
    removeItem,
    // 设置内容高度
    setContentHeight,
    // 激活选项
    setActiveItem,
  } = inject(CarouselContextKey) as CarouselContext;

  // dom
  const carouselItem = ref<HTMLElement>();

  // data

  // 是否激活
  const active = ref<boolean>(false);
  // 执行动画
  const animating = ref<boolean>(false);
  // 是否可以渲染
  const ready = ref<boolean>(false);
  // 是否可以点击下一个
  const inStage = ref<boolean>(false);
  // hover
  const hover = ref<boolean>(false);
  // translate
  const translate = ref<number>(0);
  // 缩放
  const scale = ref<number>(1);
  // 选项位置
  const zIndex = ref<number>(0);

  // methods

  // 移动选项
  const translateItem = (
    index: number,
    activeIndex: number,
    oldIndex?: number
  ) => {
    const _isCardType = unref(isCardType);
    const _isVertical = unref(isVertical);

    const itemsLength = unref(items).length ?? Number.NaN;

    // 是否激活
    const isActive = index === activeIndex;

    // 不是卡片 & 有旧的index
    if (!_isCardType && !isUndefined(oldIndex)) {
      animating.value = isActive || index === oldIndex;
    }

    // 没有激活 & 选项长度 > 2 & 开启循环
    if (!isActive && itemsLength > 2 && loop) {
      index = processIndex(index, activeIndex, itemsLength);
    }

    // 设置激活的选项
    active.value = isActive;

    // 是卡片
    if (_isCardType) {
      // 是否可以点击下一个
      inStage.value = Math.round(Math.abs(index - activeIndex)) <= 1;

      // 偏移位置
      translate.value = calcCardTranslate(index, activeIndex);

      // 不是当前激活的选项
      if (index !== activeIndex) {
        // 当前是否有 zIndex
        if (unref(zIndex)) {
          zIndex.value -= 1;
        }

        // 右选项
        if (unref(translate) > 0) {
          zIndex.value = unref(zIndex) || 2;
        }

        // 左选项
        if (unref(translate) < 0) {
          zIndex.value = unref(zIndex) || 3;
        }
      }
      // 当前激活的选项清除 zIndex
      else {
        zIndex.value = 0;
      }

      // 是否可以点击下一个 清除zIndex
      if (!unref(inStage)) {
        zIndex.value = 0;
      }

      // 缩放大小
      scale.value = isActive ? 1 : cardScale;
    }
    // 不是卡片
    else {
      // 偏移位置
      translate.value = calcTranslate(index, activeIndex, _isVertical);
    }

    // 是否可以渲染
    ready.value = true;

    // 获取元素的高度
    if (isActive && unref(carouselItem)) {
      nextTick(() => {
        // 竖向 | 横向
        const height = isVertical.value
          ? unref(carouselItem)!.offsetWidth
          : unref(carouselItem)!.offsetHeight;

        setContentHeight(height);
      });
    }
  };

  // 选项进度索引
  const processIndex = (index: number, activeIndex: number, length: number) => {
    // 最后一个选项的索引
    const lastItemIndex = length - 1;
    // 上一个选项索引
    const prevItemIndex = activeIndex - 1;
    // 下一个选项索引
    const nextItemIndex = activeIndex + 1;
    // 中间的索引
    const halfItemIndex = length / 2;

    // 激活第一个索引 && 最后一个选项
    if (activeIndex === 0 && index === lastItemIndex) {
      return -1;
    }
    // 激活的索引 === 最后一个选项的索引 && 第一个选项
    else if (activeIndex === lastItemIndex && index === 0) {
      return length;
    }
    // 选项的索引小于 上一个选项索引 && 激活的选项 - 当前选项的索引 >= 中间索引 -> 向右选择数组
    // [0,1,2,0,1,2]
    else if (index < prevItemIndex && activeIndex - index >= halfItemIndex) {
      return length + 1;
    }
    // 当前选项索引 > 下一个选项索引 && 当前选项的索引 - 激活的索引 >= 中间值 -> 向左选择数组
    else if (index > nextItemIndex && index - activeIndex >= halfItemIndex) {
      return -2;
    }

    return index;
  };

  // 计算 translate 位置
  const calcTranslate = (
    index: number,
    activeIndex: number,
    isVertical: boolean
  ) => {
    const wrapperEl = unref(wrapper);

    if (!wrapperEl) {
      return 0;
    }

    // 父级宽度
    let parentOffset = 0;

    // 垂直
    if (isVertical) {
      parentOffset = wrapperEl.offsetHeight;
    }
    // 横向
    else {
      parentOffset = wrapperEl.offsetWidth;
    }

    // 位置 * (当前索引 - 激活的索引)
    return parentOffset * (index - activeIndex);
  };

  // 计算 卡片类型 translate 位置
  const calcCardTranslate = (index: number, activeIndex: number) => {
    // 父级宽度
    let parentOffset = 0;

    // 垂直
    if (unref(isVertical)) {
      parentOffset = unref(wrapper)?.offsetHeight || 0;
    }
    // 横向
    else {
      parentOffset = unref(wrapper)?.offsetWidth || 0;
    }

    // 可以点击下一个
    if (unref(inStage)) {
      return (parentOffset * ((2 - cardScale) * (index - activeIndex) + 1)) / 4;
    }
    // 当前选项下标 < 激活的索引 向右前进
    else if (index < activeIndex) {
      return (-(1 + cardScale) * parentOffset) / 4;
    }
    // 当前选项下标 > 激活的索引 向左前进
    else {
      return ((3 + cardScale) * parentOffset) / 4;
    }
  };

  // 点击选项
  const handleItemClick = () => {
    if (unref(wrapper) && unref(isCardType)) {
      // 当前点击的index
      const index = unref(items).findIndex(({ uid: _uid }) => {
        return _uid === uid;
      });

      // 激活选项
      setActiveItem(index);
    }
  };

  // onMounted
  onMounted(() => {
    addItem({
      props,
      translate: unref(translate),
      scale: unref(scale),
      active: unref(active),
      ready: unref(ready),
      inStage: unref(inStage),
      animating: unref(animating),
      hover: unref(hover),
      uid,
      translateItem,
    });
  });

  // onUnmounted
  onUnmounted(() => {
    removeItem(uid);
  });

  return {
    // dom
    carouselItem,

    // data
    active,
    animating,
    inStage,
    hover,
    translate,
    scale,
    zIndex,
    ready,

    // inject
    isCardType,
    isVertical,

    // methods
    handleItemClick,
  };
};
