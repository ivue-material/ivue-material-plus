<template>
  <ivue-svg-loader
    :class="[bem.b(), bem.b('image')]"
    :style="styles"
    :svgSrc="svgSrc"
    v-if="svgSrc"
    @on-svg-loaded="handleSvgLoaded"
  ></ivue-svg-loader>
  <i :class="bem.b()" :style="styles" v-else>
    <slot />
  </i>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// components
import IvueSvgLoader from '@ivue-material-plus/components/ivue-svg-loader';

// type
import { iconProps, iconEmits } from './icon';

const prefixCls = 'ivue-icon';

export default defineComponent({
  name: prefixCls,
  emits: iconEmits,
  props: iconProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // computed

    // 样式
    const styles = computed(() => {
      return {
        order: props.order,
      };
    });

    // methods

    // 在获取SVG图标后立即触发
    const handleSvgLoaded = () => {
      emit('on-svg-loaded');
    };

    return {
      bem,

      // computed
      styles,

      // methods
      handleSvgLoaded,
    };
  },
  components: {
    IvueSvgLoader,
  },
});
</script>
