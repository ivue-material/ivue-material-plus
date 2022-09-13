<template>
    <div
        :class="wrapperClasses"
        ref="wrapper"
        @mouseenter.stop="handleMouseEnter"
        @mouseleave.stop="handleMouseLeave"
    >
        <div :class="`${prefixCls}-content`" :style="{ height: height }">
            <!-- 左按钮 -->
            <transition v-if="arrowDisplay" name="fade">
                <ivue-button
                    :class="[`${prefixCls}-arrow left`]"
                    flat
                    icon
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
                    index === data.activeIndex ? `${prefixCls}-dots--active` : '',
                ]"
                :key="index"
            >
                <button type="button" :class="[radiusDot ? 'radius' : '']"></button>
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
            default: 'inside',
            validator(value: string) {
                return oneOf(value, ['inside', 'outside', 'none']);
            },
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
        });

        // computed

        // 外层样式
        const wrapperClasses = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-${props.direction}`]: true,
                },
            ];
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
            return [`${prefixCls}-dots`, `${prefixCls}-dots-${props.dots}`];
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
            300,
            { trailing: true }
        );

        // provide
        provide(CarouselContextKey, {
            // dom
            wrapper,

            // data
            items: ref(data.items),
            loop: props.loop,

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
        });

        // 监听缩放->浅拷贝 useResizeObserver
        const resizeObserver =
            shallowRef<ReturnType<typeof useResizeObserver>>();

        // 鼠标进入
        const handleMouseEnter = () => {
            data.hover = true;
        };

        // 鼠标离开
        const handleMouseLeave = () => {
            data.hover = false;
        };

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

            // methods
            handleMouseEnter,
            handleMouseLeave,
            handleArrowClick,
        };
    },
});
</script>
