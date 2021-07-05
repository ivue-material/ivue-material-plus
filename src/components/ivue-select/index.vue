<template>
    <div
        ref="selectWrapper"
        :class="classes"
        v-click-outside[capture]="handleClickOutside"
        v-click-outside:[capture].mousedown="handleClickOutside"
    >
        <div
            :class="selectionClasses"
            :tabindex="selectTabindex"
            @blur="handleHeaderFocus"
            @focus="handleHeaderFocus"
            @click="handleToggleMenu"
            @mouseenter="data.hasMouseHover = true"
            @mouseleave="data.hasMouseHover = false"
        >
            <slot name="input">
                <input type="hidden" :name="name" :value="currentSelectValue" />

                <!-- 头部 -->
                <select-head
                    :prefix="prefix"
                    :filterable="filterable"
                    :multiple="multiple"
                    :maxTagCount="maxTagCount"
                    :multipleIcon="multipleIcon"
                    :maxTagPlaceholder="maxTagPlaceholder"
                    :placeholder="placeholder"
                    :arrowDownIcon="arrowDownIcon"
                    :clearable="canClearable"
                    :values="data.values"
                    :isSearchMethod="isSearchMethod"
                    :resetSelectIcon="resetSelectIcon"
                    :disabled="disabled"
                    @on-clear="handleClearSingleSelect"
                >
                    <template #prefix v-if="$slots.prefix">
                        <slot name="prefix"></slot>
                    </template>
                </select-head>
            </slot>
        </div>
        <!-- 下拉菜单 -->
        <transition name="transition-drop">
            <drop-down key="IvueSelectDropdown" v-show="dropVisible">
                <!-- 没有找到数据时的提示 -->
                <ul :class="`${prefixCls}-not-find`" v-show="showNotFindText && !allowCreate">
                    <li>{{ notFindText }}</li>
                </ul>
                <!-- 列表 -->
                <ul :class="`${prefixCls}-dropdown-list`">
                    <slot></slot>
                </ul>
            </drop-down>
        </transition>
    </div>
</template>

<script lang='ts'>
// 输入框
import SelectHead from './select-head.vue';
// 下拉框
import DropDown from './drop-down.vue';

import {
    defineComponent,
    computed,
    reactive,
    getCurrentInstance,
    provide,
    ref,
    nextTick,
    watch,
} from 'vue';

// 注册外部点击事件插件
import ClickOutside from '../../utils/directives/click-outside';

const prefixCls = 'ivue-select';
const optionGroupRegexp = /^ivue-option-group$|^IvueOptionGroup$/i;

