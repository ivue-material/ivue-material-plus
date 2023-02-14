<template>
  <div :class="bem.b()" ref="wrapper">
    <!-- slot -->
    <div ref="content" :class="classes" :style="affixStyle">
      <slot></slot>
    </div>
    <!-- 占位元素 -->
    <div v-show="affixStyle" :style="placeholderStyle"></div>
  </div>
  <transition name="fade">
    <div v-show="affixStyle">121221</div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, unref } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// affix
import { affixProps, affixEmits } from './affix';
// use
import { useAffix } from './use-affix';

const prefixCls = 'ivue-affix';

export default defineComponent({
  name: prefixCls,
  // 声明事件
  emits: affixEmits,
  // props
  props: affixProps,
  // 组合式 API
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

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
          [bem.m('fixed')]: !!unref(affixStyle),
        },
      ];
    });

    return {
      bem,

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
