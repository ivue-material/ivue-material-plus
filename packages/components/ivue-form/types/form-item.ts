import type { InjectionKey } from 'vue';
import type { FormValidateCallback, FormValidationResult } from './form';
import type { RuleItem } from 'async-validator';

export type Arrayable<T> = T | T[];

export interface Props {
  label: string;
  for: string;
  labelWidth: string | number;
  prop: any;
  required: boolean;
  rules: any;
  showMessage: boolean;
  validateSuccessMessage: string;
  showSuccessStatus: boolean;
  error: string;
}

export type FormItemContext = Props & {
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

export const FormItemContextKey: InjectionKey<FormItemContext> =
  Symbol('ivue-form-item');

export type FormItemProp = Arrayable<string>;

// item 验证
export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>;
}

// item验证状态
export const formItemValidateStates = [
  '',
  'error',
  'validating',
  'success',
] as const;

export type FormItemValidateState = (typeof formItemValidateStates)[number];
