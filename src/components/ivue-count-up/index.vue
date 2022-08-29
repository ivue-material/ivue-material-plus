<template>
    <span ref="wrapper"></span>
</template>

<script lang='ts'>
import { defineComponent, onBeforeUnmount, onMounted, watch, ref } from 'vue';
import { CountUp } from 'countup.js';

const prefixCls = 'ivue-count-up';

// 选项
interface CountUpOptions {
    startVal?: number; // number to start at (0)
    decimalPlaces?: number; // number of decimal places (0)
    duration?: number; // animation duration in seconds (2)
    useGrouping?: boolean; // example: 1,000 vs 1000 (true)
    useEasing?: boolean; // ease animation (true)
    smartEasingThreshold?: number; // smooth easing for large numbers above this if useEasing (999)
    smartEasingAmount?: number; // amount to be eased for numbers above threshold (333)
    separator?: string; // grouping separator (',')
    decimal?: string; // decimal ('.')
    // easingFn: easing function for animation (easeOutExpo)
    easingFn?: (t: number, b: number, c: number, d: number) => number;
    formattingFn?: (n: number) => string; // this function formats result
    prefix?: string; // text prepended to result
    suffix?: string; // text appended to result
    numerals?: string[]; // numeral glyph substitution
    enableScrollSpy?: boolean; // start animation when target is in view
    scrollSpyDelay?: number; // delay (ms) after target comes into view
    scrollSpyOnce?: boolean; // run only once
}

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 起始值
         *
         * @type {Number}
         */
        startValue: {
            type: Number,
            required: false,
            default: 0,
        },
        /**
         * 结束值，必填
         *
         * @type {Number}
         */
        endValue: {
            type: Number,
            required: true,
        },
        /**
         * 持续时间
         *
         * @type {Number}
         */
        duration: {
            type: Number,
            default: 2,
        },
        /**
         * 小数位数
         *
         * @type {Number}
         */
        decimals: {
            type: Number,
            default: 0,
        },
        /**
         * countup.js 设置项
         *
         * @type {Object}
         */
        options: {
            type: Object,
            default: () => {},
        },
        /**
         * 回调函数
         *
         * @type {Function}
         */
        callback: {
            type: Function,
        },
    },
    setup(props: any) {
        // dom
        const wrapper = ref(null);

        // data
        const countUp = ref(null);

        // methods

        // 初始化
        const init = () => {
            if (!countUp.value) {
                // 选项
                const countUpOptions: CountUpOptions = {
                    startVal: props.startValue,
                    decimalPlaces: props.decimals,
                    duration: props.duration,
                    ...props.options,
                };

                countUp.value = new CountUp(
                    wrapper.value,
                    props.endValue,
                    countUpOptions
                );

                countUp.value.start(() => {
                    props.callback && props.callback(countUp.value);
                });
            }
        };

        // 开始
        const start = (callback) => {
            if (countUp.value && countUp.value.start) {
                countUp.value.start(() => {
                    callback && callback(countUp.value);
                });
            }
        };

        // 销毁
        const destroy = () => {
            countUp.value = null;
        };

        // 更新结束值并设置动画
        const update = (value) => {
            if (countUp.value && countUp.value.update) {
                // 判断是否有暂停
                if (countUp.value.paused) {
                    countUp.value.paused = false;
                }

                // 更新值
                countUp.value.update(value);
            }
        };

        // 切换暂停/恢复
        const pauseResume = () => {
            if (countUp.value && countUp.value.pauseResume) {
                countUp.value.pauseResume();
            }
        };

        // 重置动画
        const reset = () => {
            if (countUp.value && countUp.value.reset) {
                countUp.value.reset();
            }
        };

        // watch

        // 监听结束值
        watch(
            () => props.endValue,
            (value) => {
                if (countUp.value && countUp.value.update) {
                    countUp.value.update(value);
                }
            }
        );

        // onMounted
        onMounted(() => {
            init();
        });

        // beforeUnmounted
        onBeforeUnmount(() => {
            destroy();
        });

        return {
            // dom
            wrapper,

            // data
            countUp,

            // methods
            start,
            destroy,
            update,
            pauseResume,
            reset,
        };
    },
});
</script>
