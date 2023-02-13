<template>
  <div
    :class="wrapperClasses"
    :style="wrapperStyles"
    ref="carouselItem"
    @click="handleItemClick"
    v-show="ready"
  >
    <!-- mask -->
    <template v-if="isCardType">
      <div v-show="!active" :class="bem.e('mask')"></div>
    </template>
    <!-- slot -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, unref } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// carousel-item
import { carouselItemProps } from './carousel-item';
// use
import { useCarouselItem } from './use-carousel-item';

const prefixCls = 'ivue-carousel-item';

export default defineComponent({
  name: prefixCls,
  props: carouselItemProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    const {
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
    } = useCarouselItem(props);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        bem.b(),
        {
          // 切换动画
          [bem.is('animating')]: unref(animating),
          // 激活
          [bem.is('active')]: unref(active),
          // hover
          [bem.is('hover')]: unref(hover),
          // 卡片类型
          [bem.is('card')]: unref(isCardType),
          // 卡片竖向
          [bem.is('card-vertical')]: unref(isCardType) && unref(isVertical),
          // 是否可以点击下一个
          [bem.is('in-stage')]: unref(inStage),
        },
      ];
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      const translateType = `translate${unref(isVertical) ? 'Y' : 'X'}`;
      const _translate = `${translateType}(${unref(translate)}px)`;
      const _scale = `scale(${unref(scale)})`;
      const transform = [_translate, _scale].join(' ');

      // 是卡片 有zIndex
      if (isCardType.value && unref(zIndex)) {
        return {
          transform,
          zIndex: unref(zIndex),
        };
      }

      return {
        transform,
      };
    });

    return {
      bem,

      // dom
      carouselItem,

      // data
      ready,
      active,

      // computed
      wrapperClasses,
      wrapperStyles,
      isCardType,

      // methods
      handleItemClick,
    };
  },
});
</script>
