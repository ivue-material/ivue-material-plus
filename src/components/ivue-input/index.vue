<template>
    <div :class="wrapClasses">
        <template v-if="type !== 'textarea'">
            <!-- 前置内容，仅在 text 类型下有效 -->
            <div
                :class="[`${prefixCls}-group-prepend`, ...prependColor]"
                :style="prependStyle"
            >
                <slot name="prepend"></slot>
            </div>
            <!-- 输入框 -->
            <input
                :class="inputClass"
                :placeholder="placeholders"
                :spellcheck="spellcheck"
                :type="type"
                :disabled="disabled"
                :autocomplete="autocomplete"
                :readonly="readonly"
                :name="name"
                :value="currentValue"
                :autofocus="autofocus"
                :number="number"
                :id="id"
                :maxlength="maxlength"
                @keyup.enter="handleEnter"
                @keyup="handleKeyup"
                @keypress="handleKeypress"
                @keydown="handleKeydown"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                ref="input"
            />
        </template>
        <template v-else>
            <textarea ref="textarea"></textarea>
        </template>
    </div>
</template>

<script lang='ts'>
import {
    PropType,
    ref,
    computed,
    defineComponent,
    onMounted,
    nextTick
} from 'vue'

import { oneOf } from '../../utils/assist';
import CalcTextareaHeight from '../../utils/calc-textarea-height';


const prefixCls = 'ivue-input';

type Type = 'text' | 'textarea' | 'password' | 'url' | 'email' | 'date' | 'hidden';

type AutoComplete = 'on' | 'off';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 绑定的值，可使用 v-model 双向绑定
         *
         * @type {String, Number}
         */
        value: {
            type: [String, Number],
            default: ''
        },
        /*
        * 输入框类型，可选值为 text、password、textarea、url、email、date
        *
        * @type {String}
        */
        type: {
            type: String as PropType<Type>,
            validator(value: string) {
                return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date', 'hidden']);
            },
            default: 'text'
        },
        /**
         * 占位文本
         *
         * @type {String}
         */
        placeholders: {
            type: String,
            default: ''
        },
        /**
         * 原生的 spellcheck 属性
         *
         * @type {Boolean}
         */
        spellcheck: {
            type: Boolean,
            default: false
        },
        /**
         * 设置输入框为禁用状态
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * 原生的自动完成功能
         *
         * @type {String}
         */
        autocomplete: {
            type: String as PropType<AutoComplete>,
            validator(value: string) {
                return oneOf(value, ['on', 'off']);
            },
            default: 'off'
        },
        /**
         * 设置输入框为只读
         *
         * @type {Boolean}
         */
        readonly: {
            type: Boolean,
            default: false
        },
        /**
         * 输入框name
         *
         * @type {String}
         */
        name: {
            type: String
        },
        /**
         * 最大输入长度
         *
         * @type {Number}
         */
        maxlength: {
            type: Number
        },
        /**
         * id
         *
         * @type {String}
         */
        id: {
            type: String
        },
        /**
         * 自动获取焦点
         *
         * @type {Boolean}
         */
        autofocus: {
            type: Boolean,
            default: false
        },
        /**
         * 将用户的输入转换为 Number 类型
         *
         * @type {Boolean}
         */
        number: {
            type: Boolean,
            default: false
        },
        /**
         * prepend前置内容背景颜色
         *
         * @type {String}
         */
        prependBgColor: {
            type: String,
            default: '#f8f8f9'
        },
        /**
         * 自适应内容高度，仅在 textarea 类型下有效
         *  指定最小行数和最大行数
         *
         * @type {String}
         */
        autosize: {
            type: [Boolean, Object],
            default: false
        }
    },
    data() {
        return {
            prefixCls: prefixCls,
        }
    },
    // 组合式 API
    setup(props: any, { slots, emit }) {
        // 当前输入值
        const currentValue = ref(props.value);
        // 文本框样式
        const textareaStyles = ref({});

        // ref = textarea
        const textarea = ref(null);

        function isCssColor(color) {
            return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
        }


        // 是否有前置内容
        const prepend = computed(() => {
            let state = false;

            if (props.placeholders !== 'textarea') {
                state = slots.prepend !== undefined;
            }

            return state;
        })

        const prependColor = computed(() => {
            let _color = {};

            if (props.prependBgColor) {
                _color = { [props.prependBgColor]: true }
            }

            return [
                _color
            ]
        });

        const prependStyle = computed(() => {
            let _color = {};

            if (isCssColor(props.prependBgColor)) {
                _color = { 'background-color': `${props.prependBgColor}` };
            }

            return _color
        });

        const wrapClasses = computed(() => {
            return [
                `${prefixCls}-wrapper`,
                {
                    [`${prefixCls}-group`]: prepend
                }
            ]
        })


        // 按下回车键时触发
        const handleEnter = (event) => {
            emit('on-enter', event);
        }

        // 原生的 keyup 事件
        const handleKeyup = (event) => {
            emit('on-keyup', event);
        }

        // 原生的 keypress 事件
        const handleKeypress = (event) => {
            emit('on-keypress', event);
        }

        // 原生的 keydown 事件
        const handleKeydown = (event) => {
            emit('on-keydown', event);
        }

        // 设置当前值
        const setCurrentValue = (value) => {
            if (value === currentValue.value) {
                return;
            }

            // 是否开启了自适应内容高度，仅在 textarea 类型下有效
            nextTick(() => {
                resizeTextarea();
            });

            currentValue.value = value;
        }

        // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，
        // 如 { minRows: 2, maxRows: 6 }
        const resizeTextarea = () => {
            const autosize = props.autosize;

            // 是否是 textarea 是否开启了自适应高度
            if (!autosize || props.type !== 'textarea') {
                return;
            }

            const minRows = autosize.minRows;
            const maxRows = autosize.maxRows;

            // 文本框样式
            textareaStyles.value = CalcTextareaHeight(textarea, minRows, maxRows);
        }


        // 输入事件
        const handleInput = (event) => {
            let value = event.target.value;

            // 是否开启了 Number 类型
            if (props.number && value !== '') {
                value = Number.isNaN(Number(value)) ? value : Number(value);
            }

            // updated v-model
            emit('input', value);
            setCurrentValue(value);
            emit('on-change', event);
        }

        onMounted(() => {

        })


        return {
            wrapClasses,
            prependColor,
            prependStyle,
            handleEnter,
            handleKeyup,
            handleKeypress,
            handleKeydown,
            textareaStyles,
            currentValue,
            handleInput,
            textarea
        }
    },
})
</script>
