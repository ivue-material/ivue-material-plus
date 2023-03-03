<template>
  <div
    :class="wrapperClasses"
    ref="wrapper"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
  >
    <div :class="bem.e('content')" :style="contentStyles">
      <!-- 左按钮 -->
      <transition v-if="arrowDisplay" name="fade">
        <ivue-button
          :class="[bem.e('arrow'), 'left']"
          flat
          icon
          @mouseenter="handleArrowEnter('left')"
          @mouseleave="handleArrowLeave"
          @click="handleArrowClick(activeIndex - 1)"
          v-show="(arrow === 'always' || hover) && (loop || activeIndex > 0)"
        >
          <slot name="leftArrow">
            <ivue-icon>{{ leftArrow }}</ivue-icon>
          </slot>
        </ivue-button>
      </transition>

      <!-- slot -->
      <slot></slot>

      <!-- 右按钮 -->
      <transition v-if="arrowDisplay" name="fade">
        <ivue-button
          :class="[bem.e('arrow'), 'right']"
          flat
          icon
          @mouseenter="handleArrowEnter('right')"
          @mouseleave="handleArrowLeave"
          @click="handleArrowClick(activeIndex + 1)"
          v-show="
            (arrow === 'always' || hover) &&
            (loop || activeIndex < items.length - 1)
          "
        >
          <slot name="rightArrow">
            <ivue-icon>{{ rightArrow }}</ivue-icon>
          </slot>
        </ivue-button>
      </transition>
    </div>
    <!-- 导航器 -->
    <ul :class="dotsClasses">
      <li
        v-for="(item, index) in items"
        :class="[
          bem.be('dots', 'dot'),
          {
            [bem.is('active')]: index === activeIndex,
          },
        ]"
        @mouseenter="handleThrottleDotHover(index)"
        @click.stop="handleDotClick(index)"
        :key="index"
      >
        <button
          type="button"
          :class="[
            bem.be('dots', 'button'),
            {
              [bem.is('radius')]: radiusDot,
            },
          ]"
        >
          <span :class="bem.be('dots', 'label')">
            {{ item.props.label }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, unref } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';
// carousel
import { carouselProps, carouselEmits } from './carousel';
// use
import { useCarousel } from './use-carousel';
// components
import { IvueButton, IvueIcon } from '@ivue-material-plus/components';

const prefixCls = 'ivue-carousel';

// defineComponent
defineComponent({
  name: prefixCls,
});
// defineEmits
const emit = defineEmits(carouselEmits);
// defineProps
const props = defineProps(carouselProps);

// bem
const bem = useNamespace(prefixCls);

// useCarousel
const {
  // dom
  wrapper,

  // data
  init,
  hover,
  items,
  activeIndex,
  contentHeight,

  // computed
  isCardType,
  hasLabel,
  isVertical,
  arrowDisplay,

  // methods
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
} = useCarousel(props, emit);

// computed

// 外层样式
const wrapperClasses = computed(() => {
  return [
    bem.b(),
    {
      // 展示的方向
      [bem.b(props.direction)]: true,
      // 卡片类型
      [bem.b('card')]: isCardType.value,
      // 没有初始化完成
      [bem.is('no-init')]: !unref(init),
    },
  ];
});

// 内容样式
const contentStyles = computed(() => {
  // 自定义高度
  if (props.height !== 'auto') {
    return {
      height: props.height,
    };
  }

  // 高度auto
  return {
    height: `${unref(contentHeight)}px`,
    overflow: 'hidden',
  };
});

// dots 样式
const dotsClasses = computed(() => {
  return [
    bem.b('dots'),
    // 指示器的位置
    bem.is(props.dots),
    {
      // 指示器文字
      [bem.is('labels')]: unref(hasLabel),
      // 指示器竖向
      [bem.is('vertical')]: unref(isVertical),
      // 指示器竖向时方向位置
      [bem.is(props.verticalDotsDirection)]: isVertical.value,
    },
  ];
});

// defineExpose
defineExpose({
  // 手动切换幻灯片
  setActiveItem,
  // 切换至上一张幻灯片
  prev,
  // 切换至下一张幻灯片
  next,
});
</script>
