<template>
    <div :class="prefixCls">
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
            <div :class="`${prefixCls}-content`">
                <div :class="`${prefixCls}-list`" :style="trackStyle" ref="content">
                    <slot></slot>
                </div>
                <!-- 复制的内容 -->
                <div :class="`${prefixCls}-list`" :style="copyTrackStyle" v-if="data.showCopyTrack">
                    <slot></slot>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <ivue-button
            :class="[`${prefixCls}-arrow right`]"
            flat
            icon
            @click="handleArrowClick('left')"
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
    provide,
    watch,
    nextTick,
    onMounted,
    getCurrentInstance,
    onUnmounted,
} from 'vue';

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
            default: 0,
        },
    },
    setup(props: any) {
        // dom
        const scroll = ref<HTMLDivElement>();

        const content = ref<HTMLDivElement>();

        // data
        const data: any = reactive<{
            timer: ReturnType<typeof setInterval> | null;
            loop: boolean;
            canScrollWidth: number;
            showCopyTrack: boolean;
            translate: number;
            copyTranslate: number;
            currentTrack: boolean;
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
             * 可滚动宽度
             *
             * @type {Number}
             */
            canScrollWidth: 0,
            /**
             * 显示复制的内容
             *
             * @type {Boolean}
             */
            showCopyTrack: false,
            /**
             * 内容偏移的位置
             *
             * @type {Number}
             */
            translate: 0,
            /**
             * 内容偏移的位置
             *
             * @type {Number}
             */
            copyTranslate: 0,
            /**
             * 当前跟踪是那个内容
             *
             * @type {Boolean}
             */
            currentTrack: false,
        });

        // computed

        const trackStyle = computed(() => {
            return {
                transform: `translateX(-${data.translate}px)`,
            };
        });

        // 复制内容的样式
        const copyTrackStyle = computed(() => {
            return {
                transform: `translateX(-${data.copyTranslate}px)`,
            };
        });

        // methods

        // 箭头点击
        const handleArrowClick = (arrow: 'left' | 'right') => {
            // 左按钮
            if (arrow === 'left') {
            }

            // 右按钮
            if (arrow === 'right') {
            }
        };

        // 重置
        const reset = () => {
            // 可滚动滚动的宽度
            const scrollWidth = scroll.value.scrollWidth;
            // 滚动层宽度
            const offsetWidth = scroll.value.offsetWidth;

            // 可滚动宽度
            let canScrollWidth = scrollWidth - offsetWidth;

            setCanScrollWidth();

            // 超过长度显示复制的内容
            if (canScrollWidth > 0) {
                data.showCopyTrack = true;
            }
        };

        // 设置可滚动宽度
        const setCanScrollWidth = () => {
            // 可滚动滚动的宽度
            const scrollWidth = scroll.value.scrollWidth;
            // 滚动层宽度
            const offsetWidth = scroll.value.offsetWidth;

            data.canScrollWidth = scrollWidth - offsetWidth;

            console.log(data.canScrollWidth);
        };

        // 自动滚动
        const autoScroll = () => {
            // 滚动层宽度
            const offsetWidth = scroll.value.offsetWidth;

            // 可以滚动
            // if (data.canScrollWidth > 0) {
            data.timer = setInterval(() => {
                if (data.canScrollWidth + offsetWidth > data.translate) {
                    data.translate += 1;
                }

                // 复制的内容
                if (data.translate > data.canScrollWidth) {
                    data.copyTranslate = data.translate;
                    data.copyTranslate = data.translate + 1;
                }

                if (data.copyTranslate > offsetWidth) {
                    data.copyTranslate = data.translate;
                    data.copyTranslate += 1;
                }

                // scroll.value.scrollLeft += 1;
                // // 当前可滚动宽度 等于 外层滚动scrollLeft
                // if (data.canScrollWidth === scroll.value.scrollLeft) {
                //     console.log(
                //         'scroll.value.scrollLeft',
                //         content.value.scrollWidth
                //     );
                //     data.translate = content.value.scrollWidth;
                // }
            }, props.interval);
            // }
        };

        // 清除定时器
        const clearTimer = () => {
            if (data.timer) {
                clearInterval(data.timer);

                data.timer = null;
            }
        };

        watch(
            () => data.canScrollWidth,
            (value) => {
                // 可滚动滚动的宽度
                // const scrollWidth = scroll.value.scrollWidth;
                // console.log('scrollWidth', scrollWidth);
                // console.log('value', value);
            }
        );

        // onMounted
        onMounted(() => {
            reset();
            // 自动滚动
            autoScroll();
        });

        // onUnmounted
        onUnmounted(() => {});

        return {
            prefixCls,

            // dom
            scroll,
            content,

            // data
            data,

            // computed
            trackStyle,
            copyTrackStyle,

            // methods
            handleArrowClick,
        };
    },
    components: {
        IvueButton,
        IvueIcon,
    },
});
</script>
