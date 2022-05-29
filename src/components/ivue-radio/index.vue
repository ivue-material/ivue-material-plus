<template>
    <label :class="wrapperClass">
        <!-- 圆点 -->
        <span :class="contentClass">
            <span :class="innerClass" :style="innerStyles"></span>
            <!-- 输入框 -->
            <input
                type="radio"
                :class="inputClass"
                :name="data.groupName"
                :disabled="disabled"
                @change="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
            />
        </span>
        <!-- 内容 -->
        <slot>{{ label }}</slot>
    </label>
</template>

<script lang='ts'>
import {
    computed,
    defineComponent,
    PropType,
    reactive,
    watch,
    inject,
    onMounted,
} from 'vue';
import { oneOf } from '../../utils/assist';
import { isCssColor } from '../../utils/helpers';

const prefixCls = 'ivue-radio';

type Size = 'large' | 'small' | 'default';

export default defineComponent({
    name: prefixCls,
    emits: ['update:modelValue', 'on-change'],
    props: {
        /**
         * 只在单独使用时有效。可以使用 v-model 双向绑定数据
         *
         * @type {String | Number | Boolean}
         */
        modelValue: {
            type: [String, Number, Boolean],
            default: false,
        },
        /**
         * 选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
         *
         * @type {String | Number | Boolean}
         */
        trueValue: {
            type: [String, Number, Boolean],
            default: true,
        },
        /**
         * 没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
         *
         * @type {String | Number | Boolean}
         */
        falseValue: {
            type: [String, Number, Boolean],
            default: false,
        },
        /**
         * 指定当前选项的 value 值，组合会自动判断当前选择的项目
         *
         * @type {String, Number}
         */
        label: {
            type: [String, Number],
        },
        /**
         * 单选框的尺寸，可选值为 large、small、default 或者不设置
         *
         * @type {String}
         */
        size: {
            type: String as PropType<Size>,
            validator(value: string) {
                return oneOf(value, ['large', 'small', 'default']);
            },
            default() {
                return 'default';
            },
        },
        /**
         * 是否禁用当前项
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
        },
        /**
         * 颜色
         *
         * @type {String}
         */
        color: {
            type: String,
            default: 'primary',
        },
        /**
         * name 属性
         *
         * @type {String}
         */
        name: {
            type: String,
        },
        /**
         * 是否显示边框
         *
         * @type {Boolean}
         */
        border: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any, { emit }) {
        const IvueRadioGroup: any = inject('IvueRadioGroup', {
            default: null,
        });

        // data
        const data: any = reactive<{
            focusInner: boolean;
            groupName: string;
        }>({
            /**
             * input 焦点
             *
             * @type {Boolean}
             */
            focusInner: false,
            /**
             * 组合名称
             *
             * @type {String}
             */
            groupName: props.name,
        });

        // onMounted
        onMounted(() => {
            // 是否有组合
            if (IvueRadioGroup.name) {
                if (props.name && props.name !== IvueRadioGroup.name) {
                    /* eslint-disable no-console */
                    if (console.warn) {
                        console.warn('Name does not match Radio Group name.');
                    }
                } else {
                    data.groupName = IvueRadioGroup.name;
                }
            }
        });

        // 外层样式
        const wrapperClass = computed(() => {
            return [
                `${prefixCls}-wrapper`,
                {
                    [`${prefixCls}-group--item`]: IvueRadioGroup.name,
                    [`${prefixCls}-wrapper--checked`]: currentValue.value,
                    [`${prefixCls}-wrapper--disabled`]: props.disabled,
                    [`${prefixCls}-border`]: props.border,
                },
            ];
        });

        // 内容外层
        const contentClass = computed(() => {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-checked`]: currentValue.value,
                    [`${prefixCls}-disabled`]: props.disabled,
                },
            ];
        });

        // 圆点
        const innerClass = computed(() => {
            let obj = {
                [`${prefixCls}-focus`]: data.focusInner,
            };

            // 文字样式
            const isTextColor: any = setTextColor(props.color);

            if (isTextColor.color && !isCssColor(isTextColor.color)) {
                obj[isTextColor.color] = true;
            }

            return [`${prefixCls}-inner`, obj];
        });

        // 圆点
        const innerStyles = computed(() => {
            let obj: any = {};

            // 文字样式
            const isTextColor: any = setTextColor(props.color);

            if (isTextColor.color && isCssColor(isTextColor.color)) {
                obj.color = isTextColor.color;
            }

            return obj;
        });

        // 输入框
        const inputClass = computed(() => {
            return `${prefixCls}-input`;
        });

        // 当前值
        const currentValue = computed(() => {
            // 有组合
            if (IvueRadioGroup.name) {
                return IvueRadioGroup.data.currentValue === props.label;
            }
            // 没有组合
            else {
                return props.modelValue === props.trueValue;
            }
        });

        // methods

        // 改变
        const handleChange = (event) => {
            // 禁用
            if (props.disabled) {
                return false;
            }

            // 是否选中
            const checked = event.target.checked;

            // 设置 v-model
            const value = checked ? props.trueValue : props.falseValue;
            emit('update:modelValue', value);

            // 组合
            if (IvueRadioGroup.name) {
                // 是否有当前选项值
                if (props.label !== undefined) {
                    IvueRadioGroup.change(props.label);
                }
            }
            // 没有组合
            else {
                // 发送事件
                emit('on-change', value);
            }
        };

        // 获取焦点
        const handleFocus = () => {
            // input 焦点
            data.focusInner = true;
        };

        // 失去焦点
        const handleBlur = () => {
            // input 焦点
            data.focusInner = false;
        };

        // 设置文字颜色
        const setTextColor = (color: Record<string, any>) => {
            let style = {};

            // 是否是数组
            if (Array.isArray(color)) {
                style = {
                    color: `${color[0]}`,
                };
            } else if (isCssColor(color)) {
                style = {
                    color: `${color}`,
                };
            } else if (color) {
                const [colorName] = color.toString().trim().split(' ', 2);

                style = {
                    color: `${colorName}--text`,
                };
            }

            return style;
        };

        // watch

        // 监听 v-model
        watch(
            () => props.modelValue,
            (value) => {
                // 当前值不符合
                if (
                    !(value === props.trueValue || value === props.falseValue)
                ) {
                    throw 'Value should be trueValue or falseValue.';
                }
            }
        );

        return {
            prefixCls,

            data,

            // computed
            wrapperClass,
            contentClass,
            innerClass,
            innerStyles,
            inputClass,
            currentValue,

            // methods
            handleChange,
            handleFocus,
            handleBlur,
        };
    },
});
</script>