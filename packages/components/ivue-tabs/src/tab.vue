<template>
  <div :class="classes" v-ripple="ripple" ref="tab" @click="handleChange">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  inject,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  ref,
  unref,
} from 'vue';

import { Ripple } from '@ivue-material-plus/directives';

// tokens
import { TabsContextKey, TabsContext } from '@ivue-material-plus/tokens';
// tab
import { tabProps } from './tab';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';

// type
import type { ComponentInternalInstance } from 'vue';
import type { TabInstance } from './tab';

const prefixCls = 'ivue-tabs-tab';

export default defineComponent({
  name: 'ivue-tab',
  directives: {
    Ripple,
  },
  props: tabProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // inject
    const tabsGroup = inject(TabsContextKey) as TabsContext;

    // vm
    const { proxy, uid } = getCurrentInstance() as ComponentInternalInstance;

    // 当前 name
    const tabName = ref<string | number>(props.name || uid);

    // computed
    const classes = computed(() => {
      return [
        bem.b(),
        {
          // 禁用
          [bem.is('disabled')]: props.disabled,
          // 激活
          [bem.is('active')]: isActive.value,
        },
      ];
    });

    // 涟漪效果
    const ripple = computed(() => {
      // 是否居中涟漪效果
      if (props.rippleCentered) {
        return {
          center: true,
        };
      }
      // 是否禁用涟漪效果
      else if (props.rippleDisabled) {
        return false;
      }

      return true;
    });

    // 激活
    const isActive = computed(() => {
      if (tabsGroup.props.modelValue === unref(tabName)) {
        return true;
      }

      return false;
    });

    // methods

    // 点击当前项
    const handleChange = () => {
      tabsGroup.tabNavClick(proxy as TabInstance);
    };

    // onMounted
    onMounted(() => {
      // 插入dom
      tabsGroup.tabs.value.push(proxy as TabInstance);
    });

    // onBeforeUnmount
    onBeforeUnmount(() => {
      tabsGroup.unregister(unref(tabName));
    });

    return {
      // bem
      bem,

      // data
      tabName,

      // computed
      classes,
      ripple,
      isActive,

      // methods
      handleChange,
    };
  },
});
</script>
