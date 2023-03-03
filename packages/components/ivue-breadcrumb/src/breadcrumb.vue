<template>
  <div :class="bem.b()" :style="styles" ref="breadcrumb">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, computed, provide, useSlots } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// tokens
import { BreadcrumbContextKey } from '@ivue-material-plus/tokens';

// props
import { breadcrumbProps } from './breadcrumb';

const prefixCls = 'ivue-breadcrumb';

// defineComponent
defineComponent({
  name: prefixCls,
});
// useSlots
const slots = useSlots();
// defineProps
const props = defineProps(breadcrumbProps);

// bem
const bem = useNamespace(prefixCls);

// computed

// 居中样式
const styles = computed(() => {
  const justify = props.justifyCenter
    ? 'center'
    : props.justifyEnd
    ? 'flex-end'
    : 'flex-start';

  return {
    'justify-content': justify,
  };
});

// 设置分隔符
const computedDivider = computed(() => {
  return slots.divider ? slots.divider : props.divider;
});

// provide
provide(BreadcrumbContextKey, {
  props,
  divider: computedDivider.value,
});
</script>
