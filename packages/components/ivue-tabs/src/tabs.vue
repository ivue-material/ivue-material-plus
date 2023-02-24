<template>
  <div :class="bem.b()">
    <!-- 头部 -->
    <div :class="bem.b('header')" ref="tabHeader">
      <!-- 左边按钮 -->
      <transition name="fade">
        <ivue-icon
          :class="[bem.be('header', 'icon'), bem.is('prev')]"
          v-show="hasArrows && prevIconVisible"
          @click="handleScrollTo('prev')"
        >
          {{ prevIcon }}
        </ivue-icon>
      </transition>
      <!-- 内容 -->
      <div
        :class="bem.be('header', 'content')"
        :style="tabWrapperStyles"
        v-touch="vTouch"
        ref="tabHeaderContent"
      >
        <div
          :class="tabContainerClasses"
          :style="containerStyles"
          ref="tabContainer"
        >
          <slider
            :sliderLeft="sliderLeft"
            :sliderWidth="sliderWidth"
            :color="sliderColor"
          ></slider>
          <slot name="header"></slot>
        </div>
      </div>
      <!-- 右边按钮 -->
      <transition name="fade">
        <ivue-icon
          :class="[bem.be('header', 'icon'), bem.is('next')]"
          v-show="hasArrows && nextIconVisible"
          @click="handleScrollTo('next')"
        >
          {{ nextIcon }}
        </ivue-icon>
      </transition>
    </div>
    <!-- 内容 -->
    <div
      :class="bem.b('content')"
      v-touch="{
        left: () => handleSwipeItem('next'),
        right: () => handleSwipeItem('prev'),
      }"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  ref,
  watch,
  nextTick,
  onMounted,
  watchEffect,
  unref,
} from 'vue';

// directives
import { Touch } from '@ivue-material-plus/directives';
// tokens
import { TabsContextKey } from '@ivue-material-plus/tokens';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';

// tabs
import { tabsProps, tabsEmits } from './tabs';
// tabs-computed
import tabsComputed from './tabs-computed';
// tabs-touch
import tabsMethods from './tabs-methods';

// components
import Slider from './slider.vue';
import { IvueIcon } from '@ivue-material-plus/components';

// type
import type { TabInstance } from './tab';
import type { ItemInstance } from './item';

const prefixCls = 'ivue-tabs';

export default defineComponent({
  name: prefixCls,
  directives: { Touch },
  // 声明事件
  emits: tabsEmits,
  props: tabsProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // dom

    const tabHeader = ref<HTMLElement>();
    const tabContainer = ref<HTMLElement>();
    const tabHeaderContent = ref<HTMLElement>();

    // data

    // tab导航数组
    const tabs = ref<TabInstance[]>([]);
    // tab内容数组
    const tabsItem = ref<ItemInstance[]>([]);
    // 导航栏是否需要滚动
    const isOverflowing = ref<boolean>(false);

    // 下一个按钮显示
    const nextIconVisible = ref<boolean>(false);
    // 上一个按钮显示
    const prevIconVisible = ref<boolean>(false);
    // 滚动位置
    const scrollOffset = ref<number>(0);
    // 开始滑动x轴
    const startX = ref<number>(0);
    // 导航栏宽度
    const widths = ref<Record<string, number>>({
      tabHeader: 0,
      tabContainer: 0,
      tabHeaderContent: 0,
    });
    // 重置时间函数
    const resizeTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
    // 滑动条位置
    const sliderLeft = ref<number>(0);
    // 滑动条宽度
    const sliderWidth = ref<number>(0);
    // 控制内容初始化动画效果
    const isBooted = ref<boolean>(false);
    // 是否初始化完成
    const isInit = ref<boolean>(false);

    // 手势触摸
    const vTouch = ref({
      start: (e: TouchEvent) => overflowCheck(e, onTouchStart),
      move: (e: TouchEvent) => overflowCheck(e, onTouchMove),
      end: (e: TouchEvent) => overflowCheck(e, onTouchEnd),
    });

    // computed
    const {
      hasArrows,
      containerStyles,
      activeTab,
      activeIndex,
      tabContainerClasses,
      tabWrapperStyles,
    } = tabsComputed(bem, props, {
      tabs,
      isOverflowing,
      scrollOffset,
      isInit,
    });

    // methods

    const {
      initDate,

      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onResize,

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
    } = tabsMethods(
      props,
      {
        // dom
        tabHeader,
        tabContainer,
        tabHeaderContent,
        // data
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
      },
      emit
    );

    // watch

    // 监听导航滑动
    watch(
      () => unref(scrollOffset),
      () => {
        // 是否开启按钮
        if (hasArrows.value) {
          nextIconVisible.value = checkNextIcon();
          prevIconVisible.value = checkPrevIcon();
        }
      }
    );

    // 监听激活项
    watch(
      () => props.modelValue,
      () => {
        initDate();
      }
    );

    // data
    watch(
      () => unref(tabsItem),
      () => {
        nextTick(() => {
          onResize();
        });
      },
      {
        deep: true,
      }
    );

    // 监听固定标签
    watch(
      () => props.fixedWidth,
      () => {
        callSlider();
      }
    );

    // 监听激活的index
    watch(
      () => activeIndex.value,
      (current, previous) => {
        const reverse = current < previous;

        updateItems(reverse);
      }
    );

    // watch

    // 同步监听 tab导航数组
    watchEffect(() => {
      // 监听resize
      if (unref(tabs)) {
        onResize();
      }
    });

    // provide
    provide(TabsContextKey, {
      props,

      // tab导航数组
      tabs: tabs,
      // tab内容数组
      tabsItem: tabsItem,

      // 导航点击
      tabNavClick: tabNavClick,

      unregister: unregister,
      unregisterItems: unregisterItems,
    });

    // onMounted
    onMounted(() => {
      nextTick(() => {
        isInit.value = true;
      });

      initDate();
    });

    return {
      prefixCls,
      bem,

      // dom
      tabContainer,
      tabHeader,
      tabHeaderContent,

      // data
      vTouch,
      prevIconVisible,
      sliderLeft,
      sliderWidth,
      nextIconVisible,

      // computed
      tabContainerClasses,
      tabWrapperStyles,
      containerStyles,
      hasArrows,

      // methods
      tabNavClick,

      onTouchStart,
      onTouchMove,
      onTouchEnd,

      handleScrollTo,
      handleSwipeItem,
    };
  },
  components: {
    IvueIcon,
    Slider,
  },
});
</script>
