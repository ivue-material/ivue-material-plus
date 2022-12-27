<template>
    <span :class="prefixCls">{{ date }}</span>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

// utils
import { oneOf } from '../../utils/assist';

import { getRelativeTime, getDate } from './time';

// type
import { Props } from './types/relative-time';

const prefixCls = 'ivue-relative-time';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 需要对比的时间，可以是时间戳或 Date 类型
         *
         * @type {Number | Date | String}
         */
        time: {
            type: [Number, Date, String],
            required: true,
        },
        /**
         * 类型，可选值为 相对时间、日期 或 日期时间
         *
         * @type {String}
         */
        type: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['relative', 'date', 'datetime']);
            },
            default: 'relative',
        },
        /**
         * 语言
         *
         * @type {String}
         *
         *  before?: string
            after?: string
            just?: string
            seconds?: string
            minutes?: string
            hours?: string
            days?: string
         */
        locale: {
            type: Object,
            default: () => {},
        },
        /**
         * 月份格式开始类型
         *
         * @type {String}
         */
        dateStartType: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['month', 'year']);
            },
        },
        /**
         * 自动更新的间隔，单位：秒
         *
         * @type {Number}
         */
        interval: {
            type: Number,
            default: 60,
        },
        /**
         * 自定义日期方法
         *
         * @type {Function}
         */
        dateFunction: {
            type: Function,
        },
    },
    setup(props: Props) {
        // 时间
        const date = ref<string>('');
        // 计时器
        const timer = ref<ReturnType<typeof setInterval> | null>(null);

        // methods

        // 设置时间
        const setTime = () => {
            // 类型
            const _typeof = typeof props.time;

            // 时间
            let time: number;

            // 时间搓
            if (_typeof === 'number') {
                const timestamp =
                    Number(props.time) > 10 ? props.time : props.time * 1000;

                time = new Date(timestamp).getTime();
            }
            // Date
            else if (_typeof === 'object') {
                time = props.time.getTime();
            }
            // 日期
            else if (_typeof === 'string') {
                time = new Date(props.time).getTime();
            }

            // 相对时间
            if (props.type === 'relative') {
                date.value = getRelativeTime(
                    time,
                    props.locale,
                    props.dateStartType,
                    props.dateFunction
                );
            }
            // 其他类型
            else {
                date.value = getDate(time, props.type);
            }
        };

        // watch

        // 监听时间变化
        watch(
            () => props.time,
            () => {
                setTime();
            }
        );

        // onMounted
        onMounted(() => {
            setTime();

            timer.value = setInterval(() => {
                setTime();
            }, 1000 * props.interval);
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            if (timer.value) {
                clearInterval(timer.value);
            }
        });

        return {
            prefixCls,

            // data
            date,
        };
    },
});
</script>
