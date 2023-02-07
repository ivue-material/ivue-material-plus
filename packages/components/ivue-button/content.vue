<template>
  <div :class="`${prefixCls}-ripple`">
    <div :class="`${prefixCls}-content`">
      <!-- loading -->
      <div :class="`${prefixCls}-loading--wrapper`" v-if="loading">
        <div :class="`${prefixCls}-loading`" v-ivue-loading="loading"></div>
      </div>
      <!-- slot -->
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IvueLoading from '../ivue-loading/directive';

const prefixCls = 'ivue-button';

export default defineComponent({
  name: prefixCls,
  directives: { IvueLoading },
  props: {
    /**
     * 显示loading
     *
     * @type {Boolean}
     */
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      prefixCls,
    };
  },
});
</script>
