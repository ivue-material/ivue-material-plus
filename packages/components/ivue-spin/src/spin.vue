<template>
  <transition name="fade">
    <div :class="wrapperClass" v-if="fullscreenVisible && show">
      <!-- 内容 -->
      <div :class="bem.b('content')">
        <!-- dot -->
        <div
          :class="bem.be('content', 'dot')"
          :style="dotStyles"
          v-show="!$slots.default"
        ></div>
        <!-- 提示文字 -->
        <div :class="bem.be('content', 'text')" v-show="$slots.default">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// utils
import { letter } from '@ivue-material-plus/utils';
// spin
import { spinProps } from './spin';

const prefixCls = 'ivue-spin';

export default defineComponent({
  name: prefixCls,
  props: spinProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // 使用 $IvueSpin 时显示
    const visible = ref<boolean>(false);

    // computed

    // 外层样式
    const wrapperClass = computed(() => {
      return [
        bem.b(),
        {
          [bem.is('fix')]: props.fix,
        },
      ];
    });

    // dot样式
    const dotStyles = computed(() => {
      // 大小
      let sizeStyle = {};

      // 是否有大小
      if (props.size) {
        // 是否有单位
        const isUnit = letter.test(`${props.size}`);

        const size = !isUnit ? `${props.size}px` : props.size;

        // 样式
        sizeStyle = {
          height: size,
          width: size,
        };
      }

      return sizeStyle;
    });

    // 是否全屏显示
    const fullscreenVisible = computed(() => {
      if (props.fullscreen) {
        return visible.value;
      } else {
        return true;
      }
    });

    // watch

    // 监听显示
    watch(
      () => visible.value,
      (value) => {
        // overflow
        if (value) {
          document.body.style.overflow = 'hidden';
        }
        // 取消overflow
        else {
          document.body.style.overflow = '';
        }
      }
    );

    return {
      prefixCls,
      bem,

      // data
      visible,

      // computed
      wrapperClass,
      dotStyles,
      fullscreenVisible,
    };
  },
});
</script>
