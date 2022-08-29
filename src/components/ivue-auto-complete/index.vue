<template>
    <div>
        <ivue-select
            :modelValue="data.currentValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :placement="placement"
            :transferClassName="transferClassName"
            :searchMethod="searchMethod"
            :transfer="transfer"
            :capture="capture"
            :eventsEnabled="eventsEnabled"
            :notFindText="''"
            :loading="loading"
            :loadingText="loadingText"
            filterable
            auto-complete
            ref="select"
            @on-select="handleSelect"
            @on-clickoutside="handleClickOutside"
        >
            <!-- input -->
            <template #input>
                <slot name="input">
                    <ivue-input
                        v-model="data.currentValue"
                        :name="name"
                        :id="id"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        :clearable="clearable"
                        @on-focus="handleFocus"
                        @on-blur="handleBlur"
                        ref="input"
                    >
                        <template #prefix v-if="$slots.prefix">
                            <slot name="prefix"></slot>
                        </template>
                        <template #suffix v-if="$slots.suffix">
                            <slot name="suffix"></slot>
                        </template>
                    </ivue-input>
                </slot>
            </template>
            <!-- option -->
            <slot>
                <ivue-option v-for="item in filteredData" :value="item" :key="item">{{ item }}</ivue-option>
            </slot>
        </ivue-select>
    </div>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive, ref, watch, nextTick } from 'vue';
import IvueSelect from '../ivue-select/index.vue';
import IvueInput from '../ivue-input/index.vue';
import IvueOption from '../ivue-select/option.vue';

import { oneOf } from '../../utils/assist';

const prefixCls = 'ivue-auto-complete';

export default defineComponent({
    name: prefixCls,
    emits: [
        'update:modelValue',
        'on-search',
        'on-change',
        'on-select',
        'on-focus',
        'on-blur',
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
         * 输入提示
         *
         * @type {String}
         */
        placeholder: {
            type: String,
            default: '',
        },
        /**
         * 是否禁用
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
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
         * 弹窗的展开方向
         *
         * @type {String}
         */
        placement: {
            validator(value: string) {
                return oneOf(value, [
                    'top',
                    'bottom',
                    'top-start',
                    'bottom-start',
                    'top-end',
                    'bottom-end',
                ]);
            },
            default: 'bottom-start',
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
         * id
         *
         * @type {String}
         */
        id: {
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
         * 是否开启 Popper 的 eventsEnabled 属性，开启可能会牺牲一定的性能
         *
         * @type {Boolean}
         */
        eventsEnabled: {
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
         * 自动完成的数据源
         *
         * @type {Array}
         */
        list: {
            type: Array,
            default: () => [],
        },
        /**
         * 外部过滤方法
         *
         * @type {Function, Boolean}
         */
        filterMethod: {
            type: [Function, Boolean],
            default: false,
        },
        /**
         * 远程搜索方法
         *
         * @type {Function}
         */
        remoteMethod: {
            type: Function,
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
    },
    setup(props: any, { emit }) {
        // dom

        // select
        const select = ref<HTMLElement | any>(null);
        // input
        const input = ref<HTMLElement | any>(null);

        // data
        const data: any = reactive<{
            currentValue: string | number | Array<any>;
            disableEmitChange: boolean;
        }>({
            /**
             * 当前输入值
             *
             * @type {String | Number | Array}
             */
            currentValue: props.modelValue,
            /**
             * 禁用事件改变
             *
             * @type {Boolean}
             */
            disableEmitChange: false,
        });

        // computed

        // 过滤的数据
        const filteredData = computed(() => {
            // 是否根据输入项进行筛选
            if (props.filterMethod) {
                return props.list.filter((item) => {
                    return props.filterMethod(data.currentValue, item);
                });
            } else {
                return props.list;
            }
        });

        // methods

        // 搜索方法
        const searchMethod = (query) => {
            emit('on-search', query);

            if (props.remoteMethod) {
                props.remoteMethod(query);
            }
        };

        // 被选中时调用，参数为选中项的 value 值
        const handleSelect = (option) => {
            const value = option.value;

            if (value === undefined || value === null) {
                return;
            }

            data.currentValue = value;

            // blur
            input.value.blur();

            emit('on-select', value);
        };

        // 点击外部
        const handleClickOutside = () => {
            nextTick(() => {
                // blur
                input.value.blur();
            });
        };

        // 获取焦点
        const handleFocus = (event) => {
            emit('on-focus', event);
        };

        // 失去焦点
        const handleBlur = (event) => {
            emit('on-blur', event);
        };

        // watch

        // 监听设置选择的值
        watch(
            () => props.modelValue,
            (value) => {
                // 当前输入值不相等
                if (data.currentValue !== value) {
                    data.disableEmitChange = true;
                }

                data.currentValue = value;
            }
        );

        // 监听当前输入值
        watch(
            () => data.currentValue,
            (value) => {
                select.value.setQuery(value);

                emit('update:modelValue', value);

                // 防止触发多次
                if (data.disableEmitChange) {
                    data.disableEmitChange = false;

                    return;
                }

                emit('on-change', value);
            }
        );

        return {
            // dom
            select,
            input,

            // data
            data,

            filteredData,

            // methods
            searchMethod,
            handleSelect,
            handleClickOutside,
            handleFocus,
            handleBlur,
        };
    },
    components: {
        IvueSelect,
        IvueInput,
        IvueOption,
    },
});
</script>
