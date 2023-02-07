<template>
  <div
    :class="wrapperClass"
    @mouseleave="handleMouseLeave()"
    ref="tableWrapper"
  >
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
            :tableLayout="tableLayout"
          ></ivue-colgroup>
          <!-- header -->
          <table-header
            :border="border"
            :defaultSort="defaultSort"
            :store="store"
            :tooltipStop="tooltipStop"
            @on-drag-visible="handleDragVisible"
            ref="tableHeaderContent"
          ></table-header>
        </table>
      </div>
      <!-- 内容 -->
      <div :class="`${prefixCls}-body-wrapper`" ref="bodyWrapper">
        <ivue-scrollbar
          :wrapperStyle="scrollbarWrapperStyle"
          :contentStyle="scrollbarContentStyle"
          :always="scrollbarAlways"
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

            <!-- auto 头部 -->
            <table-header
              :border="border"
              :defaultSort="defaultSort"
              :store="store"
              @on-drag-visible="handleDragVisible"
              v-if="showHeader && tableLayout === 'auto'"
            ></table-header>

            <!-- 内容 -->
            <table-body
              :store="store"
              :stripe="stripe"
              :rowClassName="rowClassName"
              :rowStyle="rowStyle"
              :tooltipTheme="tooltipTheme"
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
              <span :class="`${prefixCls}-placeholder--text`">{{
                placeholder
              }}</span>
            </slot>
          </div>
        </ivue-scrollbar>
      </div>
      <!-- 合计 -->
      <div
        v-if="showSummary"
        v-show="!isData"
        v-mousewheel="handleMousewheel"
        :class="`${prefixCls}-footer--wrapper`"
        ref="footer"
      >
        <table-footer
          :border="border"
          :defaultSort="defaultSort"
          :store="store"
          :style="tableStyles"
          :sum-text="sumText"
          :summary-method="summaryMethod"
        ></table-footer>
      </div>
    </div>
    <!-- 拖拽时的虚线 -->
    <div
      :class="`${prefixCls}-column-resize-proxy`"
      ref="draggingDotted"
      v-show="dragging"
    ></div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  provide,
  onMounted,
} from 'vue';
import { debounce } from 'lodash-unified';

// 表格改变
import TableLayout from './table-layout';
// Mousewheel
import { Mousewheel } from '../../utils/directives';

// store
import { createStore } from './store/helper';

// 表格style
import useStyle from './table/styles';
import useUtils from './table/utils';

// components
import IvueColgroup from './colgroup';
import TableHeader from './table-header';
import TableBody from './table-body';
import IvueScrollbar from '../ivue-scrollbar/index.vue';
import TableFooter from './table-footer';

// props
import defaultProps from './table/defaults';

// ts
import { Table, TableContextKey } from './table/defaults';
import type { TableColumnCtx } from './table-column/defaults';

const prefixCls = 'ivue-table';
let tableIdSeed = 1;

export default defineComponent({
  name: prefixCls,
  props: defaultProps,
  directives: {
    Mousewheel,
  },
  emits: [
    'on-cell-mouse-enter',
    'on-cell-mouse-leave',
    'on-selection-change',
    'on-select-all',
    'on-select',
    'on-current-change',
    'on-header-click',
    'on-sort-change',
    'on-filter-change',
    'on-header-dragend',
    'on-expand-change',
    'on-cell-click',
    'on-row-click',
  ],
  setup(props) {
    // vm
    const table = getCurrentInstance() as Table;

    // 设置id
    const tableId = `${prefixCls}-${tableIdSeed++}`;
    table.tableId = tableId;

    // store
    const store = createStore(table, props);
    table.store = store;

    // 表格布局
    const layout = new TableLayout({
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
      updateLayout,
      handleMouseLeave,
      handleMousewheel,
      handleDragVisible,
      handleBindEvents,
    } = useStyle(props, layout, store, table);

    // 去抖更新布局
    const debouncedUpdateLayout = debounce(updateLayout, 50);

    // 表格状态
    table.state = {
      resizeState,
      isGroup,
      updateLayout,
      debouncedUpdateLayout,
    };

    const {
      // 单选选择当前行
      setCurrentRow,
      // 返回当前选中的行
      getSelectionRows,
      // 多选选择的行
      toggleRowSelection,
      // 清除多选选择行
      clearSelection,
      // 用于清空排序条件，数据会恢复成未排序的状态
      clearSort,
      // 手动排序表格,参数 prop 属性指定排序列 order 指定排序顺序
      sort,
      // 传入由columnKey 组成的数组以清除指定列的过滤条件
      clearFilter,
      // 切换行展开
      toggleRowExpansion,
    } = useUtils(store);

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
          [`${prefixCls}-border`]: props.border || isGroup.value,
          // 是否拥有多级表头
          [`${prefixCls}-group`]: isGroup.value,
          // Table 的最大高度
          [`${prefixCls}-max-height`]: props.maxHeight,
          // 滚动x
          [`${prefixCls}-scroll-x`]: layout.scrollX.value,
          // 滚动y
          [`${prefixCls}-scroll-y`]: layout.scrollY.value,
          // 没有固定列的时使用
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
      // 设置整理后的列设置数据 未扁平化列数据 | 扁平化后的列数据 | 是否有固定列
      store.updateColumns();

      // 表格宽度
      const el: HTMLElement = table.vnode.el as HTMLElement;
      // 表格头部
      const header: HTMLElement = table.refs.header;

      // 设置宽度
      tableWidth.value = el.offsetWidth;

      // 初始化表格大小
      resizeState.value = {
        width: tableWidth.value,
        height: el.offsetHeight,
        headerHeight: props.showHeader && header ? header.offsetHeight : null,
      };

      // 初始化过滤的数据
      store.states.columns.value.forEach((column: TableColumnCtx) => {
        if (column.filteredValue && column.filteredValue.length) {
          table.store.commit('filterChange', {
            column,
            values: column.filteredValue,
            silent: true,
          });
        }
      });

      // 初始化完成
      table.$ready = true;

      // 更新布局
      updateLayout();

      // 绑定事件 滚动 | 列的宽度自撑开 | 表格大小改变
      handleBindEvents();
    });

    // provide
    provide(TableContextKey, table);

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
      setCurrentRow,
      toggleRowSelection,
      getSelectionRows,
      clearSelection,
      clearSort,
      sort,
      clearFilter,
      toggleRowExpansion,
    };
  },
  components: {
    IvueColgroup,
    TableBody,
    IvueScrollbar,
    TableHeader,
    TableFooter,
  },
});
</script>
