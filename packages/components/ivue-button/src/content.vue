<template>
  <div :class="bem.b('ripple')">
    <div :class="bem.be('ripple', 'content')">
      <!-- loading -->
      <div :class="bem.b('loading')" v-if="loading">
        <div
          :class="bem.be('loading', 'content')"
          v-ivue-loading="loading"
        ></div>
      </div>
      <!-- slot -->
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IvueLoadingDirective } from '@ivue-material-plus/components/ivue-loading';
import { useNamespace } from '@ivue-material-plus/hooks';

const prefixCls = 'ivue-button';

export default defineComponent({
  name: prefixCls,
  directives: {
    IvueLoading: IvueLoadingDirective,
  },
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
      prefixCls,
      bem,
    };
  },
});
</script>
