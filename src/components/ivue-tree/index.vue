<template>
  <div>12</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

const prefixCls = 'ivue-tree';

export default defineComponent({
  name: prefixCls,
  setup() {
    // computed

    const wrapperClasses = computed(() => {
      return {
        prefixCls,
      };
    });

    return {
      prefixCls,

      wrapperClasses,
    };
  },
});
</script>
