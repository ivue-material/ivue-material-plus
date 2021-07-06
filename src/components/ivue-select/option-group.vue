<template>
    <ul :class="[`${prefixCls}-wrap`]" v-show="visible">
        <!-- 标题 -->
        <li :class="[`${prefixCls}-title`]">{{ label }}</li>
        <!-- 选项 -->
        <ul>
            <li :class="[`${prefixCls}`]">
                <slot></slot>
            </li>
        </ul>
    </ul>
</template>

<script lang='ts'>
import { defineComponent, provide, reactive, toRefs, inject, ref } from 'vue';

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
        // inject
        const select: any = inject('ivue-select');

        const visible: any = ref(true);

        // methods
        const queryChange = () => {
            visible.value = select?.options?.some(
                (option) => option.visible === true
            );
        };

        // provide
        provide(
            'ivue-select-group',
            reactive({
                ...toRefs(props),
            })
        );

        // queryChange: queryChange

        select.selectEmitter = queryChange;


        return {
            prefixCls,

            // ref
            visible
        };
    },
});
</script>
