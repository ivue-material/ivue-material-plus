<template>
  <div :class="prefixCls" ref="wrapper">
    <!-- slot -->
    <div ref="content" :class="classes" :style="affixStyle">
      <slot></slot>
    </div>
    <!-- 占位元素 -->
    <div v-show="affixStyle" :style="placeholderStyle"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, unref } from 'vue';

import { affixProps, affixEmits } from './affix';
import { useAffix } from './use-affix';

const prefixCls = 'ivue-affix';

export default defineComponent({
  name: prefixCls,
  // 声明事件
  emits: affixEmits,
  props: affixProps,
  // 组合式 API
  setup(props, { emit }) {
    const {
      // ref
      wrapper,
      content,

      // data
      affixStyle,
      placeholderStyle,

      // methods
      lazyUpdatePosition,
    } = useAffix(props, emit);

    // 是否添加class设置 fixed
    const classes = computed(() => {
      return [
        {
          [`${prefixCls}-fixed`]: !!unref(affixStyle),
        },
      ];
    });

    return {
      prefixCls,

      // ref
      wrapper,
      content,

      // data
      affixStyle,
      placeholderStyle,

      // computed
      classes,

      // methods
      lazyUpdatePosition,
    };
  },
});
</script>
