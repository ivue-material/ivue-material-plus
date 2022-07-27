<template>
    <div :class="wrapperClass" @mouseleave="handleMouseLeave()" ref="tableWrapper">
        <!-- 外层 -->
        <div :class="`${prefixCls}-content`" :style="contentStyles">
            <!-- hidden -->
            <div ref="hiddenColumns" :class="`${prefixCls}-hidden`">
                <slot />
            </div>

            <!-- 头部 -->
            <div
                :class="`${prefixCls}-header--wrapper`"
                v-mousewheel="handleMousewheel"
                ref="header"
                v-if="showHeader && tableLayout === 'fixed'"
            >
                <table
                    :class="`${prefixCls}-header`"
                    :style="tableStyles"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    ref="tableHeader"
                >
                    <!-- colgroup -->
                    <ivue-colgroup
                        :columns="store.states.columns.value"
                        :table-layout="tableLayout"
                    ></ivue-colgroup>
                    <!-- header -->
                    <table-header
                        :border="border"
                        :default-sort="defaultSort"
                        :store="store"
                        @on-drag-visible="handleDragVisible"
                        ref="tableHeaderRef"
                    ></table-header>
                </table>
            </div>
            <!-- 内容 -->
            <div :class="`${prefixCls}-body-wrapper`" ref="bodyWrapper">
                <ivue-scrollbar
                    :wrapperStyle="scrollbarWrapperStyle"
                    :contentStyle="scrollbarContentStyle"
                    :always="true"
                    ref="scrollbar"
                >
                    <!-- 表格 -->
                    <table
                        :class="`${prefixCls}-body`"
                        :style="tableBodyStyle"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        ref="tableBody"
                    >
                        <!-- colgroup -->
                        <ivue-colgroup
                            :columns="store.states.columns.value"
                            :table-layout="tableLayout"
                        ></ivue-colgroup>
                        <!-- 内容 -->
                        <table-body
                            :store="store"
                            :stripe="stripe"
                            :rowClassName="rowClassName"
                            :rowStyle="rowStyle"
                        ></table-body>
                    </table>
                    <!-- 没有数据 -->
                    <div
                        v-if="isData"
                        :class="`${prefixCls}-placeholder`"
                        :style="placeholderStyle"
                        ref="placeholder"
                    >
                        <slot name="placeholder">
                            <span :class="`${prefixCls}-placeholder--text`">{{ placeholder }}</span>
                        </slot>
                    </div>
                </ivue-scrollbar>
            </div>
        </div>
        <!-- 拖拽时的虚线 -->
        <div :class="`${prefixCls}-column-resize-proxy`" ref="resizeProxy" v-show="dragging"></div>
    </div>
</template>

<script lang='ts'>
import {
    computed,
    defineComponent,
    getCurrentInstance,
    provide,
    onMounted,
} from 'vue';

// 表格改变
import TableLayout from './table-layout';
// Mousewheel
import { Mousewheel } from '../../utils/directives';

// store
import { createStore } from './store/helper';

// 表格style
import useStyle from './table/style';

// components
import IvueColgroup from './colgroup';
import TableHeader from './table-header';
import TableBody from './table-body';
import IvueScrollbar from '../ivue-scrollbar/index.vue';

// ts
import type { Table } from './table/defaults';
import defaultProps from './table/defaults';

const prefixCls = 'ivue-table';
let tableIdSeed = 1;

export default defineComponent({
    name: prefixCls,
    props: defaultProps,
    directives: {
        Mousewheel,
    },
    setup(props) {
        type Row = typeof props.data[number];

        // vm
        const table = getCurrentInstance() as Table<Row>;

        // 设置id
        const tableId = `${prefixCls}-${tableIdSeed++}`;
        table.tableId = tableId;

        // store
        const store = createStore<Row>(table, props);
        table.store = store;

        // 表格布局
        const layout = new TableLayout<Row>({
            // table store
            store: table.store,
            // table vm
            table,
            // 列的宽度是否自撑开
            fit: props.fit,
            // 显示头部
            showHeader: props.showHeader,
        });

        table.layout = layout;

        // 表格样式
        const {
            // data
            dragging,
            renderExpanded,
            resizeState,
            tableWidth,
            isGroup,

            // computed
            tableLayout,
            contentStyles,
            tableStyles,
            placeholderStyle,
            tableBodyStyle,
            scrollbarWrapperStyle,
            scrollbarContentStyle,

            // methods
            handleMouseLeave,
            handleMousewheel,
            handleDragVisible,
            handleLayout,
            handleBindEvents,
        } = useStyle<Row>(props, layout, store, table);

        // 表格状态
        table.state = {
            resizeState,
            isGroup,
            handleLayout,
        };

        // computed

        // 外层样式
        const wrapperClass = computed(() => {
            return [
                prefixCls,
                `${prefixCls}-layout-${tableLayout.value}`,
                {
                    // 列的宽度是否自撑开
                    [`${prefixCls}-fit`]: props.fit,
                    // 	是否带有纵向边框
                    [`${prefixCls}-border`]: props.border,
                    // 是否拥有多级表头
                    [`${prefixCls}-group`]: isGroup,
                    // Table 的最大高度
                    [`${prefixCls}-max-height`]: props.maxHeight,
                    // 滚动x
                    [`${prefixCls}-scroll-x`]: layout.scrollX.value,
                    // 滚动y
                    [`${prefixCls}-scroll-y`]: layout.scrollY.value,
                    // 没有 固定列的时使用
                    [`${prefixCls}-nofixed-row-hover`]:
                        !store.states.isFixedColumns.value,
                    // 是否有表格数据
                    [`${prefixCls}-nofixed-row-transition`]:
                        (store.states.data.value || []).length !== 0 &&
                        (store.states.data.value || []).length < 100,
                    // 是否在表尾显示合计行
                    ['has-footer']: props.showSummary,
                    // 是否为斑马纹 table
                    [`${prefixCls}-stripe`]: props.stripe,
                },
            ];
        });

        // 是否有数据
        const isData = computed(() => {
            return (store.states.data.value || []).length === 0;
        });

        // onMounted
        onMounted(() => {
            // 更新列
            store.updateColumns();

            // 表格宽度
            const el: HTMLElement = table.vnode.el as HTMLElement;
            // 表格头部
            const header: HTMLElement = table.refs.header;

            // 设置宽度
            tableWidth.value = el.offsetWidth;

            // 表格缩放
            resizeState.value = {
                width: tableWidth.value,
                height: el.offsetHeight,
                headerHeight:
                    props.showHeader && header ? header.offsetHeight : null,
            };

            // 初始化完成
            table.$ready = true;

            // 更新布局
            handleLayout();

            // 绑定事件
            handleBindEvents();
        });

        // provide
        provide('ivue-table', table);

        return {
            prefixCls,

            // data
            dragging,
            renderExpanded,
            resizeState,
            isGroup,

            // layout
            layout,
            // store
            store,

            // computed
            isData,
            wrapperClass,
            contentStyles,
            tableLayout,
            tableStyles,
            placeholderStyle,
            tableBodyStyle,
            scrollbarWrapperStyle,
            scrollbarContentStyle,

            // methods
            handleMouseLeave,
            handleMousewheel,
            handleDragVisible,
        };
    },
    components: {
        IvueColgroup,
        TableBody,
        IvueScrollbar,
        TableHeader,
    },
});
</script>
