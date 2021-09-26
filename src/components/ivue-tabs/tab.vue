<template>
    <div :class="wrapClass" v-ripple="computedRipple" ref="tab" @click="handleChange">
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    computed,
    reactive,
    inject,
    onMounted,
    onBeforeUnmount,
    getCurrentInstance,
} from 'vue';

import ripple from '../../utils/directives/ripple';

const prefixCls = 'ivue-tabs-tab';

export default defineComponent({
    name: 'ivue-tab',
    directives: {
        ripple,
    },
    props: {
        /**
         * 是否禁用当前项
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否禁用涟漪效果
         *
         * @type {Boolean}
         */
        rippleDisabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否居中涟漪效果
         *
         * @type {Boolean}
         */
        rippleCentered: {
            type: Boolean,
            default: false,
        },
        /**
         * name
         *
         * @type {String}
         */
        name: {
            type: String,
            default: '',
        },
    },
    setup(props: any) {
        // inject
        const tabsGroup: any = inject('tabsGroup');

        // vm
        const { proxy, uid } = getCurrentInstance();

        // data
        const data: any = reactive<{
            name: String | number;
        }>({
            // 当前 name
            name: props.name || uid,
        });

        // computed
        const wrapClass = computed(() => {
            return [
                {
                    [prefixCls]: true,
                    [`${prefixCls}-disabled`]: props.disabled,
                    [`${prefixCls}-active`]: isActive.value,
                },
            ];
        });

        // 涟漪效果
        const computedRipple = computed(() => {
            if (props.rippleCentered) {
                return {
                    center: true,
                };
            } else if (props.rippleDisabled) {
                return false;
            }

            return true;
        });

        // 激活
        const isActive = computed(() => {
            if (tabsGroup.props.modelValue === data.name) {
                return true;
            }

            return false;
        });

        // methods

        // 点击当前项
        const handleChange = () => {
            tabsGroup.tabNavClick(proxy);
        };

        // onMounted
        onMounted(() => {
            // 插入dom
            tabsGroup.data.tabs.push(proxy);
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            tabsGroup.unregister(data.name);
        });

        return {
            prefixCls,

            // data
            data,

            // computed
            wrapClass,
            computedRipple,
            isActive,

            // methods
            handleChange,
        };
    },
});
</script>
