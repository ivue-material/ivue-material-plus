<template>
    <span>
        <slot :countDown="countDownData">{{ countDownData }}</slot>
    </span>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    onBeforeUnmount,
    onMounted,
    computed,
    watch,
} from 'vue';

import { Props, Data } from './count-down';

const prefixCls = 'ivue-count-down';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 自定义显示格式
         *
         * @type {Function}
         */
        format: {
            type: Function,
        },
        /**
         * 目标时间
         *
         * @type {Date, Number}
         */
        target: {
            type: [Date, Number],
        },
        /**
         * 自动倒计时间隔
         *
         * @type {Number}
         */
        interval: {
            type: Number,
            default: 1000,
        },
        /**
         * 计算类型
         *
         * @type {String}
         */
        type: {
            type: String,
            default: 'date',
        },
    },
    setup(props: Props, { emit }) {
        // data
        const data = reactive<Data>({
            /**
             * 结束时间
             *
             * @type {Number}
             */
            lastTime: 0,
            /**
             * 倒计时函数
             *
             * @type {Function}
             */
            countDownTimer: null,
        });

        // computed

        // 倒计时数据
        const countDownData = computed(() => {
            const { format = defaultFormat } = props;

            return format(data.lastTime);
        });

        // methods

        // 初始化时间
        const initTime = () => {
            let lastTime = 0;
            let targetTime = 0;

            try {
                // 目标时间 传入的是 new Date
                if (
                    Object.prototype.toString.call(props.target) ===
                    '[object Date]'
                ) {
                    targetTime = props.target.getTime();
                }
                // 按日期倒计时
                else if (props.type === 'date') {
                    targetTime = new Date(props.target).getTime();
                }
            } catch (e) {
                throw new Error(`invalid target prop ${e}`);
            }

            // 按日期倒计时
            if (props.type === 'date') {
                lastTime = targetTime - new Date().getTime();
            }

            // 按数字倒计时
            if (props.type === 'number') {
                lastTime = props.target;
            }

            return lastTime < 0 ? 0 : lastTime;
        };

        // 补零
        const initZero = (val: number) => {
            return val * 1 < 10 ? `0${val}` : val;
        };

        // 倒计时
        const countDown = () => {
            data.countDownTimer = setTimeout(() => {
                // 结束时间 < 自动倒计时间隔
                if (data.lastTime < props.interval) {
                    clearTimeout(data.countDownTimer);

                    data.lastTime = 0;
                    // 结束
                    emit('on-end');
                }
                // 倒计时中
                else {
                    data.lastTime -= props.interval;

                    countDown();
                }
            }, props.interval);
        };

        // 默认显示格式
        const defaultFormat = (time: number) => {
            const hours = 60 * 60 * 1000;
            const minutes = 60 * 1000;

            const h = Math.floor(time / hours);
            const m = Math.floor((time - h * hours) / minutes);
            const s = Math.floor((time - h * hours - m * minutes) / 1000);

            return `${initZero(h)}:${initZero(m)}:${initZero(s)}`;
        };

        // watch

        // 监听目标时间变化
        watch(
            () => props.target,
            () => {
                // 倒计时函数
                if (data.countDownTimer) {
                    clearTimeout(data.countDownTimer);
                }

                // 重新设置结束时间
                data.lastTime = initTime();

                // 倒计时
                countDown();
            }
        );

        // onMounted
        onMounted(() => {
            // 设置结束时间
            data.lastTime = initTime();

            countDown();
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            // 倒计时函数
            if (data.countDownTimer) {
                clearTimeout(data.countDownTimer);
            }
        });

        return {
            // computed
            countDownData,
        };
    },
});
</script>
