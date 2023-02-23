<template>
  <transition name="fade">
    <div :class="bem.b()" :style="outerStyles" v-show="visible">
      <div :class="innerClasses" :style="innerStyles"></div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref, unref } from 'vue';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';

// loading-bar
import { loadingBarProps } from './loading-bar';

const prefixCls = 'ivue-loading-bar';

export default defineComponent({
  name: prefixCls,
  props: loadingBarProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // 百分比
    const percent = ref<number>(0);
    // 状态
    const status = ref<string>('success');
    // 显示
    const visible = ref<boolean>(true);

    // computed

    // 内容样式
    const innerClasses = computed(() => {
      return [
        bem.e('inner'),
        {
          [bem.is('primary')]:
            props.color === 'primary' && unref(status) === 'success',
          [bem.is('error')]:
            props.failedColor === 'error' && unref(status) === 'error',
        },
      ];
    });

    // 外层样式
    const outerStyles = computed(() => {
      return {
        height: `${props.height}px`,
      };
    });

    // styles
    const innerStyles = computed(() => {
      const style = {
        width: `${unref(percent)}%`,
        height: `${props.height}px`,
        backgroundColor: '',
      };

      if (props.color !== 'primary' && unref(status) === 'success') {
        style.backgroundColor = props.color;
      }

      if (props.failedColor !== 'error' && unref(status) === 'error') {
        style.backgroundColor = props.failedColor;
      }

      return style;
    });

    return {
      // bem
      bem,

      // data
      visible,
      percent,
      status,

      // computed
      innerClasses,
      innerStyles,
      outerStyles,
    };
  },
});
</script>
