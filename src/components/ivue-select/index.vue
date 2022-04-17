<template>
    <div
        ref="selectWrapper"
        :class="classes"
        v-click-outside[capture]="handleClickOutside"
        v-click-outside:[capture].mousedown="handleClickOutside"
    >
        <div
            ref="reference"
            :class="selectionClasses"
            :tabindex="selectTabindex"
            @blur="handleHeaderFocus"
            @focus="handleHeaderFocus"
            @click="handleToggleMenu"
            @mouseenter="data.hasMouseHover = true"
            @mouseleave="data.hasMouseHover = false"
            @keydown.down.stop.prevent="handldKeyDown"
            @keydown.up.stop.prevent="handldKeyDown"
            @keydown.enter.stop.prevent="handldKeyDown"
            @keydown.esc.stop.prevent="handldKeyDown"
            @keydown.tab="handldKeyDown"
        >
            <input type="hidden" :name="name" :value="currentSelectValue" />

            <slot name="input">
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
                    :filterQueryProp="data.filterQuery"
                    :allowCreate="allowCreate"
                    :showCreateItem="showCreateItem"
                    @on-clear="handleClearSingleSelect"
                    @on-filter-query-change="handleFilterQueryChange"
                    @on-input-focus="data.isFocused = true"
                    @on-input-blur="data.isFocused = false"
                    @on-enter="handleCreateItem"
                >
                    <template #prefix v-if="$slots.prefix">
                        <slot name="prefix"></slot>
                    </template>
                </select-head>
            </slot>
        </div>
        <div></div>
        <!-- 下拉菜单 -->
        <transition name="transition-drop">
            <drop-down
                :transfer="transfer"
                :data-transfer="transfer"
                v-transfer-dom
                key="IvueSelectDropdown"
                ref="dropdown"
                v-show="dropVisible"
            >
                <!-- 没有找到数据时的提示 -->
                <ul :class="`${prefixCls}-not-find`" v-show="showNotFindText && !allowCreate">
                    <li>{{ notFindText }}</li>
                </ul>
                <!-- 列表 -->
                <ul
                    :class="`${prefixCls}-dropdown-list`"
                    v-if="(!isSearchMethod) || (isSearchMethod && !loading)"
                >
                    <!-- 创建选项 -->
                    <ivue-option
                        :class="createItemClass"
                        :allowCreate="allowCreate"
                        :showCreateItem="showCreateItem"
                        :filterQuery="data.filterQuery"
                        @on-create="handleCreateItem"
                        v-if="showCreateItem"
                    >
                        <!-- 搜索内容 -->
                        <p class="text">{{ data.filterQuery }}</p>
                        <!-- 图标 -->
                        <ivue-icon>{{ allowCreateIcon }}</ivue-icon>
                    </ivue-option>
                    <!-- slot -->
                    <slot></slot>
                </ul>
                <!-- 加载中 -->
                <ul v-show="loading" :class="`${prefixCls}-loading`">{{ loadingText }}</ul>
            </drop-down>
        </transition>
    </div>
</template>

<script lang='ts'>
// 输入框
import SelectHead from './select-head.vue';
// 下拉框
import DropDown from './drop-down.vue';
import IvueOption from './option.vue';
import IvueIcon from '../ivue-icon/index.vue';
import mitt from 'mitt';

import {
    defineComponent,
    computed,
    reactive,
    getCurrentInstance,
    provide,
    ref,
    nextTick,
    watch,
    onMounted,
} from 'vue';

// 注册外部点击事件插件
import ClickOutside from '../../utils/directives/click-outside';
import TransferDom from '../../utils/directives/transfer-dom';

const prefixCls = 'ivue-select';

