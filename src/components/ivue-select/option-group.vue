<template>
    <li :class="[`${prefixCls}-wrap`]">
        <!-- 标题 -->
        <div :class="[`${prefixCls}-title`]">{{ label }}</div>
        <!-- 选项 -->
        <ul>
            <li :class="[`${prefixCls}`]">
                <slot></slot>
            </li>
        </ul>
    </li>
</template>

<script lang='ts'>
import { defineComponent, provide, reactive, toRefs } from 'vue';

const prefixCls = 'ivue-select-group';

export default defineComponent({
    name: 'ivue-option-group',
    props: {
        /**
         * 选项grop标题
         *
         * @type {String}
         */
        label: {
            type: String,
            default: '',
        },
        /**
         * 是否禁用当选项
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        provide(
            'ivue-select-group',
            reactive({
                ...toRefs(props),
            })
        );

        return {
            prefixCls,
        };
    },
});
</script>
