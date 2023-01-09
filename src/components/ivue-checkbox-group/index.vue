<template>
    <div :class="wrapperClasses" :id="inputId">
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref, provide, watch } from 'vue';

import { useFormItem, useFormItemInputId } from '../../hooks';
import { debugWarn } from '../../utils/error';

// type
import { CheckboxContextKey, Props } from './types/checkbox-group';

const prefixCls = 'ivue-checkbox-group';

export default defineComponent({
    name: prefixCls,
    emits: ['update:modelValue', 'on-change'],
    props: {
        /**
         * 指定当前选中的项目数据。可以使用 v-model 双向绑定数据
         *
         * @type {Array}
         */
        modelValue: {
            type: Array,
            default: () => [],
        },
        /**
         * 输入时是否触发表单的校验
         *
         * @type {Boolean}
         */
        validateEvent: {
            type: Boolean,
            default: true,
        },
    },
    setup(props: Props, { emit }) {
        // 当前值
        const currentValue = ref<any[]>(props.modelValue);

        // computed

        // 外部样式
        const wrapperClasses = computed(() => {
            return [`${prefixCls}`];
        });

        // methods

        // 改变值
        const handleChange = (value: (string | number)[]) => {
            currentValue.value = value;

            emit('update:modelValue', value);
            emit('on-change', value);
        };

        // provide
        provide(CheckboxContextKey, {
            name: prefixCls,
            props,
            handleChange,
        });

        // 设置表单对应的输入框id
        const { formItem } = useFormItem();

        // 输入框id
        const { inputId } = useFormItemInputId(props, {
            formItemContext: formItem,
        });

        // watch

        // 监听modelValue
        watch(
            () => props.modelValue,
            () => {
                // 输入时是否触发表单的校验
                if (props.validateEvent) {
                    formItem?.validate('change').catch((err) => debugWarn(err));
                }
            }
        );

        return {
            // data
            currentValue,
            inputId,

            // computed
            wrapperClasses,
        };
    },
});
</script>
