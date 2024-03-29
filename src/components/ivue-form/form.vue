<template>
  <form :class="wrapperClasses" @submit.prevent>
    <slot></slot>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  provide,
  toRefs,
  reactive,
  ref,
  watch,
} from 'vue';
import { oneOf } from '../../utils/assist';
import { isFunction } from '../../utils/helpers';
import { debugWarn } from '../../utils/error';
import { filterFields, useFormLabelWidth } from './utils';

// type
import {
  Props,
  FormContext,
  FormContextKey,
  FormValidateCallback,
  FormValidationResult,
} from './types/form';
import type {
  FormItemProp,
  Arrayable,
  FormItemContext,
} from './types/form-item';
import type { ValidateFieldsError } from 'async-validator';

const prefixCls = 'ivue-form';

export default defineComponent({
  name: prefixCls,
  props: {
    /**
     * 表单域标签的位置
     *
     * @type {String}
     */
    labelPosition: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['left', 'right', 'top']);
      },
      default: 'right',
    },
    /**
     * 错误星号的位置
     *
     * @type {String}
     */
    requireAsteriskPosition: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['left', 'right']);
      },
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
  },
  setup(props: Props, { emit }) {
    // 验证的字段
    const fields = ref<FormItemContext[]>([]);

    // computed

    // 样式
    const wrapperClasses = computed(() => [
      prefixCls,
      {
        // 表单域标签的位置
        [`${prefixCls}-label-${props.labelPosition}`]: props.labelPosition,
        // 行内表单模式
        [`${prefixCls}-inline`]: props.inline,
      },
    ]);

    // 是否可以验证
    const isValidatable = computed(() => {
      const hasModel = !!props.model;

      if (!hasModel) {
        debugWarn(prefixCls, 'model is required for validate to work.');
      }

      return hasModel;
    });

    // methods

    // 对整个表单的内容进行验证
    const validate = async (
      callback?: FormValidateCallback
    ): FormValidationResult => validateField(undefined, callback);

    // 验证具体的某个字段
    const validateField: FormContext['validateField'] = async (
      modelProps = [],
      callback
    ) => {
      // 是否是函数
      const shouldThrow = !isFunction(callback);

      try {
        // 验证字段
        const result = await useValidateField(modelProps);

        // 当结果为 false 时意味着字段不可验证
        if (result === true) {
          callback?.(result);
        }

        return result;
      } catch (error) {
        const invalidFields = error as ValidateFieldsError;

        // 当校验失败时，滚动到第一个错误表单项
        if (props.scrollToError) {
          scrollToField(Object.keys(invalidFields)[0]);
        }

        // 返回失败
        callback?.(false, invalidFields);

        return shouldThrow && Promise.reject(invalidFields);
      }
    };

    // 验证字段
    const useValidateField = async (props: Arrayable<FormItemProp> = []) => {
      // 是否可以验证
      if (!isValidatable.value) {
        return false;
      }

      // 获取验证字段
      fields.value = getValidateFields(props);

      // 都通过验证
      if (fields.value.length === 0) {
        return true;
      }

      // 验证错误的字段
      let validationErrors: ValidateFieldsError = {};

      // 循环触发item的验证
      for (const field of fields.value) {
        try {
          // item验证字段
          await field.validate('');
        } catch (error) {
          // 验证错误的字段
          validationErrors = {
            ...validationErrors,
            ...(error as ValidateFieldsError),
          };
        }
      }

      // 有验证错误的字段
      if (Object.keys(validationErrors).length === 0) {
        return true;
      }

      return Promise.reject(validationErrors);
    };

    // 获取验证字段
    const getValidateFields = (props: Arrayable<FormItemProp>) => {
      if (fields.value.length === 0) {
        return [];
      }

      // 过滤字段
      const filteredFields = filterFields(fields.value, props);

      if (!filteredFields.length) {
        debugWarn(prefixCls, 'please pass correct props!');

        return [];
      }

      return filteredFields;
    };

    // 添加验证字段
    const addField: FormContext['addField'] = (field) => {
      fields.value.push(field);
    };

    // 删除验证字段
    const removeField: FormContext['removeField'] = (field) => {
      if (field.prop) {
        fields.value.splice(fields.value.indexOf(field), 1);
      }
    };

    // 滚动到指定的字段
    const scrollToField = (prop: FormItemProp) => {
      // 当校验失败时，滚动到第一个错误表单项
      const field = filterFields(fields.value, prop)[0];

      if (field) {
        field.$el?.scrollIntoView();
      }
    };

    // 重置该表单项
    const resetFields: FormContext['resetFields'] = (properties = []) => {
      // 表单数据对象
      if (!props.model) {
        debugWarn(prefixCls, 'model is required for resetFields to work.');
        return;
      }

      // 过滤字段
      filterFields(fields.value, properties).forEach((field) =>
        field.resetField()
      );
    };

    // 清理某个字段的表单验证信息
    const clearValidate: FormContext['clearValidate'] = (props = []) => {
      // 获取需要清理的item
      filterFields(fields.value, props).forEach((field) =>
        field.clearValidate()
      );
    };

    // watch

    // 监听 rules 属性改变后立即触发一次验证
    watch(
      () => props.rules,
      () => {
        if (props.validateOnRuleChange) {
          validate().catch((err) => debugWarn(err));
        }
      }
    );

    // provide
    provide(
      FormContextKey,
      reactive({
        // props
        ...toRefs(props),
        // emit
        emit,
        // 添加验证字段
        addField,
        // 删除验证字段
        removeField,
        // 清理某个字段的表单验证信息
        clearValidate,
        // 重置该表单项
        resetFields,
        // 验证具体的某个字段
        validateField,

        // 表单宽度
        ...useFormLabelWidth(),
      })
    );

    return {
      // computed
      wrapperClasses,

      // methods
      validate,
      validateField,
      resetFields,
      scrollToField,
      clearValidate,
    };
  },
});
</script>
