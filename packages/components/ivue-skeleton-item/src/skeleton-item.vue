<template>
  <div :class="wrapperClasses">
    <!-- icon -->
    <ivue-icon v-if="type === 'image'">image</ivue-icon>
    <!-- slot -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

// hooks
import { useNamespace } from '@ivue-material-plus/hooks';

import { skeletonItemProps } from './skeleton-item';

// components
import { IvueIcon } from '@ivue-material-plus/components';

const prefixCls = 'ivue-skeleton-item';

export default defineComponent({
  name: prefixCls,
  props: skeletonItemProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [bem.b(), bem.is(props.type)];
    });

    return {
      // bem
      bem,

      // computed
      wrapperClasses,
    };
  },
  components: {
    IvueIcon,
  },
});
</script>
