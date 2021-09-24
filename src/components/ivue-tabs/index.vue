<template>
    <div :class="prefixCls">
        <div class="ivue-tabs-bar" ref="bar">
            <!-- 左边按钮 -->
            <transition name="fade-transition">
                <ivue-icon
                    :class="`ivue-tabs-icon ivue-tabs-icon--prev`"
                    v-show="hasArrows && data.prevIconVisible"
                    @click="handleScrollTo('prev')"
                >{{ prevIcon }}</ivue-icon>
            </transition>
            <!-- 内容 -->
            <div
                :class="tabWrapperClass"
                :style="tabWrapperStyle"
                v-touch="{
                    start: e => overflowCheck(e, onTouchStart),
                    move: e => overflowCheck(e, onTouchMove),
                    end: e => overflowCheck(e, onTouchEnd)
                }"
                ref="wrapper"
            >
                <div :class="tabContainerClass" :style="containerStyles" ref="container">
                    <slider
                        :sliderLeft="data.sliderLeft"
                        :sliderWidth="data.sliderWidth"
                        :color="sliderColor"
                    ></slider>
                    <slot></slot>
                </div>
            </div>
            <!-- 右边按钮 -->
            <transition name="fade-transition">
                <ivue-icon
                    :class="`ivue-tabs-icon ivue-tabs-icon--next`"
                    v-show="hasArrows && data.nextIconVisible"
                    @click="handleScrollTo('next')"
                >{{ nextIcon }}</ivue-icon>
            </transition>
        </div>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    provide,
    computed,
    ref,
    watch,
    nextTick,
} from 'vue';

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
            default: true,
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
        /**
         * 滑动条隐藏
         *
         * @type {Boolean}
         */
        hideSlider: {
            type: Boolean,
            default: false,
        },
        /**
         * 当前激活 tab 面板的 name，可以使用 v-model 双向绑定数据
         *
         * @type {String,Number,Boolean}
         */
        modelValue: {
            type: [String, Number],
            default: '',
        },
        /**
         * 调整显示箭头时设置的前后滚动的间距
         *
         * @type {Number}
         */
        arrowsMargin: {
            type: Number,
            default: 40,
        },
        /**
         * 箭头样式单位
         *
         * @type {String}
         */
        arrowsMarginUnit: {
            type: String,
            default: 'px',
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
            resizeTimeout: any;
            lazyValue: any;
            sliderLeft: Number;
            sliderWidth: Number;
        }>({
            // 激活的tab
            lazyValue: props.modelValue,
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
            // 重置时间函数
            resizeTimeout: null,
            // 滑动条位置
            sliderLeft: 0,
            // 滑动条宽度
            sliderWidth: 0,
        });

        // computed
        const { hasArrows, containerStyles, activeTab, activeIndex } =
            tabsComputed(props, data);

        // tab外层样式
        const tabWrapperClass = computed(() => {
            return {
                'ivue-tabs-wrapper': true,
                'ivue-tabs-wrapper--show-arrow': hasArrows.value,
            };
        });

        // tab外层样式
        const tabWrapperStyle = computed(() => {
            return {
                'margin-left':
                    hasArrows && data.prevIconVisible
                        ? `${props.arrowsMargin}${props.arrowsMarginUnit}`
                        : '0',
                // 'margin-right':
                //     hasArrows && data.nextIconVisible
                //         ? `${props.arrowsMargin}${props.arrowsMarginUnit}`
                //         : '',
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

        const { onTouchStart, onTouchMove, onTouchEnd, newOffset } = tabsTouch(
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

            setOverflow();
        };

        // 设置导航栏是否滚动
        const setOverflow = () => {
            data.isOverflowing = data.widths.bar < data.widths.container;
        };

        // 设置滑动条
        const callSlider = () => {
            const _activeTab = activeTab.value;

            if (props.hideSlider || !_activeTab) {
                return false;
            }

            nextTick(() => {
                if (!_activeTab || !_activeTab.$el || _activeTab.disabled) {
                    return;
                }

                data.sliderLeft = _activeTab.$el.offsetLeft;
                data.sliderWidth = _activeTab.$el.clientWidth;
            });
        };

        // 滚动导航栏
        const scrollIntoView = () => {
            const _activeTab = activeTab.value;

            if (!_activeTab) {
                return;
            }
            if (!data.isOverflowing) {
                return (data.scrollOffset = 0);
            }
            // 导航栏总共的宽度
            const totalWidth = data.widths.wrapper + data.scrollOffset;
            const { clientWidth, offsetLeft } = _activeTab.$el;

            let additionalOffset = clientWidth * 0.3;

            // item偏移宽度
            const offset = clientWidth + offsetLeft;
            const itemOffset = props.showArrows
                ? offset + (props.arrowsMargin + additionalOffset)
                : offset;

            // 如果选择最后一个选项卡，请不要添加偏移量
            if (activeIndex.value === data.tabs.length - 1) {
                additionalOffset === 0;
            }

            /* istanbul ignore else */
            if (offsetLeft < data.scrollOffset) {
                data.scrollOffset = Math.max(offsetLeft - additionalOffset, 0);
            } else if (totalWidth < itemOffset) {
                data.scrollOffset -= totalWidth - itemOffset - additionalOffset;
            }
        };

        // 检查是否有icon
        const checkIcons = () => {
            data.nextIconVisible = checkNextIcon();
            data.prevIconVisible = checkPrevIcon();
        };

        // 检查右边按钮
        const checkNextIcon = () => {
            const offset = data.scrollOffset + data.widths.wrapper;
            console.log(offset);
            return (
                data.widths.container >
                (props.showArrows ? offset - props.arrowsMargin : offset)
            );
        };

        // 检查左边按钮
        const checkPrevIcon = () => {
            return data.scrollOffset > 0;
        };

        // 点击箭头滚动
        const handleScrollTo = (direction) => {
            data.scrollOffset = newOffset(direction);
        };

        // 监听resize
        const onResize = () => {
            setWidths();

            clearTimeout(data.resizeTimeout);
            data.resizeTimeout = setTimeout(() => {
                // 设置滑动条
                callSlider();
                // 滚动导航栏
                scrollIntoView();
                // 检查是否有icon
                checkIcons();
            }, 300);
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
            tabWrapperStyle,

            // methods
            overflowCheck,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            handleScrollTo,
            unregister,
        };
    },
    components: {
        IvueIcon,
        Slider,
    },
});
</script>
