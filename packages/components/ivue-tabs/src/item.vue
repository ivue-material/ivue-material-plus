<template>
  <transition :name="computedTransition">
    <div :class="bem.b()" :style="styles" v-show="isActive" ref="content">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  inject,
  getCurrentInstance,
  computed,
  ref,
  unref,
} from 'vue';

// tokens
import { TabsContextKey, TabsContext } from '@ivue-material-plus/tokens';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';

// item
import { itemProps } from './item';

// type
import type { ComponentInternalInstance } from 'vue';
import type { ItemInstance } from './item';

const prefixCls = 'ivue-tabs-item';

export default defineComponent({
  name: 'ivue-tab-item',
  props: itemProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // vm
    const { proxy, uid } = getCurrentInstance() as ComponentInternalInstance;

    // inject
    const tabsGroup = inject(TabsContextKey) as TabsContext;

    // ref
    const content = ref<HTMLElement>();

    // 是否激活
    const isActive = ref<boolean>(false);
    // 方向
    const reverse = ref<boolean>(false);
    // 显示动画
    const showTransition = ref<boolean>(false);

    // computed

    const computedTransition = computed(() => {
      return reverse.value ? props.reverseTransition : props.transition;
    });

    // styles
    const styles = computed(() => {
      if (!unref(showTransition)) {
        return {
          transition: 'none',
        };
      }

      return {};
    });

    // methods

    // 切换
    const handleToggle = (
      _isActive: boolean,
      _reverse: boolean,
      _showTransition: boolean
    ) => {
      reverse.value = _reverse;

      isActive.value = _isActive;

      if (content.value) {
        showTransition.value = _showTransition;
      }
    };

    // onMounted
    onMounted(() => {
      // 插入dom
      tabsGroup.tabsItem.value.push(proxy as ItemInstance);
    });

    // onBeforeUnmount
    onBeforeUnmount(() => {
      tabsGroup.unregisterItems(uid);
    });

    return {
      // bem
      bem,

      // dom
      content,

      // data
      isActive,
      uid,
      showTransition,

      // computed
      computedTransition,
      styles,

      // methods
      handleToggle,
    };
  },
});
</script>
