<template>
  <div
    :class="wrapperClasses"
    @mouseenter="() => handleMouseenter()"
    @mouseleave="handleMouseleave"
    v-click-outside:[capture]="handleClickOutside"
  >
    <!-- 描述 -->
    <div
      :class="`${prefixCls}-rel`"
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
          <div :class="`${prefixCls}-content`">
            <!-- arrow -->
            <div :class="`${prefixCls}-arrow`" ref="arrow"></div>
            <!-- 对话框 -->
            <div :class="`${prefixCls}-inner`" v-if="confirm">
              <!-- body -->
              <div :class="`${prefixCls}-body`">
                <!-- icon -->
                <ivue-icon :class="`${prefixCls}-body--icon`">help</ivue-icon>
                <!-- title -->
                <div :class="`${prefixCls}-body--message`">
                  <slot name="title">{{ title }}</slot>
                </div>
              </div>
              <!-- 底部 -->
              <div :class="`${prefixCls}-footer`">
                <ivue-button
                  :class="`${prefixCls}-footer--button`"
                  outline
                  color="#dcdfe6"
                  @click="handleCancel"
                  >{{ cancelText }}</ivue-button
                >
                <!-- 确认 -->
                <ivue-button
                  :class="`${prefixCls}-footer--button`"
                  depressed
                  status="primary"
                  @click="handleConfirm"
                  >{{ confirmText }}</ivue-button
                >
              </div>
            </div>
            <!-- 不是对话框 -->
            <div :class="`${prefixCls}-inner`" v-if="!confirm">
              <!-- title -->
              <div :class="`${prefixCls}-title`" v-if="showTitle">
                <slot name="title">{{ title }}</slot>
              </div>
              <!-- body -->
              <div :class="`${prefixCls}-body`">
                <div :class="bodyContentClasses">
                  <slot name="content">{{ content }}</slot>
                </div>
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
      return [
        prefixCls,
        {
          [`${prefixCls}-confirm`]: props.confirm,
        },
      ];
    });

    // 悬浮框样式
    const popperClasses = computed(() => {
      return [
        `${prefixCls}-popper`,
        {
          // 主题
          [`${prefixCls}-${props.theme}`]: true,
          // 是否将弹层放置于 body 内
          [`${prefixCls}-transfer`]: props.transfer,
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

    // body
    const bodyContentClasses = computed(() => {
      return [
        `${prefixCls}-body--content`,
        {
          [`${prefixCls}-body--word-wrap`]: props.wordWrap,
        },
      ];
    });

    return {
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
      bodyContentClasses,
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
