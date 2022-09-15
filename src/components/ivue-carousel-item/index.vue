<template>
    <div
        :class="wrapperClasses"
        :style="wrapperStyles"
        ref="carouselItem"
        @click="handleItemClick"
        v-show="data.ready"
    >
        <!-- mask -->
        <template v-if="isCardType">
            <div v-show="!data.active" :class="`${prefixCls}--mask`"></div>
        </template>
        <!-- slot -->
        <slot></slot>
    </div>
</template>

<script  lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    inject,
    onMounted,
    getCurrentInstance,
    onUnmounted,
    ref,
} from 'vue';

import { CarouselContextKey } from './carousel-item';
import { isUndefined } from '../../utils/helpers';

const prefixCls = 'ivue-carousel-item';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 幻灯片的名字，可用作 setActiveItem 的参数
         *
         * @type {String}
         */
        name: {
            type: String,
        },
        /**
         * 该幻灯片所对应指示器的文本
         *
         * @type {String}
         */
        label: {
            type: String,
            default: '',
        },
    },
    setup(props: any) {
        // instance
        const vm = getCurrentInstance();

        // dom
        const carouselItem = ref<HTMLElement>();

        // inject
        const {
            // dom
            wrapper,

            // data
            items,
            loop,
            cardScale,

            // computed
            isVertical,
            isCardType,

            // methods
            addItem,
            removeItem,
            setContentHeight,
            setActiveItem,
        } = inject(CarouselContextKey);

        // data
        const data = reactive<{
            active: boolean;
            animating: boolean;
            translate: number;
            scale: number;
            ready: boolean;
            inStage: boolean;
            hover: boolean;
            zIndex: number;
        }>({
            /**
             * 是否激活
             *
             * @type {Boolean}
             */
            active: false,
            /**
             * 执行动画
             *
             * @type {Boolean}
             */
            animating: false,
            /**
             * translate
             *
             * @type {Number}
             */
            translate: 0,
            /**
             * 缩放
             *
             * @type {Number}
             */
            scale: 1,
            /**
             * 是否可以渲染
             *
             * @type {Boolean}
             */
            ready: false,
            /**
             * 是否可以点击下一个
             *
             * @type {Boolean}
             */
            inStage: false,
            /**
             * hover
             *
             * @type {Boolean}
             */
            hover: false,
            /**
             * 选项位置
             *
             * @type {Number}
             */
            zIndex: 0,
        });

        // computed

        // 外层样式
        const wrapperClasses = computed(() => {
            return [
                prefixCls,
                {
                    // 激活
                    [`${prefixCls}--active`]: data.active,
                    // 切换动画
                    [`${prefixCls}--animating`]: data.animating,
                    // 卡片类型
                    [`${prefixCls}--card`]: isCardType.value,
                    // 卡片竖向
                    [`${prefixCls}--card__vertical`]:
                        isCardType.value && isVertical.value,
                    // 是否可以点击下一个
                    [`${prefixCls}--in-stage`]: data.inStage,
                    // hover
                    [`${prefixCls}--hover`]: data.hover,
                },
            ];
        });

        // 外层样式
        const wrapperStyles = computed(() => {
            const translateType = `translate${isVertical.value ? 'Y' : 'X'}`;
            const _translate = `${translateType}(${data.translate}px)`;
            const _scale = `scale(${data.scale})`;

            const transform = [_translate, _scale].join(' ');

            let style: {
                transform: string;
                zIndex?: number;
            } = {
                transform,
            };

            // 是卡片 有zIndex
            if (isCardType.value && data.zIndex) {
                style.zIndex = data.zIndex;
            }

            return style;
        });

        // methods

        // 移动选项
        const translateItem = (
            index: number,
            activeIndex: number,
            oldIndex?: number
        ) => {
            const _isCardType = isCardType.value;
            const _isVertical = isVertical.value;

            const itemsLength = items.value.length ?? Number.NaN;

            // 是否激活
            const isActive = index === activeIndex;

            // 不是卡片 & 有旧的index
            if (!_isCardType && !isUndefined(oldIndex)) {
                data.animating = isActive || index === oldIndex;
            }

            // 没有激活 & 选项长度 > 2 & 开启循环
            if (!isActive && itemsLength > 2 && loop) {
                index = processIndex(index, activeIndex, itemsLength);
            }

            // 设置激活的选项
            data.active = isActive;

            // 是卡片
            if (_isCardType) {
                // 是否可以点击下一个
                data.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;

                // 偏移位置
                data.translate = calcCardTranslate(index, activeIndex);

                // 不是当前激活的选项
                if (index !== activeIndex) {
                    // 当前是否有 zIndex
                    if (data.zIndex) {
                        data.zIndex -= 1;
                    }

                    // 右选项
                    if (data.translate > 0) {
                        data.zIndex = data.zIndex || 2;
                    }

                    // 左选项
                    if (data.translate < 0) {
                        data.zIndex = data.zIndex || 3;
                    }
                }
                // 当前激活的选项清除 zIndex
                else {
                    data.zIndex = 0;
                }

                // 是否可以点击下一个 清除zIndex
                if (!data.inStage) {
                    data.zIndex = 0;
                }

                // 缩放大小
                data.scale = isActive ? 1 : cardScale;
            }
            // 不是卡片
            else {
                // 偏移位置
                data.translate = calcTranslate(index, activeIndex, _isVertical);
            }

            // 是否可以渲染
            data.ready = true;

            // 获取元素的高度
            if (isActive) {
                // 竖向
                if (isVertical.value) {
                    setContentHeight(carouselItem.value.offsetWidth);
                }
                // 横向
                else {
                    setContentHeight(carouselItem.value.offsetHeight);
                }
            }
        };

        // 选项进度索引
        const processIndex = (
            index: number,
            activeIndex: number,
            length: number
        ) => {
            // 最后一个选项的索引
            const lastItemIndex = length - 1;
            // 上一个选项索引
            const prevItemIndex = activeIndex - 1;
            // 下一个选项索引
            const nextItemIndex = activeIndex + 1;
            // 中间的索引
            const halfItemIndex = length / 2;

            // 激活第一个索引 && 最后一个选项
            if (activeIndex === 0 && index === lastItemIndex) {
                return -1;
            }
            // 激活的索引 === 最后一个选项的索引 && 第一个选项
            else if (activeIndex === lastItemIndex && index === 0) {
                return length;
            }
            // 选项的索引小于 上一个选项索引 && 激活的选项 - 当前选项的索引 >= 中间索引 -> 向右选择数组
            // [0,1,2,0,1,2]
            else if (
                index < prevItemIndex &&
                activeIndex - index >= halfItemIndex
            ) {
                return length + 1;
            }
            // 当前选项索引 > 下一个选项索引 && 当前选项的索引 - 激活的索引 >= 中间值 -> 向左选择数组
            else if (
                index > nextItemIndex &&
                index - activeIndex >= halfItemIndex
            ) {
                return -2;
            }

            return index;
        };

        // 计算 translate 位置
        const calcTranslate = (
            index: number,
            activeIndex: number,
            isVertical: boolean
        ) => {
            const wrapperEl = wrapper.value;

            if (!wrapperEl) {
                return 0;
            }

            // 父级宽度
            let parentOffset = 0;

            // 垂直
            if (isVertical) {
                parentOffset = wrapperEl.offsetHeight;
            }
            // 横向
            else {
                parentOffset = wrapperEl.offsetWidth;
            }

            // 位置 * (当前索引 - 激活的索引)
            return parentOffset * (index - activeIndex);
        };

        // 计算 卡片类型 translate 位置
        const calcCardTranslate = (index: number, activeIndex: number) => {
            // 父级宽度
            let parentOffset = 0;

            // 垂直
            if (isVertical.value) {
                parentOffset = wrapper.value?.offsetHeight || 0;
            }
            // 横向
            else {
                parentOffset = wrapper.value?.offsetWidth || 0;
            }

            // 可以点击下一个
            if (data.inStage) {
                return (
                    (parentOffset *
                        ((2 - cardScale) * (index - activeIndex) + 1)) /
                    4
                );
            }
            // 当前选项下标 < 激活的索引 向右前进
            else if (index < activeIndex) {
                return (-(1 + cardScale) * parentOffset) / 4;
            }
            // 当前选项下标 > 激活的索引 向左前进
            else {
                return ((3 + cardScale) * parentOffset) / 4;
            }
        };

        // methods

        // 点击选项
        const handleItemClick = () => {
            if (wrapper.value && isCardType.value) {
                // 当前点击的index
                const index = items.value.findIndex(({ uid }) => {
                    return uid === vm.uid;
                });

                // 激活选项
                setActiveItem(index);
            }
        };

        // onMounted
        onMounted(() => {
            addItem({
                props,
                states: data,
                uid: vm.uid,
                translateItem,
            });
        });

        // onUnmounted
        onUnmounted(() => {
            removeItem(vm.uid);
        });

        return {
            prefixCls,

            // dom
            carouselItem,

            // data
            data,

            // computed
            wrapperClasses,
            wrapperStyles,
            isCardType,

            // methods
            handleItemClick,
        };
    },
});
</script>
