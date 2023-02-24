import { computed, unref } from 'vue';

// utils
import { letter } from '@ivue-material-plus/utils';

// type
import type { Ref } from 'vue';
import type { TabsProps } from './tabs';
import type { TabInstance } from './tab';

// Data
type Data = {
  tabs: Ref<TabInstance[]>;
  isOverflowing: Ref<boolean>;
  scrollOffset: Ref<number>;
  isInit: Ref<boolean>;
};

export default (
  bem: any,
  props: TabsProps,
  { tabs, isOverflowing, scrollOffset, isInit }: Data
) => {
  // 是否有箭头
  const hasArrows = computed((): boolean => {
    return props.showArrows && unref(isOverflowing);
  });

  // 导航样式
  const containerStyles = computed(() => {
    const height = props.height;

    // 是否有单位
    const isUnit = letter.test(`${height}`);

    return {
      height: !isUnit ? `${height}px` : height,
      transform: `translate3d(-${unref(scrollOffset)}px, 0,0)`,
    };
  });

  // 没有找到可以激活的tab
  const noFindActiveTab = computed(() => {
    return unref(tabs).findIndex((tab, index: number) => {
      return tab.tabName === props.modelValue || index === props.modelValue;
    });
  });

  // 激活的Index
  const activeIndex = computed(() => {
    return unref(tabs).findIndex((tab, index: number) => {
      if (!props.modelValue) {
        return index === 0;
      }

      // 没有找到可以激活的tab 默认激活第一项
      if (noFindActiveTab.value === -1) {
        return index === 0;
      }

      return tab.tabName === props.modelValue || index === props.modelValue;
    });
  });

  // 激活的tab
  const activeTab = computed(() => {
    if (!unref(tabs).length) {
      return undefined;
    }

    return unref(tabs)[unref(activeIndex)];
  });

  // tab外层样式
  const tabWrapperStyles = computed(() => {
    // 是否有单位
    const isUnit = letter.test(`${props.arrowsMargin}`);

    return {
      marginLeft: hasArrows.value
        ? !isUnit
          ? `${props.arrowsMargin}px`
          : props.arrowsMargin
        : '',
      marginRight: hasArrows.value
        ? !isUnit
          ? `${props.arrowsMargin}px`
          : props.arrowsMargin
        : '',
      transition: unref(isInit) ? '' : 'none 0s',
    };
  });

  // tab样式
  const tabContainerClasses = computed(() => {
    return [
      bem.be('header', 'slot'),
      {
        // 导航内容居中
        [bem.is('centered')]: props.centered,
        // 导航内容向右
        [bem.is('right')]: props.right,
        // 固定宽度标签
        [bem.is('fixed-width')]: props.fixedWidth,
        // 自动适应宽度标签
        [bem.is('auto-width')]: props.autoWidth,
        // 导航栏是否需要滚动
        [bem.is('overflow')]: unref(isOverflowing),
      },
    ];
  });

  return {
    tabWrapperStyles,
    tabContainerClasses,

    hasArrows,
    activeTab,
    activeIndex,
    containerStyles,
  };
};
