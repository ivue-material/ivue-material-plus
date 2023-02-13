import type {
  ExtractPropTypes,
  UnwrapRef,
  InjectionKey,
  SetupContext,
} from 'vue';
import type {
  FormItemProps,
  FormValidateCallback,
  FormValidationResult,
  FormProps,
  FormEmits,
  FormItemProp
} from '@ivue-material-plus/components/ivue-form';
import type {
  useFormLabelWidth
} from '@ivue-material-plus/components/ivue-form/src/utils';
import type { Arrayable } from '@ivue-material-plus/utils';

// FormItemContext
export type FormItemContext = FormItemProps & {
  $el: HTMLDivElement | undefined;
  inputIds: string[];
  hasLabel: boolean;
  removeInputId: (id: string) => void;
  addInputId: (id: string) => void;
  validate: (
    trigger: string,
    callback?: FormValidateCallback
  ) => FormValidationResult;
  resetField(): void;
  clearValidate(): void;
};

// inject相关
export const FormItemContextKey: InjectionKey<FormItemContext> =
  Symbol('ivue-form-item');

// FormLabelWidthContext
export type FormLabelWidthContext = ReturnType<typeof useFormLabelWidth>;

// inject相关
export type FormContext = FormProps &
  UnwrapRef<FormLabelWidthContext> & {
    default?: null;
    emit: SetupContext<FormEmits>['emit'];
    // 验证具体的某个字段
    validateField: (
      props?: Arrayable<FormItemProp>,
      callback?: FormValidateCallback
    ) => FormValidationResult;
    // 添加验证字段
    addField: (field: FormItemContext) => void;
    // 删除验证字段
    removeField: (field: FormItemContext) => void;
    // 重置该表单项
    resetFields: (props?: Arrayable<FormItemProp>) => void;
    // 清理某个字段的表单验证信息
    clearValidate: (props?: Arrayable<FormItemProp>) => void;
  };

// FormContextKey
export const FormContextKey: InjectionKey<FormContext> = Symbol('ivue-form');
