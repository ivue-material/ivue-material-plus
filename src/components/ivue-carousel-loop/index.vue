<template>
    <div :class="prefixCls" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
        <!-- 按钮 -->
        <ivue-button
            :class="[`${prefixCls}-arrow left`]"
            flat
            icon
            @click="handleArrowClick('left')"
        >
            <slot name="leftArrow">
                <ivue-icon>{{ leftArrow }}</ivue-icon>
            </slot>
        </ivue-button>
        <!-- scroll -->
        <div :class="`${prefixCls}-scroll`" ref="scroll">
            <!-- 内容 -->
            <div :class="`${prefixCls}-content`" ref="content">
                <div :class="`${prefixCls}-list`" :style="listStyle" ref="list">
                    <slot></slot>
                </div>
                <!-- 复制的内容 -->
                <div :class="`${prefixCls}-list copy-track`" :style="listCopyStyle">
                    <slot></slot>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <ivue-button
            :class="[`${prefixCls}-arrow right`]"
            flat
            icon
            @click="handleArrowClick('right')"
        >
            <slot name="rightArrow">
                <ivue-icon>{{ rightArrow }}</ivue-icon>
            </slot>
        </ivue-button>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    ref,
    nextTick,
    onMounted,
    onUnmounted,
} from 'vue';

import { oneOf } from '../../utils/assist';

import IvueButton from '../ivue-button';
import IvueIcon from '../ivue-icon';

const prefixCls = 'ivue-carousel-loop';

