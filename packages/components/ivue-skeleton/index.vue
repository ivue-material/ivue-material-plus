<template>
  <!-- 骨架屏 -->
  <template v-if="throttledLoading">
    <div :class="wrapperClasses" v-bind="$attrs">
      <!-- 渲染的item数量-->
      <template v-for="item in total" :key="item">
        <slot v-if="loading" :key="item" name="template">
          <!-- 渲染的段落 -->
          <skeleton-item
            v-for="(_, index) in isNumber(paragraph)
              ? paragraph
              : paragraph.rows"
            :class="paragraphClasses(index)"
            :style="paragraphStyles(index)"
            :key="index"
            type="p"
          ></skeleton-item>
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

import { useThrottleRender } from '../../hooks';

import SkeletonItem from '../ivue-skeleton-item/index.vue';

const prefixCls = 'ivue-skeleton';

export default defineComponent({
  name: prefixCls,
  props: {
    /**
     * 是否显示加载结束后的 DOM 结构
     *
     * @type {Boolean}
     */
    loading: {
      type: Boolean,
      default: true,
    },
    /**
     * 渲染延迟（以毫秒为单位）
     *
     * @type {Number}
     */
    throttle: {
      type: Number,
      default: 0,
    },
    /**
     * 渲染多少个 template, 建议使用尽可能小的数字
     *
     * @type {Number}
     */
    total: {
      type: Number,
      default: 1,
    },
    /**
     * 骨架屏段落数量
     *
     * @type {Number | Object}
     */
    paragraph: {
      type: [Number, Object],
      default: 4,
    },
    /**
     * 是否使用动画
     *
     * @type {Boolean}
     */
    animated: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // 节流渲染
    const throttledLoading = useThrottleRender(
      toRef(props, 'loading'),
      props.throttle
    );

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        prefixCls,
        {
          'is-animated': props.animated,
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
        [`${prefixCls}--paragraph`]: true,
        // 第一个
        ['is-first']: index === 0,
        // 最后一个
        ['is-last']: index === _paragraph - 1 && _paragraph > 1,
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
    SkeletonItem,
  },
});
</script>
