import {
  ref,
  unref,
  onMounted,
  watch,
  onBeforeUnmount,
  shallowRef,
  computed,
  provide,
} from 'vue';
import { isString } from '@vue/shared';
import { throttle } from 'lodash-unified';
import { useResizeObserver } from '@vueuse/core';

// carousel
import { CarouselContextKey } from '@ivue-material-plus/tokens';

// type
import type { SetupContext } from 'vue';
import type { CarouselProps, CarouselEmits } from './carousel';
import type { CarouselItemContext } from '../../ivue-carousel-item/src/carousel-item';

export const useCarousel = (
  props: CarouselProps,
  emit: SetupContext<CarouselEmits>['emit']
) => {
  // dom
  // wrapper
  const wrapper = ref<HTMLElement | undefined>();

  // data

  // 选项数量
  const items = ref<CarouselItemContext[]>([]);
  // 激活的选项
  const activeIndex = ref<number>(-1);
  // 内容高度
  const contentHeight = ref<number>(0);
  // 鼠标进入
  const hover = ref<boolean>(false);
  // 是否初始化完毕
  const init = ref<boolean>(false);
  // setInterval
  const timer = ref<ReturnType<typeof setInterval> | null>(null);

  // computed

  // 是否是垂直
  const isVertical = computed(() => {
    return props.direction === 'vertical';
  });

  // 该幻灯片所对应指示器的文本
  const hasLabel = computed(() => {
    return unref(items).some((item) => item.props!.label.toString().length > 0);
  });

  // 是否是卡片类型
  const isCardType = computed(() => {
    return props.type === 'card';
  });

  // 按钮禁用
  const arrowDisplay = computed(() => {
    return props.arrow !== 'never' && !unref(isVertical);
  });

  // methods

  // 激活选项
  const setActiveItem = (index: number | string) => {
    // index 是 字符串
    if (isString(index)) {
      // 通过幻灯片的名字查找下标
      const filteredItems = unref(items).filter(
        (item) => item.props.name === index
      );

      // 过滤选项获取对应的index
      if (filteredItems.length > 0) {
        index = unref(items)!.indexOf(filteredItems[0]);
      }
    }

    // index
    index = Number(index);

    // 是否是整数
    if (Number.isNaN(index) || index !== Math.floor(index)) {
      // eslint-disable-next-line no-console
      console.warn('index must be integer');

      return;
    }

    // 选项长度
    const itemsLength = unref(items).length;

    // 之前激活的下标
    const oldIndex = unref(activeIndex);

    // 指向最后一个下标
    if (index < 0) {
      activeIndex.value = props.loop ? itemsLength - 1 : 0;
    }
    // 指向最后一个
    else if (index >= itemsLength) {
      activeIndex.value = props.loop ? 0 : itemsLength - 1;
    }
    // 其他
    else {
      activeIndex.value = index;
    }

    // 上一个下标 === 当前激活的下标
    if (oldIndex === unref(activeIndex)) {
      // 重置选项位置
      resetItemPosition(oldIndex);
    }

    // 重置倒计时
    resetTimer();
  };

  // 添加选项
  const addItem = (item: CarouselItemContext) => {
    unref(items).push(item);
  };

  // 删除选项
  const removeItem = (uid?: number) => {
    const index = unref(items).findIndex((item) => item.uid === uid);

    // 删除
    if (index !== -1) {
      items.value.splice(index, 1);

      // 设置下一个激活选项
      if (unref(activeIndex) === index) {
        next();
      }
    }
  };

  // 激活上一个选项
  const prev = throttle(
    () => {
      setActiveItem(unref(activeIndex) - 1);
    },
    props.throttleTime,
    { trailing: true }
  );

  // 激活下一个选项
  const next = throttle(
    () => {
      setActiveItem(unref(activeIndex) + 1);
    },
    props.throttleTime,
    { trailing: true }
  );

  // 重置选项位置
  const resetItemPosition = (oldIndex?: number) => {
    unref(items).forEach((item, index) => {
      // 移动选项
      item.translateItem(index, unref(activeIndex), oldIndex);
    });
  };

  // 按钮点击
  const handleArrowClick = throttle(
    (index: number) => {
      setActiveItem(index);
    },
    props.throttleTime,
    { trailing: true }
  );

  // 开始自动切换
  const startTimer = () => {
    // 自动切换的时间间隔，单位为毫秒 < 0 ｜ 没有开启自动切换 | 已经存在倒计时
    if (props.interval <= 0 || !props.autoplay || unref(timer)) {
      return;
    }

    timer.value = setInterval(() => {
      // 激活的选项 < 选项数量
      if (unref(activeIndex) < unref(items).length - 1) {
        activeIndex.value += 1;
      }
      // 开启循环
      else if (props.loop) {
        activeIndex.value = 0;
      }
    }, props.interval);
  };

  // 停止自动切换
  const pauseTimer = () => {
    if (unref(timer)) {
      clearInterval(unref(timer) as any);

      timer.value = null;
    }
  };

  // 监听缩放->浅拷贝 useResizeObserver
  const resizeObserver = shallowRef<ReturnType<typeof useResizeObserver>>();

  // 鼠标进入
  const handleMouseEnter = () => {
    hover.value = true;

    // 鼠标悬浮时暂停自动切换
    if (props.pauseOnHover) {
      pauseTimer();
    }
  };

  // 鼠标离开
  const handleMouseLeave = () => {
    hover.value = false;

    startTimer();
  };

  // 点击导航器
  const handleDotClick = (index: number) => {
    activeIndex.value = index;
  };

  // 导航器hover
  const handleDotHover = (index: number) => {
    if (props.trigger === 'hover' && index !== unref(activeIndex)) {
      activeIndex.value = index;
    }
  };

  // 导航器hover
  const handleThrottleDotHover = throttle((index: number) => {
    handleDotHover(index);
  }, props.throttleTime);

  // 设置内容高度
  const setContentHeight = (height: number) => {
    if (props.height !== 'auto') {
      return;
    }

    contentHeight.value = height;
  };

  // 按钮鼠标进入
  const handleArrowEnter = (arrow: 'left' | 'right') => {
    // 是否是垂直
    if (unref(isVertical)) {
      return;
    }

    unref(items).forEach((item, index) => {
      // 设置卡片hover
      if (arrow === itemInStage(item, index)) {
        item.hover = true;
      }
    });
  };

  // 按钮鼠标离开
  const handleArrowLeave = () => {
    // 是否是垂直
    if (unref(isVertical)) {
      return;
    }

    // 取消选项的hover
    unref(items).forEach((item) => {
      item.hover = false;
    });
  };

  // 选项是否可以点击下一个
  const itemInStage = (item: CarouselItemContext, index: number) => {
    const _items = [...unref(items)];
    const itemLength = _items.length;

    // 没有选项 || 没有下一个
    if (itemLength === 0 || !item.inStage) {
      return false;
    }

    // 上一个选项的index
    const prevItemIndex = index - 1;
    // 下一个选项的index
    const nextItemIndex = index + 1;
    // 最后一个选项的index
    const lastItemIndex = itemLength - 1;

    // 最后一个选项激活
    const isLastItemActive = _items[lastItemIndex].active;
    // 第一个选项激活
    const isFirstItemActive = _items[0].active;
    // 上一个选项激活
    const isPrevItemActive = _items[prevItemIndex].active;
    // 下一个选项激活
    const isNextItemActive = _items[nextItemIndex].active;

    // 当前选项 === 最后一个选项 && 第一个选项激活 || 下一个选项激活 -> 选择的是左边
    if ((index === lastItemIndex && isFirstItemActive) || isNextItemActive) {
      return 'left';
    }
    // index === 0 && 最后一个选项激活 || 上一个选项激活 -> 选择的是右边
    else if ((index === 0 && isLastItemActive) || isPrevItemActive) {
      return 'right';
    }

    return false;
  };

  // 重置倒计时
  const resetTimer = () => {
    pauseTimer();
    startTimer();
  };

  // watch

  // 监听激活的选项
  watch(
    () => unref(activeIndex),
    (current, prev) => {
      // 重置选项位置
      resetItemPosition(prev);

      // 改变了
      if (prev > -1) {
        emit('on-change', current, prev);
      }
    }
  );

  // 监听是否自动切换
  watch(
    () => props.autoplay,
    (value) => {
      value ? startTimer() : pauseTimer();
    }
  );

  // 监听是否循环显示
  watch(
    () => props.loop,
    () => {
      setActiveItem(unref(activeIndex));
    }
  );

  // 监听自动切换的时间间隔，单位为毫秒
  watch(
    () => props.interval,
    () => {
      resetTimer();
    }
  );

  // onMounted
  onMounted(() => {
    resizeObserver.value = useResizeObserver(wrapper.value, () => {
      // 重置选项位置
      resetItemPosition();
    });

    // 设置激活的选项
    if (props.initialIndex < unref(items).length && props.initialIndex >= 0) {
      activeIndex.value = props.initialIndex;
    }

    // 开始自动切换
    startTimer();

    // 已经完成初始化
    setTimeout(() => {
      init.value = true;
    });
  });

  // onBeforeUnmount
  onBeforeUnmount(() => {
    // 停止监听缩放
    if (wrapper.value && resizeObserver.value) {
      resizeObserver.value.stop();
    }
  });

  // provide
  provide(CarouselContextKey, {
    // dom
    wrapper,

    // data
    items,
    loop: props.loop,
    cardScale: props.cardScale,

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
  });

  return {
    // dom
    wrapper,

    // data
    init,
    items,
    hover,
    contentHeight,
    activeIndex,

    // computed
    isCardType,
    hasLabel,
    isVertical,
    arrowDisplay,

    // methods
    addItem,
    removeItem,

    setContentHeight,
    setActiveItem,

    handleMouseEnter,
    handleMouseLeave,
    handleArrowEnter,
    handleArrowLeave,
    handleArrowClick,
    handleThrottleDotHover,
    handleDotClick,
    prev,
    next,
  };
};
