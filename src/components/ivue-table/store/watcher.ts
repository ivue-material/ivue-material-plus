import { ref, getCurrentInstance } from 'vue';

// 展开行
import useExpand from './expand';
// 嵌套数据
import useTree from './tree';
// 当前数据
import useCurrent from './current';

import {
  getKeysMap,
  getRowIdentity,
} from '../utils';

// ts
import type { Ref } from 'vue';
import type { TableColumnCtx } from '../table-column/defaults';
import type { Table, } from '../table/defaults';


// 扁平化数组
const flattenColumns = (columns) => {
  const result = [];

  columns.forEach((column) => {
    // 有子项
    if (column.children) {
      // eslint-disable-next-line prefer-spread
      result.push.apply(result, flattenColumns(column.children));
    }
    // 没有子项
    else {
      result.push(column);
    }
  });

  return result;
};

function useWatcher<T>() {
  // vm
  const vm = getCurrentInstance() as Table<T>;

  // data

  // 显示的数据
  const data: Ref<T[]> = ref([]);
  const _data: Ref<T[]> = ref([]);
  // 行数据的 Key
  const rowKey: Ref<string> = ref(null);
  // 选择或取消选择所有行的值
  const selectOnIndeterminate = ref(false);
  // 选择全部
  const isAllSelected = ref(false);
  // 选择列表
  const selection = ref([]);
  // 是否有固定列
  const isFixedColumns = ref(false);
  // hover行
  const hoverRow = ref(null);
  // 列数据
  const originColumns: Ref<TableColumnCtx<T>[]> = ref([]);
  // 列
  const columns: Ref<TableColumnCtx<T>[]> = ref([]);
  // 备份列
  const _columns: Ref<TableColumnCtx<T>[]> = ref([]);
  // 固定列
  const fixedColumns: Ref<TableColumnCtx<T>[]> = ref([]);
  // 右边固定列
  const rightFixedColumns: Ref<TableColumnCtx<T>[]> = ref([]);

  // 固定列长度
  const leafColumnsLength = ref(0);
  // 固定列长度
  const fixedLeafColumnsLength = ref(0);
  // 右边固定列长度
  const rightFixedLeafColumnsLength = ref(0);

  // methods

  // 用于多选表格，切换全选和全不选
  const _toggleAllSelection = () => {
  };

  // 展开行数据
  const { states: expandStates } = useExpand({
    data,
    rowKey,
  });

  // 嵌套数据
  const { loadOrToggle, states: treeStates, } = useTree({
    data,
    rowKey,
  });


  // 检查 rowKey 是否存在
  const isRowKey = () => {
    if (!rowKey.value) throw new Error('[ElTable] prop row-key is required');
  };

  // 更新多选框key
  const updateSelectionByRowKey = () => {
    // 获取多选框标志
    const selectedMap = getKeysMap(selection.value, rowKey.value);

    data.value.forEach((row) => {
      const rowId = getRowIdentity(row, rowKey.value);

      const rowInfo = selectedMap[rowId];

      if (rowInfo) {
        selection.value[rowInfo.index] = row;
      }
    });
  };

  // 更新列数据
  const updateColumns = () => {
    // 不是固定列
    const notFixedColumns = _columns.value.filter((column) => !column.fixed);

    // 固定列
    fixedColumns.value = _columns.value.filter(
      (column) => column.fixed === true || column.fixed === 'left'
    );

    // 右边固定列
    rightFixedColumns.value = _columns.value.filter(
      (column) => column.fixed === 'right'
    );

    // 未扁平化列数据
    originColumns.value = []
      .concat(fixedColumns.value)
      .concat(notFixedColumns)
      .concat(rightFixedColumns.value);

    // 扁平化不是固定列
    const leafColumns = flattenColumns(notFixedColumns);
    // 扁平化固定列
    const fixedLeafColumns = flattenColumns(fixedColumns.value);
    // 扁平化右边固定列
    const rightFixedLeafColumns = flattenColumns(rightFixedColumns.value);

    leafColumnsLength.value = leafColumns.length;
    fixedLeafColumnsLength.value = fixedLeafColumns.length;
    rightFixedLeafColumnsLength.value = rightFixedLeafColumns.length;

    // 扁平化后的列数据
    columns.value = []
      .concat(fixedLeafColumns)
      .concat(leafColumns)
      .concat(rightFixedLeafColumns);

    // 是否有固定列
    isFixedColumns.value =
      fixedColumns.value.length > 0 || rightFixedColumns.value.length > 0;
  };

  // 更新当前数据
  const {
    updateCurrentRowData,
    updateCurrentRow,
    states: currentData,
  } = useCurrent({
    data,
    rowKey,
  });

  // 更新 DOM
  const scheduleLayout = (needUpdateColumns?: boolean, immediate = false) => {
    // 更新行
    if (needUpdateColumns) {
      updateColumns();
    }

    // 立即执行
    if (immediate) {
      vm.state.handleLayout();
    } else {
      vm.state.debouncedUpdateLayout();
    }
  };

  return {
    _toggleAllSelection,
    toggleAllSelection: null,
    isRowKey,
    loadOrToggle,
    updateSelectionByRowKey,
    updateColumns,
    scheduleLayout,
    updateCurrentRowData,
    updateCurrentRow,
    // 状态
    states: {
      data,
      _data,
      rowKey,
      selectOnIndeterminate,
      isFixedColumns,
      hoverRow,
      columns,
      _columns,
      originColumns,
      rightFixedLeafColumnsLength,
      fixedLeafColumnsLength,
      fixedColumns,
      rightFixedColumns,
      ...expandStates,
      ...treeStates,
      ...currentData
    }
  };
}

export default useWatcher;
