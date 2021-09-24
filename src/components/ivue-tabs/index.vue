<template>
    <div :class="prefixCls">
        <div class="ivue-tabs-bar" ref="bar">
            <!-- 左边按钮 -->
            <transition name="fade-transition">
                <ivue-icon
                    :class="`ivue-tabs-icon ivue-tabs-icon--prev`"
                    v-show="hasArrows && prevIconVisible"
                >{{ prevIcon }}</ivue-icon>
            </transition>
            <!-- 内容 -->
            <div
                :class="tabWrapperClass"
                v-touch="{
                    start: e => overflowCheck(e, onTouchStart),
                    move: e => overflowCheck(e, onTouchMove),
                    end: e => overflowCheck(e, onTouchEnd)
                }"
                ref="wrapper"
            >
                <div :class="tabContainerClass" :style="containerStyles" ref="container">
                    <slider :color="sliderColor"></slider>
                    <slot></slot>
                </div>
            </div>
            <!-- 右边按钮 -->
            <transition name="fade-transition">
                <ivue-icon
                    :class="`ivue-tabs-icon ivue-tabs-icon--next`"
                    v-show="hasArrows && nextIconVisible"
                >{{ nextIcon }}</ivue-icon>
            </transition>
        </div>
        {{data.isOverflowing}}
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, provide, computed, ref, watch } from 'vue';

import tabsComputed from './tabs-computed';
import tabsTouch from './tabs-touch';
import IvueIcon from '../ivue-icon/index.vue';
import Slider from './slider.vue';
import Touch from '../../utils/directives/touch';

const prefixCls = 'ivue-tabs';

export default defineComponent({
    name: prefixCls,
    directives: { Touch },
    props: {
        /**
         * 导航内容居中
         *
         * @type {Boolean}
         */
        centered: {
            type: Boolean,
            default: false,
        },
        /**
         * 导航内容向右
         *
         * @type {Boolean}
         */
        right: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否显示导航栏箭头
         *
         * @type {Boolean}
         */
        showArrows: {
            type: Boolean,
            default: false,
        },
        /**
         * 右边按钮
         *
         * @type {String}
         */
        nextIcon: {
            type: String,
            default: 'chevron_right',
        },
        /**
         * 左边按钮
         *
         * @type {String}
         */
        prevIcon: {
            type: String,
            default: 'chevron_left',
        },
        /**
         * 设置一个较高的最小宽度
         *
         * @type {Boolean}
         */
        fixedTabs: {
            type: Boolean,
            default: false,
        },
        /**
         * 导航高度
         *
         * @type {String,Number}
         */
        height: {
            type: [String, Number],
            default: null,
        },
        /**
         * 滑动条颜色
         *
         * @type {String}
         */
        sliderColor: {
            type: String,
            default: 'primary',
        },
    },
    setup(props) {
        // dom

        // tabs-container
        const container = ref(null);

        // tabs-wrapper
        const wrapper = ref(null);

        // tabs-bar
        const bar = ref(null);

        // data
        const data: any = reactive<{
            tabs: Array<any>;
            isOverflowing: Boolean;
            nextIconVisible: Boolean;
            prevIconVisible: Boolean;
            scrollOffset: Number;
            startX: Number;
            widths: Object;
        }>({
            // tab导航数组
            tabs: [],
            // 导航栏是否需要滚动
            isOverflowing: false,
            // 下一个按钮显示
            nextIconVisible: false,
            // 上一个按钮显示
            prevIconVisible: false,
            // 滚动位置
            scrollOffset: 0,
            // 开始滑动x轴
            startX: 0,
            // 导航栏宽度
            widths: {
                bar: 0,
                container: 0,
                wrapper: 0,
            },
        });

        // computed
        const { hasArrows, containerStyles } = tabsComputed(props, data);

        // tab外层样式
        const tabWrapperClass = computed(() => {
            return {
                'ivue-tabs-wrapper': true,
                'ivue-tabs-wrapper--show-arrow': hasArrows.value,
            };
        });

        // tab样式
        const tabContainerClass = computed(() => {
            return {
                'ivue-tabs-container': true,
                'ivue-tabs-container--centered': props.centered,
                'ivue-tabs-container--right': props.right,
                'ivue-tabs-container--overflow': data.isOverflowing,
                'ivue-tabs-container--fixed-tabs': props.fixedTabs,
            };
        });

        // methods

        const { onTouchStart, onTouchMove, onTouchEnd } = tabsTouch(
            data,
            container,
            wrapper
        );

        // 是否可以滚动
        const overflowCheck = (e: any, fn: Function) => {
            data.isOverflowing && fn(e);
        };

        // 清除tab导航
        const unregister = (key) => {
            data.tabs = data.tabs.filter((o) => {
                return o.data.key !== key;
            });
        };

        // 获取导航宽度
        const setWidths = () => {
            const _bar = bar.value ? bar.value.clientWidth : 0;
            const _container = container.value
                ? container.value.clientWidth
                : 0;
            const _wrapper = wrapper.value ? wrapper.value.clientWidth : 0;

            data.widths = {
                bar: _bar,
                container: _container,
                wrapper: _wrapper,
            };

            console.log(data.widths);

            setOverflow();
        };

        // 设置导航栏是否滚动
        const setOverflow = () => {
            data.isOverflowing = data.widths.bar < data.widths.container;
        };

        // 监听resize
        const onResize = () => {
            setWidths();
        };

        // provide
        provide(
            'tabsGroup',
            reactive({
                data,
                unregister: unregister,
            })
        );

        // watch

        watch(
            () => data.tabs,
            (value) => {
                onResize();
            },
            {
                deep: true,
            }
        );

        return {
            prefixCls,

            // dom
            container,
            bar,
            wrapper,

            // data
            data,

            // computed
            tabWrapperClass,
            hasArrows,
            tabContainerClass,
            containerStyles,

            // methods
            overflowCheck,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            unregister,
        };
    },
    components: {
        IvueIcon,
        Slider,
    },
});
</script>
