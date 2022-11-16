<template>
    <div :class="classes" ref="wrapper">
        <!-- 图标 -->
        <span :class="`${prefixCls}-prefix`" v-if="$slots.prefix || prefix">
            <slot name="prefix">
                <ivue-icon v-if="prefix">{{ prefix }}</ivue-icon>
            </slot>
        </span>
        <!-- 多选和设置了最大显示数时的方框 -->
        <template v-for="(item, index) in selectedMultiple">
            <div
                :class="`${prefixCls}-tag`"
                :key="item.value"
                v-if="maxTagCount === undefined || index < maxTagCount"
            >
                <span
                    :class="{
                    [`${prefixCls}-tag-text`]: true,
                    [`${prefixCls}-multiple-tag-hidden`]: item.disabled,
                }"
                >{{ item.label }}</span>
                <ivue-icon
                    v-if="!item.disabled"
                    :class="multipleIcon"
                    @click.stop="handleRemoveSelectItem(item)"
                >{{ multipleIcon }}</ivue-icon>
            </div>
        </template>
        <!-- 多选达到最大值省略 -->
        <div
            :class="`${prefixCls}-tag`"
            v-if="
                maxTagCount !== undefined &&
                selectedMultiple.length > maxTagCount"
        >
            <span :class="`${prefixCls}-tag-text ${prefixCls}-max-tag`">
                <template
                    v-if="maxTagPlaceholder"
                >{{ maxTagPlaceholder(selectedMultiple.length - maxTagCount) }}</template>
                <template v-else>+{{ selectedMultiple.length - maxTagCount }}...</template>
            </span>
        </div>
        <!-- 普通渲染 -->
        <span :class="defaultDisplayClasses" v-if="defaultDisplayValue">{{ defaultDisplayValue }}</span>
        <!-- 输入框 -->
        <input
            type="text"
            v-if="filterable"
            v-model="data.filterQuery"
            :class="[`${prefixCls}-input-filter`,
                        {'ivue-select-input-filter-placeholder': showPlaceholder}
                    ]"
            :style="inputStyles"
            :placeholder="showPlaceholder ? placeholder : ''"
            :disabled="disabled"
            spellcheck="false"
            autocomplete="off"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @input="handleResetInputState"
            @keydown.delete="handleInputDelete"
            @keydown.enter="handleInputEnter"
        />
        <!-- 下拉图标 -->
        <transition name="ivue-select-fade">
            <ivue-icon
                :class="[`${prefixCls}-arrow`]"
                v-if="!resetSelect && !isSearchMethod"
            >{{ arrowDownIcon }}</ivue-icon>
        </transition>
        <transition name="ivue-select-fade">
            <!-- 重置选择 -->
            <ivue-icon
                :class="[`${prefixCls}-arrow`,`${prefixCls}-clear`]"
                v-if="resetSelect"
                @click.stop="handleClear"
            >{{ resetSelectIcon }}</ivue-icon>
        </transition>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
    inject,
    reactive,
    watch,
    nextTick,
    ref,
} from 'vue';

import IvueIcon from '../ivue-icon/index.vue';

const prefixCls = 'ivue-select';

