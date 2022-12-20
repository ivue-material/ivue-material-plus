<template>
    <div :class="classes" v-outside="handleClickOutside">
        <!-- 输入框 -->
        <div :class="inputClasses" ref="reference" @click="handleToggleOpen">
            <input type="hidden" :name="name" :value="data.currentValue" />

            <slot>
                <ivue-input
                    :id="id"
                    :isValue="true"
                    :readonly="!filterable"
                    :disabled="disabled"
                    :modelValue="displayInputRender"
                    :placeholder="inputPlaceholder"
                    @on-change="handleChangeInput"
                    ref="input"
                >
                    <!-- 下拉图标 -->
                    <template #suffix>
                        <slot name="suffix">
                            <!--  清除按钮 -->
                            <ivue-icon
                                :class="`${prefixCls}-clearable ${clearableIconClass}`"
                                v-show="showCloseIcon"
                                @click.stop="handleClearSelect"
                            >{{ clearableIcon }}</ivue-icon>
                            <!-- 下拉按钮 -->
                            <ivue-icon
                                :class="`${prefixCls}-arrow ${arrowDownIconClass}`"
                                @click.stop="handleToggleOpen"
                            >{{ arrowDownIcon }}</ivue-icon>
                        </slot>
                    </template>
                </ivue-input>
                <!-- 是否支持搜索 -->
                <div
                    :class="`${prefixCls}-label`"
                    v-show="filterable && data.queryData === ''"
                    @click="handleInputFocus"
                >{{ displayRender }}</div>
            </slot>
        </div>
        <!-- 下拉菜单 -->
        <transition name="transition-drop">
            <drop-down
                :transfer="transfer"
                :data-transfer="transfer"
                :class="dropdownClasses"
                :style="dropdownStyles"
                v-transfer-dom
                ref="dropdown"
                v-show="data.visibleMenu"
            >
                <div>
                    <!-- 菜单 -->
                    <ivue-cascader-menu
                        :options="options"
                        :disabled="disabled"
                        :changeOnSelect="changeOnSelect"
                        :trigger="trigger"
                        ref="menu"
                        v-show="!filterable || (filterable && data.queryData === '')"
                    ></ivue-cascader-menu>
                    <!-- 有数据 -->
                    <div
                        :class="`${prefixCls}-dropdown`"
                        v-show="filterable && data.queryData !== '' && querySelections.length"
                    >
                        <ul :class="`${prefixCls}-dropdown--list`">
                            <li
                                :class="[
                                `${prefixCls}-dropdown--item`,
                                {
                                    [`${prefixCls}-dropdown--item__disabled`]: item.disabled
                                }
                                ]"
                                v-for="(item, index) in querySelections"
                                :key="index"
                                v-html="item.display"
                                @click="handleSelectItem(item)"
                            ></li>
                        </ul>
                    </div>
                    <!-- 当搜索列表为空时显示的内容 -->
                    <ul
                        :class="`${prefixCls}-not-found-tip`"
                        v-show="(filterable && data.queryData !== '' && !querySelections.length) || !options.length"
                    >
                        <li :class="`${prefixCls}-not-found-tip-text`">{{ notFoundText }}</li>
                    </ul>
                </div>
            </drop-down>
        </transition>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    ref,
    provide,
    watch,
    nextTick,
    onMounted,
    getCurrentInstance,
} from 'vue';

import { oneOf } from '../../utils/assist';
import { Outside, TransferDom } from '../../utils/directives';

import IvueInput from '../ivue-input/index.vue';
import IvueIcon from '../ivue-icon/index.vue';
import DropDown from '../ivue-select/drop-down.vue';
import IvueCascaderMenu from './menu.vue';

// type
import {
    IvueInputInstance,
    CascaderContextKey,
    DropDownInstance,
    IvueCascaderMenuInstance,
    Props,
    Data,
    Options,
    ResultChange,
    Result,
} from './types/cascader';
import { SelectContextKey } from '../ivue-select/types/select';

const prefixCls = 'ivue-cascader';

