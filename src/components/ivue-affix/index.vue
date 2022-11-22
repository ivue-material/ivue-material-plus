<template>
    <div ref="wrapper">
        <div ref="content" :class="classes" :style="data.styles">
            <slot></slot>
        </div>
        <div v-show="data.slot" :style="data.slotStyle"></div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, computed, reactive } from 'vue';
import { useEventListener } from '@vueuse/core';

import {Props, Data} from './ivue-affix';

const prefixCls = 'ivue-affix';

export default defineComponent({
    name: prefixCls,
    // 声明事件
    emits: ['on-change'],
    props: {
        /**
         * 距离窗口顶部达到指定偏移量后触发
         *
         * @type {Number}
         */
        offsetTop: {
            type: Number,
            default: 0,
        },
        /**
         * 距离窗口底部达到指定偏移量后触发
         *
         * @type {Number}
         */
        offsetBottom: {
            type: Number,
        },
        /**
         * addEventListener 原生的 useCapture 选项
         *
         * @type {Boolean}
         */
        useCapture: {
            type: Boolean,
            default: false,
        },
    },
    // 组合式 API
    setup(props: Props, { emit }) {
        // data
        const data = reactive<Data>({
            // 组件状态是否开启固定
            affix: false,
            // slot 是否开启
            slot: false,
            // styles
            styles: {},
            // slotStyle
            slotStyle: {},
        });

        // ref = wrapper
        const wrapper = ref<HTMLDivElement>();
        // ref = content
        const content = ref<HTMLDivElement>();

        // computed

        // 滚动状态值
        const offsetType = computed(() => {
            let type = 'top';

            // 是否有底部偏移量
            if (props.offsetBottom >= 0) {
                type = 'bottom';
            }

            return type;
        });

        // 是否添加class设置 fixed
        const classes = computed(() => {
            return [
                {
                    [`${prefixCls}`]: data.affix,
                },
            ];
        });

        // method

        // 获取滚动数值
        const getScroll = (target: Window, top: boolean) => {
            const prop = top ? 'pageYOffset' : 'pageXOffset';
            const method = top ? 'scrollTop' : 'scrollLeft';

            // 在 window 中查找参数 pageYOffset || pageXOffset
            let ret = target[prop];

            // 如果 没有 pageYOffset || pageXOffset
            if (typeof ret !== 'number') {
                // 返回 scrollTop || scrollLeft
                ret = window.document.documentElement[method];
            }

            return ret;
        };

        // 获取元素坐标
        const getOffset = (element: HTMLDivElement) => {
            // 方法返回元素的大小及其相对于视口的位置
            const rect = element.getBoundingClientRect();

            // 滚动条的垂直位置
            const scrollTop = getScroll(window, true);
            // 滚动条的水平位置
            const scrollLeft = getScroll(window, false);

            const docEl = window.document.body;
            // 视口高度
            const clientTop = docEl.clientTop || 0;
            //视口宽度
            const clientLeft = docEl.clientTop || 0;

            return {
                // 元素上边到视窗上边的距离 + 滚动条的垂直位置 - 顶部边框的宽度(顶部边框的宽度)
                top: rect.top + scrollTop - clientTop,
                // 元素左边到视窗左边的距离 + 滚动条的水平位置 - 元素的左边框的宽度(不包括左外边距和左内边距)
                left: rect.left + scrollLeft - clientLeft,
            };
        };

        // 监听滚动
        const handleScroll = () => {
            // 获取垂直滚动高度
            const scrollTop = getScroll(window, true);

            // 获取元素坐标
            const elOffset = getOffset(wrapper.value);

            // window高度
            const windowHeight = window.innerHeight;

            // 元素高度
            const elHeight = content.value.offsetHeight;

            // 固定在头部 Top
            if (
                // 元素的顶部 减去 需要到达指定位置的数值 < window 的滚动高度 向上滚动
                elOffset.top - props.offsetTop < scrollTop &&
                // 固定头部
                offsetType.value === 'top' &&
                // 没有开启固定状态
                !data.affix
            ) {
                // 开启固定状态
                data.affix = true;

                // slot样式
                data.slotStyle = {
                    width: `${content.value.clientWidth}px`,
                    height: `${content.value.clientHeight}px`,
                };

                data.slot = true;

                // 组样式
                data.styles = {
                    top: `${props.offsetTop}px`,
                    left: `${elOffset.left}px`,
                    width: `${wrapper.value.offsetWidth}px`,
                };

                // 在固定状态发生改变时触发
                emit('on-change', true);
            }
            // 头部取消固定顶部
            else if (
                // 没有达到指定位置的数值
                elOffset.top - props.offsetTop > scrollTop &&
                // 固定头部
                offsetType.value == 'top' &&
                // 开启固定状态
                data.affix
            ) {
                data.slot = false;
                data.slotStyle = {};
                data.affix = false;
                data.styles = {};

                // 在固定状态发生改变时触发
                emit('on-change', false);
            }

            // 固定在底部 Bottom
            if (
                // 元素的顶部 + 距离窗口底部达到指定偏移量后触发 + 元素高度 > 获取垂直滚动高度 + window高度
                elOffset.top + props.offsetBottom + elHeight >
                    scrollTop + windowHeight &&
                // 固定底部
                offsetType.value == 'bottom' &&
                // 没有开启固定状态
                !data.affix
            ) {
                data.affix = true;
                data.styles = {
                    bottom: `${props.offsetBottom}px`,
                    left: `${elOffset.left}px`,
                    width: `${elOffset.top}px`,
                };

                // 在固定状态发生改变时触发
                emit('on-change', true);
            }
            // 头部取消固定底部
            else if (
                // 元素的顶部 + 距离窗口底部达到指定偏移量后触发 + 元素高度 < 获取垂直滚动高度 + window高度
                elOffset.top + props.offsetBottom + elHeight <
                    scrollTop + windowHeight &&
                // 固定底部
                offsetType.value == 'bottom' &&
                // 开启固定状态
                data.affix
            ) {
                data.affix = false;
                data.styles = {};

                // 在固定状态发生改变时触发
                emit('on-change', false);
            }
        };

        // mounted
        onMounted(() => {
            // 初始化
            handleScroll();

            // 监听滚动和缩放事件
            useEventListener(window, 'resize', handleScroll, props.useCapture);
            useEventListener(window, 'scroll', handleScroll, props.useCapture);
        });

        return {
            data,
            classes,
            offsetType,
            wrapper,
            content,
        };
    },
});
</script>
