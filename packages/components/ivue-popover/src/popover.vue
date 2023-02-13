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
      ref="reference"
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
          ref="popper"
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
import {
  defineComponent,
  computed,
  reactive,
  ref,
  getCurrentInstance,
  onMounted,
  nextTick,
  provide,
  unref,
} from 'vue';
import { useEventListener } from '@vueuse/core';

// // utils
// import { oneOf } from '../../utils/assist';
import { transferIndex, transferIncrease } from '@ivue-material-plus/utils';

// // 注册外部点击事件插件
// import { ClickOutside } from '../../utils/directives';

// // components
// import IvueIcon from '../ivue-icon';
// import IvueButton from '../ivue-button';

// // ts
// import {
//   PopoverContextKey,
//   Props,
//   Data,
//   _ComponentInternalInstance,
// } from './types/popover';

// directives
import { ClickOutside } from '@ivue-material-plus/directives';
import { PopoverContextKey } from '@ivue-material-plus/tokens';
// import Popper from '@ivue-material-plus/utils/mixins/popper';

// popover
import { popoverProps } from './popover';

// type
import { Status } from './popover';

// components
import IvueIcon from '@ivue-material-plus/components/ivue-icon';
import IvueButton from '@ivue-material-plus/components/ivue-button';

const prefixCls = 'ivue-popover';

export default defineComponent({
  name: prefixCls,
  // mixins: [Popper],
  emits: ['on-cancel', 'on-confirm'],
  // 注册局部指令
  directives: { ClickOutside },
  props: popoverProps,
  setup(props, { emit, slots }) {
    // vm
    const { proxy } = getCurrentInstance();

    // dom
    const popper = ref<HTMLDivElement>();
    const reference = ref<HTMLDivElement>();

    // data

    // 显示隐藏
    const visible = ref<boolean>(props.modelValue);

    // 延迟
    const timeout = ref<ReturnType<typeof setTimeout> | number>(0);
    // 当前元素index
    const zIndex = ref<number>(0);
    // 是否有input
    const isInput = ref<boolean>(false);
    // 当前点击target获取焦点
    const currentTargetFocus = ref<boolean>(false);

    // data
    const data = reactive<Status>({
      // transfer 模式下，点击 slot 也会触发关闭
      disableCloseUnderTransfer: false,
      // 关闭延迟
      closeDelay: 0,
    });

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

    // 显示标题
    const showTitle = computed(() => {
      // 不是对话框模式
      if (!props.confirm) {
        return slots.title !== undefined || props.title;
      }

      return false;
    });

    // methods

    // 获取index
    const handleGetIndex = () => {
      transferIncrease();

      return transferIndex;
    };

    // 增加zIndex
    const handleIndexIncrease = () => {
      zIndex.value = handleGetIndex();
    };

    // 鼠标进入
    const handleMouseenter = (status?: string) => {
      // 是否禁用
      if (props.disabled) {
        return;
      }

      // 进入到弹框 && 获取焦点
      if (status === 'popper' && unref(currentTargetFocus)) {
        // 清除延迟
        clearTimeout(unref(timeout));
      }

      // 不是 hover || 开启了对话框
      if (props.trigger !== 'hover' || props.confirm) {
        return false;
      }

      // 清除延迟
      if (unref(timeout)) {
        clearTimeout(unref(timeout));
      }

      // 延迟时间
      timeout.value = setTimeout(() => {
        visible.value = true;
      }, props.delay);
    };

    // 鼠标离开
    const handleMouseleave = () => {
      // 获取焦点 鼠标移出元素 关闭弹框
      if (unref(currentTargetFocus)) {
        clearTimeout(unref(timeout));

        timeout.value = setTimeout(() => {
          visible.value = false;
        }, 100);
      }

      // 不是 hover || 开启了对话框
      if (props.trigger !== 'hover' || props.confirm) {
        return false;
      }

      // 清除延迟
      if (unref(timeout)) {
        clearTimeout(unref(timeout));

        timeout.value = setTimeout(() => {
          visible.value = false;
        }, 100);
      }
    };

    // 描述点击
    const handleRelClick = () => {
      // 是否禁用
      if (props.disabled) {
        return;
      }

      // 开启了对话框
      if (props.confirm) {
        visible.value = !visible.value;

        return;
      }

      // 不是点击事件
      if (props.trigger !== 'click') {
        return false;
      }

      visible.value = !visible.value;
    };

    // 点击外部
    const handleClickOutside = () => {
      setTimeout(() => {
        // 点击的是内容
        if (data.disableCloseUnderTransfer) {
          data.disableCloseUnderTransfer = false;

          return false;
        }

        // 开启了对话框
        if (props.confirm) {
          visible.value = false;

          return;
        }

        // 不是点击事件
        if (props.trigger !== 'click') {
          return false;
        }

        visible.value = false;
      }, data.closeDelay);
    };

    // transfer时点击
    const handleTransferClick = () => {
      if (props.transfer) {
        data.disableCloseUnderTransfer = true;
      }
    };

    // 获取焦点
    const handleFocus = (fromInput = true) => {
      // 是否禁用
      if (props.disabled) {
        return;
      }

      // 触发方式 不是 focus || 开启对话框 || 没有input
      if (
        props.trigger !== 'focus' ||
        props.confirm ||
        (unref(isInput) && !fromInput)
      ) {
        return false;
      }

      // 没有输入框
      if (!unref(isInput)) {
        // 当前获取焦点
        currentTargetFocus.value = true;
      }

      // 显示
      visible.value = true;
    };

    // 失去焦点
    const handleBlur = (fromInput = true) => {
      // 触发方式 不是 focus || 开启对话框 || 没有input
      if (
        props.trigger !== 'focus' ||
        props.confirm ||
        (unref(isInput) && !fromInput)
      ) {
        return false;
      }

      // 没有输入框
      if (!unref(isInput)) {
        currentTargetFocus.value = false;
      }

      // 显示
      visible.value = false;
    };

    // 获取是否有input
    const getInputChildren = () => {
      const input = reference.value!.querySelectorAll('input');
      const textarea = reference.value!.querySelectorAll('textarea');

      let children = null;

      // input
      if (input.length) {
        children = input[0];
      }
      // textarea
      else if (textarea.length) {
        children = textarea[0];
      }

      return children;
    };

    // 取消
    const handleCancel = () => {
      visible.value = false;

      // 点击取消的回调，只在 confirm 模式下有效
      emit('on-cancel');
    };

    // 确认
    const handleConfirm = () => {
      visible.value = false;

      // 点击确定的回调，只在 confirm 模式下有效
      emit('on-confirm');
    };

    // onMounted
    onMounted(() => {
      zIndex.value = handleGetIndex();

      // if trigger and children is input or textarea,
      // listen focus & blur event
      if (props.trigger === 'focus') {
        nextTick(() => {
          const children = getInputChildren();

          // 有input
          if (children) {
            isInput.value = true;

            useEventListener(children, 'focus', handleFocus, false);
            useEventListener(children, 'blur', handleBlur, false);
          }
        });
      }

      if (visible.value) {
        proxy.updatePopper();
      }
    });

    // provide
    provide(
      PopoverContextKey,
      reactive({
        data,
        visible,
        handleCancel,
      })
    );

    return {
      prefixCls,
      // dom
      reference,
      popper,

      // data
      data,
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
