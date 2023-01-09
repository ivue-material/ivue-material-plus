<template>
    <div :class="wrapperClasses" ref="formItem">
        <!-- 标签 -->
        <form-label-wrap
            :is-auto-width="labelStyle.width === 'auto'"
            :update-all="formContext?.labelWidth === 'auto'"
        >
            <component
                :class="`${prefixCls}--label`"
                :is="labelFor ? 'label' : 'div'"
                :id="labelId"
                :for="labelFor"
                :style="labelStyle"
                v-if="showLabel"
            >
                <slot name="label" :label="currentLabel">{{ currentLabel }}</slot>
            </component>
        </form-label-wrap>
        <!-- 内容 -->
        <div :class="`${prefixCls}--content`" :style="contentStyle">
            <slot></slot>
            <!-- 错误提示 -->
            <transition :name="`${prefixCls}-zoom-in-top`">
                <slot name="error" :error="validateMessage" v-if="shouldShowError">
                    <div :class="validateClasses">{{ validateMessage }}</div>
                </slot>
            </transition>
            <!-- 成功 -->
            <transition :name="`${prefixCls}-zoom-in-top`">
                <slot name="success" v-if="shouldShowSuccess">
                    <div :class="validateClasses">{{ validateSuccessMessage }}</div>
                </slot>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    ref,
    provide,
    reactive,
    toRefs,
    inject,
    onMounted,
    onBeforeUnmount,
    nextTick,
    watch,
} from 'vue';
import { isString } from '@vue/shared';
import AsyncValidator from 'async-validator';
import { refDebounced } from '@vueuse/core';
import { clone } from 'lodash-unified';

import FormLabelWrap from './form-label-wrap';
import IvueIcon from '../ivue-icon/index.vue';

import { useId } from '../../hooks';
import { addUnit } from '../../utils/dom/style';
import { isFunction } from '../../utils/helpers';
import { ensureArray } from '../../utils/arrays';
import { getProp } from '../../utils/objects';

// type
import type { CSSProperties } from 'vue';
import type { RuleItem } from 'async-validator';
import { FormContextKey, FormValidateFailure } from './types/form';
import {
    Props,
    FormItemContextKey,
    FormItemContext,
    FormItemRule,
    Arrayable,
    FormItemValidateState,
} from './types/form-item';

const prefixCls = 'ivue-form-item';

