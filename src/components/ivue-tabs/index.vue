<template>
    <div :class="prefixCls">
        <!-- 头部 -->
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
                :class="tabWrapperClasses"
                :style="tabWrapperStyles"
                v-touch="{
                    start: e => overflowCheck(e, onTouchStart),
                    move: e => overflowCheck(e, onTouchMove),
                    end: e => overflowCheck(e, onTouchEnd)
                }"
                ref="wrapper"
            >
                <div :class="tabContainerClasses" :style="containerStyles" ref="container">
                    <slider
                        :sliderLeft="data.sliderLeft"
                        :sliderWidth="data.sliderWidth"
                        :color="sliderColor"
                    ></slider>
                    <slot name="header"></slot>
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
        <!-- 内容 -->
        <div
            class="ivue-tabs-items"
            v-touch="{
                left: e => handleSwipeItem('next'),
                right: e => handleSwipeItem('prev'),
            }"
        >
            <slot name="content"></slot>
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
    onMounted,
    watchEffect,
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
    // 声明事件
    emits: ['update:modelValue'],
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
         * @type {Number | String}
         */
        arrowsMargin: {
            type: [Number, String],
            default: 40,
        },
    },
    setup(props: any, { emit }) {
        // dom

        // tabs-container
        const container = ref<any>(null);

        // tabs-wrapper
        const wrapper = ref<any>(null);

        // tabs-bar
        const bar = ref<any>(null);

        // data
        const data: any = reactive<{
            tabs: Array<any>;
            tabsItem: Array<any>;
            isOverflowing: boolean;
            nextIconVisible: boolean;
            prevIconVisible: boolean;
            scrollOffset: number;
            startX: number;
            widths: any;
            resizeTimeout: any;
            sliderLeft: number;
            sliderWidth: number;
            isBooted: boolean;
        }>({
            // tab导航数组
            tabs: [],
            // tab内容数组
            tabsItem: [],
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
            // 控制内容初始化动画效果
            isBooted: false,
        });

        // onMounted
        onMounted(() => {
            initDate();
        });

        // computed
        const { hasArrows, containerStyles, activeTab, activeIndex } =
            tabsComputed(props, data);

        // tab外层样式
        const tabWrapperClasses = computed(() => {
            return {
                'ivue-tabs-wrapper': true,
                'ivue-tabs-wrapper--show-arrow': hasArrows.value,
            };
        });

        // tab外层样式
        const tabWrapperStyles = computed(() => {
            const regexp = new RegExp(/[a-zA-Z]/g);

            // 是否有单位
            const isUnit = regexp.test(props.arrowsMargin);

            return {
                'margin-left': hasArrows
                    ? !isUnit
                        ? `${props.arrowsMargin}px`
                        : props.arrowsMargin
                    : '',
                'margin-right': hasArrows
                    ? !isUnit
                        ? `${props.arrowsMargin}px`
                        : props.arrowsMargin
                    : '',
            };
        });

        // tab样式
        const tabContainerClasses = computed(() => {
            return {
                'ivue-tabs-container': true,
                'ivue-tabs-container--centered': props.centered,
                'ivue-tabs-container--right': props.right,
                'ivue-tabs-container--overflow': data.isOverflowing,
                'ivue-tabs-container--fixed-tabs': props.fixedTabs,
            };
        });

        // methods

        const {
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            newOffset,
            handleSwipeItem,
        } = tabsTouch(data, container, wrapper, activeIndex);

        // 初始化
        const initDate = () => {
            nextTick(() => {
                // 滚动导航栏
                scrollIntoView();
            });

            callSlider();
        };

        // 是否可以滚动
        const overflowCheck = (e: any, fn: any) => {
            data.isOverflowing && fn(e);
        };

        // 清除tab导航
        const unregister = (name) => {
            data.tabs = data.tabs.filter((o) => {
                return o.data.name !== name;
            });
        };

        // 清除tab item
        const unregisterItems = (name) => {
            data.tabsItem = data.tabsItem.filter((o) => {
                return o.data.name !== name;
            });
        };

        // 获取导航宽度
        const setWidths = () => {
            const _bar = bar.value ? bar.value?.clientWidth : 0;
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

            const activeTabBounding = _activeTab.$el.getBoundingClientRect();
            const navScrollBounding = wrapper.value.getBoundingClientRect();
            const navBounding = container.value.getBoundingClientRect();

            const currentOffset = data.scrollOffset;
            let newOffset = currentOffset;

            if (
                parseInt(navBounding.right) < parseInt(navScrollBounding.right)
            ) {
                newOffset =
                    container.value.offsetWidth -
                    parseInt(navScrollBounding.width);
            }

            if (
                parseInt(activeTabBounding.left) <
                parseInt(navScrollBounding.left)
            ) {
                newOffset =
                    currentOffset -
                    (parseInt(navScrollBounding.left) -
                        parseInt(activeTabBounding.left));
            } else if (
                parseInt(activeTabBounding.right) >
                parseInt(navScrollBounding.right)
            ) {
                newOffset =
                    currentOffset +
                    parseInt(activeTabBounding.right) -
                    parseInt(navScrollBounding.right);
            }

            if (currentOffset !== newOffset) {
                const maxOffset = data.widths.container - data.widths.wrapper;
                const isOffset = newOffset + data.widths.wrapper;
                const widthsContainer = data.widths.container;

                if (isOffset > widthsContainer) {
                    newOffset = maxOffset;
                }

                data.scrollOffset = newOffset;
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

            if (offset === data.widths.container) {
                return false;
            }

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

        // 导航点击
        const tabNavClick = (tab) => {
            // 判断禁用
            if (tab.disabled) {
                return;
            }

            updateValue(tab.data.name);
        };

        // 更新当前激活的导航
        const updateValue = (value) => {
            // updated v-model
            emit('update:modelValue', value);
        };

        // 更新激活的item
        const updateItems = (reverse) => {
            for (let index = data.tabsItem.length; --index >= 0; ) {
                data.tabsItem[index].handleToggle(
                    activeIndex.value === index,
                    reverse,
                    data.isBooted
                );
            }

            data.isBooted = true;
        };

        // watch

        // 监听导航滑动
        watch(
            () => data.scrollOffset,
            () => {
                // 是否开启按钮
                if (hasArrows.value) {
                    data.nextIconVisible = checkNextIcon();
                    data.prevIconVisible = checkPrevIcon();
                }
            }
        );

        // 监听激活项
        watch(
            () => props.modelValue,
            () => {
                initDate();
            }
        );

        // 监听设置一个较高的最小宽度
        watch(
            () => props.fixedTabs,
            () => {
                callSlider();
            }
        );

        // 监听激活的index
        watch(
            () => activeIndex.value,
            (current, previous) => {
                let reverse = current < previous;

                updateItems(reverse);
            }
        );

        // provide
        provide(
            'tabsGroup',
            reactive({
                props,
                data,
                unregister: unregister,
                tabNavClick: tabNavClick,
                unregisterItems: unregisterItems,
            })
        );

        // watch

        // 同步监听 tab导航数组
        watchEffect(() => {
            if (data.tabs) {
                onResize();
            }
        });

        return {
            prefixCls,

            // dom
            container,
            bar,
            wrapper,

            // data
            data,

            // computed
            tabWrapperClasses,
            hasArrows,
            tabContainerClasses,
            containerStyles,
            tabWrapperStyles,

            // methods
            overflowCheck,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            handleScrollTo,
            unregister,
            handleSwipeItem,
            tabNavClick,
        };
    },
    components: {
        IvueIcon,
        Slider,
    },
});
</script>
