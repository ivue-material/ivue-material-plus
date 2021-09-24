<template>
    <div :class="wrapClass" v-ripple="computedRipple" ref="tab">
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
         * key
         *
         * @type {String}
         */
        key: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        // inject
        const tabsGroup: any = inject('tabsGroup');

        // vm
        const { proxy, uid } = getCurrentInstance();

        // data
        const data: any = reactive<{
            isActive: boolean;
            key: String | number;
        }>({
            // 是否激活
            isActive: false,
            // 当前key
            key: props.key || uid,
        });

        // computed
        const wrapClass = computed(() => {
            return [
                {
                    [prefixCls]: true,
                    [`${prefixCls}-disabled`]: props.disabled,
                    [`${prefixCls}-active`]: data.isActive,
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

        // onMounted
        onMounted(() => {
            // 插入dom
            tabsGroup.data.tabs.push(proxy);
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            tabsGroup.unregister(data.key);
        });

        return {
            prefixCls,

            // data
            data,

            // computed
            wrapClass,
            computedRipple,
        };
    },
});
</script>
