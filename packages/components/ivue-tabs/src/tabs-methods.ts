import { getCurrentInstance, nextTick, unref } from 'vue';

// type
import type { Ref, ComponentInternalInstance, SetupContext } from 'vue';
import type { TabsProps, TabsEmits, TabsInstance } from './tabs';
import type { TabInstance } from './tab';
import type { ItemInstance } from './item';

type ResizeTimeout = ReturnType<typeof setTimeout>;

// Data
type Data = {
  // dom
  tabHeader?: Ref<HTMLElement | undefined>;
  tabContainer?: Ref<HTMLElement | undefined>;
  tabHeaderContent?: Ref<HTMLElement | undefined>;

  // data
  isOverflowing: Ref<boolean>;
  tabs: Ref<TabInstance[]>;
  tabsItem: Ref<ItemInstance[]>;
  widths: Ref<Record<string, number>>;
  activeTab: Ref<TabInstance | undefined>;
  sliderLeft: Ref<number>;
  sliderWidth: Ref<number>;
  scrollOffset: Ref<number>;
  prevIconVisible: Ref<boolean>;
  nextIconVisible: Ref<boolean>;
  hasArrows: Ref<boolean>;
  resizeTimeout: Ref<ResizeTimeout | null>;
  activeIndex: Ref<number>;
  isBooted: Ref<boolean>;
  startX: Ref<number>;
};