export default defineComponent({
    name: prefixCls,
    // 注册局部指令
    directives: { ClickOutside },
    emits: ['update:modelValue', 'on-change', 'on-clear', 'on-menu-open'],
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
         * 选择选项时的颜色
         *
         * @type {String | Array}
         */
        selectedColor: {
            type: [String, Array],
            default: '#5B8EFF',
        },
        /**
         * hover 选择选项时的颜色
         *
         * @type {String | Array}
         */
        hoverColor: {
            type: [String, Array],
            default: () => '#5B8EFF',
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
            default: 'cancel',
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
            default: '请选择',
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
         * 没有找到数据时的提示
         *
         * @type {Boolean}
         */
        notFindText: {
            type: String,
            default: '无匹配数据',
        },
        /**
         * 搜索方法
         *
         * @type {Function}
         */
        searchMethod: {
            type: Function,
        },
        /**
         * 下拉图标
         *
         * @type{String}
         */
        arrowDownIcon: {
            type: String,
            default: 'keyboard_arrow_down',
        },
        /**
         * 是否可以清除选择
         *
         * @type {Boolean}
         */
        clearable: {
            type: Boolean,
            default: false,
        },
        /**
         * 重置选择图标
         *
         * @type {String}
         */
        resetSelectIcon: {
            type: String,
            default: 'cancel',
        },
    },
    setup(props: any, { emit }) {
        // dom
        const selectWrapper = ref<HTMLElement | null>(null);

        const { proxy }: any = getCurrentInstance();

        // data
        const data: any = reactive<{
            visibleMenu: boolean;
            capture: boolean;
            isFocused: boolean;
            values: Array<any>;
            options: Array<any>;
            cachedOptions: Array<any>;
            focusIndex: number;
            filterQueryChange: boolean;
            filterQuery: string;
            hasMouseHover: boolean;
            lastSearchQuery: string;
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
            /**
             * 子选项 dom
             *
             * @type {Array}
             */
            options: [],
            /**
             * 缓存子选项dom
             *
             * @type {Array}
             */
            cachedOptions: [],
            /**
             * 焦点项
             *
             * @type {Number}
             */
            focusIndex: -1,
            /**
             * 是否开始输入框支持搜索
             *
             * @type {Boolean}
             */
            filterQueryChange: false,
            /**
             * 搜索输入框输入数据
             *
             * @type {String}
             */
            filterQuery: '',
            /**
             * 鼠标悬浮
             *
             * @type {Boolean}
             */
            hasMouseHover: false,
            /**
             * 下一个搜索请求
             *
             * @type {String}
             */
            lastSearchQuery: '',
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

        // 显示没有数据时的文本
        const showNotFindText = computed(() => {
            // 是否禁用选择组件 | 是否支持搜索
            return (
                selectOptions.value &&
                selectOptions.value.length === 0 &&
                !isSearchMethod.value
            );
        });

        // 判断是搜索是否是一个方法
        const isSearchMethod = computed(() => {
            return typeof props.searchMethod === 'function';
        });

        // 获取菜单选择列表
        const selectOptions = computed(() => {
            // 获取选项的列表
            const selectOptions = [];

            // 选项计数器，计算有多少个选项
            let optionCounter = -1;

            // 当前焦点项
            const currentIndex = data.focusIndex;

            // 获取选择选项的value
            const selectedValues = data.values
                .filter(Boolean)
                .map(({ value }) => value);

            // 判断是否有自动输入
            if (props.autoComplete) {
                console.log('autoComplete');
            }

            // 选项的数据
            data.options.forEach((option) => {
                // 选项计数器
                optionCounter = optionCounter + 1;

                selectOptions.push(
                    handleOption(
                        option,
                        selectedValues,
                        optionCounter === currentIndex
                    )
                );
            });

            // 这是一个组件数组 [components]
            return selectOptions;
        });

        // 显示下拉菜单
        const dropVisible = computed(() => {
            let status = true;

            // 没有选项
            const noSelectOptions =
                selectOptions.value && selectOptions.value.length === 0;

            if (
                data.filterQuery === '' &&
                noSelectOptions &&
                isSearchMethod.value
            ) {
                status = false;
            }

            if (props.autocomplete && noSelectOptions) {
                status = false;
            }

            return data.visibleMenu && status;
        });

        // 是否可以显示重置选择按钮
        const canClearable = computed(() => {
            // 多选模式下无效
            return (
                data.hasMouseHover &&
                props.clearable &&
                !props.multiple &&
                !props.disabled
            );
        });

        // 当前选择的值
        const selectValue = computed(() => {
            // 判断是否有开启返回label和value
            if (props.labelAndValue) {
                return props.multiple ? data.values : data.values[0];
            } else {
                return props.multiple
                    ? data.values.map((option) => option.value)
                    : (data.values[0] || {}).value;
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

                // 用于 自动完成组件
                if (!data.autocomplete) {
                    event.stopPropagation();
                }

                // 取消焦点
                data.isFocused = false;

                event.preventDefault();

                // 点击后隐藏菜单
                hideMenu();
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

        // 提取选项数据
        const handleOption = (option, values, isFocused) => {
            // 如果选项节点没有子组件就直接返回选项节点

            // 是否获取到焦点
            option.data.isFocused = isFocused;

            // 是否禁用选项
            // option.data.disabled =
            //     typeof disabled === 'undefined' ? false : disabled !== false;

            const propsData = {
                // selected: isSelect,
                isFocused: isFocused,
                // disabled:
                //     typeof disabled === 'undefined'
                //         ? false
                //         : disabled !== false,
            };

            return {
                option,
                propsData: propsData,
            };
        };

        // 点击菜单
        const handleToggleMenu = (event, force) => {
            // 选择组件是否禁用
            if (props.disabled) {
                return false;
            }

            // 设置菜单状态
            data.visibleMenu =
                typeof force !== 'undefined' ? force : !data.visibleMenu;
        };

        // 隐藏菜单
        const hideMenu = () => {
            handleToggleMenu(null, false);
        };

        // 选项菜单点击
        const handleOptionClick = (option) => {
            // 判断是否开启了多选
            if (props.multiple) {
                const selected = data.values.find(
                    ({ value }) => value === option.value
                );

                // 判断是搜索是否是一个方法
                if (isSearchMethod.value) {
                    // 下一个搜索请求 || 搜索输入框输入数据
                    data.lastSearchQuery =
                        data.lastSearchQuery || data.filterQuery;
                } else {
                    // 下一个搜索请求
                    data.lastSearchQuery = '';
                }

                // 当前是否有对应的选项
                if (selected) {
                    data.values = data.values.filter(
                        ({ value }) => value !== option.value
                    );
                }
                // 没有当前选项
                else {
                    data.values = data.values.concat(option);
                }

                // 鼠标点击选项元素后放回焦点
                data.isFocused = true;
            }
            // 单选
            else {
                // 过滤输入框数据
                data.filterQuery = String(option.label).trim();
                // 最终渲染的数据
                data.values = [option];

                // 点击后隐藏菜单
                hideMenu();

                // 搜索请求
                data.lastSearchQuery = '';
            }

            // 是否支持搜索
            if (props.filterable) {
            }

            // 获取焦点项
            data.focusIndex = setFocusIndex(option);

            // 判断是否进行了过滤输入
            if (data.filterQueryChange) {
                // 等菜单动画执行完再清除
                setTimeout(() => {
                    data.filterQueryChange = false;
                }, 300);
            }
            // 没有开启过滤
            else {
                // 等菜单动画执行完再清除
                nextTick(() => {
                    data.filterQueryChange = false;
                });
            }
        };

        // 设置选项焦点位置
        const setFocusIndex = (option) => {
            return selectOptions.value.findIndex((item) => {
                if (typeof option === 'object') {
                    // 判断是否有key 使用key匹配选项
                    return item.option.value === option.value;
                } else {
                    return item.option.value === option;
                }
            });
        };

        // 清楚单项选择数据
        const handleClearSingleSelect = () => {
            // 非多选清除数据
            if (!props.multiple) {
                emit('update:modelValue', '');
            }

            // API 点击清空按钮时触发
            emit('on-clear');

            // 隐藏菜单
            hideMenu();

            // 初始化数据
            if (props.clearable) {
                resetData();
            }
        };

        // 重置数据
        const resetData = () => {
            // 焦点项
            data.focusIndex = -1;
            // 最终渲染的数据
            data.values = [];
            // 鼠标悬浮
            data.hasMouseHover = false;

            // 等菜单动画消失后再清除
            // setTimeout(() => {
            // 搜索输入框输入数据
            data.filterQuery = '';
            // 是否开始输入框支持搜索
            data.filterQueryChange = false;
            // }, 300);
        };

        // provide
        provide(
            'ivue-select',
            reactive({
                props,
                selectWrapper,
                options: data.options,
                values: data.values,
                handleOptionClick,
            })
        );

        // watch

        // 监听最终渲染的数据的变化
        watch(
            () => data.values,
            (newValue, oldValue) => {
                const _newValue = JSON.stringify(newValue);
                const _oldValue = JSON.stringify(oldValue);

                // 设置v-model的值
                const vModelValue =
                    props.labelAndValue && selectValue.value
                        ? props.multiple
                            ? selectValue.value.map(({ value }) => value)
                            : selectValue.value
                        : selectValue.value;

                // 输入框值
                const emitInput =
                    _newValue !== _oldValue && vModelValue !== props.modelValue;

                if (emitInput) {
                    // 更新 v-model
                    emit('update:modelValue', vModelValue);

                    emit('on-change', selectValue.value);
                }
            }
        );

        // watch

        // 监听菜单显示隐藏
        watch(
            () => data.visibleMenu,
            (state) => {
                // API 下拉框展开或收起时触发
                emit('on-menu-open', state);
            }
        );

        return {
            prefixCls,

            // dom
            selectWrapper,

            // data
            data,

            // computed
            classes,
            selectionClasses,
            selectTabindex,
            currentSelectValue,
            isSearchMethod,
            showNotFindText,
            dropVisible,
            canClearable,

            // methods
            handleClickOutside,
            handleHeaderFocus,
            handleOption,
            handleToggleMenu,
            handleClearSingleSelect,
            setFocusIndex,
        };
    },
    components: {
        SelectHead,
        DropDown,
    },
});
</script>
