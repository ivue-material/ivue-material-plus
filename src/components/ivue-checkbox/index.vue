<template>
    <label :class="wrapperClass">
        <!-- 方框外层 -->
        <span :class="contentClass">
            <!-- 方框 -->
            <span :class="innerClass" :style="innerStyles"></span>
            <!-- input 有组合 -->
            <input
                v-if="isGroup"
                type="checkbox"
                :class="inputClass"
                :disabled="disabled"
                :value="label"
                v-model="data.groupModel"
                :name="name"
                @change="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
            />
            <!-- input 没有组合 -->
            <input
                v-else
                type="checkbox"
                :class="inputClass"
                :disabled="disabled"
                :name="name"
                :checked="currentValue"
                @change="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
            />
        </span>
        <!-- 内容 -->
        <span :class="`${prefixCls}-label-text`">
            <slot>{{ label }}</slot>
        </span>
        {{currentValueccc}}
    </label>
</template>

<script lang='ts'>
import {
    computed,
    defineComponent,
    reactive,
    watch,
    inject,
} from 'vue';
import { isCssColor, setTextColor } from '../../utils/helpers';

const prefixCls = 'ivue-checkbox';

export default defineComponent({
    name: prefixCls,
    emits: ['update:modelValue', 'on-change'],
    inject: {
        IvueCheckboxGroup: {
            default: null,
        },
    },
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
         * 是否禁用当前项
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
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
         * 颜色
         *
         * @type {String}
         */
        color: {
            type: String,
            default: 'primary',
        },
        /**
         * 指定当前选项的 value 值，组合会自动判断当前选择的项目
         *
         * @type {String, Number, Boolean}
         */
        label: {
            type: [String, Number, Boolean],
        },
    },
    computed: {
        currentValueccc() {
          console.log('this.IvueCheckboxGroup', this.IvueCheckboxGroup);
            // if (this.IvueCheckboxGroup) {
            //     return (
            //         this.IvueCheckboxGroup.modelValue.indexOf(this.label) >=
            //         0
            //     );
            // } else {
            //     return this.modelValue === this.trueValue;
            // }
        },
    },
    setup(props: any, { emit }) {
        // 组合
        const IvueCheckboxGroup: any = inject('IvueCheckboxGroup', {
            default: null,
        });

        // data
        const data: any = reactive<{
            focusInner: boolean;
            groupName: string;
            groupModel: Array<any>;
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
            /**
             * 组合的 v-model
             *
             * @type {Array}
             */
            groupModel: [],
        });

        // computed

        // 外层样式
        const wrapperClass = computed(() => {
            return [
                `${prefixCls}-wrapper`,
                {
                    [`${prefixCls}-wrapper--checked`]: currentValue.value,
                    [`${prefixCls}-group--item`]: isGroup.value,
                },
            ];
        });

        // 内容外层
        const contentClass = computed(() => {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-checked`]: currentValue.value,
                },
            ];
        });

        // 方框 class
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

        // 方框 style
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
            if (isGroup.value) {
                // return IvueCheckboxGroup.modelValue.indexOf(props.label) >= 0;
            } else {
                // 没有组合
                return props.modelValue === props.trueValue;
            }
        });

        // 是否有组合
        const isGroup = computed(() => {
            if (IvueCheckboxGroup) {
                return true;
            }

            return false;
        });

        // method

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

            // 有组合
            if (isGroup.value) {
                console.log(data.groupModel);
                IvueCheckboxGroup.change(data.groupModel);
            } else {
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

        // 监听组合 v-model
        watch(
            () => IvueCheckboxGroup.modelValue,
            (value) => {
                data.groupModel = value || [];

                console.log('监听组合 v-model');
            },
            {
                // 同步监听
                immediate: true,
            }
        );

        return {
            prefixCls,
            // data
            data,

            // computed
            wrapperClass,
            contentClass,
            innerClass,
            innerStyles,
            inputClass,
            currentValue,
            isGroup,

            // methods
            handleChange,
            handleFocus,
            handleBlur,
            IvueCheckboxGroup,
        };
    },
    watch: {
        'IvueCheckboxGroup.modelValue': {
            handler(val) {
                console.log('val', val);
            },
            immediate: true,
        },
    },
});
</script>
