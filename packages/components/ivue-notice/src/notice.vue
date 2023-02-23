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
      <!-- 内容 -->
      <div :class="contentClasses" ref="content">
        <!-- 普通消息 -->
        <template v-if="type === 'normal'">
          <!-- title -->
          <div :class="bem.be('content', 'title')">{{ title }}</div>
          <div :class="bem.be('content', 'desc')">{{ desc }}</div>
        </template>
        <!-- 带图标消息 -->
        <template v-else>
          <ivue-icon :class="bem.is(type)">
            {{ iconTypes[type] }}
          </ivue-icon>
          <div :class="bem.be('content', 'title')">{{ title }}</div>
          <div :class="bem.be('content', 'desc')">{{ desc }}</div>
        </template>
      </div>
      <!-- render 渲染 -->
      <div :class="contentHaveIcon" v-if="renderFunc">
        <render-cell :render="renderFunc"></render-cell>
      </div>
      <!-- 关闭按钮 -->
      <div :class="bem.b('close')" @click.stop="handleClose" v-show="closable">
        <ivue-icon>close</ivue-icon>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, unref } from 'vue';
import { useEventListener } from '@vueuse/core';

// utils
import { RenderCell, EVENT_CODE } from '@ivue-material-plus/utils';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';

// notice
import { noticeProps } from './notice';

// type
type SetTimeout = ReturnType<typeof setTimeout>;

// components
import IvueIcon from '@ivue-material-plus/components/ivue-icon';

const prefixCls = 'ivue-notice';

export default defineComponent({
  name: prefixCls,
  emits: ['destroy'],
  props: noticeProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

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
        // 弹出方向
        bem.is(unref(horizontalClass)),
        {
          // 自定义样式名称
          [`${props.className}`]: !!props.className,
        },
      ];
    });

    // 当前方向
    const verticalProperty = computed(() => {
      return props.position.startsWith('top') ? 'top' : 'bottom';
    });

    // 弹出方向
    const horizontalClass = computed(() => {
      return props.position.indexOf('right') > 1 ? 'right' : 'left';
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      return {
        [verticalProperty.value]: `${props.offset}px`,
        zIndex: props.zIndex,
      };
    });

    // 内容样式
    const contentClasses = computed(() => {
      return [
        bem.b('content'),
        {
          // 有 render 渲染函数
          [bem.is('render')]: props.render,
          // 是否有有描述
          [bem.is('have-desc')]: props.desc || props.render,
          // 有状态图标
          [bem.is('have-icon')]: props.type !== 'normal',
          // 带图标消息
          [bem.is(`have-${props.type}`)]: props.type !== 'normal',
        },
      ];
    });

    // 是否有图标
    const contentHaveIcon = computed(() => {
      return {
        [`${prefixCls}-content-have-icon`]: props.type !== 'normal',
      };
    });

    // render 函数
    const renderFunc = computed(() => {
      return props.render;
    });

    // methods

    // 关闭
    const handleClose = () => {
      visible.value = false;
    };

    // 清除关闭定时器
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

    // 键盘点击
    const onKeydown = ({ code }: KeyboardEvent) => {
      if (code === EVENT_CODE.delete || code === EVENT_CODE.backspace) {
        // 按 delete/backspace 清除关闭定时器
        clearCloseTimer();
      } else if (code === EVENT_CODE.esc) {
        // 按 esc 关闭通知
        if (unref(visible)) {
          handleClose();
        }
      } else {
        // 恢复定时器
        startTime();
      }
    };

    // onMounted
    onMounted(() => {
      startTime();

      visible.value = true;

      useEventListener(document, 'keydown', onKeydown);
    });

    return {
      prefixCls,
      // bem
      bem,

      // data
      visible,
      iconTypes,

      // computed
      wrapperClasses,
      contentClasses,
      contentHaveIcon,
      renderFunc,
      wrapperStyles,

      // methods
      handleClose,
      clearCloseTimer,
      handleMouseenter,
      handleMouseleave,
      horizontalClass,
    };
  },
  components: {
    RenderCell,
    IvueIcon,
  },
});
</script>