export default (
  props: TabsProps,
  {
    tabHeader,
    tabContainer,
    tabHeaderContent,
    isOverflowing,
    tabs,
    tabsItem,
    widths,
    activeTab,
    sliderLeft,
    sliderWidth,
    scrollOffset,
    prevIconVisible,
    nextIconVisible,
    hasArrows,
    resizeTimeout,
    activeIndex,
    isBooted,
    startX,
  }: Data,
  emit: SetupContext<TabsEmits>['emit']
) => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;

  // 初始化
  const initDate = () => {
    nextTick(() => {
      // 滚动导航栏
      scrollIntoView();
    });

    callSlider();
  };

  // 是否可以滚动
  const overflowCheck = (e: TouchEvent, fn: (arg0: TouchEvent) => any) => {
    unref(isOverflowing) && fn(e);
  };

  // 清除tab导航
  const unregister = (tabName: string | number) => {
    tabs.value = unref(tabs).filter((o) => {
      return o.tabName !== tabName;
    });
  };

  // 清除tab item
  const unregisterItems = (uid: number) => {
    tabsItem.value = unref(tabsItem).filter((o) => {
      return o.uid !== uid;
    });
  };

  // 获取导航宽度
  const setWidths = () => {
    const _bar = unref(tabHeader) ? unref(tabHeader)?.clientWidth : 0;
    const _container = unref(tabContainer)
      ? unref(tabContainer)?.clientWidth
      : 0;
    const _wrapper = unref(tabHeaderContent)
      ? unref(tabHeaderContent)?.clientWidth
      : 0;

    // 导航栏宽度
    widths.value = {
      tabHeader: _bar as number,
      tabContainer: _container as number,
      tabHeaderContent: _wrapper as number,
    };

    setOverflow();
  };

  // 设置导航栏是否滚动
  const setOverflow = () => {
    isOverflowing.value = unref(widths).tabHeader < unref(widths).tabContainer;
  };

  // 设置滑动条
  const callSlider = () => {
    const _activeTab = activeTab.value;

    if (props.hideSlider || !_activeTab) {
      return false;
    }

    nextTick(() => {
      if (!_activeTab || !_activeTab.$el || _activeTab.disabled) {
        return;
      }

      // 滑动条位置
      sliderLeft.value = _activeTab.$el.offsetLeft;
      // 滑动条宽度
      sliderWidth.value = _activeTab.$el.clientWidth;
    });
  };

  // 滚动导航栏
  const scrollIntoView = () => {
    const _activeTab = activeTab.value;

    if (!_activeTab) {
      return;
    }

    // 导航栏是否需要滚动
    if (!unref(isOverflowing)) {
      return (scrollOffset.value = 0);
    }

    const activeTabBounding = _activeTab.$el.getBoundingClientRect();
    const navScrollBounding = unref(tabHeaderContent)!.getBoundingClientRect();
    const navBounding = unref(tabContainer)!.getBoundingClientRect();

    // 当前滚动位置
    const currentOffset = unref(scrollOffset);
    let newOffset = currentOffset;

    if (
      parseInt(`${navBounding.right}`) < parseInt(`${navScrollBounding.right}`)
    ) {
      newOffset =
        unref(tabContainer)!.offsetWidth -
        parseInt(`${navScrollBounding.width}`);
    }

    if (
      parseInt(activeTabBounding.left) < parseInt(`${navScrollBounding.left}`)
    ) {
      newOffset =
        currentOffset -
        (parseInt(`${navScrollBounding.left}`) -
          parseInt(activeTabBounding.left));
    } else if (
      parseInt(activeTabBounding.right) > parseInt(`${navScrollBounding.right}`)
    ) {
      newOffset =
        currentOffset +
        parseInt(activeTabBounding.right) -
        parseInt(`${navScrollBounding.right}`);
    }

    if (currentOffset !== newOffset) {
      // 最大偏移值
      const maxOffset =
        unref(widths).tabContainer - unref(widths).tabHeaderContent;
      const isOffset = newOffset + unref(widths).tabHeaderContent;
      const widthsContainer = unref(widths).tabContainer;

      if (isOffset > widthsContainer) {
        newOffset = maxOffset;
      }

      scrollOffset.value = newOffset;
    }
  };

  // 检查是否有icon
  const checkIcons = () => {
    // 上一个按钮显示
    prevIconVisible.value = checkPrevIcon();
    // 下一个按钮显示
    nextIconVisible.value = checkNextIcon();
  };

  // 检查右边按钮
  const checkNextIcon = () => {
    const offset = unref(scrollOffset) + unref(widths).tabHeaderContent;

    if (offset === unref(widths).tabContainer) {
      return false;
    }

    return (
      unref(widths).tabContainer >
      (unref(hasArrows) ? offset - Number(props.arrowsMargin) : offset)
    );
  };

  // 检查左边按钮
  const checkPrevIcon = () => {
    return unref(scrollOffset) > 0;
  };

  // 点击箭头滚动
  const handleScrollTo = (direction: string) => {
    scrollOffset.value = newOffset(direction);
  };

  // 监听resize
  const onResize = () => {
    setWidths();

    clearTimeout(unref(resizeTimeout) as ResizeTimeout);

    resizeTimeout.value = setTimeout(() => {
      // 设置滑动条
      callSlider();
      // 滚动导航栏
      scrollIntoView();
      // 检查是否有icon
      checkIcons();
    }, 300);
  };

  // 导航点击
  const tabNavClick = (tab: TabInstance) => {
    // 判断禁用
    if (tab.disabled) {
      return;
    }

    updateValue(tab.tabName);
  };

  // 更新当前激活的导航
  const updateValue = (value: string | number) => {
    // updated v-model
    emit('update:modelValue', value);
  };

  // 更新激活的item
  const updateItems = (reverse: boolean) => {
    for (let index = unref(tabsItem).length; --index >= 0; ) {
      unref(tabsItem)[index].handleToggle(
        unref(activeIndex) === index,
        reverse,
        unref(isBooted)
      );
    }

    // 控制内容初始化动画效果
    isBooted.value = true;
  };

  // 手势开始
  const onTouchStart = (e: any) => {
    startX.value = unref(scrollOffset) + e.touchstartX;

    tabContainer!.value!.style.transition = 'none';
    tabContainer!.value!.style.willChange = 'transform';
  };

  // 手势移动
  const onTouchMove = (e: any) => {
    scrollOffset.value = unref(startX) - e.touchmoveX;
  };

  // 手势结束
  const onTouchEnd = () => {
    const maxScrollOffset =
      unref(tabContainer)!.clientWidth - unref(tabHeaderContent)!.clientWidth;

    tabContainer!.value!.style.transition = '';
    tabContainer!.value!.style.willChange = '';

    if (unref(scrollOffset) < 0 || !unref(isOverflowing)) {
      scrollOffset.value = 0;
    } else if (unref(scrollOffset) >= maxScrollOffset) {
      scrollOffset.value = maxScrollOffset;
    }
  };

  // 偏移位置
  const newOffset = (direction: string) => {
    const clientWidth = unref(tabHeaderContent)!.clientWidth;

    if (direction === 'prev') {
      return Math.max(unref(scrollOffset) - clientWidth, 0);
    } else {
      return Math.min(
        unref(scrollOffset) + clientWidth,
        unref(tabContainer)!.clientWidth - clientWidth
      );
    }
  };

  // 内容滑动切换.
  const handleSwipeItem = (direction: string) => {
    // 左
    if (direction === 'next') {
      const index = activeIndex.value + 1;

      const tab = unref(tabs)[index];

      if (tab) {
        (proxy as TabsInstance).tabNavClick(tab);
      }
    }

    // 右
    if (direction === 'prev') {
      const index = activeIndex.value - 1;

      const tab = unref(tabs)[index];

      if (tab) {
        (proxy as TabsInstance).tabNavClick(tab);
      }
    }
  };

  return {
    initDate,

    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onResize,

    newOffset,
    checkNextIcon,
    checkPrevIcon,
    overflowCheck,
    callSlider,
    updateItems,
    tabNavClick,

    unregister,
    unregisterItems,

    handleSwipeItem,
    handleScrollTo,
  };
};
