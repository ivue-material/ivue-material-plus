<template>
  <component
    :class="wrapperClasses"
    :style="wrapperStyles"
    :is="tagName"
    v-bind="tagProps"
    @click="handleLink"
  >
    <!-- 标题 -->
    <div :class="`${prefixCls}-title`" :style="titleStyles" v-if="showTitle">
      <slot name="title">{{ title }}</slot>
    </div>
    <!-- 额外显示的内容，默认位置在右上角 -->
    <div :class="`${prefixCls}-extra`" v-if="showExtra">
      <slot name="extra"></slot>
    </div>
    <!-- 内容 -->
    <div :class="`${prefixCls}-body`" :style="bodyStyles">
      <slot></slot>
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { letter } from '@ivue-material-plus/utils';

// card
import { cardProps } from './card';
import { useCard } from './user-card';

// type
// import type { Props } from '../types/card';

const prefixCls = 'ivue-card';

export default defineComponent({
  name: prefixCls,
  props: cardProps,
  setup(props, { slots }) {
    const {
      // data
      showTitle,
      showExtra,

      // computed
      tagName,
      tagProps,

      // methods
      handleLink,
    } = useCard(props, slots);
    // computed

    // 外部样式
    const wrapperClasses = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}-border`]: props.border && !props.shadow,
          [`${prefixCls}-dis-hover`]: props.disHover,
          [`${prefixCls}-shadow`]: props.shadow,
        },
      ];
    });

    // 外部样式
    const wrapperStyles = computed(() => {
      // 圆角
      if (props.radius) {
        const regexp = new RegExp(/[a-zA-Z]/g);

        // 是否有单位
        const isUnit = regexp.test(`${props.radius}`);

        return {
          borderRadius: !isUnit ? `${props.radius}px` : props.radius,
        };
      }

      return {};
    });

    // 标题样式
    const titleStyles = computed(() => {
      const padding = props.paddingStylesLinkage
        ? props.padding
        : props.titlePadding;

      // padding
      if (padding) {
        // 是否有单位
        const isUnit = letter.test(`${padding}`);

        return {
          padding: !isUnit ? `${padding}px` : padding,
        };
      }

      return {};
    });

    // 内容样式
    const bodyStyles = computed(() => {
      // 卡片内部间距
      if (props.padding) {
        // 是否有单位
        const isUnit = letter.test(`${props.padding}`);

        return {
          padding: !isUnit ? `${props.padding}px` : props.padding,
        };
      }

      return {};
    });

    return {
      prefixCls,

      // data
      showTitle,
      showExtra,

      // computed
      tagName,
      wrapperClasses,
      wrapperStyles,
      titleStyles,
      bodyStyles,
      tagProps,

      // methods
      handleLink,
    };
  },
});
</script>
