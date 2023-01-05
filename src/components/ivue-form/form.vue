<template>
    <form :class="classes">
        <slot></slot>
    </form>
</template>

<script lang="ts">
import { computed, defineComponent, provide, toRefs, reactive } from 'vue';
import { oneOf } from '../../utils/assist';

// type
import { Props, FormContextKey } from './types/form';

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
    },
    setup(props: Props) {
        // computed
        const classes = computed(() => [
            prefixCls,
            {
                [`${prefixCls}-label-${props.labelPosition}`]:
                    props.labelPosition,
            },
        ]);

        provide(
            FormContextKey,
            reactive({
                ...toRefs(props),
            })
        );

        return {
            // computed
            classes,
        };
    },
});
</script>
