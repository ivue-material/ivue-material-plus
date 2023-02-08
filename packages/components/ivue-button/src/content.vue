<template>
  <div :class="bem.b()">
    <div :class="bem.m('content')">
      <!-- loading -->
      <!-- <div :class="`${prefixCls}-loading--wrapper`" v-if="loading">
        <div :class="`${prefixCls}-loading`" v-ivue-loading="loading"></div>
      </div> -->
      <!-- slot -->
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import IvueLoading from '../ivue-loading/directive';
import { useNamespace } from '@ivue-material-plus/hooks';

const prefixCls = 'ivue-button-ripple';

export default defineComponent({
  name: prefixCls,
  // directives: { IvueLoading },
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
    // bem
    const bem = useNamespace(prefixCls);

    return {
      bem,
    };
  },
});
</script>
