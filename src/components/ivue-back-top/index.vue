<template>
  <transition name="fade">
    <div
      :class="wrapperClasses"
      :style="wrapperStyles"
      @click="handleScrollTop"
      v-show="backTop"
    >
      <slot>
        <div :class="`${prefixCls}-content`">
          <slot name="icon">
            <ivue-icon>arrow_upward</ivue-icon>
          </slot>
        </div>
      </slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, shallowRef } from 'vue';
import { useEventListener } from '@vueuse/core';

import { isClient } from '../../utils/helpers';
import { scrollTop } from '../../utils/assist';

import IvueIcon from '../ivue-icon';

// type
import type { Props } from './types/back-top';

const prefixCls = 'ivue-back-top';

export default defineComponent({
  name: prefixCls,
  emits: ['on-scroll-end', 'on-click'],
  props: {
    /**
     * 触发滚动的对象
     *
     * @type {String}
     */
    target: {
      type: String,
      default: '',
    },
    /**
     * 页面滚动高度达到该值时才显示
     *
     * @type {Number}
     */
    visibilityHeight: {
      type: Number,
      default: 200,
    },
    /**
     * 组件距离底部的距离
     *
     * @type {Number}
     */
    bottom: {
      type: Number,
      default: 30,
    },
    /**
     * 组件距离右部的距离
     *
     * @type {Number}
     */
    right: {
      type: Number,
      default: 30,
    },
    /**
     * 滚动动画持续时间，单位 毫秒
     *
     * @type {Number}
     */
    duration: {
      type: Number,
      default: 1000,
    },
  },
  setup(props: Props, { emit }) {
    // 容器
    const container = shallowRef<Document | HTMLElement>();

    // documentElement
    const el = shallowRef<HTMLElement>();

    // 是否可以显示滚动顶部
    const backTop = ref<boolean>(false);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [prefixCls];
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      return {
        bottom: `${props.bottom}px`,
        right: `${props.right}px`,
      };
    });

    // methods

    // 监听滚动
    const handleScroll = () => {
      if (!isClient) {
        return;
      }

      // 显示滚动顶部
      if (el.value) {
        backTop.value = el.value.scrollTop >= props.visibilityHeight;
      }
    };

    // 滚动到顶部
    const handleScrollTop = () => {
      // emit
      emit('on-click');

      // 滚动到顶部
      scrollTop(
        el.value,
        el.value.scrollTop,
        0,
        props.duration,
        handleScrollEnd
      );
    };

    // 滚动结束回调
    const handleScrollEnd = () => {
      emit('on-scroll-end');
    };

    // onMounted
    onMounted(() => {
      container.value = document;
      el.value = document.documentElement;

      if (props.target) {
        el.value =
          document.querySelector<HTMLElement>(props.target) ?? undefined;

        // 没有找到节点
        if (!el.value) {
          throw `target is not existed: ${props.target}`;
        }

        container.value = el.value;
      }

      // 设置滚动
      useEventListener(container, 'scroll', handleScroll);
    });

    return {
      prefixCls,

      // data
      backTop,

      // computed
      wrapperClasses,
      wrapperStyles,

      // methods
      handleScrollTop,
    };
  },
  components: {
    IvueIcon,
  },
});
</script>