export default defineComponent({
    name: 'ivue-select-head',
    props: {
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
            default: '',
        },
        /**
         * 最终渲染的数据
         *
         * @type {Array}
         */
        values: {
            type: Array,
            default: () => [],
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
         * 开启过滤筛选
         *
         * @type {Boolean}
         */
        filterable: {
            type: Boolean,
            default: false,
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
         * 下拉图标
         *
         * @type {Boolean}
         */
        arrowDownIcon: {
            type: String,
        },
        /**
         * 是否可以清楚选择
         *
         * @type {Boolean}
         */
        clearable: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否有搜索方法
         *
         * @type {Boolean}
         */
        isSearchMethod: {
            type: Boolean,
            default: false,
        },
        /**
         * 重置选择图标
         *
         * @type {Boolean}
         */
        resetSelectIcon: {
            type: String,
            default: '',
        },
        /**
         * 外部输入框输入数据
         *
         * @type {String}
         */
        filterQueryProp: {
            type: String,
            default: '',
        },
        /**
         * 外部dom元素
         *
         * @type {Object}
         */
        selectionDom: {
            type: Object,
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
    },
    setup(props: any, { slots, emit }) {
        const wrapper = ref<HTMLElement | null>(null);

        // inject
        const select: any = inject('ivue-select');

        // data
        const data = reactive<{
            inputLength: number;
            filterQuery: any;
            isInputChange: boolean;
        }>({
            /**
             * 输入框长度
             *
             * @type { Number}
             */
            inputLength: 30,
            /**
             * 输入框输入数据
             *
             * @type { String}
             */
            filterQuery: props.filterQueryProp,
            /**
             * 输入框是否输入-这里不是判断直接赋值v-model而是输入框确实有输入行为
             *
             * @type { Boolean}
             */
            isInputChange: false,
        });

        // computed

        // 外层样式
        const classes = computed(() => {
            return {
                // 开启了过滤 && 有图标
                [`${prefixCls}-head-flex`]:
                    props.filterable && (slots.prefix || props.prefix),
            };
        });

        // 多项选择
        const selectedMultiple = computed(() => {
            return props.multiple ? props.values : [];
        });

        // 普通显示的class
        const defaultDisplayClasses = computed(() => {
            return [
                {
                    [`${prefixCls}-head-with-prefix`]:
                        slots.prefix || props.prefix,
                    [`${prefixCls}-selection-value`]:
                        !showPlaceholder.value &&
                        !props.multiple &&
                        !props.filterable,
                    [`${prefixCls}-placeholder`]:
                        showPlaceholder.value && !props.filterable,
                },
            ];
        });

        // 是否显示占位符
        const showPlaceholder = computed(() => {
            let status = false;
            if (!props.multiple) {
                const value = props.values[0];

                // 判断 undefined 和清除空格
                if (
                    typeof value === 'undefined' ||
                    String(value).trim() === ''
                ) {
                    status = true;
                }
            } else {
                if (!(props.values.length > 0)) {
                    status = true;
                }
            }

            return status;
        });

        // 普通显示的值
        const defaultDisplayValue = computed(() => {
            // 判断是否是多选 或者 是否开启了输入框过滤
            if (
                (props.multiple && props.values.length > 0) ||
                props.filterable
            ) {
                return '';
            }

            return `${selectedSingle.value}` || props.placeholder;
        });

        // 选择单个选项
        const selectedSingle = computed(() => {
            const selected: any = props.values[0];

            return selected ? selected.label : '';
        });

        // 重置选择
        const resetSelect = computed(() => {
            return !showPlaceholder.value && props.clearable;
        });

        // 输入框样式
        const inputStyles = computed(() => {
            const style: any = {};

            if (props.multiple) {
                if (showPlaceholder.value) {
                    style.width = '100%';
                } else {
                    style.width = `${data.inputLength}px`;
                }
            }

            return style;
        });

        // methods

        // 清除选择
        const handleClear = () => {
            emit('on-clear');
        };

        // 删除选择选项
        const handleRemoveSelectItem = (value) => {
            if (props.disabled) {
                return false;
            }

            // 多选删除了
            select.handleOptionClick(value, 'delete-multiple');
        };

        // 判断焦点发送事件
        const handleInputFocus = () => {
            emit('on-input-focus');
        };

        // 失去焦点
        const handleInputBlur = () => {
            if (props.showCreateItem) {
                return;
            }

            // 没有选项
            if (!props.values.length) {
                data.filterQuery = '';
            }

            emit('on-input-blur');
        };

        // 重置输入框状态
        const handleResetInputState = (event = null) => {
            const value = (event && event.target.value) || data.filterQuery;

            data.inputLength = value.length * 12 + 20;

            const wrapperOffsetWidth = wrapper.value.offsetWidth;

            if (data.inputLength > wrapperOffsetWidth) {
                data.inputLength = wrapperOffsetWidth;
            }
        };

        // 输入框删除
        const handleInputDelete = (event) => {
            const targetValue = event.target.value;

            if (
                props.multiple &&
                selectedMultiple.value.length &&
                data.filterQuery === '' &&
                targetValue === ''
            ) {
                handleRemoveSelectItem(
                    selectedMultiple.value[selectedMultiple.value.length - 1]
                );
            }
        };

        // 点击确认
        const handleInputEnter = () => {
            emit('on-enter');
        };

        // watch

        // 监听最终渲染的数据
        watch(
            () => props.values,
            ([value]: any) => {
                // 开启了过滤
                if (!props.filterable) {
                    return;
                }

                data.isInputChange = true;

                // 判断多选
                if (props.multiple) {
                    // 输入框输入数据
                    data.filterQuery = '';
                    // 判断输入框是否输入-这里不是判断直接赋值v-model而是输入框确实有输入行为
                    data.isInputChange = false;

                    return;
                }

                if (
                    typeof value === 'undefined' ||
                    value === '' ||
                    value === null
                ) {
                    data.filterQuery = '';
                } else {
                    data.filterQuery = value.label;
                }

                nextTick(() => {
                    // 判断输入框是否输入-这里不是判断直接赋值v-model而是输入框确实有输入行为
                    data.isInputChange = false;
                });
            }
        );

        // 监听过滤输入
        watch(
            () => data.filterQuery,
            (value) => {
                if (data.isInputChange) {
                    data.isInputChange = false;
                    return;
                }

                emit('on-filter-query-change', value);
            }
        );

        // 监听外部过滤输入
        watch(
            () => props.filterQueryProp,
            (filterQuery) => {
                if (filterQuery !== data.filterQuery && props.filterable) {
                    data.filterQuery = filterQuery;
                }

                // 重置输入框长度
                handleResetInputState();
            }
        );

        return {
            prefixCls,

            // dom
            wrapper,

            // data
            data,

            // computed
            classes,
            selectedMultiple,
            defaultDisplayClasses,
            defaultDisplayValue,
            resetSelect,
            showPlaceholder,
            inputStyles,

            // methods
            handleClear,
            handleRemoveSelectItem,
            handleInputFocus,
            handleInputBlur,
            handleResetInputState,
            handleInputDelete,
            handleInputEnter,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
