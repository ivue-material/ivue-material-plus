import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes, InjectionKey } from 'vue';
import type { RuleItem } from 'async-validator';

import type { FormValidateCallback, FormValidationResult } from './form';
import type FormItem from './form-item.vue';
import type { Arrayable } from '@ivue-material-plus/utils';

// props
export const formItemProps = buildProps({
  /**
   * 标签文本
   *
   * @type {String}
   */
  label: {
    type: String,
  },
  /**
   * 属性规定 label 与哪个表单元素绑定
   *
   * @type {String}
   */
  for: {
    type: String,
  },
  /**
   * 标签宽度
   *
   * @type {String | Number}
   */
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  /**
   * model 的键名
   *
   * @type {String | String[]}
   */
  prop: {
    type: definePropType<string | string[]>([String, Array]),
  },
  /**
   * 是否为必填项，如不设置，则会根据校验规则确认
   *
   * @type {Boolean}
   */
  required: {
    type: Boolean,
  },
  /**
   * 表单验证规则
   *
   * @type {Object | Array}
   */
  rules: {
    type: [Object, Array],
  },
  /**
   * 是否显示校验错误信息
   *
   * @type {Boolean}
   */
  showMessage: {
    type: Boolean,
    default: true,
  },
  /**
   * 验证成功提示状态
   *
   * @type {Boolean}
   */
  showSuccessStatus: {
    type: Boolean,
    default: false,
  },
  /**
   * 验证成功提示信息
   *
   * @type {String}
   */
  validateSuccessMessage: {
    type: String,
    default: '',
  },
  /**
   * 表单域验证错误时的提示信息
   *
   * @type {String}
   */
  error: {
    type: String,
  },
});
// props 类型
export type FormItemProps = ExtractPropTypes<typeof formItemProps>;

// emits事件类型
export const formItemEmits = {};
export type FormItemEmits = typeof formItemEmits;

// 组件实例
export type FormItemInstance = InstanceType<typeof FormItem>;

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

// item 验证
export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>;
}

// FormItemProp
export type FormItemProp = Arrayable<string>;

// item验证状态
export const formItemValidateStates = [
  '',
  'error',
  'validating',
  'success',
] as const;

// FormItemValidateState
export type FormItemValidateState = (typeof formItemValidateStates)[number];

// inject相关
export const FormItemContextKey: InjectionKey<FormItemContext> =
  Symbol('ivue-form-item');
