import { ref, unref, computed, watch } from 'vue';
import { debugWarn } from '@ivue-material-plus/utils';

import { AutoCompleteProps } from './auto-complete';

// type
import { SetupContext } from 'vue';
import type {
  Select,
  Input,
  Option,
  FilteredData,
  AutoCompleteEmits,
} from './auto-complete';
import type { FormItemContext } from '../../../components/ivue-form/src/form-item';

export const useAutoComplete = (
  props: AutoCompleteProps,
  emit: SetupContext<AutoCompleteEmits>['emit'],
  formItem: FormItemContext
) => {
  // dom
  // select
  const select = ref<Select>();
  // input
  const input = ref<Input>();

  // data

  // 当前输入值
  const currentValue = ref<string>(props.modelValue);
  // 禁用事件改变
  const disableEmitChange = ref<boolean>(false);

  // computed

  // 过滤的数据
  const filteredData = computed<FilteredData>(() => {
    // 是否根据输入项进行筛选
    if (props.filterMethod) {
      return props.list.filter((item) => {
        return props.filterMethod(unref(currentValue), item);
      });
    }
    // 自动完成的数据源
    else {
      return props.list;
    }
  });

  // methods

  // 搜索方法
  const searchMethod = (query: string) => {
    // 搜索值
    emit('on-search', query);

    // 远程搜索方法
    if (props.remoteMethod) {
      props.remoteMethod(query);
    }
  };

  // 被选中时调用，参数为选中项的 value 值
  const handleSelect = (option: Option) => {
    const value = option.value;

    if (value === undefined || value === null) {
      return;
    }

    // 当前输入值
    currentValue.value = `${value}`;

    // blur
    input.value.blur();

    // 搜索值
    emit('on-select', value);
  };

  // 获取焦点
  const handleFocus = (event: FocusEvent) => {
    emit('on-focus', event);

    // 输入时是否触发表单的校验
    if (props.validateEvent) {
      formItem?.validate?.('focus').catch((err: Error) => debugWarn(err));
    }
  };

  // 失去焦点
  const handleBlur = (event: FocusEvent) => {
    emit('on-blur', event);

    // 输入时是否触发表单的校验
    if (props.validateEvent) {
      formItem?.validate?.('focus').catch((err: Error) => debugWarn(err));
    }
  };

  // 清空时触发
  const handleClear = () => {
    emit('on-clear');
  };

  // watch

  // 监听设置选择的值
  watch(
    () => props.modelValue,
    (value) => {
      // 当前输入值不相等
      if (unref(currentValue) !== value) {
        disableEmitChange.value = true;
      }

      currentValue.value = value;

      // 输入时是否触发表单的校验
      if (props.validateEvent) {
        formItem?.validate?.('change').catch((err) => debugWarn(err));
      }
    }
  );

  // 监听当前输入值
  watch(
    () => currentValue.value,
    (value) => {
      select.value.setQuery(value);

      emit('update:modelValue', value);

      // 防止触发多次
      if (unref(disableEmitChange)) {
        disableEmitChange.value = false;

        return;
      }

      // 清空时触发
      emit('on-change', value);
    }
  );

  return {
    // dom
    select,
    input,

    // data
    currentValue,
    disableEmitChange,

    // computed
    filteredData,

    // methods
    searchMethod,
    handleSelect,
    handleFocus,
    handleBlur,
    handleClear,
  };
};
