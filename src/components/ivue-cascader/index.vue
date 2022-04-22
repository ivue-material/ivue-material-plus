<template>
    <div :class="classes" v-outside="handleClickOutside">
        <!-- 输入框 -->
        <div :class="`${prefixCls}-rel`" ref="reference" @click="handleToggleOpen">
            <input type="hidden" :name="name" :value="data.currentValue" />

            <slot>
                <ivue-input
                    :id="id"
                    :readonly="!filterable"
                    :disabled="disabled"
                    :value="displayInputRender"
                    :placeholder="inputPlaceholder"
                    @on-change="handleInput"
                    ref="input"
                >
                    <!-- 下拉图标 -->
                    <template #suffix>
                        <slot name="suffix">
                            <ivue-icon :class="`${prefixCls}-arrow`">{{ arrowDownIcon }}</ivue-icon>
                            <!-- <ivue-icon :class="`${prefixCls}-arrow`">{{ clearableIcon }}</ivue-icon> -->
                        </slot>
                    </template>
                </ivue-input>
                <!-- 是否支持搜索 -->
                <div
                    :class="`${prefixCls}-label`"
                    v-show="filterable && data.query === ''"
                    @click="handleFocus"
                >{{ displayRender }}</div>
            </slot>
        </div>
        <!-- 下拉菜单 -->
        <transition name="transition-drop">
            <drop-down
                :transfer="transfer"
                :data-transfer="transfer"
                :eventsEnabled="eventsEnabled"
                :class="dropdownClass"
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
                        v-show="!filterable || (filterable && query === '')"
                    ></ivue-cascader-menu>
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
    getCurrentInstance,
    provide,
    watch,
    nextTick,
    onMounted,
} from 'vue';

import { oneOf } from '../../utils/assist';
import Outside from '../../utils/directives/outside';
import TransferDom from '../../utils/directives/transfer-dom';

import IvueInput from '../ivue-input/index.vue';
import IvueIcon from '../ivue-icon/index.vue';
import DropDown from '../ivue-select/drop-down.vue';
import IvueCascaderMenu from './menu.vue';

const prefixCls = 'ivue-cascader';

export default defineComponent({
    name: prefixCls,
    // 注册局部指令
    directives: { Outside, TransferDom },
    emits: ['on-change', 'update:modelValue'],
    props: {
        /**
         * 可选项的数据源
         *
         * @type {Array}
         */
        options: {
            type: Array,
            default() {
                return [];
            },
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
         * 是否开启外部点击的 capture 模式，可通过全局配置
         *
         * @type {Boolean}
         */
        capture: {
            type: Boolean,
            default: true,
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
            default(label: any) {
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
         * 清除按钮图标
         *
         * @type {Boolean}
         */
        clearableIcon: {
            type: String,
            default: 'cancel',
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
         * 是否开启 Popper 的 eventsEnabled 属性，开启可能会牺牲一定的性能
         *
         * @type {Boolean}
         */
        eventsEnabled: {
            type: Boolean,
            default: false,
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
         * 次级菜单展开方式，可选值为 click 或 hover
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
        },
    },
    setup(props: any, { emit }) {
        // dom
        const input = ref<HTMLElement | null>(null);
        const reference = ref<HTMLElement | null>(null);
        const dropdown = ref(null);
        const menu = ref(null);

        // vm
        const { proxy }: any = getCurrentInstance();

        // data
        const data: any = reactive<{
            visibleMenu: boolean;
            currentValue: Array<any>;
            capture: boolean;
            selected: Array<any>;
            query: string;
            validDataStr: string;
            isLoadedChildren: boolean;
            tmpSelected: Array<any>;
            updatingValue: boolean;
            isValueNull: boolean;
        }>({
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
             * 是否开启 capture 模式，也可通过全局配置
             *
             * @type {Boolean}
             */
            capture: !proxy.$IVUE ? props.capture : proxy.$IVUE.capture,
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
            query: '',
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
                },
            ];
        });

        // 显示渲染
        const displayRender = computed(() => {
            let label = [];
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
        const dropdownClass = computed(() => {
            return {
                [`${prefixCls}-dropdown--transfer`]: props.transfer,
                [props.transferClassName]: props.transferClassName,
            };
        });

        // methods

        // 点击外部
        const handleClickOutside = () => {
            console.log('点击外部');

            data.visibleMenu = false;
        };

        // 输入框数据改变
        const handleInput = (value: string) => {
            data.query = value;
        };

        // 失去焦点
        const handleFocus = () => {
            input.value.focus();
        };

        // 关闭
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
                onFocus();
            }
        };

        // 结果变化
        const handleResultChange = (params) => {
            // lastValue: 是点击的最终值
            const lastValue = params.lastValue;
            // fromInit: 这是从更新值发出的
            const fromInit = params.fromInit;
            const changeOnSelect = params.changeOnSelect;

            // 点选每级菜单选项值都会发生变化
            if (lastValue || changeOnSelect) {
                const oldVal = JSON.stringify(data.currentValue);

                console.log('?点选每级菜单选项值都会发生变化?');
                data.selected = data.tmpSelected;

                let newVal = [];
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

        // 获取焦点
        const onFocus = () => {
            data.visibleMenu = true;
            console.log('获取焦点');

            // 清除带单数据
            if (!data.currentValue.length) {
                menu.value.handleClear();
            }
        };

        // 排除 loading 后的 data，避免重复触发 updateSelect
        const getValidData = (data) => {
            function deleteData(item) {
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

            return data.map((item) => deleteData(item));
        };

        // 更新选项
        const updateSelected = (
            init: boolean = false,
            changeOnSelectDataChange: boolean = false
        ) => {
            // changeOnSelectDataChange 用于在数据更改和设置值时进行 changeOnSelect
            if (!props.changeOnSelect || init || changeOnSelectDataChange) {
                menu.value.handleFindSelected({
                    value: data.currentValue,
                });

                console.log('更新选项', data.currentValue);
            }
        };

        // 更新结果
        const updateResult = (result) => {
            console.log(result);
            data.tmpSelected = result;
        };

        // 发送事件
        const emitValue = (val, oldVal) => {
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
                    console.log('data.currentValue', data.currentValue)
                    if (data.currentValue.length) {
                        updateSelected();
                    }

                    // if (this.transfer) {
                    //     this.$refs.drop.update();
                    // }
                    // this.broadcast('Drop', 'on-update-popper');
                }
                // else {
                //     if (this.filterable) {
                //         this.query = '';
                //         this.$refs.input.currentValue = '';
                //     }
                //     if (this.transfer) {
                //         this.$refs.drop.destroy();
                //     }
                //     this.broadcast('Drop', 'on-destroy-popper');
                // }
                // this.$emit('on-visible-change', val);
            }
        );

        // 监听 modelValue
        watch(
            () => props.modelValue,
            (value) => {}
        );

        // 监听当前的value
        watch(
            () => data.currentValue,
            (value) => {
                console.log(value);

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

        watch(
            () => data.visibleMenu,
            (value) => {
                console.log('value');
                console.log(value);
            }
        );

        // provide
        provide(
            'ivue-select',
            reactive({
                props,
                reference,
            })
        );

        // provide
        provide(
            'ivue-cascader',
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
            displayRender,
            displayInputRender,
            inputPlaceholder,
            dropdownClass,

            // methods
            handleClickOutside,
            handleInput,
            handleFocus,
            handleToggleOpen,
            updateResult
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
