<template>
    <div :class="wrapperClasses" :style="wrapperStyles" ref="item" v-show="data.ready">
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
} from 'vue';

import { CarouselContextKey } from './carousel-item';
import { isUndefined } from '../../utils/helpers';

const prefixCls = 'ivue-carousel-item';

/* eslint-disable */
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
        },
    },
    setup(props: any) {
        // inject
        const {
            isVertical,
            isCardType,
            addItem,
            removeItem,
            items,
            loop,
            wrapper,
        } = inject(CarouselContextKey);

        // instance
        const vm = getCurrentInstance();

        // data
        const data = reactive<{
            active: boolean;
            animating: boolean;
            translate: number;
            scale: number;
            ready: boolean;
            inStage: boolean;
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
             * inStage
             *
             * @type {Boolean}
             */
            inStage: false,
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
                },
            ];
        });

        // 外层样式
        const wrapperStyles = computed(() => {
            const translateType = `translate${isVertical.value ? 'Y' : 'X'}`;
            const _translate = `${translateType}(${data.translate}px)`;
            const _scale = `scale(${data.scale})`;

            const transform = [_translate, _scale].join(' ');

            return {
                transform,
            };
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
                //
                if (_isVertical) {
                }
            }
            // 不是卡片
            else {
                data.translate = calcTranslate(index, activeIndex, _isVertical);
            }

            // 是否可以渲染
            data.ready = true;
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

            // 方向
            let distance = 0;

            // 垂直
            if (isVertical) {
                distance = wrapperEl.offsetHeight;
            }
            // 横向
            else {
                distance = wrapperEl.offsetWidth;
            }

            // 位置 * (当前索引 - 激活的索引)
            return distance * (index - activeIndex);
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

            // data
            data,

            // computed
            wrapperClasses,
            wrapperStyles,
        };
    },
});
</script>
