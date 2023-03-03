<template>
  <div :class="bem.b()" ref="wrapper">
    <!-- slot -->
    <div ref="content" :class="contentClasses" :style="affixStyle">
      <slot></slot>
    </div>
    <!-- 占位元素 -->
    <div v-show="affixStyle" :style="placeholderStyle"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, unref, defineComponent } from 'vue';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';
// affix
import { affixProps, affixEmits } from './affix';
// use
import { useAffix } from './use-affix';

const prefixCls = 'ivue-affix';

// defineComponent
defineComponent({
  name: prefixCls,
});
// defineEmits
const emit = defineEmits(affixEmits);
// defineProps
const props = defineProps(affixProps);
// bem
const bem = useNamespace(prefixCls);

// useAffix
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
const contentClasses = computed(() => {
  return [
    {
      [bem.m('fixed')]: !!unref(affixStyle),
    },
  ];
});

// defineExpose
defineExpose({
  lazyUpdatePosition,
});
</script>
