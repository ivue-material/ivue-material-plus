import { isBoolean } from '@vueuse/core';
import { isArray, isString } from '@vue/shared';
import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type { ValidateFieldsError, ValidateError } from 'async-validator';

import type Form from './form.vue';
import type { FormItemProp } from './form-item';

// props
export const formProps = buildProps({
  /**
   * 表单域标签的位置
   *
   * @type {String}
   */
  labelPosition: {
    type: String,
    values: ['left', 'right', 'top'],
    default: 'right',
  },
  /**
   * 错误星号的位置
   *
   * @type {String}
   */
  requireAsteriskPosition: {
    type: String,
    values: ['left', 'right'],
    default: 'left',
  },
  /**
   * 表单域标签的后缀
   *
   * @type {String}
   */
  labelSuffix: {
    type: String,
    default: '',
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
   * 行内表单模式
   *
   * @type {Boolean}
   */
  inline: {
    type: Boolean,
  },
  /**
   * 表单数据对象
   *
   * @type {Object}
   */
  model: {
    type: Object,
  },
  /**
   * 表单验证规则
   *
   * @type {Object}
   */
  rules: {
    type: Object,
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
   * 是否隐藏必填字段标签旁边的红色星号
   *
   * @type {Boolean}
   */
  hideRequiredAsterisk: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否在 rules 属性改变后立即触发一次验证
   *
   * @type {Boolean}
   */
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否禁用该表单内的所有组件
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 当校验失败时，滚动到第一个错误表单项
   *
   * @type {Boolean}
   */
  scrollToError: {
    type: Boolean,
  },
} as const);
// props 类型
export type FormProps = ExtractPropTypes<typeof formProps>;

// emits事件类型
export const formEmits = {
  'on-validate': (prop: FormItemProp, isValid: boolean, message: string) =>
    (isArray(prop) || isString(prop)) &&
    isBoolean(isValid) &&
    isString(message),
};
export type FormEmits = typeof formEmits;

// 组件实例
export type FormInstance = InstanceType<typeof Form>;

// FormValidateCallback
export type FormValidateCallback = (
  // 是否通过验证
  isValid: boolean,
  // 无效字段
  invalidFields?: ValidateFieldsError
) => void;

// 对整个表单的内容进行验证
export type FormValidationResult = Promise<boolean>;

// 表单验证失败
export interface FormValidateFailure {
  errors: ValidateError[] | null;
  fields: ValidateFieldsError;
}
