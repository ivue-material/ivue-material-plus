import {
  inject,
  ref,
  onMounted,
  watch,
  toRef,
  onUnmounted,
  computed,
  unref,
} from 'vue';

// 生成随机id
import { useId } from '../use-id';
import { FormItemContextKey } from '@ivue-material-plus/components/ivue-form/src/form-item';
import { FormContextKey } from '@ivue-material-plus/components/ivue-form/src/form';

// type
import type {
  WatchStopHandle,
  ComputedRef,
  Ref,
  ComponentInternalInstance,
} from 'vue';
import type { FormItemContext } from '@ivue-material-plus/components/ivue-form/src/form-item';

// 获取表单 inject
export const useFormItem = () => {
  const form = inject(FormContextKey, undefined);
  const formItem = inject(FormItemContextKey, undefined);

  return {
    form,
    formItem,
  };
};

export type IUseFormItemInputCommonProps = {
  id?: any;
  label?: string | number | boolean | Record<string, any>;
};

// 设置表单item输入框id
export const useFormItemInputId = (
  props: IUseFormItemInputCommonProps,
  {
    formItemContext,
    disableIdGeneration,
    disableIdManagement,
  }: {
    formItemContext?: FormItemContext;
    disableIdGeneration?: ComputedRef<boolean> | Ref<boolean>;
    disableIdManagement?: ComputedRef<boolean> | Ref<boolean>;
  },
  slots?: ComponentInternalInstance['slots']
) => {
  // 禁用 ID 生成
  if (!disableIdGeneration) {
    disableIdGeneration = ref<boolean>(false);
  }

  // 禁用 ID 管理
  if (!disableIdManagement) {
    disableIdManagement = ref<boolean>(false);
  }

  // 取消watch
  let idUnwatch: WatchStopHandle | undefined = undefined;

  // data

  // 输入框id
  const inputId = ref<string>();

  // computed

  // 获取表单item的标签名称
  const isLabeledByFormItem = computed<boolean>(() => {
    return !!(
      !props.label &&
      formItemContext &&
      formItemContext.inputIds &&
      formItemContext.inputIds?.length <= 1
    );
  });

  // onMounted
  // 如果没有作为 prop 提供，则为 IvueFormItem 标签生成 id
  onMounted(() => {
    // 有自定义input插槽
    if (slots && slots.input && slots.input()) {
      return;
    }

    idUnwatch = watch(
      [toRef(props, 'id')],
      ([id]: [string]) => {
        const newId =
          id ?? (!unref(disableIdGeneration) ? useId().value : undefined);

        if (formItemContext?.removeInputId) {
          // 删除输入框id
          inputId.value && formItemContext.removeInputId(inputId.value);

          // 添加输入框id
          if (
            !unref(disableIdManagement) &&
            !unref(disableIdGeneration) &&
            newId
          ) {
            formItemContext.addInputId(newId);
          }
        }

        inputId.value = newId;
      },
      {
        immediate: true,
      }
    );
  });

  // onUnmounted
  onUnmounted(() => {
    idUnwatch && idUnwatch();

    // 删除输入框id
    if (formItemContext?.removeInputId) {
      inputId.value && formItemContext.removeInputId(inputId.value);
    }
  });

  return {
    isLabeledByFormItem,
    inputId,
  };
};
