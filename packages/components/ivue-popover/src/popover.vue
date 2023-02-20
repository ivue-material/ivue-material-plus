<template>
  <div
    :class="wrapperClasses"
    @mouseenter="() => handleMouseenter()"
    @mouseleave="handleMouseleave"
    v-click-outside:[capture]="handleClickOutside"
  >
    <!-- 描述 -->
    <div
      :class="bem.e('rel')"
      ref="referenceRef"
      @click="handleRelClick"
      @mousedown="handleFocus(false)"
      @mouseup="handleBlur(false)"
    >
      <slot></slot>
    </div>
    <!-- 为封装到组件中来构建 UI -->
    <teleport to="body" :disabled="!transfer">
      <transition name="fade">
        <div
          :class="popperClasses"
          :style="popperStyles"
          @click="handleTransferClick"
          @mouseenter="handleMouseenter('popper')"
          @mouseleave="handleMouseleave"
          ref="popperRef"
          v-show="visible"
        >
          <div :class="bem.b('content')">
            <!-- 箭头 -->
            <div :class="bem.b('arrow')" ref="arrow"></div>

            <!-- 对话框 -->
            <div :class="bem.b('inner')" v-if="confirm">
              <!-- body -->
              <div :class="bem.be('inner', 'body')">
                <!-- icon -->
                <ivue-icon :class="bem.be('inner', 'icon')">help</ivue-icon>
                <!-- title -->
                <div :class="bem.be('inner', 'message')">
                  <slot name="title">{{ title }}</slot>
                </div>
              </div>
              <!-- 底部 -->
              <div :class="bem.be('inner', 'footer')">
                <ivue-button outline color="#dcdfe6" @click="handleCancel">{{
                  cancelText
                }}</ivue-button>
                <!-- 确认 -->
                <ivue-button
                  depressed
                  status="primary"
                  @click="handleConfirm"
                  >{{ confirmText }}</ivue-button
                >
              </div>
            </div>

            <!-- 不是对话框 -->
            <div :class="bem.b('inner')" v-if="!confirm">
              <!-- title -->
              <div :class="bem.be('inner', 'title')" v-if="showTitle">
                <slot name="title">{{ title }}</slot>
              </div>
              <!-- body -->
              <div :class="bodyClasses">
                <slot name="content">{{ content }}</slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, unref } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// directives
import { ClickOutside } from '@ivue-material-plus/directives';

// popover
import { popoverProps, popoverEmits } from './popover';
import { usePopover } from './use-popover';

// components
import IvueIcon from '@ivue-material-plus/components/ivue-icon';
import IvueButton from '@ivue-material-plus/components/ivue-button';

const prefixCls = 'ivue-popover';

export default defineComponent({
  name: prefixCls,
  emits: popoverEmits,
  // 注册局部指令
  directives: { ClickOutside },
  props: popoverProps,
  setup(props, { emit, slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    const {
      // dom
      popperRef,
      referenceRef,

      // data
      visible,
      zIndex,

      // computed
      showTitle,

      // methods
      handleIndexIncrease,
      handleMouseenter,
      handleMouseleave,
      handleRelClick,
      handleClickOutside,
      handleTransferClick,
      handleFocus,
      handleBlur,
      handleConfirm,
      handleCancel,
    } = usePopover(props, slots, emit);

    // computed

    // 外部样式
    const wrapperClasses = computed(() => {
      return [bem.b()];
    });

    // 悬浮框样式
    const popperClasses = computed(() => {
      return [
        bem.e('popper'),
        {
          // 开启对话框
          [bem.is('confirm')]: props.confirm,
          // 是否将弹层放置于 body 内
          [bem.is('transfer')]: props.transfer,
        },
        // 开启 transfer 时，给浮层添加额外的 class 名称
        props.transferClassName && props.transferClassName,
      ];
    });

    // 悬浮框样式
    const popperStyles = computed(() => {
      const styles: {
        width?: string | number;
        zIndex?: number;
      } = {};

      // 设置宽度
      if (props.width) {
        styles.width = `${props.width}px`;
      }

      // 是否将弹层放置于 body 内
      if (props.transfer) {
        styles.zIndex = 1060 + unref(zIndex);
      }

      return styles;
    });

    // 内容样式
    const bodyClasses = computed(() => {
      return [
        bem.be('inner', 'body'),
        {
          [bem.is('word-wrap')]: props.wordWrap,
        },
      ];
    });

    return {
      bem,
      prefixCls,
      // dom
      popperRef,
      referenceRef,

      // data
      visible,

      // computed
      wrapperClasses,
      popperClasses,
      popperStyles,
      bodyClasses,
      showTitle,

      // methods
      handleIndexIncrease,
      handleMouseenter,
      handleMouseleave,
      handleRelClick,
      handleClickOutside,
      handleTransferClick,
      handleFocus,
      handleBlur,
      handleConfirm,
      handleCancel,
    };
  },
  components: {
    IvueIcon,
    IvueButton,
  },
});
</script>
