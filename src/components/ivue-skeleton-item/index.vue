<template>
  <div :class="wrapperClasses">
    <ivue-icon v-if="type === 'image'">image</ivue-icon>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { oneOf } from '../../utils/assist';
import IvueIcon from '../ivue-icon';

// type
import type { Props } from './types/skeleton-item';

const prefixCls = 'ivue-skeleton-item';

export default defineComponent({
  name: prefixCls,
  props: {
    type: {
      type: String,
      validator(value: string) {
        return oneOf(value, [
          'circle',
          'square',
          'rect',
          'h1',
          'h3',
          'text',
          'caption',
          'p',
          'image',
          'button',
        ]);
      },
      default: 'text',
    },
  },
  setup(props: Props) {
    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [prefixCls, `${prefixCls}--${props.type}`];
    });

    return {
      wrapperClasses,
    };
  },
  components: {
    IvueIcon,
  },
});
</script>

<style lang="scss" scoped></style>
