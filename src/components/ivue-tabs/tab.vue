<template>
    <div :class="wrapClasses" v-ripple="computedRipple" ref="tab" @click="handleChange">
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    computed,
    inject,
    onMounted,
    onBeforeUnmount,
    getCurrentInstance,
    ref,
} from 'vue';

import ripple from '../../utils/directives/ripple';

// type
import { Props } from './types/tab';
import { TabsContextKey } from './types/tabs';

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
    setup(props: Props) {
        // inject
        const tabsGroup = inject(TabsContextKey);

        // vm
        const { proxy, uid } = getCurrentInstance();

        // 当前 name
        const tabName = ref<string | number>(props.name || uid);

        // computed
        const wrapClasses = computed(() => {
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
            if (tabsGroup.props.modelValue === tabName.value) {
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
            tabsGroup.unregister(tabName.value);
        });

        return {
            prefixCls,

            // data
            tabName,

            // computed
            wrapClasses,
            computedRipple,
            isActive,

            // methods
            handleChange,
        };
    },
});
</script>
