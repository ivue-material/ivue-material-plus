import {
  ref,
  unref,
  computed,
  watch,
  onMounted,
  nextTick,
  onUnmounted,
} from 'vue';

import { colorable } from '@ivue-material-plus/utils/mixins/colorable';
import {
  useFormItem,
  useFormItemInputId,
  useDisabled,
} from '@ivue-material-plus/hooks';
import { debugWarn } from '@ivue-material-plus/utils';

// type
import type { SetupContext } from 'vue';
import type { SwitchProps, SwitchEmits } from './switch';

export const useSwitch = (
  props: SwitchProps,
  emit: SetupContext<SwitchEmits>['emit']
) => {
  // mixins
  const { setTextColor } = colorable(props);

  // 当前选择状态
  const currentValue = ref<string | boolean | number>(props.modelValue);

  // 输入框禁用
  const inputDisabled = useDisabled();

  // computed

  // 更新 ripple
  const computedRipple = computed(() => {
    if (props.rippleDisabled || inputDisabled.value) {
      return false;
    }

    return {
      center: true,
    };
  });

  // 设置背景颜色
  const setColor = computed<string | string[]>(() => {

    // 激活
    if (currentValue.value === props.trueValue) {
      return props.color;
    }

    if (currentValue.value === props.falseValue) {
      return props.falseColor;
    }

    return '';
  });

  // methods

  // 切换状态
  const toggle = (event: Event) => {
    if (event) {
      event.preventDefault();
    }

    if (inputDisabled.value || props.loading) {
      return false;
    }

    // 是否有 Promise
    if (!props.beforeChange) {
      return handleToggle();
    }

    const before = props.beforeChange();

    if (before && before.then) {
      before.then(() => {
        handleToggle();
      });
    } else {
      handleToggle();
    }
  };

  // 切换状态
  const handleToggle = () => {
    const checked =
      currentValue.value === props.trueValue
        ? props.falseValue
        : props.trueValue;

    // 修改 v-modal
    currentValue.value = checked;

    emit('update:modelValue', checked);

    emit('on-change', checked);
  };

  // 监听value
  watch(
    () => props.modelValue,
    (value) => {
      if (value !== props.trueValue && value !== props.falseValue) {
        throw 'Value should be trueValue or falseValue.';
      }

      currentValue.value = value;

      // 输入时是否触发表单的校验
      if (props.validateEvent) {
        formItem?.validate?.('change').catch((err) => debugWarn(err));
      }
    }
  );

  // 设置表单对应的输入框id
  const { formItem } = useFormItem();

  // 输入框id
  const { inputId } = useFormItemInputId(props, {
    formItemContext: formItem,
  });

  return {
    inputId,
    setTextColor,
    inputDisabled,
    currentValue,

    // computed
    computedRipple,
    setColor,

    // methods
    toggle,
  };
};
