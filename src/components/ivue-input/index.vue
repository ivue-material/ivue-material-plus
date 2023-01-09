<template>
    <div :class="wrapClasses">
        <template v-if="type !== 'textarea'">
            <!-- 前置内容，仅在 text 类型下有效 -->
            <div
                :class="[`${prefixCls}-group-prepend`, ...prependColor]"
                :style="prependStyle"
                v-if="prepend"
            >
                <slot name="prepend"></slot>
            </div>
            <!-- 输入框 -->
            <div :class="contentClass">
                <!-- 首部图标 -->
                <span :class="[`${prefixCls}-prefix`]" v-show="showPrefix">
                    <slot name="prefix">
                        <i class="ivue-icon">{{ prefix }}</i>
                    </slot>
                </span>

                <input
                    :class="inputClass"
                    :placeholder="placeholder"
                    :spellcheck="spellcheck"
                    :type="currentType"
                    :disabled="inputDisabled"
                    :autocomplete="autocomplete"
                    :readonly="readonly"
                    :name="name"
                    :value="currentValue"
                    :autofocus="autofocus"
                    :number="number"
                    :id="inputId || id"
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

                <!-- 重置选择 -->
                <div
                    :class="[`${prefixCls}-icon`, `${prefixCls}-clear`]"
                    v-if="clearable && currentValue && !disabled"
                    @click.stop="handleClear"
                >
                    <ivue-icon
                        :class="[
                            `${prefixCls}-icon-clear`,
                            showSuffix ? 'is-suffix' : '',
                        ]"
                    >{{ clearIcon }}</ivue-icon>
                </div>
                <!-- 字数统计 -->
                <span
                    :class="`${prefixCls}-word-count`"
                    v-if="showWordLimit"
                >{{ textLength }}/{{ upperLimit }}</span>
                <!-- 是否显示密码 -->
                <div
                    :class="[`${prefixCls}-suffix`, `${prefixCls}-password`]"
                    v-if="password"
                    @click="handleShowPassword"
                >
                    <template v-if="showPassword">
                        <slot name="password-on">
                            <i class="ivue-icon">{{ passwordIcon.on }}</i>
                        </slot>
                    </template>
                    <template v-else>
                        <slot name="password-off">
                            <i class="ivue-icon">{{ passwordIcon.off }}</i>
                        </slot>
                    </template>
                </div>
                <!-- 尾部图标 -->
                <span :class="[`${prefixCls}-suffix`]" v-if="showSuffix" @click.stop="handleSuffix">
                    <slot name="suffix">
                        <i class="ivue-icon">{{ suffix }}</i>
                    </slot>
                </span>
            </div>
            <!-- 搜索型输入框 -->
            <template v-if="search && enterButton === false">
                <i :class="[`${prefixCls}-icon`, 'ivue-icon']" @click="handleSearch">search</i>
            </template>
            <template v-else-if="search && enterButton">
                <div
                    :class="[
                            `${prefixCls}-group-append`,
                            `${prefixCls}-search`,
                        ]"
                    @click="handleSearch"
                >
                    <i :class="['ivue-icon']" v-if="enterButton === true">search</i>
                    <template v-else>{{ enterButton }}</template>
                </div>
            </template>
            <!-- 后置内容，仅在 text 类型下有效 -->
            <div
                :class="[`${prefixCls}-group-append`, ...appendColor]"
                :style="appendStyle"
                v-if="append"
            >
                <slot name="append"></slot>
            </div>
        </template>
        <template v-else>
            <textarea
                :id="inputId || id"
                :name="name"
                :disabled="inputDisabled"
                :class="textareaClasses"
                :style="textareaStyles"
                :value="currentValue"
                :placeholder="placeholder"
                :autofocus="autofocus"
                :readonly="readonly"
                :rows="rows"
                :maxlength="maxlength"
                :spellcheck="spellcheck"
                :wrap="wrap"
                @keyup.enter="handleEnter"
                @keyup="handleKeyup"
                @keypress="handleKeypress"
                @keydown="handleKeydown"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="handleInput"
                ref="textarea"
            ></textarea>
            <!-- 字数统计 -->
            <span
                :class="`${prefixCls}-word-count`"
                v-if="showWordLimit"
            >{{ textLength }}/{{ upperLimit }}</span>
        </template>
    </div>
