import { ref } from 'vue';

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

    // 未扁平化列数据
    originColumns.value = []
      // .concat(fixedColumns.value)
      .concat(notFixedColumns);
    // .concat(rightFixedColumns.value)


    // 扁平化不是固定列
    const _flattenColumns = flattenColumns(notFixedColumns);

    // 扁平化后的列数据
    columns.value = []
      // .concat(fixedLeafColumns)
      .concat(_flattenColumns);
    // .concat(rightFixedLeafColumns);
  };

  // 更新当前数据
  const {
    updateCurrentRowData,
  } = useCurrent({
    data,
    rowKey,
  });

  return {
    _toggleAllSelection,
    toggleAllSelection: null,
    isRowKey,
    loadOrToggle,
    updateSelectionByRowKey,
    updateColumns,
    updateCurrentRowData,
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
      ...expandStates,
      ...treeStates
    }
  };
}

export default useWatcher;
