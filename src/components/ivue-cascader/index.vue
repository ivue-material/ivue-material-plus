<template>
    <div
        :class="classes"
        v-click-outside[capture]="handleClickOutside"
        v-click-outside:[capture].mousedown="handleClickOutside"
    >
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
            <drop-down v-show="data.visibleMenu" ref="dropdown"></drop-down>
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
    onMounted,
    onBeforeUnmount,
} from 'vue';
import ClickOutside from '../../utils/directives/click-outside';
import IvueInput from '../ivue-input/index.vue';
import IvueIcon from '../ivue-icon/index.vue';
// 下拉框
import DropDown from '../ivue-select/drop-down.vue';

const prefixCls = 'ivue-cascader';

export default defineComponent({
    name: prefixCls,
    // 注册局部指令
    directives: { ClickOutside },
    props: {
        /**
         * 可选项的数据源
         *
         * @type {Array}
         */
        data: {
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
    },
    setup(props: any) {
        // dom
        const input = ref<HTMLElement | null>(null);
        const reference = ref<HTMLElement | null>(null);
        const dropdown = ref(null);

        // vm
        const { proxy }: any = getCurrentInstance();

        // data
        const data: any = reactive<{
            visibleMenu: boolean;
            currentValue: Array<any>;
            capture: boolean;
            selected: Array<any>;
            query: string;
        }>({
            /**
             * 是否显示菜单
             *
             * @type {Boolean}
             */
            visibleMenu: false,
            /**
             * 当前的 value
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

        // methods

        // 点击外部
        const handleClickOutside = () => {
            data.visibleMenu = true;
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

        // 获取焦点
        const onFocus = () => {
            data.visibleMenu = true;

            // if (!data.currentValue.length) {
            // this.broadcast('Caspanel', 'on-clear');
            // }
        };

        // provide
        provide(
            'ivue-select',
            reactive({
                props,
                reference,
            })
        );

        return {
            prefixCls,

            // dom
            input,
            reference,
            dropdown,

            // data
            data,

            // computed
            classes,
            displayRender,
            displayInputRender,
            inputPlaceholder,

            // methods
            handleClickOutside,
            handleInput,
            handleFocus,
            handleToggleOpen,
        };
    },
    components: {
        IvueInput,
        IvueIcon,
        DropDown,
    },
});
</script>
