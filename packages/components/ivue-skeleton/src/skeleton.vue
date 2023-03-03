<template>
  <!-- 骨架屏 -->
  <template v-if="throttledLoading">
    <div :class="wrapperClasses" v-bind="$attrs">
      <!-- 渲染的item数量-->
      <template v-for="item in total" :key="item">
        <slot v-if="loading" :key="item" name="template">
          <!-- 渲染的段落 -->
          <ivue-skeleton-item
            v-for="(_, index) in isNumber(paragraph)
              ? paragraph
              : paragraph.rows"
            :class="paragraphClasses(index)"
            :style="paragraphStyles(index)"
            :key="index"
            type="p"
          ></ivue-skeleton-item>
        </slot>
      </template>
    </div>
  </template>
  <!-- 内容 -->
  <template v-else>
    <slot v-bind="$attrs"></slot>
  </template>
</template>

<script lang="ts">
import { defineComponent, toRef, computed } from 'vue';
import { isNumber } from '@vueuse/core';
import { isArray, isString } from '@vue/shared';
// hooks
import { useThrottleRender, useNamespace } from '@ivue-material-plus/hooks';

// skeleton
import { skeletonProps } from './skeleton';

// components
import { IvueSkeletonItem } from '@ivue-material-plus/components/ivue-skeleton-item';

const prefixCls = 'ivue-skeleton';

export default defineComponent({
  name: prefixCls,
  props: skeletonProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // 节流渲染
    const throttledLoading = useThrottleRender(
      toRef(props, 'loading'),
      props.throttle
    );

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        bem.b(),
        {
          // 是否使用动画
          [bem.is('animated')]: props.animated,
        },
      ];
    });

    // methods

    // 段落class
    const paragraphClasses = (index: number) => {
      const _paragraph = isNumber(props.paragraph)
        ? props.paragraph
        : props.paragraph.rows;

      const obj = {
        [bem.e('paragraph')]: true,
        // 第一个
        [bem.is('first')]: index === 0,
        // 最后一个
        [bem.is('last')]: index === _paragraph - 1 && _paragraph > 1,
      };

      return obj;
    };

    // 段落style
    const paragraphStyles = (index: number) => {
      const obj: {
        width?: number | string;
      } = {};

      // 不是NUMBER
      if (
        !isNumber(props.paragraph) &&
        props.paragraph.width &&
        isArray(props.paragraph.width)
      ) {
        let width = props.paragraph.width[index];

        if (props.paragraph.width.length < props.paragraph.rows) {
          width = props.paragraph.width[0];
        }

        // number
        if (isNumber(width)) {
          obj.width = `${width}px`;
        }
        // string
        else if (isString(width)) {
          obj.width = width;
        }
      }

      return obj;
    };

    return {
      // bem
      bem,
      prefixCls,

      // data
      throttledLoading,

      // computed
      wrapperClasses,

      // methods
      isNumber,
      paragraphClasses,
      paragraphStyles,
    };
  },
  components: {
    IvueSkeletonItem,
  },
});
</script>
