<template>
    <form :class="wrapperClasses" @submit.prevent>
        <slot></slot>
    </form>
</template>

<script lang="ts">
import { computed, defineComponent, provide, toRefs, reactive, ref } from 'vue';
import { oneOf } from '../../utils/assist';
import { isFunction } from '../../utils/helpers';
import { debugWarn } from '../../utils/error';
import { filterFields } from './utils';

// type
import {
    Props,
    FormContext,
    FormContextKey,
    FormValidateCallback,
    FormValidationResult,
} from './types/form';
import { FormItemProp, Arrayable, FormItemContext } from './types/form-item';
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
            default: true,
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
                [`${prefixCls}-label-${props.labelPosition}`]:
                    props.labelPosition,
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
                const result = await useValidateField(modelProps);
                // When result is false meaning that the fields are not validatable
                if (result === true) {
                    callback?.(result);
                }
                return result;
            } catch (e) {
                const invalidFields = e as ValidateFieldsError;

                if (props.scrollToError) {
                    scrollToField(Object.keys(invalidFields)[0]);
                }
                callback?.(false, invalidFields);
                return shouldThrow && Promise.reject(invalidFields);
            }
        };

        // 验证字段
        const useValidateField = async (
            props: Arrayable<FormItemProp> = []
        ) => {
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

            let validationErrors: ValidateFieldsError = {};

            // 循环触发item的验证
            for (const field of fields.value) {
                try {
                    // item验证字段
                    await field.validate('');
                } catch (fields) {
                    // 验证错误的字段
                    validationErrors = {
                        ...validationErrors,
                        ...(fields as ValidateFieldsError),
                    };
                }
            }
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
            const field = filterFields(fields.value, prop)[0];

            if (field) {
                field.$el?.scrollIntoView();
            }
        };

        // 重置该表单项
        const resetFields: FormContext['resetFields'] = (properties = []) => {
            // 表单数据对象
            if (!props.model) {
                debugWarn(
                    prefixCls,
                    'model is required for resetFields to work.'
                );
                return;
            }

            // 过滤字段
            filterFields(fields.value, properties).forEach((field) =>
                field.resetField()
            );
        };

        // provide
        provide(
            FormContextKey,
            reactive({
                ...toRefs(props),
                addField,
                removeField,
                emit,
            })
        );

        return {
            // computed
            wrapperClasses,

            // methods
            validate,
            resetFields,
        };
    },
});
</script>
