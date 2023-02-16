<template>
  <component
    :class="wrapperClasses"
    :style="wrapperStyles"
    :is="tagName"
    v-bind="tagProps"
    @click="handleLink"
  >
    <!-- 标题 -->
    <div :class="bem.b('header')" :style="titleStyles" v-if="showTitle">
      <div :class="bem.be('header', 'title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div :class="bem.be('header', 'desc')">
        <slot name="desc"></slot>
      </div>
      <!-- 额外显示的内容，默认位置在右上角 -->
      <div :class="extraClass" v-if="showExtra">
        <slot name="extra"></slot>
      </div>
    </div>
    <!-- 内容 -->
    <div :class="bem.e('body')" :style="bodyStyles">
      <slot></slot>
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { letter } from '@ivue-material-plus/utils';
import { useNamespace } from '@ivue-material-plus/hooks';

// card
import { cardProps } from './card';
// user-card
import { useCard } from './user-card';

const prefixCls = 'ivue-card';

export default defineComponent({
  name: prefixCls,
  props: cardProps,
  setup(props, { slots }) {
    // bem
    const bem = useNamespace(prefixCls);

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
        bem.b(),
        {
          [bem.is('border')]: props.border && !props.shadow,
          [bem.is('dis-hover')]: props.disHover,
          [bem.is('shadow')]: props.shadow,
        },
      ];
    });

    // 外部样式
    const wrapperStyles = computed(() => {
      // 圆角
      if (props.radius) {
        // 是否有单位
        const isUnit = letter.test(`${props.radius}`);

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

    // 内容样式
    const extraClass = computed(() => {
      return [bem.be('header', 'extra'), bem.is(props.extra)];
    });

    return {
      bem,

      // data
      showTitle,
      showExtra,

      // computed
      wrapperClasses,
      wrapperStyles,
      titleStyles,
      bodyStyles,
      extraClass,

      tagProps,
      tagName,

      // methods
      handleLink,
    };
  },
});
</script>