export default defineComponent({
    name: prefixCls,
    // 注册局部指令
    directives: { Outside, TransferDom },
    emits: ['on-change', 'update:modelValue', 'on-visible-change'],
    props: {
        /**
         * 可选项的数据源
         *
         * @type {Array}
         */
        options: {
            type: Array,
            default: () => [],
        },
        /**
         * 当前已选项的数据
         *
         * @type {Array}
         */
        modelValue: {
            type: Array,
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
         * id
         *
         * @type {String}
         */
        id: {
            type: String,
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
         * 是否禁用选择组件
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 选择后展示的函数，用于自定义显示格式
         *
         * @type {Function}
         */
        renderFormat: {
            type: Function,
            default: (label: string[] | number[]) => {
                return label.join(' / ');
            },
        },
        /**
         * 输入框占位符
         *
         * @type {String}
         */
        placeholder: {
            type: String,
            default: '请选择',
        },
        /**
         * 下拉图标
         *
         * @type {Boolean}
         */
        arrowDownIcon: {
            type: String,
            default: 'keyboard_arrow_down',
        },
        /**
         * 下拉图标Class
         *
         * @type {Boolean}
         */
        arrowDownIconClass: {
            type: String,
            default: '',
        },
        /**
         * 清除按钮图标
         *
         * @type {Boolean}
         */
        clearableIcon: {
            type: String,
            default: 'cancel',
        },
        /**
         * 清除按钮图标Class
         *
         * @type {Boolean}
         */
        clearableIconClass: {
            type: String,
            default: '',
        },
        /**
         * 开启 transfer 时，给浮层添加额外的 class 名称
         *
         * @type {String}
         */
        transferClassName: {
            type: String,
        },
        /**
         * 是否将弹层放置于 body 内、
         * 带有 fixed 的 Table 列内使用时，
         * 建议添加此属性，它将不受父级样式影响，
         * 从而达到更好的效果
         *
         * @type {Boolean}
         */
        transfer: {
            type: Boolean,
            default() {
                const global =
                    getCurrentInstance().appContext.config.globalProperties;

                return !global.$IVUE || global.$IVUE.transfer === ''
                    ? false
                    : global.$IVUE.transfer;
            },
        },
        /**
         * 当此项为 true 时，点选每级菜单选项值都会发生变化
         *
         * @type {Boolean}
         */
        changeOnSelect: {
            type: Boolean,
            default: false,
        },
        /**
         * 菜单展开方式，可选值为 click 或 hover
         *
         * @type {String}
         */
        trigger: {
            validator(value: string) {
                return oneOf(value, ['click', 'hover']);
            },
            default: 'click',
        },
        /**
         * 动态获取数据，数据源需标识 loading
         *
         * @type {Function}
         */
        loadData: {
            type: Function,
            default: () => {},
        },
        /**
         * 清除按钮
         *
         * @type {Boolean}
         */
        clearable: {
            type: Boolean,
            default: true,
        },
        /**
         * 当搜索列表为空时显示的内容
         *
         * @type {String}
         */
        notFoundText: {
            type: String,
            default: '无匹配数据',
        },
    },
    setup(props: Props, { emit }) {
        // dom
        const input = ref<IvueInputInstance>();
        const reference = ref<HTMLDivElement>();
        const dropdown = ref<DropDownInstance>();
        const menu = ref<IvueCascaderMenuInstance>();

        // data
        const data = reactive<Data>({
            /**
             * 是否显示菜单
             *
             * @type {Boolean}
             */
            visibleMenu: false,
            /**
             * 当前的value
             *
             * @type {Array}
             */
            currentValue: props.modelValue || [],
            /**
             * 选择的数据
             *
             * @type {Array}
             */
            selected: [],
            /**
             * 请求的输入
             *
             * @type {String}
             */
            queryData: '',
            /**
             * 有效数据流
             *
             * @type {String}
             */
            validDataStr: '',
            /**
             * 加载子项
             *
             * @type {Boolean}
             */
            isLoadedChildren: false,
            /**
             * 临时选择
             *
             * @type {Array}
             */
            tmpSelected: [],
            /**
             * 修复 changeOnSelect 类型中的设置值
             *
             * @type {Boolean}
             */
            updatingValue: false,
            /**
             * 解决 value 置为 null 时，$emit:update:modelValue [] 而不是 null
             *
             * @type {Boolean}
             */
            isValueNull: false,
            /**
             * 过滤选择
             *
             * @type {Boolean}
             */
            filterableSelect: true,
        });

        // onMounted
        onMounted(() => {
            // 有效数据流
            data.validDataStr = JSON.stringify(getValidData(props.options));

            // 更新选项
            updateSelected(true);
        });

        // computed

        // 外层样式
        const classes = computed(() => {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-visible`]: data.visibleMenu,
                    [`${prefixCls}-disabled`]: props.disabled,
                    [`${prefixCls}-not-found`]:
                        props.filterable &&
                        data.queryData !== '' &&
                        !querySelections.value.length,
                },
            ];
        });

        // input样式
        const inputClasses = computed(() => {
            return [
                `${prefixCls}-input`,
                {
                    [`${prefixCls}-show-clear`]: showCloseIcon.value,
                },
            ];
        });

        // 显示渲染
        const displayRender = computed(() => {
            const label = [];
            for (let i = 0; i < data.selected.length; i++) {
                label.push(data.selected[i].label);
            }

            return props.renderFormat(label, data.selected);
        });

        // 获取的值
        const displayInputRender = computed(() => {
            return props.filterable ? '' : displayRender.value;
        });

        // 输入框提示
        const inputPlaceholder = computed(() => {
            return props.filterable && data.currentValue.length
                ? null
                : props.placeholder;
        });

        // 下拉框样式
        const dropdownClasses = computed(() => {
            return {
                [`${prefixCls}-dropdown-not-found`]:
                    props.filterable &&
                    data.queryData !== '' &&
                    !querySelections.value.length,
                [`${prefixCls}-dropdown--transfer`]: props.transfer,
                [props.transferClassName]: props.transferClassName,
            };
        });

        // 下拉框样式
        const dropdownStyles = computed(() => {
            return {
                display: data.filterableSelect ? 'inline-block' : 'none',
            };
        });

        // 显示清除按钮
        const showCloseIcon = computed(() => {
            return (
                data.currentValue &&
                data.currentValue.length &&
                props.clearable &&
                !props.disabled
            );
        });

        // 获取查询的数据
        const querySelections = computed(() => {
            // 是否支持搜索
            if (!props.filterable) {
                return;
            }

            let selections = [];

            function getSelections(
                arr: Options[],
                label: string,
                value: string
            ) {
                arr.forEach((item) => {
                    // label
                    item.__label = label
                        ? `${label} / ${item.label}`
                        : item.label;

                    // value
                    item.__value = value
                        ? `${value},${item.value}`
                        : item.value;

                    if (item.children && item.children.length) {
                        getSelections(
                            item.children,
                            item.__label,
                            item.__value
                        );

                        delete item.__label;
                        delete item.__value;
                    } else {
                        selections.push({
                            label: item.__label,
                            value: item.__value,
                            display: item.__label,
                            item: item,
                            disabled: !!item.disabled,
                        });
                    }
                });
            }

            // 获取选项
            getSelections(props.options, null, null);

            // 当前匹配项
            selections = selections
                .filter((item) => {
                    return item.label
                        ? item.label.indexOf(data.queryData) > -1
                        : false;
                })
                .map((item) => {
                    item.display = item.display.replace(
                        new RegExp(data.queryData, 'g'),
                        `<span>${data.queryData}</span>`
                    );

                    return item;
                });

            return selections;
        });

        // methods

        // 点击外部
        const handleClickOutside = () => {
            data.visibleMenu = false;
        };

        // 输入框数据改变
        const handleChangeInput = (value: string) => {
            data.queryData = value;
        };

        // 失去焦点
        const handleInputFocus = () => {
            input.value.focus(null);
        };

        // 关闭下拉框
        const handleClose = () => {
            data.visibleMenu = false;
        };

        // 打开菜单
        const handleToggleOpen = () => {
            // 是否禁用选择组件
            if (props.disabled) {
                return false;
            }

            // 是否显示菜单
            if (data.visibleMenu) {
                // 是否支持搜索
                if (!props.filterable) {
                    handleClose();
                }
            } else {
                // 获取焦点
                handleFocus();
            }
        };

        // 结果变化
        const handleResultChange = (params: ResultChange) => {
            // lastValue: 是点击的最终值
            const lastValue = params.lastValue;
            // fromInit: 这是从更新值发出的
            const fromInit = params.fromInit;
            const changeOnSelect = params.changeOnSelect;

            // 点选每级菜单选项值都会发生变化
            if (lastValue || changeOnSelect) {
                const oldVal = JSON.stringify(data.currentValue);

                data.selected = data.tmpSelected;

                const newVal = [];
                data.selected.forEach((item) => {
                    newVal.push(item.value);
                });

                if (!fromInit) {
                    data.updatingValue = true;
                    data.currentValue = newVal;

                    // 发送事件
                    emitValue(data.currentValue, oldVal);
                }
            }

            // 选择最后一项
            if (lastValue && !fromInit) {
                handleClose();
            }
        };

        // 清除选择数据
        const handleClearSelect = () => {
            // 是否禁用选择组件
            if (props.disabled) {
                return false;
            }

            // 当前值
            const oldVal = JSON.stringify(data.currentValue);
            data.currentValue = data.selected = data.tmpSelected = [];

            // 发送事件
            emitValue(data.currentValue, oldVal);

            // 关闭下拉框
            handleClose();

            setTimeout(() => {
                // 清除菜单选择数据
                menu.value.handleClear();
            }, 300);
        };

        // 获取焦点
        const handleFocus = () => {
            data.filterableSelect = true;

            data.visibleMenu = true;

            // 清除带单数据
            if (!data.currentValue.length) {
                menu.value.handleClear();
            }
        };

        // 选择搜索选项
        const handleSelectItem = (item: Options) => {
            // 禁用
            if (item.disabled || item.item.disabled) {
                return false;
            }

            // 清除搜索内容
            data.queryData = '';

            // 清除输入框
            input.value.handleClear();

            const oldVal = JSON.stringify(data.currentValue);
            data.currentValue = item.value.split(',');

            // 有当前数据
            if (data.currentValue.length) {
                updateSelected();
            }

            // 发送事件
            emitValue(data.currentValue, oldVal);

            data.filterableSelect = false;

            setTimeout(() => {
                // 关闭弹窗
                handleClose();
            });
        };

        // 排除 loading 后的 data，避免重复触发 updateSelect
        const getValidData = (data: Options[]) => {
            function deleteData(item: Options) {
                const new_item = Object.assign({}, item);
                if ('loading' in new_item) {
                    delete new_item.loading;
                }

                if ('__value' in new_item) {
                    delete new_item.__value;
                }

                if ('__label' in new_item) {
                    delete new_item.__label;
                }

                if ('children' in new_item && new_item.children.length) {
                    new_item.children = new_item.children.map((i) =>
                        deleteData(i)
                    );
                }
                return new_item;
            }

            return data.map((item: Options) => deleteData(item));
        };

        // 更新选项 触发菜单 handleFindSelected 方法
        const updateSelected = (
            init = false,
            changeOnSelectDataChange = false
        ) => {
            // changeOnSelectDataChange 用于在数据更改和设置值时进行 changeOnSelect
            if (!props.changeOnSelect || init || changeOnSelectDataChange) {
                menu.value.handleFindSelected({
                    value: data.currentValue,
                });
            }
        };

        // 更新结果
        const updateResult = (result: Result[]) => {
            data.tmpSelected = result;
        };

        // 发送事件
        const emitValue = (val: string[], oldVal: string) => {
            if (JSON.stringify(val) !== oldVal) {
                emit(
                    'on-change',
                    data.currentValue,
                    JSON.parse(JSON.stringify(data.selected))
                );
            }
        };

        // 监听菜单打开
        watch(
            () => data.visibleMenu,
            (value) => {
                if (value) {
                    // 有当前数据
                    if (data.currentValue.length) {
                        updateSelected();
                    }

                    // 是否将弹层放置于 body 内，在 Tabs
                    dropdown.value.update();
                } else {
                    // 是否支持搜索
                    if (props.filterable) {
                        // 请求的输入下拉框动画结束后清除
                        setTimeout(() => {
                            data.queryData = '';
                            input.value.handleClear();
                        }, 300);
                    }

                    // 是否将弹层放置于 body 内，在 Tabs
                    if (props.transfer) {
                        dropdown.value.destroy();
                    }
                }

                emit('on-visible-change', value);
            }
        );

        // 监听 modelValue
        watch(
            () => props.modelValue,
            (value) => {
                if (value === null) {
                    data.isValueNull = true;
                }

                // 有当前数据
                data.currentValue = value || [];

                // 清除选择的数据
                if (value === null || !value.length) {
                    data.selected = [];
                }
            }
        );

        // 监听当前的value
        watch(
            () => data.currentValue,
            (value: string[] | null) => {
                // 解决 value 置为 null 时，$emit:update:modelValue [] 而不是 null
                if (data.isValueNull) {
                    data.isValueNull = false;

                    emit('update:modelValue', null);
                } else {
                    emit('update:modelValue', value);
                }

                if (data.updatingValue) {
                    data.updatingValue = false;
                    return;
                }

                // 更新选项
                updateSelected(true);
            }
        );

        // 监听可选项的数据源
        watch(
            () => props.options,
            () => {
                const validDataStr = JSON.stringify(
                    getValidData(props.options)
                );

                // 数据流不一样
                if (validDataStr !== data.validDataStr) {
                    data.validDataStr = validDataStr;

                    if (!data.isLoadedChildren) {
                        nextTick(() =>
                            updateSelected(false, props.changeOnSelect)
                        );
                    }

                    // 加载子项
                    data.isLoadedChildren = false;
                }
            },
            {
                deep: true,
            }
        );

        // provide
        provide(
            SelectContextKey,
            reactive({
                props,
                reference,
            })
        );

        // provide
        provide(
            CascaderContextKey,
            reactive({
                props,
                dropdown,
                data,
                updateResult,
                handleResultChange,
            })
        );

        return {
            prefixCls,

            // dom
            input,
            reference,
            dropdown,
            menu,

            // data
            data,

            // computed
            classes,
            inputClasses,
            displayRender,
            displayInputRender,
            inputPlaceholder,
            dropdownClasses,
            dropdownStyles,
            showCloseIcon,
            querySelections,

            // methods
            handleClickOutside,
            handleChangeInput,
            handleInputFocus,
            handleToggleOpen,
            handleClearSelect,
            handleSelectItem,
            updateResult,
        };
    },
    components: {
        IvueInput,
        IvueIcon,
        DropDown,
        IvueCascaderMenu,
    },
});
</script>
