<template>
    <div
        :class="wrapperClasses"
        ref="wrapper"
        @mouseenter.stop="handleMouseEnter"
        @mouseleave.stop="handleMouseLeave"
    >
        <div :class="`${prefixCls}-content`" :style="contentStyles">
            <!-- 左按钮 -->
            <transition v-if="arrowDisplay" name="fade">
                <ivue-button
                    :class="[`${prefixCls}-arrow left`]"
                    flat
                    icon
                    @mouseenter="handleArrowEnter('left')"
                    @mouseleave="handleArrowLeave"
                    @click="handleArrowClick(data.activeIndex - 1)"
                    v-show="(arrow === 'always' || data.hover) && (loop || data.activeIndex > 0)"
                >
                    <slot name="leftArrow">
                        <ivue-icon>{{ leftArrow }}</ivue-icon>
                    </slot>
                </ivue-button>
            </transition>

            <!-- slot -->
            <slot></slot>

            <!-- 右按钮 -->
            <transition v-if="arrowDisplay" name="fade">
                <ivue-button
                    :class="[`${prefixCls}-arrow right`]"
                    flat
                    icon
                    @mouseenter="handleArrowEnter('right')"
                    @mouseleave="handleArrowLeave"
                    @click="handleArrowClick(data.activeIndex + 1)"
                    v-show="(arrow === 'always' || data.hover) && (loop || data.activeIndex < data.items.length - 1)"
                >
                    <slot name="rightArrow">
                        <ivue-icon>{{ rightArrow }}</ivue-icon>
                    </slot>
                </ivue-button>
            </transition>
        </div>
        <!-- 导航器 -->
        <ul :class="dotsClasses">
            <li
                v-for="(item, index) in data.items"
                :class="[
                    `${prefixCls}-dots--dot`,
                    {
                        [`${prefixCls}-dots--active`]: index === data.activeIndex,
                    }
                ]"
                @mouseenter="handleThrottleDotHover(index)"
                @click.stop="handleDotClick(index)"
                :key="index"
            >
                <button
                    type="button"
                    :class="[
                        `${prefixCls}-dots--button`,
                        {
                            [`${prefixCls}-dots--radius`]: radiusDot
                        },
                    ]"
                >
                    <span :class="`${prefixCls}-dots--label`">{{ item.props.label }}</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang='ts'>
import {
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    provide,
    reactive,
    ref,
    shallowRef,
    watch,
} from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { isString } from '@vue/shared';

import { throttle } from 'lodash-unified';

import { oneOf } from '../../utils/assist';

// ts
import { CarouselItemContext } from './carousel';
import { CarouselContextKey } from '../ivue-carousel-item/carousel-item';

const prefixCls = 'ivue-carousel';