/* eslint-disable */
export default defineComponent({
    name: prefixCls,
    props: {
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
         * 是否自动切换
         *
         * @type {Boolean}
         */
        autoplay: {
            type: Boolean,
            default: true,
        },
        /**
         * 自动切换的时间间隔，单位为毫秒
         *
         * @type {Number}
         */
        interval: {
            type: Number,
            // default: 16.7,
            default: 1,
        },
        /**
         * 滚动方向
         *
         * @type {String}
         */
        direction: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['left', 'right']);
            },
            default: 'left',
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
    },
    setup(props: any) {
        // dom
        const scroll = ref<HTMLDivElement>();
        const content = ref<HTMLDivElement>();
        const list = ref<HTMLDivElement>();

        // data
        const data: any = reactive<{
            timer: ReturnType<typeof setInterval> | null;
            loop: boolean;
            showCopyTrack: boolean;
            listWidth: number;
            contentWidth: number;
            listTranslate: number;
            listTranslateStart: boolean;
            listCopyTranslate: number;
            listCopyTranslateStart: boolean;
            overflowWidth: number;
            scrollDoneQuantity: number;
            direction: string;
            arrowInterval: any;
            span: number;
        }>({
            /**
             * setInterval
             *
             * @type  {Function}
             */
            timer: null,
            /**
             * 是否循环显示
             *
             * @type {Boolean}
             */
            loop: true,
            /**
             * 显示复制的内容
             *
             * @type {Boolean}
             */
            showCopyTrack: false,
            /**
             * 列表宽度
             *
             * @type {Number}
             */
            listWidth: 0,
            /**
             * 内容宽度
             *
             * @type {Number}
             */
            contentWidth: 0,
            /**
             * 列表动画
             *
             * @type {Number}
             */
            listTranslate: 0,
            /**
             * 列表动画开始
             *
             * @type {Boolean}
             */
            listTranslateStart: true,
            /**
             * 复制列表动画
             *
             * @type {Number}
             */
            listCopyTranslate: 0,
            /**
             * 复制列表动画开始
             *
             * @type {Boolean}
             */
            listCopyTranslateStart: false,
            /**
             * 溢出宽度
             *
             * @type {Number}
             */
            overflowWidth: 0,
            /**
             * 列表滚动完成数量
             *
             * @type {Number}
             */
            scrollDoneQuantity: 0,
            /**
             * 方向
             *
             * @type {String}
             */
            direction: props.direction,
            arrowInterval: null,
            /**
             * 跨度
             *
             * @type {Number}
             */
            span: -1,
        });

        // computed

        // 列表样式
        const listStyle = computed(() => {
            let left = 0;

            // 向左
            if (data.span < 0) {
                left = data.scrollDoneQuantity > 0 ? data.contentWidth : 0;
            }

            // 向右
            if (data.span > 0) {
                left = data.scrollDoneQuantity > 0 ? -data.listWidth : 0;
            }

            return {
                // left: `${left}px`,
                transform: `translateX(${data.listTranslate}px)`,
            };
        });

        // 复制列表样式
        const listCopyStyle = computed(() => {
            let left = 0;

            // 向左
            if (data.span < 0) {
                left = data.contentWidth;
            }

            // 向右
            if (data.span > 0) {
                left = -data.listWidth;
            }

            return {
                // left: `${left}px`,
                transform: `translateX(${data.listCopyTranslate}px)`,
            };
        });

        // 达到尾部的距离
        const tailDistance = computed(() => {
            return data.scrollDoneQuantity > 0
                ? data.overflowWidth + data.contentWidth
                : data.overflowWidth;
        });

        // 总宽度
        const overallWidth = computed(() => {
            // 总宽度 = 已经滚动成功次数 > 0 ? 列表宽度 + 父级宽度 : 列表宽度
            let overallWidth = 0;

            // 向左
            if (data.span < 0) {
                overallWidth = data.listWidth;
            }

            // 向右
            if (data.span > 0) {
                overallWidth = data.contentWidth;
            }

            // 滚动次数超过一次
            if (data.scrollDoneQuantity > 0) {
                overallWidth = data.listWidth + data.contentWidth;
            }

            return overallWidth;
        });

        // methods

        // 初始化数据
        const initData = () => {
            // 可滚动滚动的宽度
            const scrollWidth = scroll.value.scrollWidth;
            // 滚动层宽度
            const offsetWidth = scroll.value.offsetWidth;

            // 内容宽度
            data.contentWidth = content.value.offsetWidth;

            // 列表宽度
            data.listWidth = list.value.offsetWidth;

            // 溢出宽度
            data.overflowWidth = data.listWidth - data.contentWidth;

            // 超过长度显示复制的内容
            if (scrollWidth - offsetWidth > 0) {
                data.showCopyTrack = true;
            }

            // 向左
            if (props.direction === 'left') {
                data.span = -1;

                data.listCopyTranslate = data.contentWidth;
            }

            // 向右
            if (props.direction === 'right') {
                data.span = 1;

                data.listCopyTranslate = -data.listWidth;
            }
        };

        // 设置列表动画
        const setListTranslate = () => {
            // 列表动画开始
            if (data.listTranslateStart) {
                // 列表动画 < 总宽度
                data.listTranslate += data.span;

                console.log('data/listTranslate', overallWidth.value);

                // listTranslate === 溢出宽度
                if (data.listTranslate === -tailDistance.value) {
                    // 复制列表动画开始
                    data.listCopyTranslateStart = true;
                }

                // 向左
                if (data.span < 0) {
                    // listTranslate === 溢出宽度
                    if (data.listTranslate === -overallWidth.value) {
                        // 重制列表动画位置
                        data.listTranslate = data.contentWidth;

                        // 列表动画结束
                        data.listTranslateStart = false;
                    }
                }
                // if (Math.abs(data.listTranslate) < overallWidth.value) {
                //     data.listTranslate += data.span;
                // }

                // // 没有列表滚动完成
                // if (Math.abs(data.listTranslate) >= overallWidth.value) {
                //     // 记录滚动次数
                //     data.scrollDoneQuantity += 1;

                //     console.log('没有列表滚动完成');

                //     // 重制列表动画位置
                //     data.listTranslate = data.contentWidth;

                //     // 列表动画结束
                //     data.listTranslateStart = false;
                // }

                // // 向右
                // if (data.span > 0) {
                //     // 当前列表第一个已经显示
                //     if (
                //         data.scrollDoneQuantity === 0 ||
                //         Math.abs(data.listTranslate) === data.listWidth
                //     ) {
                //         data.listCopyTranslateStart = true;
                //     }
                // }
                // // 向左
                // // 当前列表最后一个已经显示
                // else if (Math.abs(data.listTranslate) >= tailDistance.value) {
                //     data.listCopyTranslateStart = true;
                // }
            }

            // 复制列表动画开始
            if (data.listCopyTranslateStart) {
                // 总宽度
                // let listCopyOverallWidth = 0;

                // 向右
                // if (data.span > 0) {
                //     // 列表宽度 + 内容宽度
                //     listCopyOverallWidth = data.listWidth + data.contentWidth;
                // }

                // // 向左
                // if (data.span < 0) {
                //     // 总宽度
                //     listCopyOverallWidth = overallWidth.value;
                // }

                // 复制列表动画 < 总宽度
                data.listCopyTranslate += data.span;

                // if (Math.abs(data.listCopyTranslate) < listCopyOverallWidth) {
                // }

                // 没有列表滚动完成
                // if (Math.abs(data.listCopyTranslate) >= listCopyOverallWidth) {
                //     // 记录滚动次数
                //     data.scrollDoneQuantity += 1;

                //     // 重制复制列表动画位置
                //     data.listCopyTranslate = 0;

                //     // 复制列表动画结束
                //     data.listCopyTranslateStart = false;
                // }

                // 向左
                if (data.span < 0) {
                    // listCopyTranslate > 0
                    // listCopyTranslate === 溢出的宽度
                    if (
                        data.listCopyTranslate < 0 &&
                        data.listCopyTranslate === -data.overflowWidth
                    ) {
                        // 列表动画开始
                        // data.listTranslateStart = false;

                        data.listCopyTranslateStart = false;
                    }
                }
            }
        };

        // 自动滚动
        const startTime = () => {
            // 自动切换的时间间隔，单位为毫秒 < 0 ｜ 没有开启自动切换 | 已经存在倒计时
            if (props.interval <= 0 || !props.autoplay || data.timer) {
                return;
            }

            // 可以滚动
            nextTick(() => {
                data.timer = setInterval(() => {
                    setListTranslate();
                }, props.interval);
            });
        };

        // 清除定时器
        const clearTimer = () => {
            if (data.timer) {
                clearInterval(data.timer);

                data.timer = null;
            }
        };

        // 重置计时
        const resetTimer = () => {
            clearTimer();
            startTime();
        };

        // 箭头点击
        const handleArrowClick = (arrow: 'left' | 'right') => {
            // 设置方向

            // 向左
            if (arrow === 'left') {
                data.span = -1;
            }

            // 向右
            if (arrow === 'right') {
                data.span = 1;

                if (data.listTranslate === 0) {
                    data.listCopyTranslate = -data.listWidth;
                }
            }

            // 重置计时
            // resetTimer();

            // 初始化动画
            // initTranslate();
            clearInterval(data.arrowInterval);

            data.arrowInterval = setInterval(() => {
                setListTranslate();
            }, props.interval);

            // setTimeout(() => {
            //     clearInterval(data.arrowInterval);
            // }, 1000);

            // clearTimer();
        };

        // 鼠标进入
        const handleMouseenter = () => {
            // 鼠标悬浮时暂停自动切换
            if (props.pauseOnHover) {
                clearTimer();
            }
        };

        // 鼠标移开
        const handleMouseleave = () => {
            // startTime();
        };

        // onMounted
        onMounted(() => {
            // 初始化数据
            initData();

            // 是否自动切换
            if (props.autoplay) {
                // 自动滚动
                startTime();
            }
        });

        // onUnmounted
        onUnmounted(() => {
            // 清除定时器
            clearTimer();
        });

        return {
            prefixCls,

            // dom
            scroll,
            content,
            list,

            // data
            data,

            // computed
            listStyle,
            listCopyStyle,

            // methods
            clearTimer,
            handleArrowClick,
            handleMouseenter,
            handleMouseleave,
        };
    },
    components: {
        IvueButton,
        IvueIcon,
    },
});
</script>
