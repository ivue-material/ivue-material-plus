<template>
  <transition name="fade">
    <div
      :class="bem.b()"
      :style="wrapperStyles"
      @click="handleScrollTop"
      v-show="backTop"
    >
      <!-- slot -->
      <slot>
        <div :class="bem.e('content')">
          <!-- icon -->
          <slot name="icon">
            <ivue-icon>{{ icon }}</ivue-icon>
          </slot>
        </div>
      </slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// back-top
import { backTopProps, backTopEmits } from './back-top';
// use
import { useBackTop } from './use-back-top';

// components
import { IvueIcon } from '@ivue-material-plus/components';

// type
import type { CSSProperties } from 'vue';

const prefixCls = 'ivue-back-top';

export default defineComponent({
  name: prefixCls,
  // emits
  emits: backTopEmits,
  // props
  props: backTopProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    const {
      // data
      backTop,

      // methods
      handleScrollTop,
    } = useBackTop(props, emit);

    // computed

    // 外层样式
    const wrapperStyles = computed<CSSProperties>(() => {
      return {
        bottom: `${props.bottom}px`,
        right: `${props.right}px`,
      };
    });

    return {
      bem,

      prefixCls,

      // data
      backTop,

      // computed
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
