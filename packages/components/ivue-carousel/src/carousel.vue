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
          :class="[`${prefixCls}-arrow left`]"
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
          :class="[`${prefixCls}-arrow right`]"
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

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';

import IvueButton from '@ivue-material-plus/components/ivue-button';
import IvueIcon from '@ivue-material-plus/components/ivue-icon';
import { useNamespace } from '@ivue-material-plus/hooks';

// carousel
import { carouselProps, carouselEmits } from './carousel';
// use
import { useCarousel } from './use-carousel';

const prefixCls = 'ivue-carousel';

export default defineComponent({
  name: prefixCls,
  emits: carouselEmits,
  props: carouselProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

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
        prefixCls,
        {
          // 展示的方向
          [bem.b(props.direction)]: true,
          // 卡片类型
          [bem.b('card')]: isCardType.value,
          // 没有初始化完成
          [bem.is('is-no-init')]: !unref(init),
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
        bem.is('outside'),
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

    // 按钮禁用
    const arrowDisplay = computed(() => {
      return props.arrow !== 'never' && !unref(isVertical);
    });

    return {
      prefixCls,
      bem,
      // dom
      wrapper,

      // data
      hover,
      items,
      activeIndex,

      // computed
      wrapperClasses,
      dotsClasses,
      contentStyles,

      arrowDisplay,

      // methods
      handleMouseEnter,
      handleMouseLeave,
      handleArrowEnter,
      handleArrowLeave,
      handleArrowClick,
      handleThrottleDotHover,
      handleDotClick,
      setActiveItem,
      prev,
      next,
    };
  },
  components: {
    IvueButton,
    IvueIcon,
  },
});
</script>
