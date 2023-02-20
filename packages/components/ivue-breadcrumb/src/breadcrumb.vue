<template>
  <div :class="bem.b()" :style="styles" ref="breadcrumb">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, provide } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// tokens
import { BreadcrumbContextKey } from '@ivue-material-plus/tokens';

// props
import { breadcrumbProps } from './breadcrumb';

const prefixCls = 'ivue-breadcrumb';

export default defineComponent({
  name: prefixCls,
  props: breadcrumbProps,
  setup(props, { slots }) {
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

    return {
      bem,

      // computed
      styles,
    };
  },
});
</script>
