<template>
    <div ref="breadcrumb" :class="prefixCls" :style="styles">
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import { defineComponent, computed, provide } from 'vue';

// types
import { Props, BreadcrumbContextKey } from './breadcrumb';

const prefixCls = 'ivue-breadcrumb';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 分隔符
         *
         * @type {String}
         */
        divider: {
            type: String,
            default: '/',
        },
        /**
         * 中间对齐
         *
         * @type {Boolean}
         */
        justifyCenter: {
            type: Boolean,
            default: false,
        },
        /**
         * 尾部对齐
         *
         * @type {Boolean}
         */
        justifyEnd: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: Props, { slots }) {
        // computed

        // 居中样式
        const styles = computed(() => {
            const justify = props.justifyCenter
                ? 'center'
                : props.justifyEnd
                ? 'flex-end'
                : 'flex-start';

            return {
                'justify-content': justify,
            };
        });

        // 设置分隔符
        const computedDivider = computed(() => {
            return slots.divider ? slots.divider : props.divider;
        });

        // provide
        provide(BreadcrumbContextKey, {
            props,
            divider: computedDivider.value,
        });

        return {
            prefixCls,

            // computed
            styles,
        };
    },
});
</script>
