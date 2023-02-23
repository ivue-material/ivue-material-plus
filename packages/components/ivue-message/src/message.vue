<template>
  <transition
    :name="bem.b('fade')"
    @before-leave="onClose"
    @after-leave="$emit('destroy')"
  >
    <div
      :class="wrapperClasses"
      :style="wrapperStyles"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      v-show="visible"
    >
      <div :class="bem.b('content')" ref="content">
        <template v-if="type === 'loading'">
          <div :class="bem.b('indeterminate')">
            <!-- 自定义图标class -->
            <ivue-icon :class="loadingIcon" v-if="loadingIcon"></ivue-icon>
            <!-- loading -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              :viewBox="`${viewBoxSize} ${viewBoxSize} ${2 * viewBoxSize} ${
                2 * viewBoxSize
              }`"
              :class="[bem.be('indeterminate', 'loading'), 'ivue-animation-loop']"
              v-else
            >
              <circle
                fill="transparent"
                :cx="`${2 * viewBoxSize}`"
                :cy="`${2 * viewBoxSize}`"
                r="20"
                :stroke-width="`${strokeWidth}`"
                :stroke-dasharray="`${strokeDasharray}`"
                :stroke-dashoffset="`${strokeDashoffset}`"
                :class="bem.be('indeterminate', 'circle')"
              />
            </svg>
          </div>
          <span v-html="content"></span>
        </template>
        <template v-else>
          <!-- icon -->
          <ivue-icon :class="[bem.be('content', 'icon'), bem.is(type)]">
            {{ iconTypes[type] }}
          </ivue-icon>
          <!-- render 渲染 -->
          <div :class="bem.be('content', 'text')" v-if="render">
            <render-cell :render="render"></render-cell>
          </div>
          <!-- 内容 -->
          <div :class="bem.be('content', 'text')" v-html="content" v-else></div>
          <!-- 关闭按钮 -->
          <div
            :class="bem.be('content', 'close')"
            @click="handleClose"
            v-show="closable"
          >
            <ivue-icon>close</ivue-icon>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, unref } from 'vue';

// utils
import { RenderCell } from '@ivue-material-plus/utils';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';
// message
import { messageProps } from './message';

// type
type SetTimeout = ReturnType<typeof setTimeout>;

// components
import IvueIcon from '@ivue-material-plus/components/ivue-icon';

const prefixCls = 'ivue-message';

export default defineComponent({
  emits: ['destroy'],
  name: prefixCls,
  props: messageProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    const radius = 20;
    const size = 20;
    const percent = 20;
    const viewBoxSize = radius / (1 - 4 / +size);
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = ((100 - percent) / 100) * circumference + 'px';
    const strokeDasharray = Math.round(circumference * 1000) / 1000;
    const strokeWidth = (2 / +size) * viewBoxSize * 2;

    // 关闭时间
    const closeTimer = ref<SetTimeout | null>(null);
    // 显示
    const visible = ref<boolean>(false);
    // 图标类型
    const iconTypes = ref<Record<string, string>>({
      success: 'check_circle',
      info: 'info',
      warning: 'warning',
      error: 'error',
    });

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        bem.b(),
        {
          // 是否有关闭按钮
          [bem.is('closable')]: props.closable,
          // 背景颜色
          [bem.is('have-background')]: props.background,
          [bem.is(props.type)]: props.background,
          // 自定义样式名称
          [`${props.className}`]: !!props.className,
        },
      ];
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      return {
        top: `${props.top}px`,
        zIndex: props.zIndex,
      };
    });

    // methods

    // 关闭
    const handleClose = () => {
      visible.value = false;
    };

    // 清除关闭时间
    const clearCloseTimer = () => {
      if (unref(closeTimer)) {
        clearTimeout(unref(closeTimer) as SetTimeout);
        closeTimer.value = null;
      }
    };

    // 开始时间
    const startTime = () => {
      // 重新设置延迟关闭
      if (props.duration > 0) {
        closeTimer.value = setTimeout(() => {
          handleClose();
        }, props.duration);
      }
    };

    // 鼠标进入
    const handleMouseenter = () => {
      clearTimeout(unref(closeTimer) as SetTimeout);
      closeTimer.value = null;
    };

    // 鼠标移开
    const handleMouseleave = () => {
      startTime();
    };

    // onMounted
    onMounted(() => {
      startTime();

      visible.value = true;
    });

    return {
      // bem
      bem,

      // data
      visible,
      iconTypes,

      viewBoxSize,
      strokeWidth,
      strokeDasharray,
      strokeDashoffset,

      // computed
      wrapperClasses,
      wrapperStyles,

      // methods
      clearCloseTimer,
      handleClose,
      handleMouseenter,
      handleMouseleave,
    };
  },
  components: {
    RenderCell,
    IvueIcon,
  },
});
</script>
