<template>
    <div :class="wrapperClasses">
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import {
    computed,
    defineComponent,
    watch,
    provide,
    PropType,
    ref,
} from 'vue';
import { oneOf } from '../../utils/assist';

// type
import { Props, Size, RadioContextKey } from './types/radio-group';

const prefixCls = 'ivue-radio-group';

let seed = 0;
const now = Date.now();
const getUuid = () => `${prefixCls}_${now}_${seed++}`;

export default defineComponent({
    name: prefixCls,
    emits: ['update:modelValue', 'on-change'],
    props: {
        /**
         * 指定当前选中的项目数据。可以使用 v-model 双向绑定数据
         *
         * @type {String | Number}
         */
        modelValue: {
            type: [String, Number],
            default: '',
        },
        /**
         * name 属性
         *
         * @type {String}
         */
        name: {
            type: String,
            default: getUuid,
        },
        /**
         * 垂直排列
         *
         * @type {Boolean}
         */
        vertical: {
            type: Boolean,
            default: false,
        },
        /**
         * 可选值为 button 或不填，为 button 时使用按钮样式
         *
         * @type {String}
         */
        type: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['button']);
            },
        },
        /**
         * 按钮样式，可选值为 default 和 solid
         *
         * @type {String}
         */
        buttonStyle: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['default', 'solid']);
            },
            default: 'default',
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
    },
    setup(props: Props, { emit }) {
        // 当前值
        const currentValue = ref<string | number>(props.modelValue);

        // 外部样式
        const wrapperClasses = computed(() => {
            return [
                `${prefixCls}`,
                {
                    // 单选框的尺寸
                    [`${prefixCls}--${props.size}`]: !!props.size,
                    // 单选框的尺寸
                    [`${prefixCls}--${props.size}`]: !!props.size,
                    // 垂直排列
                    [`${prefixCls}--vertical`]: props.vertical,
                    // 按钮
                    [`${prefixCls}--${props.type}`]: !!props.type,
                    // 按钮样式
                    [`${prefixCls}--button--${props.buttonStyle}`]:
                        props.type === 'button' &&
                        props.buttonStyle !== 'default',
                },
            ];
        });

        // methods

        // 改变值
        const handleChange = (value: string | number) => {
            currentValue.value = value;

            emit('update:modelValue', value);
            emit('on-change', value);
        };

        // watch

        // 监听 v-model
        watch(
            () => props.modelValue,
            () => {
                // 当F前值是否不相等
                if (currentValue.value !== props.modelValue) {
                    currentValue.value = props.modelValue;
                }
            }
        );

        // provide

        provide(RadioContextKey, {
            name: props.name,
            currentValue: currentValue,
            change: handleChange,
        });

        return {
            prefixCls,

            // data
            currentValue,

            // computed
            wrapperClasses,

            // methods
            handleChange,
        };
    },
});
</script>
