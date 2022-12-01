<template>
    <div :class="wrapperClasses">
        <!-- 上下按钮 -->
        <div :class="`${prefixCls}-internal--wrapper`" v-if="!controlsOutside">
            <!-- 上按钮 -->
            <ivue-button
                :class="internalUpClasses"
                depressed
                :disabled="data.upDisabled"
                @click="handleUp()"
            >
                <ivue-icon>expand_less</ivue-icon>
            </ivue-button>
            <!-- 下按钮 -->
            <ivue-button
                :class="internalDownClasses"
                depressed
                :disabled="data.downDisabled"
                @click="handleDown()"
            >
                <ivue-icon>expand_more</ivue-icon>
            </ivue-button>
        </div>
        <!-- 外部减少按钮 -->
        <ivue-button
            :class="outsideDownClasses"
            depressed
            :disabled="data.downDisabled"
            @click="handleDown()"
            v-if="controlsOutside"
        >
            <ivue-icon>remove</ivue-icon>
        </ivue-button>
        <!-- 外部增加按钮 -->
        <ivue-button
            :class="outsideUpClasses"
            depressed
            @click="handleUp()"
            :disabled="data.upDisabled"
            v-if="controlsOutside"
        >
            <ivue-icon>add</ivue-icon>
        </ivue-button>
        <!-- 左右按钮 -->
        <!-- 输入框 -->
        <div :class="`${prefixCls}-input--wrapper`">
            <input
                :class="`${prefixCls}-input`"
                autocomplete="off"
                spellcheck="false"
                :disabled="disabled"
                :autofocus="autofocus"
                :readonly="readonly || !editable"
                :name="name"
                :placeholder="placeholder"
                :value="formatterValue"
                @focus="focus"
                @blur="blur"
                @change="handleChange"
                @input="handleChange"
                @keydown.stop="handleKeyDown"
            />
        </div>
    </div>
</template>

<script lang='ts'>
/* eslint-disable */
import {
    reactive,
    computed,
    defineComponent,
    nextTick,
    watch,
    onMounted,
} from 'vue';

import IvueIcon from '../ivue-icon';
import IvueButton from '../ivue-button';

// type
import type { Props, Data } from './types/input-number';

const prefixCls = 'ivue-input-number';

