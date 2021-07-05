<template>
    <div :class="classes">
        <!-- 图标 -->
        <span :class="`${prefixCls}-prefix`" v-if="$slots.prefix || prefix">
            <slot name="prefix">
                <ivue-icon v-if="prefix">{{ prefix }}</ivue-icon>
            </slot>
        </span>
        <!-- 多选和设置了最大显示数时的方框 -->
        <!-- eslint-disable vue/no-use-v-if-with-v-for -->
        <div
            :class="`${prefixCls}-tag`"
            v-for="(item, index) in selectedMultiple"
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
        <!-- 多选达到最大值省略 -->
        <div
            :class="`${prefixCls}-tag`"
            v-if="
                maxTagCount !== undefined &&
                selectedMultiple.length > maxTagCount
            "
        >
            <span :class="`${prefixCls}-tag-text ${prefixCls}-max-tag`">
                <template v-if="maxTagPlaceholder">
                    {{
                    maxTagPlaceholder(selectedMultiple.length - maxTagCount)
                    }}
                </template>
                <template v-else>{{ selectedMultiple.length - maxTagCount }}...</template>
            </span>
        </div>
        <!-- 普通渲染 -->
        <span :class="defaultDisplayClasses" v-if="defaultDisplayValue">{{ defaultDisplayValue }}</span>
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
import { defineComponent, computed, inject } from 'vue';

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
    },
    setup(props, { slots, emit }) {
        // inject
        const select: any = inject('ivue-select');

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

            select.handleOptionClick(value);
        };

        return {
            prefixCls,

            // computed
            classes,
            selectedMultiple,
            defaultDisplayClasses,
            defaultDisplayValue,
            resetSelect,

            // methods
            handleClear,
            handleRemoveSelectItem,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
