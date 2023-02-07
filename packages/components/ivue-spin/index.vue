<template>
  <transition :name="`${prefixCls}-fade`">
    <div :class="wrapperClass" v-if="fullscreenVisible && show">
      <!-- 内容 -->
      <div :class="`${prefixCls}-content`">
        <!-- dot -->
        <div
          :class="`${prefixCls}-dot`"
          :style="dotStyles"
          v-show="!$slots.default"
        ></div>
        <!-- 提示文字 -->
        <div :class="`${prefixCls}-text`" v-show="$slots.default">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, watch, getCurrentInstance, ref } from 'vue';

// type
import { Props } from './types/spin';

const prefixCls = 'ivue-spin';

export default defineComponent({
  name: prefixCls,
  props: {
    /**
     * 显示
     *
     * @type {Boolean}
     */
    show: {
      type: Boolean,
      default: true,
    },
    /**
     * 大小
     *
     * @type {Number,String}
     */
    size: {
      type: [Number, String],
    },
    /**
     * 是否固定 需要父级有relative或absolute
     *
     * @type {Boolean}
     */
    fix: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;

        return !global.$IVUE || !global.$IVUE.spin.fix
          ? false
          : global.$IVUE.spin.fix;
      },
    },
    /**
     * 全屏显示
     *
     * @type {Boolean}
     */
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    // 使用 $IvueSpin 时显示
    const visible = ref<boolean>(false);

    // computed

    // 外层样式
    const wrapperClass = computed(() => {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-fix`]: props.fix,
        },
      ];
    });

    // dot样式
    const dotStyles = computed(() => {
      // 大小
      let sizeStyle = {};

      // 是否有大小
      if (props.size) {
        const regexp = new RegExp(/[a-zA-Z]/g);

        // 是否有单位
        const isUnit = regexp.test(`${props.size}`);

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
