<script lang="ts">
import {
    defineComponent,
    h,
    PropType,
    computed,
    watch,
    withDirectives,
    resolveDirective,
    ref,
} from 'vue';

import { oneOf } from '../../utils/assist';
import { colorable } from '../../utils/mixins/colorable';
import ripple from '../../utils/directives/ripple';
import { debugWarn } from '../../utils/error';

import { useFormItem, useFormItemInputId } from '../../hooks/index';

// type
import { Size, Props } from './types/switch';

const prefixCls = 'ivue-switch';

export default defineComponent({
    name: prefixCls,
    directives: {
        ripple,
    },
    emits: ['on-change', 'update:modelValue'],
    props: {
        /**
         * 浮雕按钮
         *
         * @type {Boolean}
         */
        emboss: {
            type: Boolean,
            default: false,
        },
        /**
         * 取消的颜色
         *
         * @type {String}
         */
        falseColor: {
            type: [String, Array],
        },
        /**
         * 是否禁用开关
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 禁用水波纹
         *
         * @type {Boolean}
         */
        rippleDisabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 加载中的开关
         *
         * @type {Boolean}
         */
        loading: {
            type: Boolean,
            default: false,
        },
        /**
         * 进度条颜色
         *
         * @type {String}
         */
        embossLoadingColor: {
            type: String,
            default: '',
        },
        /**
         * 选中时的值
         *
         * @type {String,Number,Boolean}
         */
        trueValue: {
            type: [String, Number, Boolean],
            default: true,
        },
        /**
         * 没有选中时的值
         *
         * @type {String,Number,Boolean}
         */
        falseValue: {
            type: [String, Number, Boolean],
            default: false,
        },
        /**
         * 指定当前是否开启，可以使用 v-model 双向绑定数据
         *
         * @type {String,Number,Boolean}
         */
        modelValue: {
            type: [String, Number, Boolean],
            default: false,
        },
        /**
         * 开关的尺寸，可选值为large、small、default或者不写。建议如果使用了2个汉字的文字，使用 large
         *
         * @type {String,Number,Boolean}
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
         * 返回 Promise 可以阻止切换
         *
         * @type {Function}
         */
        beforeChange: Function,
        /**
         * 颜色
         *
         * @type {String | Array}
         */
        color: {
            type: [String, Array],
            default: '',
        },
        /**
         * 文字颜色
         *
         * @type {String}
         */
        textColor: {
            type: String,
            default: '#ffffff',
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
    setup(props: Props, { emit }) {
        // mixins
        const { setTextColor } = colorable(props);

        // 当前选择状态
        const currentValue = ref<string | boolean | number>(props.modelValue);

        // computed

        // 外部样式
        const wrapClasses = computed(() => {
            // 是否开启浮雕
            if (props.emboss) {
                return {
                    [`${prefixCls}-emboss--wrapper`]: true,
                    [`${prefixCls}-emboss--disabled`]: props.disabled,
                };
            }

            return {
                [`${prefixCls}`]: true,
                [`${prefixCls}-false`]: props.falseColor,
                [`${prefixCls}-checked`]:
                    currentValue.value === props.trueValue,
                [`${prefixCls}-disabled`]: props.disabled,
                [`${prefixCls}-loading`]: props.loading,
                [`${prefixCls}-${props.size}`]: props.size,
            };
        });

        // 浮雕样式
        const embossClass = computed(() => {
            return {
                [`${prefixCls}-emboss`]: true,
                [`${prefixCls}-emboss--disabled`]: props.disabled,
                [`${prefixCls}-emboss--${props.size}`]: props.size,
            };
        });

        // 浮雕进度条
        const embossTrackClass = computed(() => {
            return [
                `${prefixCls}-emboss--track`,
                {
                    [`${prefixCls}-emboss--track__checked`]:
                        currentValue.value === props.trueValue,
                },
            ];
        });

        // 浮雕指示器
        const embossThumbClass = computed(() => {
            return [
                `${prefixCls}-emboss--thumb`,
                {
                    [`${prefixCls}-emboss--thumb__checked`]:
                        currentValue.value === props.trueValue,
                },
            ];
        });

        // 进度条样式
        const embossLoadingClass = computed(() => {
            return {
                [`${prefixCls}-emboss--loading`]: props.loading,
            };
        });

        // 浮雕ripple
        const embossRippleClass = computed(() => {
            return [
                `${prefixCls}-emboss--ripple`,
                {
                    [`${prefixCls}-emboss--ripple__checked`]:
                        currentValue.value === props.trueValue,
                },
            ];
        });

        // 设置背景颜色
        const setColor = computed(() => {
            let color;

            // 激活
            if (currentValue.value === props.trueValue) {
                color = props.color;
            }

            if (currentValue.value === props.falseValue) {
                color = props.falseColor;
            }

            return color;
        });

        // 内部文字样式
        const innerClasses = computed(() => {
            return `${prefixCls}-inner`;
        });

        // 更新 ripple
        const computedRipple = computed(() => {
            if (props.rippleDisabled || props.disabled) {
                return false;
            }

            return {
                center: true,
            };
        });

        // methods

        // 切换状态
        const toggle = (event: Event) => {
            if (event) {
                event.preventDefault();
            }

            if (props.disabled || props.loading) {
                return false;
            }

            // 是否有 Promise
            if (!props.beforeChange) {
                return handleToggle();
            }

            const before = props.beforeChange();

            if (before && before.then) {
                before.then(() => {
                    handleToggle();
                });
            } else {
                handleToggle();
            }
        };

        // 切换状态
        const handleToggle = () => {
            const checked =
                currentValue.value === props.trueValue
                    ? props.falseValue
                    : props.trueValue;

            // 修改 v-modal
            currentValue.value = checked;

            emit('update:modelValue', checked);

            emit('on-change', checked);
        };

        // 监听value
        watch(
            () => props.modelValue,
            (value) => {
                if (value !== props.trueValue && value !== props.falseValue) {
                    throw 'Value should be trueValue or falseValue.';
                }

                currentValue.value = value;

                // 输入时是否触发表单的校验
                if (props.validateEvent) {
                    formItem
                        ?.validate?.('change')
                        .catch((err) => debugWarn(err));
                }
            }
        );

        // 设置表单对应的输入框id
        const { formItem } = useFormItem();

        // 输入框id
        const { inputId } = useFormItemInputId(props, {
            formItemContext: formItem,
        });

        return {
            // data
            currentValue,
            inputId,

            // computed
            wrapClasses,
            embossClass,
            embossTrackClass,
            embossThumbClass,
            embossLoadingClass,
            embossRippleClass,
            innerClasses,
            computedRipple,
            setColor,

            // methods
            toggle,
            setTextColor,
        };
    },
    render() {
        // 解析指令
        const rippleDirective = resolveDirective('ripple');

        // 渲染浮雕
        const genEmboss = () => {
            return h(
                'div',
                {
                    class: this.embossClass,
                },
                [
                    h(
                        'span',
                        this.setTextColor(this.setColor, {
                            class: this.embossTrackClass,
                        })
                    ),
                    h(
                        'span',
                        this.setTextColor(this.setColor, {
                            class: this.embossThumbClass,
                        }),
                        [
                            h(
                                'span',
                                this.setTextColor(this.embossLoadingColor, {
                                    class: this.embossLoadingClass,
                                })
                            ),
                        ]
                    ),
                    withDirectives(
                        h('span', {
                            class: this.embossRippleClass,
                        }),
                        [[rippleDirective, this.computedRipple]]
                    ),
                ]
            );
        };

        // 渲染内容
        const genInner = () => {
            const name = this.currentValue === this.trueValue;
            const close = this.currentValue === this.falseValue;

            return h(
                'span',
                {
                    class: this.innerClasses,
                },
                [
                    name
                        ? this.$slots.open && this.$slots.open()
                        : close
                        ? this.$slots.close && this.$slots.close()
                        : '',
                ]
            );
        };

        // 输入框
        const genInput = () => {
            return h('input', {
                class: `${prefixCls}-input`,
                id: this.inputId,
                type: 'checkbox',
                role: 'switch',
                trueValue: this.trueValue,
                falseValue: this.falseValue,
                ariaChecked: this.currentValue,
                ariaDisabled: this.disabled,
                checked: this.currentValue,
            });
        };

        return h(
            'span',
            this.setTextColor(!this.emboss && this.setColor, {
                class: this.wrapClasses,
                tabindex: '0',
                onClick: this.toggle,
            }),
            [genInput(), this.emboss && genEmboss(), genInner()]
        );
    },
});
</script>
