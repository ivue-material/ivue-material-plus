<template>
  <div :class="bem.b()">
    <ivue-button
      flat
      :color="color"
      :index="name"
      :isActive="isActive"
      @click="handleClick"
    >
      <slot></slot>
    </ivue-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// components
import { IvueButton } from '@ivue-material-plus/components';
// bottom-nav-item
import { bottomNavItemProps } from './bottom-nav-item';
// use
import { useBottomNavItem } from './use-bottom-nav-item';

const prefixCls = 'ivue-bottom-nav-item';

export default defineComponent({
  name: prefixCls,
  props: bottomNavItemProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    const {
      // data
      isActive,
      uid,

      // methods
      handleClick,
    } = useBottomNavItem(props);

    return {
      // bem
      bem,

      // data
      isActive,
      uid,

      // methods
      handleClick,
    };
  },
  components: {
    IvueButton,
  },
});
</script>