</template>

<script lang='ts'>
import {
    PropType,
    ref,
    computed,
    defineComponent,
    nextTick,
    watch,
    onMounted,
} from 'vue';

import { calcTextareaHeight } from '../../utils/calc-textarea-height';
import { oneOf } from '../../utils/assist';
import { useFormItem, useFormItemInputId } from '../../hooks/index';
import { debugWarn } from '../../utils/error';
import { useDisabled } from '../../hooks';

// component
import IvueIcon from '../ivue-icon/index.vue';

// type
import type { Props, TextareaStyles, Size } from './types/input';

function isCssColor(color) {
    return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
}

const prefixCls = 'ivue-input';

export default defineComponent({
    name: prefixCls,
    emits: [
        'update:modelValue',
        'on-change',
        'on-focus',
        'on-blur',
        'on-clear',
        'on-enter',
        'on-keyup',
        'on-keypress',
        'on-keydown',
        'on-suffix',
        'on-search',
    ],
    // 声明事件
    props: {
        /**
         * 绑定的值，可使用 v-model 双向绑定
         *
         * @type {String | Number}
         */
        modelValue: {
            type: [String, Number],
            default: '',
        },
        /**
         * 输入框类型
         *
         * @type {String}
         */
        type: {
            type: String,
            default: 'text',
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
         * 原生的 spellcheck 属性
         *
         * @type {Boolean}
         */
        spellcheck: {
            type: Boolean,
            default: false,
        },
        /**
         * 设置输入框为禁用状态
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 原生的自动完成功能
         *
         * @type {String}
         */
        autocomplete: {
            type: String,
            default: 'off',
        },
        /**
         * 设置输入框为只读
         *
         * @type {Boolean}
         */
        readonly: {
            type: Boolean,
            default: false,
        },
        /**
         * 输入框name
         *
         * @type {String}
         */
        name: {
            type: String,
        },
        /**
         * 最大输入长度
         *
         * @type {Number}
         */
        maxlength: {
            type: Number,
        },
        /**
         * id
         *
         * @type {String}
         */
        id: {
            type: String,
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
         * 只允许用户输入number
         *
         * @type {Boolean}
         */
        number: {
            type: Boolean,
            default: false,
        },
        /**
         * prepend前置内容背景颜色
         *
         * @type {String}
         */
        prependBgColor: {
            type: String,
            default: '#f8f8f9',
        },
        /**
         * append前后置内容背景颜色
         *
         * @type {String}
         */
        appendBgColor: {
            type: String,
            default: '#f8f8f9',
        },
        /**
         * 输入框头部图标
         *
         * @type {String}
         */
        prefix: {
            type: String,
            default: '',
        },
        /**
         * 输入框尾部图标
         *
         * @type {String}
         */
        suffix: {
            type: String,
            default: '',
        },
        /**
         * 输入框尺寸，可选值为large、small、default或者不设置
         *
         *
         * @type {String}
         */
        size: {
            type: String as PropType<Size>,
            validator(value: string) {
                return oneOf(value, ['small', 'large', 'default']);
            },
            default() {
                return 'default';
            },
        },
        /**
         * 是否显示清除按钮
         *
         * @type {Boolean}
         */
        clearable: {
            type: Boolean,
            default: false,
        },
        /**
         * 输入框清除图标
         *
         * @type {String}
         */
        clearIcon: {
            type: String,
            default: 'cancel',
        },
        /**
         * 是否显示输入字数统计，可以配合 maxlength 使用
         *
         * @type {Boolean}
         */
        showWordLimit: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否显示切换密码图标
         *
         * @type {Boolean}
         */
        password: {
            type: Boolean,
            default: false,
        },
        /**
         * 密码图标
         *
         * @type {Object}
         */
        passwordIcon: {
            type: Object,
            default: () => {
                return {
                    on: 'visibility',
                    off: 'visibility_off',
                };
            },
        },
        /**
         * 是否显示为搜索型输入框
         *
         * @type {Boolean}
         */
        search: {
            type: Boolean,
            default: false,
        },
        /**
         * 开启 search 时可用，是否有确认按钮，可设为按钮文字
         *
         * @type {Boolean, String}
         */
        enterButton: {
            type: [Boolean, String],
            default: false,
        },
        /**
         * 文本域默认行数，仅在 textarea 类型下有效
         *
         * @type {Number}
         */
        rows: {
            type: Number,
            default: 2,
        },
        /**
         * 自适应内容高度，仅在 textarea 类型下有效
         * 指定最小行数和最大行数
         *
         * @type {Object}
         */
        autoHeight: {
            type: [Boolean, Object],
            default: false,
        },
        /**
         * 是否显示边框
         *
         * @type {Boolean}
         */
        border: {
            type: Boolean,
            default: true,
        },
        /**
         * 是否使用纯value
         *
         * @type {Boolean}
         */
        isValue: {
            type: Boolean,
            default: false,
        },
        /**
         * 原生的 wrap 属性，可选值为 hard 和 soft，仅在 textarea 下生效
         *
         * @type {String}
         */
        wrap: {
            validator(value: string) {
                return oneOf(value, ['hard', 'soft']);
            },
            default: 'soft',
        },
        /**
         * 自定义输入方法
         *
         * @type {Boolean}
         */
        inputFunction: {
            type: Function,
        },
        /**
         * 输入时是否触发表单的校验
         *
         * @type {Boolean}
         */
        validateEvent: {
            type: Boolean,
            default: true,
        },
    },
    // 组合式 API
    setup(props: Props, { slots, emit }) {
        // 当前输入值
        const currentValue = ref<string | number>(props.modelValue);

        // 文本框样式
        const textareaStyles = ref<TextareaStyles>({});

        // 显示密码
        const showPassword = ref<boolean>(false);

        // ref = textarea
        const textarea = ref<HTMLTextAreaElement>();
        // ref = input
        const input = ref<HTMLInputElement>();

        // 输入框禁用
        const inputDisabled = useDisabled();

        // computed

        // 外层样式
        const wrapClasses = computed(() => {
            return [
                `${prefixCls}-wrapper`,
                {
                    [`${prefixCls}-wrapper-${props.size}`]: !!props.size,
                    [`${prefixCls}-wrapper-clearable`]: props.clearable,
                    [`${prefixCls}-type-${props.type}`]: props.type,
                    [`${prefixCls}-group`]:
                        prepend.value ||
                        append.value ||
                        (props.search && props.enterButton),
                    [`${prefixCls}-group-${props.size}`]:
                        (prepend.value ||
                            append.value ||
                            (props.search && props.enterButton)) &&
                        !!props.size,
                    [`${prefixCls}-group-with-prepend`]: prepend.value,
                    [`${prefixCls}-group-with-append`]:
                        append.value || (props.search && props.enterButton),
                },
            ];
        });

        // 输入框外层样式
        const contentClass = computed(() => {
            return [
                `${prefixCls}-content`,
                {
                    [`${prefixCls}-group`]:
                        prepend.value ||
                        append.value ||
                        (props.search && props.enterButton),
                    [`${prefixCls}-no-border`]: !props.border,
                    [`${prefixCls}-content--prepend`]: prepend.value,
                    [`${prefixCls}-content--append`]:
                        append.value || (props.search && props.enterButton),
                    [`${prefixCls}-content-disabled`]: inputDisabled.value,
                },
            ];
        });

        // 输入框样式
        const inputClass = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-${props.size}`]: !!props.size,
                    [`${prefixCls}-with-prefix`]: showPrefix.value,
                    [`${prefixCls}-with-suffix`]:
                        showSuffix.value ||
                        (props.search && props.enterButton === false),
                    [`${prefixCls}-disabled`]: inputDisabled.value,
                    [`${prefixCls}-no-border`]: !props.border,
                },
            ];
        });

        // 文本框样式
        const textareaClasses = computed(() => {
            return [
                prefixCls,
                `${prefixCls}-textarea`,
                {
                    [`${prefixCls}-disabled`]: inputDisabled.value,
                    [`${prefixCls}-no-border`]: !props.border,
                },
            ];
        });

        // 前置内容背景
        const prependColor = computed(() => {
            let _color = {};

            if (!isCssColor(props.prependBgColor)) {
                _color = { [props.prependBgColor]: true };
            }

            return [_color];
        });

        // 前置内容背景
        const prependStyle = computed(() => {
            let _color = {};

            if (isCssColor(props.prependBgColor)) {
                _color = { 'background-color': `${props.prependBgColor}` };
            }

            return _color;
        });

        // 后置内容背景
        const appendColor = computed(() => {
            let _color = {};

            if (!isCssColor(props.appendBgColor)) {
                _color = { [props.appendBgColor]: true };
            }

            return [_color];
        });

        // 后置内容背景
        const appendStyle = computed(() => {
            let _color = {};

            if (isCssColor(props.appendBgColor)) {
                _color = { 'background-color': `${props.appendBgColor}` };
            }

            return _color;
        });

        // 输入的内容
        const nativeInputValue = computed(() => {
            return props.modelValue;
        });

        // 输入上限
        const upperLimit = computed(() => {
            return props.maxlength;
        });

        // 监听输入的长度
        const textLength = computed(() => {
            if (typeof currentValue.value === 'number') {
                return String(currentValue.value).length;
            }

            return (currentValue.value || '').length;
        });

        // 获取当前输入框type
        const currentType = computed(() => {
            let type = props.type;

            if (type === 'password' && props.password && showPassword.value) {
                type = 'text';
            }

            return type;
        });

        // 是否有前置内容
        const prepend = computed(() => {
            let state = false;

            if (props.type !== 'textarea') {
                state = slots.prepend !== undefined;
            }

            return state;
        });

        // 是否有后置内容
        const append = computed(() => {
            let state = false;

            if (props.type !== 'textarea') {
                state = slots.append !== undefined;
            }

            return state;
        });

        // 是否显示输入框头部图标
        const showPrefix = computed(() => {
            let state = false;

            if (props.type !== 'textarea') {
                state = props.prefix !== '' || slots.prefix !== undefined;
            }

            return state;
        });

        // 是否显示输入框尾部图标
        const showSuffix = computed(() => {
            let state = false;

            if (props.type !== 'textarea') {
                state = props.suffix !== '' || slots.suffix !== undefined;
            }

            return state;
        });

        // methods

        // 按下回车键时触发
        const handleEnter = (event: Event) => {
            emit('on-enter', event);
        };

        // 原生的 keyup 事件
        const handleKeyup = (event: Event) => {
            emit('on-keyup', event);
        };

        // 原生的 keypress 事件
        const handleKeypress = (event: Event) => {
            emit('on-keypress', event);
        };

        // 原生的 keydown 事件
        const handleKeydown = (event: Event) => {
            emit('on-keydown', event);
        };

        // 尾部图标点击事件
        const handleSuffix = (event: Event) => {
            emit('on-suffix', event);
        };

        // 更新value
        const setNativeInputValue = () => {
            if (props.modelValue === currentValue.value) {
                return;
            }

            currentValue.value = nativeInputValue.value;
        };

        // 设置当前值
        const setCurrentValue = (value: string | number) => {
            if (value === currentValue.value) {
                return;
            }

            nextTick(() => {
                resizeTextarea();
            });

            currentValue.value = value;

            if (!props.isValue) {
                nextTick(() => {
                    setNativeInputValue();
                });
            }
        };

        // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，
        // 如 { minRows: 2, maxRows: 6 }
        const resizeTextarea = () => {
            const autoHeight = props.autoHeight;

            // 是否是 textarea 是否开启了自适应高度
            if (!autoHeight || props.type !== 'textarea') {
                return;
            }

            const minRows = autoHeight.minRows;
            const maxRows = autoHeight.maxRows;

            // 文本框样式
            textareaStyles.value = calcTextareaHeight(
                textarea.value,
                minRows,
                maxRows
            );
        };

        // 输入事件
        const handleInput = (event: Event) => {
            let value = (event.target as HTMLInputElement).value;

            // 是否开启了 Number 类型
            if (props.number) {
                value = value.replace(/[^\d]+/g, '');

                (event.target as HTMLInputElement).value = value;
            }

            // 自定义输入方法
            if (props.inputFunction) {
                value = props.inputFunction(value);

                (event.target as HTMLInputElement).value = value;
            }

            // updated v-model
            emit('update:modelValue', value);

            setCurrentValue(value);

            emit('on-change', (event.target as HTMLInputElement).value);
        };

        // 输入框聚焦时触发
        const handleFocus = (event: Event) => {
            emit('on-focus', event);
        };

        // 输入框失去焦点时触发
        const handleBlur = (event: Event) => {
            emit('on-blur', event);

            if (props.validateEvent) {
                formItem?.validate?.('blur').catch((err) => debugWarn(err));
            }
        };

        // 清除数据
        const handleClear = () => {
            emit('update:modelValue', '');

            setCurrentValue('');

            emit('on-clear');

            emit('on-change', '');
        };

        // 获取焦点
        const focus = (option) => {
            const $el =
                props.type === 'textarea' ? textarea.value : input.value;

            // 获取焦点
            $el.focus(option);

            // 选择内容
            const { cursor } = option || {};

            if (cursor) {
                const len = $el.value.length;

                switch (cursor) {
                    case 'start':
                        $el.setSelectionRange(0, 0);
                        break;
                    case 'end':
                        $el.setSelectionRange(len, len);
                        break;
                    default:
                        $el.setSelectionRange(0, len);
                }
            }
        };

        // 失去焦点
        const blur = () => {
            if (props.type === 'textarea') {
                textarea.value.blur();
            } else {
                input.value.blur();
            }
        };

        // 是否显示密码
        const handleShowPassword = () => {
            // 是否禁用
            if (inputDisabled.value) {
                return false;
            }

            showPassword.value = !showPassword.value;

            // 焦点
            focus(null);

            const len = `${currentValue.value}`.length;

            setTimeout(() => {
                input.value.setSelectionRange(len, len);
            }, 0);
        };

        // 点击搜索
        const handleSearch = () => {
            if (inputDisabled.value) {
                return false;
            }

            input.value.focus();

            emit('on-search', currentValue.value);
        };

        // 监听value
        watch(
            () => props.modelValue,
            (value) => {
                setCurrentValue(value);

                // 输入时是否触发表单的校验
                if (props.validateEvent) {
                    formItem
                        ?.validate?.('change')
                        .catch((err) => debugWarn(err));
                }
            }
        );

        // native input value is set explicitly
        // do not use v-model / :value in template
        watch(nativeInputValue, () => {
            setNativeInputValue();
        });

        // when change between <input> and <textarea>,
        // update DOM dependent value and styles
        watch(
            () => props.type,
            () => {
                nextTick(() => {
                    // 更新value
                    setNativeInputValue();
                    // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，
                    resizeTextarea();
                });
            }
        );

        // onMounted
        onMounted(() => {
            // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，
            resizeTextarea();
        });

        // 设置表单对应的输入框id
        const { formItem } = useFormItem();

        // 输入框id
        const { inputId } = useFormItemInputId(props, {
            formItemContext: formItem,
        });

        return {
            prefixCls,

            // data
            inputId,
            inputDisabled,

            // computed
            wrapClasses,
            contentClass,
            inputClass,
            textareaStyles,
            textareaClasses,
            prependStyle,
            prependColor,
            appendColor,
            appendStyle,
            upperLimit,
            textLength,
            currentType,
            prepend,
            append,
            showPrefix,
            showSuffix,

            // methods
            handleEnter,
            handleKeyup,
            handleKeypress,
            handleKeydown,
            handleFocus,
            handleBlur,
            handleInput,
            handleClear,
            setCurrentValue,
            handleShowPassword,
            handleSuffix,
            handleSearch,
            focus,
            blur,

            // data
            showPassword,
            currentValue,
            textarea,
            input,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
