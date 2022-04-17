<template>
    <div
        :class="classes"
        v-click-outside[capture]="handleClickOutside"
        v-click-outside:[capture].mousedown="handleClickOutside"
    >
        <div :class="`${prefixCls}-rel`" ref="reference">
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
                ></ivue-input>
            </slot>
        </div>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    inject,
    getCurrentInstance,
    onMounted,
    onBeforeUnmount,
} from 'vue';
import ClickOutside from '../../utils/directives/click-outside';
import IvueInput from '../ivue-input/index.vue';

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
    },
    setup(props: any) {
        // vm
        const { proxy }: any = getCurrentInstance();

        // data
        const data: any = reactive<{
            visibleMenu: boolean;
            currentValue: Array<any>;
            capture: boolean;
            selected: Array<any>;
            query: string
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
            return [`${prefixCls}`];
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
        const handleInput = (value) => {
            data.query = value;
        };

        return {
            prefixCls,
            // data
            data,

            // computed
            classes,
            displayInputRender,
            inputPlaceholder,

            // methods
            handleClickOutside,
            handleInput
        };
    },
    components: {
        IvueInput,
    },
});
</script>
