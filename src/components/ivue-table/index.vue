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
            <div ref="bodyWrapper"></div>
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
    reactive,
    provide,
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

// ts
import type { Table } from './table/defaults';
import defaultProps from './table/defaults';

const prefixCls = 'ivue-table';

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

        // provide
        provide(prefixCls, table);

        const store = createStore<Row>(table, props);

        table.store = store;

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
            tableLayout,
            dragging,
            contentStyles,
            tableStyles,
            handleMouseLeave,
            handleMousewheel,
            handleDragVisible,
        } = useStyle<Row>(props, layout, table);

        // data

        const data = reactive<{
            isGroup: boolean;
        }>({
            /**
             * 是否拥有多级表头
             *
             * @type {Boolean}
             */
            isGroup: false,
        });

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
                    [`${prefixCls}-group`]: data.isGroup,
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
                },
            ];
        });

        return {
            prefixCls,
            // data
            data,
            dragging,

            // layout
            layout,
            // store
            store,

            // computed
            wrapperClass,
            contentStyles,
            tableLayout,
            tableStyles,

            // methods
            handleMouseLeave,
            handleMousewheel,
            handleDragVisible,
        };
    },
    components: {
        IvueColgroup,
        TableHeader,
    },
});
</script>
