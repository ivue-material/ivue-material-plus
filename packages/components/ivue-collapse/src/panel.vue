<template>
  <div :class="classes">
    <!-- 头部 -->
    <div :class="headerClasses" @click="handleToggle">
      <slot name="title">{{ title }}</slot>
      <!-- icon -->
      <slot name="header-icon" v-if="!hideArrow">
        <ivue-icon>keyboard_arrow_right</ivue-icon>
      </slot>
    </div>
    <!-- transition -->
    <collapse-transition v-if="mounted">
      <div :class="`${prefixCls}--content`" v-show="isActive">
        <div :class="`${prefixCls}--content-box`">
          <slot name="content"></slot>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  inject,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
  ref,
  unref,
} from 'vue';

// components
import { IvueIcon } from '@ivue-material-plus/components';
import CollapseTransition from '@ivue-material-plus/utils/collapse-transition';

// tokens
import {
  CollapseContextKey,
  CollapseContext,
} from '@ivue-material-plus/tokens';

// collapse
import { panelProps } from './panel';

// type
import type { ComponentInternalInstance } from 'vue';

const prefixCls = 'ivue-collapse-panel';

export default defineComponent({
  name: prefixCls,
  props: panelProps,
  setup(props) {
    const IvueCollapse = inject(CollapseContextKey) as CollapseContext;

    // 支持访问内部组件实例
    const { uid } = getCurrentInstance() as ComponentInternalInstance;

    // 是否激活
    const isActive = ref<boolean>(false);
    // 下标
    const index = ref<number>(0);
    // 是否初始化完成
    const mounted = ref<boolean>(false);

    // onMounted
    onMounted(() => {
      // 初始化完成
      mounted.value = true;

      IvueCollapse.pushExpandable({
        uid,
        name: props.name,
        isActive,
        index,
      });
    });

    // onBeforeUnmount
    onBeforeUnmount(() => {
      IvueCollapse.removeExpandable({
        uid,
        name: props.name,
        isActive,
        index,
      });
    });

    // computed

    // 外层样式
    const classes = computed(() => {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}--active`]: unref(isActive),
        },
      ];
    });

    // 头部 class
    const headerClasses = computed(() => {
      return [`${prefixCls}--header`];
    });

    // methods

    const handleToggle = () => {
      IvueCollapse.toggle({
        name: props.name || unref(index),
        isActive: unref(isActive),
      });
    };

    return {
      prefixCls,

      // data
      mounted,
      isActive,

      // computed
      classes,
      headerClasses,

      // methods
      handleToggle,
    };
  },
  components: {
    IvueIcon,
    CollapseTransition,
  },
});
</script>