export default defineComponent({
    name: prefixCls,
    emits: ['on-focus', 'on-blur', 'update:modelValue', 'on-change'],
    props: {
        /**
         * 设置禁用状态
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 自动获取焦点
         *
         * @type {Boolean}
         */
        autofocus: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否设置为只读
         *
         * @type {Boolean}
         */
        readonly: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否可编辑
         *
         * @type {Boolean}
         */
        editable: {
            type: Boolean,
            default: true,
        },
        /**
         * input name
         *
         * @type {String}
         */
        name: {
            type: String,
        },
        /**
         * 占位文本
         *
         * @type {String}
         */
        placeholder: {
            type: String,
            default: '',
        },
        /**
         * 指定输入框展示值的格式
         *
         * @type {Function}
         */
        formatter: {
            type: Function,
        },
        /**
         * 数值精度, 小数点
         *
         * @type {Number}
         */
        precision: {
            type: Number,
        },
        /**
         * modelValue
         *
         * @type {Number}
         */
        modelValue: {
            type: Number,
            default: 1,
        },
        /**
         * 是否实时响应数据，设置为 false 时，只会在失焦时更改数据
         *
         * @type {Boolean}
         */
        activeChange: {
            type: Boolean,
            default: true,
        },
        /**
         * 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
         *
         * @type {Function}
         */
        parser: {
            type: Function,
        },
        /**
         * 最大值
         *
         * @type {Number}
         */
        max: {
            type: Number,
            default: Infinity,
        },
        /**
         * 最小值
         *
         * @type {Number}
         */
        min: {
            type: Number,
            default: -Infinity,
        },
        /**
         * 按钮位置是否置于两侧
         *
         * @type {Boolean}
         */
        controlsOutside: {
            type: Boolean,
            default: false,
        },
        /**
         * 每次改变的步伐，可以是小数
         *
         * @type {Number}
         */
        step: {
            type: Number,
            default: 1,
        },
    },
    setup(props: Props, { emit }) {
        // data
        const data = reactive<Data>({
            /**
             * 获取焦点
             *
             * @type {Number}
             */
            focused: false,
            /**
             * 当前value
             *
             * @type {Number}
             */
            currentValue: props.modelValue,
            /**
             * 增加禁用
             *
             * @type {Boolean}
             */
            upDisabled: false,
            /**
             * 减少禁用
             *
             * @type {Boolean}
             */
            downDisabled: false,
        });

        // computed

        // 外层样式
        const wrapperClasses = computed(() => {
            return [
                prefixCls,
                {
                    // 获取焦点
                    [`${prefixCls}-focused`]: data.focused,
                    // 禁用
                    [`${prefixCls}-disabled`]: props.disabled,
                    // 按钮位置是否置于两侧
                    [`${prefixCls}-controls-outside`]: props.controlsOutside,
                },
            ];
        });

        // 数值精度格式化
        const precisionValue = computed(() => {
            // 没有值
            if (!data.currentValue) {
                return data.currentValue;
            }

            return props.precision
                ? data.currentValue.toFixed(props.precision)
                : data.currentValue;
        });

        // 输入框value
        const formatterValue = computed(() => {
            if (props.formatter && precisionValue.value !== null) {
                return props.formatter(precisionValue.value);
            } else {
                return precisionValue.value;
            }
        });

        // 内部上按钮
        const internalUpClasses = computed(() => {
            return [
                `${prefixCls}-internal`,
                {
                    [`${prefixCls}-internal--disabled`]: data.upDisabled,
                },
            ];
        });

        // 内部下按钮
        const internalDownClasses = computed(() => {
            return [
                `${prefixCls}-internal`,
                {
                    [`${prefixCls}-internal--disabled`]: data.downDisabled,
                },
            ];
        });

        // 外部上按钮
        const outsideUpClasses = computed(() => {
            return [
                `${prefixCls}-outside`,
                `${prefixCls}-outside--up`,
                {
                    [`${prefixCls}-internal--disabled`]: data.upDisabled,
                },
            ];
        });

        // 外部下按钮
        const outsideDownClasses = computed(() => {
            return [
                `${prefixCls}-outside`,
                `${prefixCls}-outside--down`,

                {
                    [`${prefixCls}-internal--disabled`]: data.downDisabled,
                },
            ];
        });

        // methods

        // 获取焦点
        const focus = (event: Event) => {
            data.focused = true;

            emit('on-focus', event);
        };

        // 失去焦点
        const blur = () => {
            data.focused = false;

            emit('on-blur');
        };

        // 改变值
        const handleChange = (event: Event) => {
            // change 失焦时更改数据
            if (event.type === 'change' && props.activeChange) {
                return;
            }

            // input 是否实时响应数据
            if (event.type === 'input' && !props.activeChange) {
                return;
            }

            const target = event.target as HTMLInputElement;

            let value: string = target.value.trim();

            // 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
            if (props.parser) {
                value = props.parser(value);
            }

            // 是空字符串
            const isEmptyString = value.length === 0;

            // 是空字符串
            if (isEmptyString) {
                setInputValue(null);

                return;
            }

            // prevent fire early if decimal. If no more input the change event will fire later
            // 是否是十进制 -> 用于 -号
            if (event.type === 'input' && value.match(/^-?\.?$|\.$/)) {
                return;
            }

            // 转换类型
            const _value = Number(value);

            // 不是NaN
            if (!isNaN(_value)) {
                data.currentValue = _value;

                setInputValue(_value);
            }
            // 返回当前value
            else {
                target.value = `${data.currentValue}`;
            }
        };

        // 设置输入框value
        const setInputValue = (value: null | number) => {
            // 如果 step 是小数，且没有设置 precision
            if (value && !isNaN(props.precision)) {
                value = Number(Number(value).toFixed(props.precision));
            }

            const { min, max } = props;

            // 有值
            if (value !== null) {
                // 大于最大值
                if (value > max) {
                    value = max;
                }
                // 小于最小值
                else if (value < min) {
                    value = min;
                }
            }

            nextTick(() => {
                // 当前value
                data.currentValue = value;

                // modelValue
                emit('update:modelValue', value);

                // 数值改变时的回调，返回当前值
                emit('on-change', value);
            });
        };

        // 修改value
        const changeValue = (value: number) => {
            let _value = Number(value);

            // 判断是否有值
            if (!isNaN(_value)) {
                // 大于最大值
                data.upDisabled = _value + props.step > props.max;

                // 小于最小值
                data.downDisabled = _value - props.step < props.min;
            }
            // 都禁用
            else {
                data.upDisabled = true;
                data.downDisabled = true;
            }
        };

        // 增加
        const handleUp = (event?: Event) => {
            changeStep('up', event);
        };

        // 减少
        const handleDown = (event?: Event) => {
            changeStep('down', event);
        };

        // 改变步骤
        const changeStep = (type: string, event?) => {
            // 禁用
            if (props.disabled || props.readonly) {
                return false;
            }

            let value = Number(data.currentValue);

            // 每次改变的步伐，可以是小数
            const step = Number(props.step);

            // NaN
            if (isNaN(value)) {
                return false;
            }

            // 输入一个数字，然后向上或向下键
            if (event) {
                // 当前的 value
                const targetVal = Number(event.target.value);

                if (!isNaN(targetVal)) {
                    if (type === 'up') {
                        // 小于最大值
                        if (addNum(targetVal, step) <= props.max) {
                            value = targetVal;
                        }
                        // 大于最大值
                        else {
                            return false;
                        }
                    } else if (type === 'down') {
                        // 大于最小值
                        if (addNum(targetVal, -step) >= props.min) {
                            value = targetVal;
                        }
                        // 小于最小值
                        else {
                            return false;
                        }
                    }
                }
            }

            // 增加
            if (type === 'up') {
                value = addNum(value, step);
            }
            // 减少
            else if (type === 'down') {
                value = addNum(value, -step);
            }

            // 设置输入框value
            setInputValue(value);
        };

        // 增加数字
        const addNum = (num1: number, num2: number): number => {
            let sq1: number;
            let sq2: number;
            let m: number;

            try {
                // 有多少位小数
                sq1 = num1.toString().split('.')[1].length;
            } catch (e) {
                sq1 = 0;
            }

            try {
                // 有多少位小数
                sq2 = num2.toString().split('.')[1].length;
            } catch (e) {
                sq2 = 0;
            }

            // 需要除多是位小数
            m = Math.pow(10, Math.max(sq1, sq2));

            // 步骤 -> 转换为整数
            let step = Math.round(num2 * m);

            // 当前值 -> 转换为整数
            let currentValue = Math.round(num1 * m);

            // 当前值 + 步骤 / 需要除多是位小数
            return (currentValue + step) / m;
        };

        // 键盘点击
        const handleKeyDown = (event) => {
            // 增加
            if (event.keyCode === 38) {
                event.preventDefault();

                handleUp(event);
            }
            // 减少
            else if (event.keyCode === 40) {
                event.preventDefault();

                handleDown(event);
            }
        };

        // onMounted
        onMounted(() => {
            changeValue(data.currentValue);
        });

        // watch

        // 监听 modelValue
        watch(
            () => props.modelValue,
            (value) => {
                data.currentValue = value;
            }
        );

        // 监听 currentValue
        watch(
            () => data.currentValue,
            (value) => {
                changeValue(value);
            }
        );

        // 监听 最小值
        watch(
            () => props.min,
            () => {
                changeValue(data.currentValue);
            }
        );

        // 监听 最大值
        watch(
            () => props.max,
            () => {
                changeValue(data.currentValue);
            }
        );

        return {
            prefixCls,

            // data
            data,

            // computed
            wrapperClasses,
            formatterValue,
            internalUpClasses,
            internalDownClasses,
            outsideUpClasses,
            outsideDownClasses,

            // methods
            focus,
            blur,
            handleChange,
            handleUp,
            handleDown,
            handleKeyDown,
        };
    },
    components: {
        IvueIcon,
        IvueButton,
    },
});
</script>