export default defineComponent({
    name: prefixCls,
    props: {
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
            type: [String, Array],
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
            default: true,
        },
        /**
         * 验证成功提示信息
         *
         * @type {String}
         */
        validateSuccessMessage: {
            type: String,
            default: 'Validate Success',
        },
        /**
         * 表单域验证错误时的提示信息
         *
         * @type {String}
         */
        error: {
            type: String,
        },
    },
    setup(props: Props, { slots }) {
        // form inject
        const formContext = inject(FormContextKey, undefined);
        // 父级item
        const parentFormItemContext = inject(FormItemContextKey, undefined);

        // 是否是嵌套的item
        const isNested = !!parentFormItemContext;

        // label id
        const labelId = useId().value;

        // ref

        // 输入框id
        const inputIds = ref<string[]>([]);
        // 验证状态
        const validateState = ref('');
        // 验证状态节流
        const validateStateDebounced = refDebounced(validateState, 100);

        // 是否重置验证
        const isResettingField = ref<boolean>(false);
        // 验证提示
        const validateMessage = ref<string>('');
        // item dom
        const formItem = ref<HTMLDivElement>();
        // 内敛值
        const initialValue = ref(undefined);

        // computed

        // class
        const wrapperClasses = computed(() => {
            return [
                prefixCls,
                {
                    // 错误提示
                    ['is-error']: validateState.value === 'error',
                    // 成功提示
                    ['is-success']:
                        validateState.value === 'success' &&
                        props.showSuccessStatus,
                    // 必填
                    ['is-required']: isRequired.value || props.required,
                    // 是否隐藏必填字段标签旁边的红色星号
                    ['is-no-asterisk']: formContext.hideRequiredAsterisk,
                },
                // 星号的位置
                formContext.requireAsteriskPosition === 'right'
                    ? 'asterisk-right'
                    : 'asterisk-left',
            ];
        });

        // 提示样式
        const validateClasses = computed(() => {
            return {
                [`${prefixCls}--error`]: shouldShowError.value,
                [`${prefixCls}--success`]: shouldShowSuccess.value,
            };
        });

        // 结果反馈图标
        const iconClasses = computed(() => {
            return [
                `${prefixCls}--icon`,
                {
                    [`${prefixCls}--icon__${validateState.value}`]:
                        validateState.value,
                },
            ];
        });

        // 属性规定 label 与哪个表单元素绑定
        const labelFor = computed(() => {
            return props.for || inputIds.value.length === 1
                ? inputIds.value[0]
                : undefined;
        });

        // 当前标签文本
        const currentLabel = computed(
            () => `${props.label || ''}${formContext?.labelSuffix || ''}`
        );

        // 标签样式
        const labelStyle = computed<CSSProperties>(() => {
            let obj = {};

            if (formContext?.labelPosition === 'top') {
                return obj;
            }

            // 添加单位
            const labelWidth = addUnit(
                props.labelWidth || formContext?.labelWidth || ''
            );

            if (labelWidth) {
                obj = {
                    width: labelWidth,
                };
            }

            return obj;
        });

        // 是否显示标签
        const showLabel = computed<boolean>(() => {
            return !!(props.label || slots.label);
        });

        // 内容样式
        const contentStyle = computed<CSSProperties>(() => {
            let obj = {};

            if (formContext?.labelPosition === 'top') {
                return obj;
            }

            // 是嵌套的item
            if (!props.label && !props.labelWidth && isNested) {
                return obj;
            }

            // 添加单位
            const labelWidth = addUnit(
                props.labelWidth || formContext?.labelWidth || ''
            );

            if (!props.label && !slots.label) {
                obj = {
                    marginLeft: labelWidth,
                };
            }

            return obj;
        });

        // 格式化验证
        const normalizedRules = computed(() => {
            const { required } = props;

            const rules: FormItemRule[] = [];

            // 当前item有设置表单验证规则
            if (props.rules) {
                rules.push(...ensureArray(props.rules));
            }

            // 获取form的验证规则
            const formRules = formContext?.rules;

            // 有验证规则 && 有 model 的键名
            if (formRules && props.prop) {
                // 获取当前item对应的规则
                const currentRules = getProp<
                    Arrayable<FormItemRule> | undefined
                >(formRules, props.prop).value;

                // 有当前item对应的规则
                if (currentRules) {
                    rules.push(...ensureArray(currentRules));
                }
            }

            // 是否为必填项
            if (required) {
                // 必填的验证
                const requiredRules = rules
                    .map((rule, index) => [rule, index] as const)
                    .filter(([rule]) => Object.keys(rule).includes('required'));

                // 有必填项
                if (requiredRules.length > 0) {
                    for (const [rule, index] of requiredRules) {
                        // 必填项
                        if (rule.required === required) {
                            continue;
                        }

                        rules[index] = {
                            ...rule,
                            required,
                        };
                    }
                }
                // 没有必填项
                else {
                    rules.push({
                        required,
                    });
                }
            }

            return rules;
        });

        // 是否需要验证
        const validateEnabled = computed(
            () => normalizedRules.value.length > 0
        );

        // model的键名转换为 string
        const propString = computed(() => {
            if (!props.prop) {
                return '';
            }

            return isString(props.prop) ? props.prop : props.prop.join('.');
        });

        // 获取该item的 model 值
        const fieldValue = computed(() => {
            // 表单数据对象
            const model = formContext?.model;

            if (!model || !props.prop) {
                return;
            }

            return getProp(model, props.prop).value;
        });

        // 显示错误提示
        const shouldShowError = computed(() => {
            return (
                // 验证状态节流
                validateStateDebounced.value === 'error' &&
                // 是否显示校验错误信息
                props.showMessage &&
                // 是否显示校验错误信息
                (formContext?.showMessage ?? true)
            );
        });

        // 显示成功提示
        const shouldShowSuccess = computed(() => {
            return (
                // 验证状态节流
                validateStateDebounced.value === 'success' &&
                // 没有错误信息
                !shouldShowError.value &&
                // item验证成功提示状态
                props.showSuccessStatus &&
                // form验证成功提示状态
                (formContext?.showSuccessStatus ?? true)
            );
        });

        // 是必填
        const isRequired = computed(() => {
            return normalizedRules.value.some((rule) => rule.required);
        });

        // 有标签
        const hasLabel = computed(() => {
            return !!(props.label || slots.label);
        });

        // methods

        // 添加输入框id
        const addInputId = (id: string) => {
            if (!inputIds.value.includes(id)) {
                inputIds.value.push(id);
            }
        };

        // 删除输入框id
        const removeInputId = (id: string) => {
            inputIds.value = inputIds.value.filter((listId) => listId !== id);
        };

        // 验证字段
        const validate: FormItemContext['validate'] = async (
            // 触发方式
            trigger,
            // 回调函数
            callback
        ) => {
            // 如果重置则跳过验证
            if (isResettingField.value || !props.prop) {
                return false;
            }

            // 是否有回调函数
            const hasCallback = isFunction(callback);

            // 不需要验证
            if (!validateEnabled.value) {
                callback?.(false);

                return false;
            }

            // 获取过滤规则
            const rules = getFilteredRule(trigger);
            if (rules.length === 0) {
                callback?.(true);
                return true;
            }

            // 验证中
            setValidationState('validating');

            // 验证规则
            return useValidate(rules)
                .then(() => {
                    callback?.(true);

                    return true as const;
                })
                .catch((err: FormValidateFailure) => {
                    const { fields } = err;

                    callback?.(false, fields);

                    // 有回调函数
                    return hasCallback ? false : Promise.reject(fields);
                });
        };

        // 设置验证状态
        const setValidationState = (state: FormItemValidateState) => {
            validateState.value = state;
        };

        // 设置验证状态为成功
        const setValidationSucceeded = () => {
            setValidationState('success');

            // 任一表单项被校验后触发
            formContext?.emit('on-validate', props.prop!, true, '');
        };

        // 设置验证状态为失败
        const setValidationFailed = (error: FormValidateFailure) => {
            const { errors, fields } = error;

            if (!errors || !fields) {
                // eslint-disable-next-line no-console
                console.error(error);
            }

            // 设置验证状态为失败
            setValidationState('error');

            // 验证提示
            validateMessage.value = errors
                ? errors?.[0]?.message ?? `${props.prop} is required`
                : '';

            // 任一表单项被校验后触发
            formContext?.emit(
                'on-validate',
                props.prop!,
                false,
                validateMessage.value
            );
        };

        // 验证规则
        const useValidate = async (rules: RuleItem[]): Promise<true> => {
            // model的键名
            const modelName = propString.value;

            // 验证规则
            const validator = new AsyncValidator({
                [modelName]: rules,
            });

            return validator
                .validate(
                    // 要验证的对象
                    {
                        [modelName]: fieldValue.value,
                    },
                    {
                        // 当指定字段的第一条校验规则产生错误时调用，
                        // 不再处理同字段的校验规则。
                        // true表示所有字段
                        firstFields: true,
                    }
                )
                .then(() => {
                    // 设置验证状态为成功
                    setValidationSucceeded();

                    return true as const;
                })
                .catch((err: FormValidateFailure) => {
                    // 设置验证状态为失败
                    setValidationFailed(err as FormValidateFailure);

                    return Promise.reject(err);
                });
        };

        // 获取过滤规则
        const getFilteredRule = (trigger: string) => {
            const rules = normalizedRules.value;

            return rules
                .filter((rule) => {
                    // 验证逻辑的触发方式
                    if (!rule.trigger || !trigger) {
                        return true;
                    }

                    // 验证逻辑的触发方式
                    if (Array.isArray(rule.trigger)) {
                        return rule.trigger.includes(trigger);
                    } else {
                        return rule.trigger === trigger;
                    }
                })
                .map(({ trigger, ...rule }): RuleItem => rule);
        };

        // 对该表单项进行重置
        const resetField: FormItemContext['resetField'] = async () => {
            const model = formContext?.model;

            if (!model || !props.prop) {
                return;
            }

            // 获取当前item对应的规则
            const computedValue = getProp(model, props.prop);

            // 防止验证被触发
            isResettingField.value = true;

            // 重置的时候重新赋值给props
            computedValue.value = clone(initialValue.value);

            // nextTick
            await nextTick();

            // 清除验证
            clearValidate();

            // 是否重置验证
            isResettingField.value = false;
        };

        // 清除验证
        const clearValidate: FormItemContext['clearValidate'] = () => {
            // 清除验证
            setValidationState('');

            // 验证提示
            validateMessage.value = '';

            // 是否重置验证
            isResettingField.value = false;
        };

        // provide
        const context: FormItemContext = reactive({
            ...toRefs(props),
            $el: formItem,
            inputIds,
            addInputId,
            removeInputId,
            validate,
            resetField,
            clearValidate,
            hasLabel,
        });

        // provide
        provide(FormItemContextKey, context);

        // onMounted
        onMounted(() => {
            if (props.prop) {
                // 添加验证字段
                formContext?.addField(context);
                // 保存当前 item 的值
                initialValue.value = clone(fieldValue.value);
            }
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            formContext?.removeField(context);
        });

        // watch

        // 监听表单域验证错误时的提示信息
        watch(
            () => props.error,
            (value) => {
                // 验证提示
                validateMessage.value = value || '';

                // 设置验证状态
                setValidationState(value ? 'error' : '');
            },
            {
                immediate: true,
            }
        );

        return {
            prefixCls,

            // inject
            formContext,

            // data
            validateMessage,
            validateState,
            labelId,

            // computed
            wrapperClasses,
            validateClasses,
            iconClasses,
            labelStyle,
            contentStyle,
            currentLabel,
            labelFor,
            showLabel,
            shouldShowError,
            shouldShowSuccess,
            hasLabel,

            // methods
            addInputId,
            removeInputId,
            resetField,
            clearValidate,
            validate,
        };
    },
    components: {
        FormLabelWrap,
        IvueIcon,
    },
});
</script>
