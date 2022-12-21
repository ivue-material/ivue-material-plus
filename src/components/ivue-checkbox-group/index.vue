<template>
    <div :class="wrapperClasses">
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref, provide } from 'vue';

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

        return {
            // data
            currentValue,

            // computed
            wrapperClasses,
        };
    },
});
</script>
