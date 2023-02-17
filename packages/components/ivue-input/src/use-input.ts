import { ref, computed, nextTick, onMounted, watch } from 'vue';
import {
  useFormItem,
  useFormItemInputId,
  useDisabled,
} from '@ivue-material-plus/hooks';
import { calcTextareaHeight } from '@ivue-material-plus/utils/calc-textarea-height';
import { debugWarn } from '@ivue-material-plus/utils';

// type
import type { SetupContext, ComponentInternalInstance } from 'vue';
import type { InputProps, InputEmits, TextareaStyles } from './input';

export const useInput = (
  props: InputProps,
  emit: SetupContext<InputEmits>['emit'],
  slots: ComponentInternalInstance['slots']
) => {
  // 设置表单对应的输入框id
  const { formItem } = useFormItem();

  // 输入框id
  const { inputId } = useFormItemInputId(props, {
    formItemContext: formItem,
  });

  // 当前输入值
  const currentValue = ref<string | number>(props.modelValue);

  // 文本框样式
  const textareaStyles = ref<TextareaStyles>({});

  // 显示密码
  const showPassword = ref<boolean>(false);

  // 是否有焦点
  const focused = ref<boolean>(false);

  // ref = textarea
  const textarea = ref<HTMLTextAreaElement>();
  // ref = input
  const input = ref<HTMLInputElement>();

  // 输入框禁用
  const inputDisabled = useDisabled();

  // computed

  // 输入的内容
  const nativeInputValue = computed(() => {
    return props.modelValue;
  });

  // 输入上限
  const upperLimit = computed(() => {
    return props.maxlength;
  });

  // 监听输入的长度
  const textLength = computed(() => {
    if (typeof currentValue.value === 'number') {
      return String(currentValue.value).length;
    }

    return (currentValue.value || '').length;
  });

  // 获取当前输入框type
  const currentType = computed(() => {
    let type = props.type;

    if (type === 'password' && props.password && showPassword.value) {
      type = 'text';
    }

    return type;
  });

  // 是否有前置内容
  const prepend = computed(() => {
    let state = false;

    if (props.type !== 'textarea') {
      state = slots.prepend !== undefined;
    }

    return state;
  });

  // 是否有后置内容
  const append = computed(() => {
    let state = false;

    if (props.type !== 'textarea') {
      state = slots.append !== undefined;
    }

    return state;
  });

  // 是否显示输入框头部图标
  const showPrefix = computed(() => {
    let state = false;

    if (props.type !== 'textarea') {
      state = props.prefix !== '' || slots.prefix !== undefined;
    }

    return state;
  });

  // 是否显示输入框尾部图标
  const showSuffix = computed(() => {
    let state = false;

    if (props.type !== 'textarea') {
      state = props.suffix !== '' || slots.suffix !== undefined;
    }

    return state;
  });

  // methods

  // 按下回车键时触发
  const handleEnter = (event: Event) => {
    emit('on-enter', event);
  };

  // 原生的 keyup 事件
  const handleKeyup = (event: Event) => {
    emit('on-keyup', event);
  };

  // 原生的 keypress 事件
  const handleKeypress = (event: Event) => {
    emit('on-keypress', event);
  };

  // 原生的 keydown 事件
  const handleKeydown = (event: Event) => {
    emit('on-keydown', event);
  };

  // 尾部图标点击事件
  const handleSuffix = (event: Event) => {
    emit('on-suffix', event);
  };

  // 更新value
  const setNativeInputValue = () => {
    if (props.modelValue === currentValue.value) {
      return;
    }

    currentValue.value = nativeInputValue.value;
  };

  // 设置当前值
  const setCurrentValue = (value: string | number) => {
    if (value === currentValue.value) {
      return;
    }

    // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，
    nextTick(() => {
      resizeTextarea();
    });

    currentValue.value = value;

    if (!props.isValue) {
      nextTick(() => {
        setNativeInputValue();
      });
    }
  };

  // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，
  // 如 { minRows: 2, maxRows: 6 }
  const resizeTextarea = () => {
    const autoHeight = props.autoHeight;

    // 是否是 textarea 是否开启了自适应高度
    if (!autoHeight || props.type !== 'textarea') {
      return;
    }

    const minRows = autoHeight.minRows;
    const maxRows = autoHeight.maxRows;

    // 文本框样式
    textareaStyles.value = calcTextareaHeight(textarea.value, minRows, maxRows);
  };

  // 输入事件
  const handleInput = (event: Event) => {
    let value = (event.target as HTMLInputElement).value;

    // 是否开启了 Number 类型
    if (props.number) {
      value = value.replace(/[^\d]+/g, '');

      (event.target as HTMLInputElement).value = value;
    }

    // 自定义输入方法
    if (props.inputFunction) {
      value = props.inputFunction(value);

      (event.target as HTMLInputElement).value = value;
    }

    // updated v-model
    emit('update:modelValue', value);

    // 设置当前值
    setCurrentValue(value);

    emit('on-change', (event.target as HTMLInputElement).value);
  };

  // 输入框聚焦时触发
  const handleFocus = (event: Event) => {
    focused.value = true;

    emit('on-focus', event);
  };

  // 输入框失去焦点时触发
  const handleBlur = (event: Event) => {
    focused.value = false;

    emit('on-blur', event);

    if (props.validateEvent) {
      formItem?.validate?.('blur').catch((err) => debugWarn(err));
    }
  };

  // 清除数据
  const handleClear = () => {
    emit('update:modelValue', '');

    setCurrentValue('');

    emit('on-clear');

    emit('on-change', '');
  };

  // 获取焦点
  const focus = (option: any) => {
    const $el =
      props.type === 'textarea'
        ? (textarea.value as HTMLTextAreaElement)
        : (input.value as HTMLInputElement);

    // 获取焦点
    $el.focus(option);

    // 选择内容
    const { cursor } = option || {};

    // cursor
    if (cursor) {
      const len = $el.value.length;

      switch (cursor) {
        case 'start':
          $el.setSelectionRange(0, 0);
          break;
        case 'end':
          $el.setSelectionRange(len, len);
          break;
        default:
          $el.setSelectionRange(0, len);
      }
    }
  };

  // 失去焦点
  const blur = () => {
    if (props.type === 'textarea') {
      textarea.value?.blur();
    } else {
      input.value?.blur();
    }
  };

  // 是否显示密码
  const handleShowPassword = () => {
    // 是否禁用
    if (inputDisabled.value) {
      return false;
    }

    showPassword.value = !showPassword.value;

    // 焦点
    focus(null);

    const len = `${currentValue.value}`.length;

    setTimeout(() => {
      input.value?.setSelectionRange(len, len);
    }, 0);
  };

  // 点击搜索
  const handleSearch = () => {
    if (inputDisabled.value) {
      return false;
    }

    input.value?.focus();

    emit('on-search', currentValue.value);
  };

  // 监听value
  watch(
    () => props.modelValue,
    (value) => {
      setCurrentValue(value);

      // 输入时是否触发表单的校验
      if (props.validateEvent) {
        formItem?.validate?.('change').catch((err) => debugWarn(err));
      }
    }
  );

  // native input value is set explicitly
  // do not use v-model / :value in template
  watch(nativeInputValue, () => {
    setNativeInputValue();
  });

  // when change between <input> and <textarea>,
  // update DOM dependent value and styles
  watch(
    () => props.type,
    () => {
      nextTick(() => {
        // 更新value
        setNativeInputValue();
        // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，
        resizeTextarea();
      });
    }
  );

  // onMounted
  onMounted(() => {
    // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，
    resizeTextarea();
  });

  return {
    inputId,

    // dom
    textarea,
    input,

    // data
    showPassword,
    currentValue,
    focused,

    inputDisabled,

    // computed
    textareaStyles,
    upperLimit,
    textLength,
    currentType,
    prepend,
    append,
    showPrefix,
    showSuffix,

    // methods
    handleEnter,
    handleKeyup,
    handleKeypress,
    handleKeydown,
    handleFocus,
    handleBlur,
    handleInput,
    handleClear,
    handleShowPassword,
    handleSuffix,
    handleSearch,
    setCurrentValue,
    focus,
    blur,
  };
};
