<template>
    <li
        :class="classes"
        v-ripple="!disabledRipple"
        @click.stop="handleOptionClick"
        @mousedown.prevent
    >
        <slot>{{ showLabel }}</slot>
    </li>
</template>

<script lang='ts'>
import {
    defineComponent,
    computed,
    onBeforeUnmount,
    getCurrentInstance,
    inject,
} from 'vue';

import ripple from '../../utils/directives/ripple';

const prefixCls = 'ivue-select-item';

export default defineComponent({
    name: 'ivue-option',
    componentName: 'ivue-select-item',
    directives: {
        ripple,
    },
    props: {
        /**
         * 启用/禁用涟漪
         *
         * @type {null}
         */
        disabledRipple: {
            type: Boolean,
            default: true,
        },
        /**
         * 是否禁用选项
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否选择当前项
         *
         * @type {Boolean}
         */
        selected: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否获取到焦点
         *
         * @type {Boolean}
         */
        isFocused: {
            type: Boolean,
            default: false,
        },
        /**
         * 渲染的 label
         *
         * @type {String, Number}
         */
        label: {
            type: [String, Number],
        },
        /**
         * 渲染的 value
         *
         * @type {String, Number}
         */
        value: {
            type: [String, Number],
            required: true,
        },
    },
    setup(props) {
        // inject
        const select: any = inject('ivue-select');

        // vm
        const { proxy } = getCurrentInstance();

        // computed

        // classes
        const classes = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-disabled`]: props.disabled,
                    [`${prefixCls}-selected`]: props.selected,
                    [`${prefixCls}-focus`]: props.isFocused,
                },
            ];
        });

        // 是否显示label
        const showLabel = computed(() => {
            return props.label ? props.label : props.value;
        });

        // 获取label
        const getLabel = computed(() => {
            return props.label || proxy.$el.textContent;
        });

        // methods

        const handleOptionClick = () => {
            select.handleOptionClick({
                value: props.value,
                label: getLabel.value,
            });
        };

        // 插入dom
        select.options.push(proxy);

        // onBeforeUnmount
        onBeforeUnmount(() => {
            // let selectedOptions = select.props.multiple ? selected : [selected];
        });


        return {
            // computed
            classes,
            showLabel,

            // methods
            handleOptionClick,
        };
    },
});
</script>
