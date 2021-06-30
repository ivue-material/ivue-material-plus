<template>
    <div
        :class="classes"
        v-click-outside[capture]="handleClickOutside"
        v-click-outside:[capture].mousedown="handleClickOutside"
    >
        <div
            :class="selectionClasses"
            :tabindex="selectTabindex"
            @blur="handleHeaderFocus"
            @focus="handleHeaderFocus"
        >
            <slot name="input">
                <input
                    type="hidden"
                    :name="name"
                    :value="currentSelectValue"
                />

                <!-- 头部 -->
                <select-head
                    :prefix="prefix"
                    :filterable="filterable"
                    :maxTagCount="maxTagCount"
                    :multipleIcon="multipleIcon"
                    :maxTagPlaceholder="maxTagPlaceholder"
                    :placeholder="placeholder"
                >
                    <template
                        #prefix
                        v-if="$slots.prefix"
                    >
                        <slot name="prefix"></slot>
                    </template>
                </select-head>
            </slot>
        </div>
    </div>
</template>

<script lang='ts'>
// 输入框
import SelectHead from './select-head.vue';

import { defineComponent, computed, reactive, getCurrentInstance } from 'vue';

// 注册外部点击事件插件
import ClickOutside from '../../utils/directives/click-outside';

const prefixCls = 'ivue-select';

export default defineComponent({
    name: prefixCls,
    // 注册局部指令
    directives: { ClickOutside },
    props: {
        /**
         * 设置选择的值
         *
         * @type {String, Number, Array}
         */
        modelValue: {
            type: [String, Number, Array],
            default: '',
        },
        /**
         * 是否开启多选
         *
         * @type {Boolean}
         */
        multiple: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否开启多选后的图表
         *
         * @type {Boolean}
         */
        multipleIcon: {
            type: String,
            default: 'close',
        },
        /**
         * 是否禁用选择组件
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否开启外部点击的 capture 模式，可通过全局配置
         *
         * @type {Boolean}
         */
        capture: {
            type: Boolean,
            default: true,
        },
        /**
         * 用于 自动完成组件
         *
         * @type {Boolean}
         */
        autocomplete: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否支持搜索
         *
         * @type {Boolean}
         */
        filterable: {
            type: Boolean,
            default: false,
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
         * 是否将label和value一起返回
         *
         * @type {Boolean}
         */
        labelAndValue: {
            type: Boolean,
            default: false,
        },
        /**
         * 在 Select 内显示图标
         *
         * @type {String}
         */
        prefix: {
            type: String,
        },
        /**
         * 多选时最多显示多少个 tag
         *
         * @type {Number}
         */
        maxTagCount: {
            type: Number,
        },
        /**
         * 隐藏 tag 时显示的内容，参数是剩余项数量
         *
         * @type {Function}
         */
        maxTagPlaceholder: {
            type: Function,
        },
        /**
         * 输入提示
         *
         * @type {String}
         */
        placeholder: {
            type: String,
            default: '',
        },
    },
    setup(props: any) {
        const { proxy }: any = getCurrentInstance();

        // data
        const data: any = reactive<{
            visibleMenu: boolean;
            capture: boolean;
            isFocused: boolean;
            values: Array<any>;
        }>({
            /**
             * 是否显示菜单
             *
             * @type {Boolean}
             */
            visibleMenu: false,
            /**
             * 是否开启 capture 模式，也可通过全局配置
             *
             * @type {Boolean}
             */
            capture: !proxy.$IVUE ? props.capture : proxy.$IVUE.capture,
            /**
             * 判断是否有焦点
             *
             * @type {Boolean}
             */
            isFocused: false,
            /**
             * 最终渲染的数据
             *
             * @type {Array}
             */
            values: [],
        });

        // computed

        // 外部样式
        const classes = computed(() => {
            return [
                `${prefixCls}`,
                {
                    // 默认
                    [`${prefixCls}-default`]: !props.multiple,
                    // 是否支持多选
                    [`${prefixCls}-multiple`]: props.multiple,
                    // 是否禁用
                    [`${prefixCls}-disabled`]: props.disabled,
                    // 是否显示菜单
                    [`${prefixCls}-visible`]: data.visibleMenu,
                },
            ];
        });

        // 选择框样式
        const selectionClasses = computed(() => {
            return [
                `${prefixCls}-selection-default`,
                {
                    [`${prefixCls}-selection`]: !props.autocomplete,
                    [`${prefixCls}-selection-focused`]: data.isFocused,
                },
            ];
        });

        // tab 键顺序
        const selectTabindex = computed(() => {
            // 是否禁用选择组件 | 是否支持搜索
            return props.disabled || props.filterable ? -1 : 0;
        });

        // 当前选择的值
        const currentSelectValue = computed(() => {
            const _value = data.values;

            // 判断是否有开启返回label和value
            if (props.labelAndValue) {
                return props.multiple ? _value : _value[0];
            } else {
                return props.multiple
                    ? _value.map((option: { value: any }) => option.value)
                    : (_value[0] || {}).value;
            }
        });

        // methods

        // 点击外部
        const handleClickOutside = (event) => {
            // 判断是否显示了菜单
            if (data.visibleMenu) {
                if (event.type === 'mousedown') {
                    event.preventDefault();

                    return;
                }

                // 取消焦点
                data.isFocused = false;
            }
            // 关闭
            else {
                // 取消焦点
                data.isFocused = false;
            }
        };

        // 头部输入框获取焦点
        const handleHeaderFocus = ({ type }) => {
            if (props.disabled) {
                return;
            }

            data.isFocused = type === 'focus';
        };

        return {
            // data
            data,

            // computed
            classes,
            selectionClasses,
            selectTabindex,
            currentSelectValue,

            // methods
            handleClickOutside,
            handleHeaderFocus,
        };
    },
    components: {
        SelectHead,
    },
});
</script>