/* eslint-disable */
export default defineComponent({
    name: prefixCls,
    emits: ['on-change'],
    props: {
        /**
         * carousel 的类型
         *
         * @type {String}
         */
        type: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['card']);
            },
        },
        /**
         * 展示的方向
         *
         * @type {String}
         */
        direction: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['vertical', 'horizontal']);
            },
            default: 'horizontal',
        },
        /**
         * 导航器竖向方向
         *
         * @type {String}
         */
        verticalDotsDirection: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['left', 'right']);
            },
            default: 'left',
        },
        /**
         * carousel 的高度
         *
         * @type {String}
         */
        height: {
            type: String,
        },
        /**
         * 是否循环显示
         *
         * @type {Boolean}
         */
        loop: {
            type: Boolean,
            default: true,
        },
        /**
         * 初始状态激活的幻灯片的索引，从 0 开始
         *
         * @type {Number}
         */
        initialIndex: {
            type: Number,
            default: 0,
        },
        /**
         * 左箭头图标
         *
         * @type {String}
         */
        leftArrow: {
            type: String,
            default: 'keyboard_arrow_left',
        },
        /**
         * 右箭头图标
         *
         * @type {String}
         */
        rightArrow: {
            type: String,
            default: 'keyboard_arrow_right',
        },
        /**
         * 切换箭头显示时机
         *
         * @type {String}
         *
         * hover（悬停），always（一直显示），never（不显示）
         */
        arrow: {
            type: String,
            default: 'always',
            validator(value: string) {
                return oneOf(value, ['hover', 'always', 'never']);
            },
        },
        /**
         * 指示器的位置，可选值为 inside （内部），outside（外部），none（不显示）
         *
         * @type {String}
         */
        dots: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['inside', 'outside', 'none']);
            },
            default: 'inside',
        },
        /**
         * 是否显示圆形指示器
         *
         * @type {Boolean}
         */
        radiusDot: {
            type: Boolean,
            default: false,
        },
        /**
         * 节流时间
         *
         * @type {Number}
         */
        throttleTime: {
            type: Number,
            default: 300,
        },
        /**
         * 指示器的触发方式
         *
         * @type {String}
         */
        trigger: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['hover', 'click']);
            },
            default: 'click',
        },
        /**
         * 是否自动切换
         *
         * @type {Boolean}
         */
        autoplay: {
            type: Boolean,
            default: false,
        },
        /**
         * 自动切换的时间间隔，单位为毫秒
         *
         * @type {Number}
         */
        interval: {
            type: Number,
            default: 3000,
        },
        /**
         * 鼠标悬浮时暂停自动切换
         *
         * @type {Boolean}
         */
        pauseOnHover: {
            type: Boolean,
            default: false,
        },
        /**
         * 卡片缩放大小
         *
         * @type {Number}
         */
        cardScale: {
            type: Number,
            default: 0.83,
        },
    },
    setup(props: any, { emit }) {
        // dom

        // wrapper
        const wrapper = ref<HTMLDivElement>();

        // data
        const data: any = reactive<{
            items: Array<CarouselItemContext>;
            activeIndex: number;
            hover: boolean;
            timer: ReturnType<typeof setInterval> | null;
            contentHeight: number;
        }>({
            /**
             * 选项数量
             *
             * @type {Array}
             */
            items: [],
            /**
             * 激活的选项
             *
             * @type {Number}
             */
            activeIndex: -1,
            /**
             * 鼠标进入
             *
             * @type {Boolean}
             */
            hover: false,
            /**
             * setInterval
             *
             * @type  {Function}
             */
            timer: null,
            /**
             * 内容高度
             *
             * @type {Number}
             */
            contentHeight: 0,
        });

        // computed

        // 外层样式
        const wrapperClasses = computed(() => {
            return [
                prefixCls,
                {
                    // 展示的方向
                    [`${prefixCls}-${props.direction}`]: true,
                    // 卡片类型
                    [`${prefixCls}-card`]: isCardType.value,
                },
            ];
        });

        // 内容样式
        const contentStyles = computed(() => {
            // 高度auto
            if (props.height === 'auto') {
                return {
                    height: `${data.contentHeight}px`,
                };
            }

            return {
                height: props.height,
            };
        });

        // 是否是垂直
        const isVertical = computed(() => {
            return props.direction === 'vertical';
        });

        // 是否是卡片类型
        const isCardType = computed(() => {
            return props.type === 'card';
        });

        // 按钮禁用
        const arrowDisplay = computed(() => {
            return props.arrow !== 'never' && !isVertical.value;
        });

        // dots 样式
        const dotsClasses = computed(() => {
            return [
                `${prefixCls}-dots`,
                // 指示器的位置
                `${prefixCls}-dots--${props.dots}`,
                {
                    // 指示器文字
                    [`${prefixCls}-dots--labels`]: hasLabel.value,
                    // 指示器竖向
                    [`${prefixCls}-dots--vertical`]: isVertical.value,
                    // 指示器竖向时方向位置
                    [`${prefixCls}-dots--${props.verticalDotsDirection}`]:
                        isVertical.value,
                    // 卡片类型指示器使用 outside
                    [`${prefixCls}-dots--outside`]:
                        isCardType.value && !isVertical.value,
                },
            ];
        });

        // 该幻灯片所对应指示器的文本
        const hasLabel = computed(() => {
            return data.items.some(
                (item) => item.props.label.toString().length > 0
            );
        });

        // methods

        // 激活选项
        const setActiveItem = (index: number | string) => {
            // index 是 字符串
            if (isString(index)) {
                // 通过幻灯片的名字查找下标
                const filteredItems = data.items.filter(
                    (item) => item.props.name === index
                );

                // 过滤选项获取对应的index
                if (filteredItems.length > 0) {
                    index = data.items.indexOf(filteredItems[0]);
                }
            }

            // index
            index = Number(index);

            // 是否是整数
            if (Number.isNaN(index) || index !== Math.floor(index)) {
                console.warn('index must be integer');

                return;
            }

            // 选项长度
            const itemsLength = data.items.length;

            // 之前激活的下标
            const oldIndex = data.activeIndex;

            // 指向最后一个下标
            if (index < 0) {
                data.activeIndex = props.loop ? itemsLength - 1 : 0;
            }
            // 指向最后一个
            else if (index >= itemsLength) {
                data.activeIndex = props.loop ? 0 : itemsLength - 1;
            }
            // 其他
            else {
                data.activeIndex = index;
            }

            // 上一个下标 === 当前激活的下标
            if (oldIndex === data.activeIndex) {
                // 重置选项位置
                resetItemPosition(oldIndex);
            }
        };

        // 添加选项
        const addItem = (item: CarouselItemContext) => {
            data.items.push(item);
        };

        // 删除选项
        const removeItem = (uid?: number) => {
            const index = data.items.findIndex((item) => item.uid === uid);

            // 删除
            if (index !== -1) {
                data.items.splice(index, 1);

                // 设置下一个激活选项
                if (data.activeIndex === index) {
                    next();
                }
            }
        };

        // 激活下一个选项
        const next = () => {
            setActiveItem(data.activeIndex + 1);
        };

        // 重置选项位置
        const resetItemPosition = (oldIndex?: number) => {
            data.items.forEach((item, index) => {
                // 移动选项
                item.translateItem(index, data.activeIndex, oldIndex);
            });
        };

        // 按钮点击
        const handleArrowClick = throttle(
            (index: number) => {
                setActiveItem(index);
            },
            props.throttleTime,
            { trailing: true }
        );

        // 开始自动切换
        const startTimer = () => {
            if (props.interval <= 0 || !props.autoplay || data.timer) {
                return;
            }

            data.timer = setInterval(() => {
                // 激活的选项 < 选项数量
                if (data.activeIndex < data.items.length - 1) {
                    data.activeIndex += 1;
                }
                // 开启循环
                else if (props.loop) {
                    data.activeIndex = 0;
                }
            }, props.interval);
        };

        // 停止自动切换
        const pauseTimer = () => {
            if (data.timer) {
                clearInterval(data.timer);

                data.timer = null;
            }
        };

        // 监听缩放->浅拷贝 useResizeObserver
        const resizeObserver =
            shallowRef<ReturnType<typeof useResizeObserver>>();

        // 鼠标进入
        const handleMouseEnter = () => {
            data.hover = true;

            // 鼠标悬浮时暂停自动切换
            if (props.pauseOnHover) {
                pauseTimer();
            }
        };

        // 鼠标离开
        const handleMouseLeave = () => {
            data.hover = false;

            startTimer();
        };

        // 点击导航器
        const handleDotClick = (index) => {
            data.activeIndex = index;
        };

        // 导航器hover
        const handleDotHover = (index) => {
            if (props.trigger === 'hover' && index !== data.activeIndex) {
                data.activeIndex = index;
            }
        };

        // 导航器hover
        const handleThrottleDotHover = throttle((index: number) => {
            handleDotHover(index);
        }, props.throttleTime);

        // 设置内容高度
        const setContentHeight = (height: number) => {
            data.contentHeight = height;
        };

        // 按钮鼠标进入
        const handleArrowEnter = (arrow: 'left' | 'right') => {
            // 是否是垂直
            if (isVertical.value) {
                return;
            }

            data.items.forEach((item, index) => {
                // 设置卡片hover
                if (arrow === itemInStage(item, index)) {
                    item.states.hover = true;
                }
            });
        };

        // 按钮鼠标离开
        const handleArrowLeave = () => {
            // 是否是垂直
            if (isVertical.value) {
                return;
            }

            // 取消选项的hover
            data.items.forEach((item) => {
                item.states.hover = false;
            });
        };

        // 选项是否可以点击下一个
        const itemInStage = (item: CarouselItemContext, index: number) => {
            const items = [...data.items];
            const itemLength = items.length;

            // 没有选项 || 没有下一个
            if (itemLength === 0 || !item.states.inStage) {
                return false;
            }

            // 上一个选项的index
            const prevItemIndex = index - 1;
            // 下一个选项的index
            const nextItemIndex = index + 1;
            // 最后一个选项的index
            const lastItemIndex = itemLength - 1;

            // 最后一个选项激活
            const isLastItemActive = items[lastItemIndex].states.active;
            // 第一个选项激活
            const isFirstItemActive = items[0].states.active;
            // 上一个选项激活
            const isPrevItemActive = items[prevItemIndex]?.states?.active;
            // 下一个选项激活
            const isNextItemActive = items[nextItemIndex]?.states?.active;

            // 当前选项 === 最后一个选项 && 第一个选项激活 || 下一个选项激活 -> 选择的是左边
            if (
                (index === lastItemIndex && isFirstItemActive) ||
                isNextItemActive
            ) {
                return 'left';
            }
            // index === 0 && 最后一个选项激活 || 上一个选项激活 -> 选择的是右边
            else if ((index === 0 && isLastItemActive) || isPrevItemActive) {
                return 'right';
            }

            return false;
        };

        // provide
        provide(CarouselContextKey, {
            // dom
            wrapper,

            // data
            items: ref(data.items),
            loop: props.loop,
            cardScale: props.cardScale,

            // computed
            // 是否是垂直
            isVertical,
            // 是否是卡片类型
            isCardType,

            // methods
            // 添加选项
            addItem,
            // 删除选项
            removeItem,
            // 设置内容高度
            setContentHeight,
            // 激活选项
            setActiveItem,
        });

        // watch
        watch(
            () => data.activeIndex,
            (current, prev) => {
                // 重置选项位置
                resetItemPosition(prev);

                // 改变了
                if (prev > -1) {
                    emit('on-change', current, prev);
                }
            }
        );

        // onMounted
        onMounted(() => {
            resizeObserver.value = useResizeObserver(wrapper.value, () => {
                // 重置选项位置
                resetItemPosition();
            });

            // 设置激活的选项
            if (
                props.initialIndex < data.items.length &&
                props.initialIndex >= 0
            ) {
                data.activeIndex = props.initialIndex;
            }

            // 开始自动切换
            startTimer();
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            // 停止监听缩放
            if (wrapper.value && resizeObserver.value) {
                resizeObserver.value.stop();
            }
        });

        return {
            prefixCls,

            // dom
            wrapper,

            // data
            data,

            // computed
            wrapperClasses,
            arrowDisplay,
            dotsClasses,
            contentStyles,

            // methods
            handleMouseEnter,
            handleMouseLeave,
            handleArrowClick,
            handleDotClick,
            handleThrottleDotHover,
            handleArrowEnter,
            handleArrowLeave,
        };
    },
});
</script>
