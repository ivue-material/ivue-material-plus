<template>
    <li
        v-show="data.visible"
        :data-visible="data.visible"
        data-select="select-item"
        :class="classes"
        :style="styles"
        v-ripple="ripple"
        @click.stop="handleOptionClick"
        @mousedown.prevent
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
    >
        <slot>{{ showLabel }}</slot>
    </li>
</template>

<script lang='ts'>
import {
    defineComponent,
    computed,
    getCurrentInstance,
    inject,
    reactive,
    onBeforeUnmount,
    onMounted,
    nextTick,
} from 'vue';

import ripple from '../../utils/directives/ripple';

// type
import { Props, Data } from './types/option';
import { SelectContextKey } from './types/select';
import { SelectGroupContextKey } from './types/option-group';

const prefixCls = 'ivue-select-item';

function isCssColor(color: string) {
    return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
}

export default defineComponent({
    name: 'ivue-option',
    componentName: 'ivue-select-item',
    directives: {
        ripple,
    },
    props: {
        /**
         * 启用/禁用涟漪
         *
         * @type {Boolean}
         */
        ripple: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否禁用选项
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否选择当前项
         *
         * @type {Boolean}
         */
        selected: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否获取到焦点
         *
         * @type {Boolean}
         */
        isFocused: {
            type: Boolean,
            default: false,
        },
        /**
         * 渲染的 label
         *
         * @type {String, Number}
         */
        label: {
            type: [String, Number],
        },
        /**
         * 渲染的 value
         *
         * @type {String, Number}
         */
        value: {
            type: [String, Number],
        },
        /**
         * 选择选项时的颜色
         *
         * @type {String | Array}
         */
        selectedColor: {
            type: [String, Array],
        },
        /**
         * hover 选择选项时的颜色
         *
         * @type {String | Array}
         */
        hoverColor: {
            type: [String, Array],
        },
        /**
         * 是否允许用户创建新条目，需开启 filterable
         *
         * @type {Boolean}
         */
        allowCreate: {
            type: Boolean,
            default: false,
        },
        /**
         * 显示创建的选项
         *
         * @type {Boolean}
         */
        showCreateItem: {
            type: Boolean,
            default: false,
        },
        /**
         * 输入框输入数据
         *
         * @type {String}
         */
        filterQuery: {
            type: String,
            default: '',
        },
    },
    setup(props: Props, { emit }) {
        // inject
        const select = inject(SelectContextKey);

        // 有选项组
        const selectGroup = inject(SelectGroupContextKey, {
            disabled: false,
        });

        // data
        const data = reactive<Data>({
            /**
             * 是否获取到焦点
             *
             * @type {Boolean}
             */
            isFocused: false,
            /**
             * 是否禁用选项
             *
             * @type {Boolean}
             */
            disabled: props.disabled,
            /**
             * 鼠标悬浮
             *
             * @type {Boolean}
             */
            hasMouseHover: false,
            /**
             * 是否显示
             *
             * @type {Boolean}
             */
            visible: true,
        });

        // vm
        const { proxy } = getCurrentInstance();

        // computed

        // classes
        const classes = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-disabled`]: isDisabled.value,
                    [`${prefixCls}-focus`]: data.isFocused,
                    [`${prefixCls}-selected`]:
                        itemSelected.value && !select.props.autoComplete,
                },
            ];
        });

        // styles
        const styles = computed(() => {
            let obj = {};

            // 单选触发
            if (
                (itemSelected.value && !select.props.autoComplete) ||
                data.isFocused
            ) {
                // 单选
                if (!select.props.multiple) {
                    obj = {
                        ...obj,
                        ...setBackgroundColor(select.props.selectedColor),
                    };
                }
                // 多选
                else {
                    if (data.isFocused) {
                        obj = {
                            ...obj,
                            ...setBackgroundColor(select.props.selectedColor),
                        };
                    } else {
                        obj = {
                            ...obj,
                            ...setTextColor(select.props.selectedColor),
                        };
                    }
                }
            }

            // 鼠标悬浮
            if (data.hasMouseHover && !isDisabled.value) {
                // 单选
                if (!select.props.multiple) {
                    obj = {
                        ...obj,
                        ...setBackgroundColor(
                            props.hoverColor || select.props.hoverColor
                        ),
                    };
                }
                // 多选
                else {
                    obj = {
                        ...obj,
                        ...setBackgroundColor(
                            props.selectedColor || select.props.selectedColor
                        ),
                        color: '#ffffff',
                    };
                }
            }

            return obj;
        });

        // 是否禁用
        const isDisabled = computed(() => {
            return data.disabled || selectGroup.disabled;
        });

        // 是否显示label
        const showLabel = computed(() => {
            return props.label ? props.label : props.value;
        });

        // 获取label
        const getLabel = computed(() => {
            return props.label || proxy.$el.textContent;
        });

        // 当前选项是否激活
        const itemSelected = computed(() => {
            // 单选激活
            if (!select.props.multiple) {
                return isEqual(props.value, select.props.modelValue);
            }
            // 多选激活
            else {
                return contains(select.props.modelValue, props.value);
            }
        });

        // computed
        const isObject = computed(() => {
            return (
                Object.prototype.toString.call(props.value).toLowerCase() ===
                '[object object]'
            );
        });

        // methods

        // 点击选项
        const handleOptionClick = () => {
            // 禁用
            if (isDisabled.value) {
                return;
            }

            // 开启了创建列表
            if (props.allowCreate) {
                handleCreateItem();
            }
            // 普通点击
            else {
                select.handleOptionClick({
                    value: props.value,
                    label: getLabel.value,
                });
            }
        };

        // 创建新列表
        const handleCreateItem = () => {
            if (
                props.allowCreate &&
                props.filterQuery !== '' &&
                props.showCreateItem
            ) {
                emit('on-create');
            }
        };

        // 两个值是否相等
        const isEqual = (a: string | number, b: string | number) => {
            if (!isObject.value) {
                return a === b;
            }
        };

        // 是否包含元素
        const contains = (
            arr: (string | number)[] = [],
            target: string | number
        ) => {
            if (!isObject.value) {
                return arr && arr.indexOf(target) > -1;
            }
        };

        // 设置背景颜色
        const setBackgroundColor = (color: string | string[]) => {
            let style = {};

            // 是否是数组
            if (Array.isArray(color)) {
                style = {
                    background: `linear-gradient(135deg,${color[0]} 0%, ${color[1]} 100%)`,
                    color: '#fff',
                };
            } else if (isCssColor(color)) {
                style = {
                    'background-color': `${color}`,
                    color: '#fff',
                };
            }

            return style;
        };

        // 设置文字颜色
        const setTextColor = (color: string | string[]) => {
            let style = {};

            // 是否是数组
            if (Array.isArray(color)) {
                style = {
                    color: `${color[0]}`,
                };
            } else if (isCssColor(`${color}`)) {
                style = {
                    color: `${color}`,
                };
            }

            return style;
        };

        // 鼠标进入
        const handleMouseenter = () => {
            if (!select.dropVisible) {
                return;
            }

            data.hasMouseHover = true;
        };

        // 鼠标离开
        const handleMouseleave = () => {
            data.hasMouseHover = false;
        };

        // onMounted
        onMounted(() => {
            if (!props.allowCreate) {
                // 插入dom
                select.options.push(proxy);
            }
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            nextTick(() => {
                select.onOptionDestroy(
                    select.options
                        .map((item) => item.value)
                        .indexOf(props.value)
                );
            });
        });

        return {
            // data,
            data,

            // computed
            classes,
            styles,
            showLabel,
            getLabel,
            itemSelected,
            isDisabled,

            // methods
            handleOptionClick,
            handleMouseenter,
            handleMouseleave,
            setBackgroundColor,
        };
    },
});
</script>