export default defineComponent({
    name: prefixCls,
    // 注册局部指令
    directives: { ClickOutside, TransferDom },
    emits: [
        'update:modelValue',
        'on-change',
        'on-clear',
        'on-menu-open',
        'on-filter-query-change',
        'on-set-default-options',
        'on-create',
    ],
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
         * 远程搜索时，显示默认 label，详见示例
         *
         * @type {}
         */
        defaultLabel: {
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
         * 是否开启多选多虑收起时清除输入
         *
         * @type {Boolean}
         */
        multipleFilterableClear: {
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
         * 是否开启还原输入框内容 图标
         *
         * @type {Boolean}
         */
        allowCreateIcon: {
            type: String,
            default: 'reply',
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
        /**
         * 开启搜索时，隐藏group组件头
         *
         * @type {String}
         */
        filterableHiddenGroup: {
            type: Boolean,
            default: false,
        },
        /**
         * 加载中
         *
         * @type {Boolean}
         */
        loading: {
            type: Boolean,
            default: false,
        },
        /**
         * 加载中的文字提示
         *
         * @type {String}
         */
        loadingText: {
            type: String,
            default: '加载中',
        },
        /**
         * 搜索时，只按 label 进行搜索
         *
         * @type {Boolean}
         */
        filterByLabel: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否开启还原输入框内容（仅在单选时生效）
         *
         * @type {Boolean}
         */
        restoreInputOption: {
            type: Boolean,
            default: true,
        },
        /**
         * 是否将弹层放置于 body 内，在 Tabs、
         * 带有 fixed 的 Table 列内使用时，
         * 建议添加此属性，它将不受父级样式影响，
         * 从而达到更好的效果
         *
         * @type {Boolean}
         */
        transfer: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any, { emit, slots }) {
        // 事件发射器/发布订阅
        const selectEmitter = mitt();

        // dom
        const selectWrapper = ref<HTMLElement | null>(null);
        const reference = ref<HTMLElement | null>(null);
        const dropdown = ref(null);

        // vm
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
            selectEmitter: any;
            hasExpectedValue: boolean;
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
            filterQuery: props.filterQueryProp || '',
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
            /**
             * 事件发射器/发布订阅
             *
             * @type {Function}
             */
            selectEmitter,
            /**
             * 当前有 value 值
             *
             * @type {Boolean}
             */
            hasExpectedValue: false,
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
                    [`${prefixCls}-selection`]: true,
                    [`${prefixCls}-selection-focused`]: data.isFocused,
                },
            ];
        });

        // 创建列表选项样式
        const createItemClass = computed(() => {
            return [`${prefixCls}-item`, `${prefixCls}-item--create`];
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
                (!isSearchMethod.value ||
                    (isSearchMethod.value && !props.loading))
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

            // 选项的数据
            for (let option of data.options) {
                // 选项计数器
                optionCounter = optionCounter + 1;

                //如果没有 filterQueryChange ，则忽略选项
                if (data.filterQueryChange) {
                    const optionFilter = props.filterable
                        ? validateOption(option)
                        : option;

                    // 不符合条件的选项
                    if (!optionFilter) {
                        option.data.visible = false;
                    } else {
                        option.data.visible = true;
                    }

                    // 过滤数组
                    if (!optionFilter) {
                        continue;
                    }
                } else {
                    option.data.visible = true;
                }

                selectOptions.push(
                    handleOption(
                        option,
                        selectedValues,
                        optionCounter === currentIndex
                    )
                );
            }

            // 这是一个组件数组 [components]
            return selectOptions;
        });

        // 显示下拉菜单
        const dropVisible = computed(() => {
            let status = true;

            // 没有选项
            const noSelectOptions =
                selectOptions.value && selectOptions.value.length === 0;

            // 没有加载中
            if (
                !props.loading &&
                data.filterQuery === '' &&
                noSelectOptions &&
                isSearchMethod.value
            ) {
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

        // 显示创建的选项
        const showCreateItem = computed(() => {
            let state = false;

            // 开启了创建选项, 有搜索内容
            if (props.allowCreate && data.filterQuery !== '') {
                state = true;

                // 是否有选项列表
                if (data.options && data.options.length) {
                    if (
                        data.options.find(
                            (item) => item.getLabel === data.filterQuery
                        )
                    )
                        state = false;
                }
            }

            return state;
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

                // 是否将弹层放置于 body 内
                if (props.transfer) {
                    const { $el } = dropdown.value;
                    if ($el === event.target || $el.contains(event.target)) {
                        return;
                    }
                }

                // 取消焦点
                data.isFocused = false;

                // 用于 自动完成组件
                event.stopPropagation();

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
        const handleOption = (option, values, isFocused: boolean) => {
            // 如果选项节点没有子组件就直接返回选项节点

            // 是否获取到焦点
            option.data.isFocused = isFocused;

            return {
                option,
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

            // 菜单收起
            if (!data.visibleMenu) {
                // 取消焦点
                if (data.filterable) {
                    const input = proxy.$el.querySelector('input[type="text"]');

                    input.blur();
                }

                // 更新下拉框
                dropdown.value.update();
            }
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
                const input = proxy.$el.querySelector('input[type="text"]');

                // 输入框获取焦点
                nextTick(() => {
                    input.focus();
                });
            }

            // 更新下拉框
            dropdown.value.update();

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
            // 搜索输入框输入数据
            data.filterQuery = '';
            // 是否开始输入框支持搜索
            data.filterQueryChange = false;
        };

        // 初始化值
        const getInitialValue = () => {
            let initialValue = Array.isArray(props.modelValue)
                ? props.modelValue
                : [props.modelValue];

            // 判断 值 === undefined 或者是 ''而且 参数不是无穷大
            if (
                typeof initialValue[0] === 'undefined' ||
                (String(initialValue[0]).trim() === '' &&
                    !Number.isFinite(initialValue[0]))
            ) {
                initialValue = [];
            }

            // 开启搜索，没有多选
            if (isSearchMethod.value && !props.multiple && props.modelValue) {
                // 获取选项数据
                const optionData = getOptionData(props.modelValue);

                // 过滤输入框数据
                data.filterQuery = optionData
                    ? optionData.label
                    : String(props.modelValue);
            }

            return initialValue.filter((item) => {
                return Boolean(item) || item === 0;
            });
        };

        // 获取选项的值
        const getOptionData = (value) => {
            const option = data.options.find((option) => {
                return option.value === value || option.getLabel === value;
            });

            if (!option) {
                return null;
            }

            // 获取焦点项
            data.focusIndex = setFocusIndex(option);

            return {
                value: option.value,
                label: option.getLabel,
                disabled: option.isDisabled,
            };
        };

        // 过滤输入框输入
        const handleFilterQueryChange = (filterQuery) => {
            // 是否显示下拉菜单
            if (filterQuery.length > 0 && filterQuery !== data.filterQuery) {
                data.visibleMenu = true;
            }

            // 输入框需要过滤的数据
            data.filterQuery = filterQuery;

            // 输入框过滤输入开始
            data.filterQueryChange = true;
        };

        // 过滤选项组件
        const validateOption = (options) => {
            // value
            const value = options.value;
            // label
            const label = options.label || options.value;
            // elm
            const elm = options.$el || '';

            // 文本内容 将数组元素计算为一个值（从左到右）
            const textContent = elm.textContent;

            // 把数据转换成字符串
            const stringValues = props.filterByLabel
                ? [label].toString()
                : [value, label, textContent].toString();

            // 把输入框数据转换成小写去除前后空格
            const filterQuery = data.filterQuery.toLowerCase().trim();

            // 是否开启搜索，没有多选，没有输入
            if (props.filterable && !props.multiple && filterQuery === '') {
                return false;
            }

            // 判断 stringValues 数组中是否包含 filterQuery 中的值 includes()
            return stringValues.toLowerCase().includes(filterQuery);
        };

        // 设置滚动条滚动
        const focusScroll = (index) => {
            if (index < 0) {
                return;
            }

            // update scroll
            const options = data.options[index];

            // dropdown
            const _dropdown = dropdown.value.$el;
            // 底部距离
            let bottomOverflowDistance =
                options.$el.getBoundingClientRect().bottom -
                _dropdown.getBoundingClientRect().bottom;

            // 顶部距离
            let topOverflowDistance =
                options.$el.getBoundingClientRect().top -
                _dropdown.getBoundingClientRect().top;

            // 滚动到底部
            if (bottomOverflowDistance > 0) {
                _dropdown.scrollTop += bottomOverflowDistance;
            }

            // 滚动到顶部
            if (topOverflowDistance < 0) {
                _dropdown.scrollTop += topOverflowDistance;
            }
        };

        // 选项销毁
        const handleOptionDestroy = (index) => {
            if (index > -1) {
                data.options.splice(index, 1);
            }
        };

        // 按键
        const handldKeyDown = (event) => {
            const key = event.key || event.code;
            const keyCode = event.keyCode || event.which;

            // Backspace
            if (key === 'Backspace' || keyCode === 8) {
                return; // so we don't call preventDefault
            }

            // 展开
            if (data.visibleMenu) {
                // Tab
                if (key === 'Tab') {
                    hideMenu();
                }

                // Esc slide-up
                if (key === 'Escape') {
                    hideMenu();
                }

                // next
                if (key === 'ArrowUp') {
                    navigateOptions(-1);
                }

                // prev
                if (key === 'ArrowDown') {
                    navigateOptions(1);
                }

                // enter
                if (key === 'Enter') {
                    if (data.focusIndex === -1) {
                        return hideMenu();
                    }

                    const optionItem = selectOptions.value[data.focusIndex];

                    if (optionItem) {
                        // 获取选项数据
                        const option = getOptionData(optionItem.option.value);

                        handleOptionClick(option);
                    } else {
                        hideMenu();
                    }
                }
            } else {
                const keysCanOpenMenu = ['ArrowDown', 'ArrowUp'];

                // 如果焦点在当前选择框的话按 next or prev 可以打开选项菜单
                if (keysCanOpenMenu.includes(event.key)) {
                    handleToggleMenu(null, true);
                }
            }
        };

        // 下一个选项
        const navigateOptions = (direction) => {
            const optionLength = selectOptions.value.length - 1;

            let index = data.focusIndex + direction;

            if (index < 0) {
                index = optionLength;
            }

            // 重置下标
            if (index > optionLength) {
                index = 0;
            }

            // 寻找下标选项
            if (direction > 0) {
                let activeOption = -1;
                for (let i = 0; i < selectOptions.value.length; i++) {
                    // 判断选项是否可选
                    const isActiveOption =
                        !selectOptions.value[i].option.disabled;

                    // 设置激活的选项
                    if (isActiveOption) {
                        activeOption = i;
                    }

                    if (activeOption >= index) {
                        break;
                    }
                }

                index = activeOption;
            } else {
                let activeOption = selectOptions.value.length;

                for (let i = optionLength; i >= 0; i--) {
                    // 判断选项是否可选
                    const isActiveOption =
                        !selectOptions.value[i].option.disabled;

                    // 设置激活的选项
                    if (isActiveOption) {
                        activeOption = i;
                    }

                    if (activeOption <= index) {
                        break;
                    }
                }

                index = activeOption;
            }

            // 设置焦点选项
            data.focusIndex = index;
        };

        // 检查值是否相等
        const checkValuesNotEqual = (value, publicValue, values) => {
            const strValue = JSON.stringify(value);
            const strPublic = JSON.stringify(publicValue);
            const strValues = JSON.stringify(
                values.map((item) => {
                    return item.value;
                })
            );

            return (
                strValue !== strPublic ||
                strValue !== strValues ||
                strValues !== strPublic
            );
        };

        // 检查当前值更新状态
        const checkUpdateStatus = () => {
            if (
                getInitialValue().length > 0 &&
                selectOptions.value.length === 0
            ) {
                data.hasExpectedValue = true;
            }
        };

        // 创建新列表
        const handleCreateItem = () => {
            if (
                props.allowCreate &&
                data.filterQuery !== '' &&
                showCreateItem.value
            ) {
                const filterQuery = data.filterQuery;

                emit('on-create', filterQuery);

                // 清除输入
                data.filterQuery = '';

                const option = {
                    value: filterQuery,
                    label: filterQuery,
                    disabled: false,
                };

                if (props.multiple) {
                    handleOptionClick(option);
                } else {
                    // 单选时如果不在 nextTick 里执行，无法赋值
                    nextTick(() => {
                        handleOptionClick(option);
                    });
                }
            }
        };

        // 初始化输入
        data.options = [];

        // onMounted
        onMounted(() => {
            // 设置初始值
            if (!isSearchMethod.value && selectOptions.value.length > 0) {
                data.values = getInitialValue()
                    .map((value) => {
                        if (typeof value === 'undefined' && !value) {
                            return null;
                        }
                        return getOptionData(value);
                    })
                    .filter(Boolean);
            }

            // 有搜索方法，设置默认标签
            if (isSearchMethod.value && props.defaultLabel) {
                // 单选
                if (!props.multiple) {
                    data.filterQuery = props.defaultLabel;

                    data.hasExpectedValue = true;
                }
                // 多选
                else if (
                    props.multiple &&
                    props.defaultLabel instanceof Array &&
                    props.modelValue.length === props.defaultLabel.length
                ) {
                    const values = props.modelValue.map((item, index) => {
                        return {
                            value: item,
                            label: props.defaultLabel[index],
                        };
                    });

                    emit('on-set-default-options', values);
                    nextTick(() => {
                        data.values = values;
                    });
                }
            }
        });

        // provide
        provide(
            'ivue-select',
            reactive({
                props,
                selectWrapper,
                reference,
                options: data.options,
                values: data.values,
                handleOptionClick,
                selectEmitter: data.selectEmitter,
                onOptionDestroy: handleOptionDestroy,
            })
        );

        // watch

        // 监听设置的值
        watch(
            () => props.modelValue,
            (value) => {
                // 检查当前值更新状态
                checkUpdateStatus();

                if (value === '') {
                    data.values = [];

                    data.filterQueryChange = true;
                }
                // 当前值是否相等
                else if (
                    checkValuesNotEqual(value, selectValue.value, data.values)
                ) {
                    // 修改适配
                    nextTick(() => {
                        if (data.options.length > 0) {
                            const values = getInitialValue()
                                .map((value) => {
                                    if (
                                        typeof value === 'undefined' &&
                                        !value
                                    ) {
                                        return null;
                                    }

                                    return getOptionData(value);
                                })
                                .filter(Boolean);

                            data.values = values;
                        }
                    });
                }
            }
        );

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
                            : selectValue.value.value
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

        // 监听菜单显示隐藏
        watch(
            () => data.visibleMenu,
            (state) => {
                // API 下拉框展开或收起时触发
                emit('on-menu-open', state);

                // 显示时
                if (state) {
                    if (props.filterable) {
                        // 触发选项组显示
                        data.selectEmitter.emit('ivueOptionGroupQueryChange');
                    }
                }

                // 恢复单选查询值
                const [option] = data.values;

                // 清除输入
                if (
                    option &&
                    !data.isFocused &&
                    props.filterable &&
                    props.multiple &&
                    props.multipleFilterableClear
                ) {
                    data.filterQuery = '';

                    // 等菜单动画执行完再清除
                    nextTick(() => {
                        data.filterQueryChange = false;
                    });
                }
            }
        );

        // 焦点项
        watch(
            () => data.focusIndex,
            (index) => {
                focusScroll(index);
            }
        );

        // 监听过滤输入框输入数据
        watch(
            () => data.filterQuery,
            (filterQuery) => {
                // API 搜索词改变时触发
                emit('on-filter-query-change', filterQuery);

                // 是否是有效查询
                const hasValidQuery =
                    filterQuery !== '' &&
                    (filterQuery !== data.lastSearchQuery ||
                        !data.lastSearchQuery);

                const shouldCallRemoteMethod =
                    props.searchMethod && hasValidQuery;

                // 是否有搜索方法
                if (shouldCallRemoteMethod) {
                    data.focusIndex = -1;
                    props.searchMethod(filterQuery);
                }

                // 正常搜索
                if (filterQuery !== '' && isSearchMethod.value) {
                    data.lastSearchQuery = filterQuery;
                }

                // 输入为空隐藏下拉框 非多选
                if (filterQuery === '' && !props.multiple) {
                    data.visibleMenu = false;

                    // 等菜单动画执行完再清除
                    nextTick(() => {
                        data.filterQueryChange = false;
                    });
                }

                // 触发选项组显示;
                data.selectEmitter.emit('ivueOptionGroupQueryChange');
            }
        );

        // 监听焦点
        watch(
            () => data.isFocused,
            (focused) => {
                // 输入框获取焦点，移除焦点
                const el = props.filterable
                    ? proxy.$el.querySelector('input[type="text"]')
                    : proxy.$el;

                el[focused ? 'focus' : 'blur']();

                // 恢复单选查询值
                const [option] = data.values;

                // 判断是否有点击删除按钮在进行还原输入框内容
                if (
                    option &&
                    props.filterable &&
                    !props.multiple &&
                    !focused &&
                    props.restoreInputOption
                ) {
                    const label = String(option.label || option.value).trim();

                    if (label && data.filterQuery !== label) {
                        data.filterQuery = label;

                        nextTick(() => {
                            data.filterQueryChange = false;

                            // 获取焦点项
                            data.focusIndex = setFocusIndex(option);
                        });
                    }
                }

                // 没有开启还原输入框内容
                if (
                    option &&
                    props.filterable &&
                    !props.multiple &&
                    !focused &&
                    !props.restoreInputOption
                ) {
                    // 更新 v-model
                    emit('update:modelValue', data.filterQuery);
                }
            }
        );

        // 监听选项变化
        watch(
            () => selectOptions.value,
            (value) => {
                // 初始化值
                if (data.hasExpectedValue && value.length > 0) {
                    data.values = getInitialValue()
                        .map((value) => {
                            if (typeof value === 'undefined' && !value) {
                                return null;
                            }

                            return getOptionData(value);
                        })
                        .filter(Boolean);

                    data.hasExpectedValue = false;
                }

                // 更新下拉框
                dropdown.value.update();
            }
        );

        // 监听下拉框
        watch(
            () => dropVisible.value,
            (value) => {
                if (value) {
                    // 更新下拉框
                    dropdown.value.update();
                } else {
                    // 销毁下拉框
                    dropdown.value.destroy();
                }
            }
        );

        return {
            prefixCls,

            // dom
            selectWrapper,
            reference,
            dropdown,

            // data
            data,

            // computed
            classes,
            selectionClasses,
            createItemClass,
            selectTabindex,
            currentSelectValue,
            isSearchMethod,
            showNotFindText,
            dropVisible,
            canClearable,
            showCreateItem,

            // methods
            handleClickOutside,
            handleHeaderFocus,
            handleOption,
            handleToggleMenu,
            handleClearSingleSelect,
            handleFilterQueryChange,
            handldKeyDown,
            handleCreateItem,
            setFocusIndex,
        };
    },
    components: {
        SelectHead,
        DropDown,
        IvueOption,
        IvueIcon,
    },
});
</script>
