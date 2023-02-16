import {
  ref,
  provide,
  nextTick,
  onMounted,
  reactive,
  computed,
  unref,
} from 'vue';
import { useEventListener } from '@vueuse/core';

import { PopoverContextKey } from '@ivue-material-plus/tokens';
import { transferIndex, transferIncrease } from '@ivue-material-plus/utils';
import { popper as Popper } from '@ivue-material-plus/utils/mixins/popper';

// type
import type { SetupContext, ComponentInternalInstance } from 'vue';
import type { PopoverProps, PopoverEmits, Status } from './popover';

export const usePopover = (
  props: PopoverProps,
  slots: ComponentInternalInstance['slots'],
  emit: SetupContext<PopoverEmits>['emit']
) => {
  // dom

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
    const input = unref(referenceRef)!.querySelectorAll('input');
    const textarea = unref(referenceRef)!.querySelectorAll('textarea');

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

  // 引入popper
  const { popperRef, referenceRef, updatePopper } = Popper(
    props,
    {
      visible: visible,
      handleIndexIncrease: handleIndexIncrease,
    },
    emit
  );

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
      updatePopper();
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
  };
};
