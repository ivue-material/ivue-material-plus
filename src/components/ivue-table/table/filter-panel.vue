<template>
    <ivue-tooltip
        :class="prefixCls"
        :transferClassName="prefixCls"
        :placement="placement"
        v-model="tooltipVisible"
        theme="light"
        noArrow
        transfer
        manual
    >
        <!-- 内容 -->
        <template #content>
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
                    >Confirm</button>
                    <!-- 重置 -->
                    <button @click="handleReset">Reset</button>
                </div>
            </div>
        </template>
        <!-- 图标 -->
        <ivue-icon :class="iconClass" @click="handleShowTooltip">keyboard_arrow_down</ivue-icon>
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
} from 'vue';
import IvueTooltip from '../../ivue-tooltip/index.vue';
import IvueIcon from '../../ivue-icon/index.vue';
import IvueScrollbar from '../../ivue-scrollbar/index.vue';
import IvueCheckboxGroup from '../../ivue-checkbox-group/index.vue';
import IvueCheckbox from '../../ivue-checkbox/index.vue';

// ts
import type { TableColumnCtx } from '../table-column/defaults';
import type { Store } from '../store';

const prefixCls = 'ivue-table-filter-panel';

export default defineComponent({
    name: prefixCls,
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
    setup(props) {
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

            handleHiddenTooltip();
        };

        // 确认过滤
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

        // watch

        // 监听tooltip显示
        watch(tooltipVisible, (value) => {
            if (props.column) {
                props.upDataColumn('filterOpened', value);
            }
        });

        return {
            prefixCls,
            // data
            tooltipVisible,

            // computed
            iconClass,
            filterMultiple,
            filteredValue,
            filtersList,

            // methods
            handleShowTooltip,
            handleReset,
            handleFilter,
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
