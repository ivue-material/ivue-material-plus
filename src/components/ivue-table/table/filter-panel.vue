<template>
    <ivue-tooltip
        v-model="tooltipVisible"
        :class="prefixCls"
        :transferClassName="prefixCls"
        :placement="placement"
        theme="light"
        noArrow
        transfer
        manual
        ref="tooltip"
    >
        <!-- 内容 -->
        <template #content>
            <!-- 多选 -->
            <div v-if="filterMultiple">
                <!-- content -->
                <div :class="`${prefixCls}-content`">
                    <!-- scrollbar -->
                    <ivue-scrollbar>
                        <!-- checkbox-group -->
                        <ivue-checkbox-group
                            :class="`${prefixCls}-checkbox-group`"
                            v-model="filteredValue"
                        >
                            <!-- checkbox -->
                            <ivue-checkbox
                                v-for="filter in filtersList"
                                :key="filter.value"
                                :label="filter.value"
                            ></ivue-checkbox>
                        </ivue-checkbox-group>
                    </ivue-scrollbar>
                </div>
                <!-- 按钮 -->
                <div :class="`${prefixCls}-bottom`">
                    <!-- 确认 -->
                    <button
                        :class="{
                          ['is-disabled']: filteredValue.length === 0
                        }"
                        @click="handleConfirm"
                    >Confirm</button>
                    <!-- 重置 -->
                    <button @click="handleReset">Reset</button>
                </div>
            </div>
            <!-- 单选 -->
            <ul :class="`${prefixCls}-list`" v-else>
                <!-- 全部 -->
                <li
                    :class="[`${prefixCls}-list--item`, (filterValue === undefined || filterValue === null) && `${prefixCls}-list--active`]"
                    @click="handleSelect(null)"
                >全部</li>
                <!-- 其他 -->
                <li
                    :class="[`${prefixCls}-list--item`, isActive(filter) && `${prefixCls}-list--active`]"
                    v-for="filter in filtersList"
                    :key="filter.value"
                    :label="filter.value"
                    @click="handleSelect(filter.value)"
                >{{ filter.text }}</li>
            </ul>
        </template>
        <!-- 图标 -->
        <ivue-icon
            :class="iconClass"
            @click="handleShowTooltip"
            v-click-outside:[capture]="handleHiddenTooltip"
        >keyboard_arrow_down</ivue-icon>
    </ivue-tooltip>
</template>

<script lang='ts'>
import {
    defineComponent,
    ref,
    watch,
    PropType,
    computed,
    WritableComputedRef,
    getCurrentInstance,
} from 'vue';
import IvueTooltip from '../../ivue-tooltip/index.vue';
import IvueIcon from '../../ivue-icon/index.vue';
import IvueScrollbar from '../../ivue-scrollbar/index.vue';
import IvueCheckboxGroup from '../../ivue-checkbox-group/index.vue';
import IvueCheckbox from '../../ivue-checkbox/index.vue';
// 注册外部点击事件插件
import ClickOutside from '../../../utils/directives/click-outside';

// ts
import type { TableColumnCtx } from '../table-column/defaults';
import type { Store } from '../store';

const prefixCls = 'ivue-table-filter-panel';

export default defineComponent({
    name: prefixCls,
    // 注册局部指令
    directives: { ClickOutside },
    props: {
        /**
         * 弹窗的展开方向
         *
         * @type {String}
         */
        placement: {
            type: String,
            default: 'bottom-start',
        },
        /**
         * 当前列数据
         *
         * @type {Object}
         */
        column: {
            type: Object as PropType<TableColumnCtx<unknown>>,
        },
        /**
         * 更新列数据
         *
         * @type {Function}
         */
        upDataColumn: {
            type: Function,
        },
        store: {
            type: Object as PropType<Store<unknown>>,
        },
    },
    setup(props: any) {
        // vm
        const vm = getCurrentInstance();

        // dom
        const tooltip = ref(null);

        const parent: any = vm?.parent;

        // 当前列
        if (!parent.filterPanels.value[props.column.id]) {
            parent.filterPanels.value[props.column.id] = vm;
        }

        // tooltip显示
        const tooltipVisible = ref(false);

        // computed
        const iconClass = computed(() => {
            return {
                [`${prefixCls}-visible`]: props.column.filterOpened,
                [`${prefixCls}-icon`]: true,
            };
        });

        // 数据过滤的选项是否多选
        const filterMultiple = computed(() => {
            if (props.column) {
                return props.column.filterMultiple;
            }
            return true;
        });

        // 选择的过滤选项
        const filteredValue: WritableComputedRef<unknown[]> = computed({
            get() {
                if (props.column) {
                    return props.column.filteredValue || [];
                }
                return [];
            },
            set(value: unknown[]) {
                // 更新列数据
                if (props.column) {
                    props.upDataColumn('filteredValue', value);
                }
            },
        });

        // 数据过滤的选项
        const filtersList = computed(() => {
            return props.column && props.column.filters;
        });

        // tooltip 状态 capture
        const capture = computed(() => {
            return tooltip.value?.capture;
        });

        // 第一个选择过滤的值
        const filterValue = computed({
            get: () => {
                return (props.column.filteredValue || [])[0];
            },
            set: (value: string) => {
                // 有过滤值
                if (filteredValue.value) {
                    // 替换第一个的值->重复点击同一个
                    if (typeof value !== 'undefined' && value !== null) {
                        filteredValue.value.splice(0, 1, value);
                    }
                    // 选择第一个
                    else {
                        filteredValue.value.splice(0, 1);
                    }
                }
            },
        });

        // methods

        // 显示tooltip
        const handleShowTooltip = (event) => {
            event.stopPropagation();

            tooltipVisible.value = !tooltipVisible.value;
        };

        // 重置
        const handleReset = () => {
            // 清除过滤列表
            filteredValue.value = [];

            // 确认过滤
            handleFilter(filteredValue.value);

            // 隐藏tooltip
            handleHiddenTooltip();
        };

        // 确认选择
        const handleConfirm = () => {
            // 确认过滤
            handleFilter(filteredValue.value);

            // 隐藏tooltip
            handleHiddenTooltip();
        };

        // 过滤方法
        const handleFilter = (filteredValue: unknown[]) => {
            props.store.commit('filterChange', {
                column: props.column,
                values: filteredValue,
            });

            props.store.updateAllSelected();
        };

        // 隐藏tooltip
        const handleHiddenTooltip = () => {
            tooltipVisible.value = false;
        };

        // 选择
        const handleSelect = (value?: string) => {
            filterValue.value = value;

            // 有数据
            if (typeof value !== 'undefined' && value !== null) {
                handleFilter(filteredValue.value);
            }
            // 没有数据
            else {
                handleFilter([]);
            }

            // 隐藏tooltip
            handleHiddenTooltip();
        };

        // 是否激活
        const isActive = (filter) => {
            return filter.value === filterValue.value;
        };

        // watch

        // 监听tooltip显示
        watch(tooltipVisible, (value) => {
            if (props.column) {
                props.upDataColumn('filterOpened', value);
            }
        });

        return {
            prefixCls,
            // dom
            tooltip,
            // data
            tooltipVisible,

            // computed
            iconClass,
            filterMultiple,
            filteredValue,
            filtersList,
            capture,
            filterValue,

            // methods
            isActive,
            handleShowTooltip,
            handleHiddenTooltip,
            handleReset,
            handleFilter,
            handleConfirm,
            handleSelect,
        };
    },
    components: {
        IvueTooltip,
        IvueIcon,
        IvueScrollbar,
        IvueCheckboxGroup,
        IvueCheckbox,
    },
});
</script>
