<template>
    <div :class="prefixCls" ref="scrollbar">
        <div
            :class="wrapperClasses"
            :style="wrapperStyles"
            @scroll="handleScroll"
            ref="scrollbarContent"
        >
            <component :is="tag" :class="contentClasses" :style="contentStyle" ref="resize">
                <slot></slot>
            </component>
        </div>
    </div>
</template>

<script  lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { addUnit } from '../../utils/helpers';

// ts
import type { CSSProperties } from 'vue';

const prefixCls = 'ivue-scrollbar';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 包裹容器的自定义类名
         *
         * @type {String | Array}
         */
        wrapperClass: {
            type: [String, Array],
            default: '',
        },
        /**
         * 包裹容器的自定义样式
         *
         * @type {String | Object | Array}
         */
        wrapperStyle: {
            type: [String, Object, Array],
            default: '',
        },
        /**
         * 视图的自定义类名
         *
         * @type {String | Array}
         */
        contentClass: {
            type: [String, Array],
            default: '',
        },
        /**
         * 视图的自定义类名
         *
         * @type {String | Object | Array}
         */
        contentStyle: {
            type: [String, Object, Array],
            default: '',
        },
        /**
         * 是否使用原生滚动条样式
         *
         * @type {Boolean}
         */
        native: {
            type: Boolean,
        },
        /**
         * 滚动条高度
         *
         * @type {String | Number}
         */
        height: {
            type: [String, Number],
            default: '',
        },
        /**
         * 滚动条最大高度
         *
         * @type {String | Number}
         */
        maxHeight: {
            type: [String, Number],
            default: '',
        },
        /**
         * 视图的元素标签
         *
         * @type {String}
         */
        tag: {
            type: String,
            default: 'div',
        },
    },
    setup(props: any, { emit }) {
        // dom
        const scrollbarContent = ref<HTMLDivElement>(null);

        // computed

        // 外层样式
        const wrapperClasses = computed(() => {
            return [
                props.wrapperClass,
                `${prefixCls}-wrapper`,
                {
                    [`${prefixCls}-hidden-default`]: !props.native,
                },
            ];
        });

        // 外层样式
        const wrapperStyles = computed(() => {
            const style: CSSProperties = {};

            // 滚动条高度
            if (props.height) {
                style.height = addUnit(props.height);
            }

            // 滚动条最大高度
            if (props.maxHeight) {
                style.maxHeight = addUnit(props.maxHeight);
            }

            return [props.wrapStyle, style];
        });

        // 内容样式
        const contentClasses = computed(() => {
            return [props.contentClass, `${prefixCls}-content`];
        });

        // methods

        // 滚动
        const handleScroll = () => {
            if (scrollbarContent.value) {
                emit('scroll', {
                    scrollTop: scrollbarContent.value.scrollTop,
                    scrollLeft: scrollbarContent.value.scrollLeft,
                });
            }
        };

        return {
            prefixCls,

            // computed
            wrapperClasses,
            wrapperStyles,
            contentClasses,

            // methods
            handleScroll,
        };
    },
});
</script>
