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
  toggleRowStatus
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

  // 仅对 type=selection 的列有效，
  // 类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
  const selectable: Ref<(row: T, index: number) => boolean> = ref(null);

  // 仅对  type=selection 的列有效 需指定 row-key 来让这个功能生效。
  const reserveSelection = ref(false);

  // methods

  // 用于多选表格，切换全选和全不选
  const _toggleAllSelection = () => {
    // 当只选择了一些行（但不是全部）时，选择或取消选择所有行
    // 取决于 selectOnIndeterminate 的值

    // 是否选择所有行
    const value = selectOnIndeterminate.value
      ? !isAllSelected.value
      : !(isAllSelected.value || selection.value.length);

    // 是否选择所有行
    isAllSelected.value = value;


    let selectionChanged = false;
    let childrenCount = 0;

    // 行数据的 Key
    const rowKey = vm?.store?.states?.rowKey.value;

    // 遍历数据
    data.value.forEach((row, index) => {

      // 行下标
      const rowIndex = index + childrenCount;

      // 这一行的 CheckBox 是否可以勾选
      if (selectable.value) {
        // 勾选
        if (
          selectable.value.call(null, row, rowIndex) &&
          toggleRowStatus(selection.value, row, value)
        ) {
          selectionChanged = true;
        }
      }
      // 修改当前行的状态
      else {
        if (toggleRowStatus(selection.value, row, value)) {
          selectionChanged = true;
        }
      }

      // 通过rowKey获取所有子节点的个数
      childrenCount += getChildrenCount(getRowIdentity(row, rowKey));
    });

    // 勾选了
    if (selectionChanged) {
      vm.emit('on-selection-change', selection.value || []);
    }

    // 选择全部
    vm.emit('select-all', selection.value);
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

  // 选择多选
  const isSelected = (row) => {
    return selection.value.includes(row);
  };

  // 当前选择的选项
  const toggleRowSelection = (
    row: T,
    selected = undefined,
    emitChange = true
  ) => {
    const changed = toggleRowStatus(selection.value, row, selected);

    if (changed) {
      // 通过api调用时触发
      if (emitChange) {
        vm.emit('on-select', selection.value || [], row);
      }

      vm.emit('on-selection-change', selection.value || []);
    }
  };

  // 更新是否选择全部行
  const updateAllSelected = () => {
    // 没有数据
    if (data.value?.length === 0) {
      isAllSelected.value = false;

      return;
    }

    let selectedMap;

    // 行数据的Key
    if (rowKey.value) {
      selectedMap = getKeysMap(selection.value, rowKey.value);
    }

    // 是否选择了
    const isSelected = (row) => {
      // 有行数据的Key
      if (selectedMap) {
        return !!selectedMap[getRowIdentity(row, rowKey.value)];
      }
      // 没有key
      else {
        return selection.value.includes(row);
      }
    };

    let _isAllSelected = true;
    let selectedCount = 0;
    let childrenCount = 0;

    for (let i = 0, j = (data.value || []).length; i < j; i++) {
      // 行数据的Key
      const keyProp = vm?.store?.states?.rowKey.value;

      // 行index
      const rowIndex = i + childrenCount;
      // 当前数据
      const item = data.value[i];

      // 是否有可选行
      const isRowSelectable =
        selectable.value && selectable.value.call(null, item, rowIndex);

      // 当前行没有选中
      if (!isSelected(item)) {
        if (!selectable.value || isRowSelectable) {
          _isAllSelected = false;

          break;
        }
      }
      // 选中了
      else {
        selectedCount++;
      }

      // 子节点数量
      childrenCount += getChildrenCount(getRowIdentity(item, keyProp));
    }

    // 不是全选
    if (selectedCount === 0) {
      _isAllSelected = false;
    }

    // 设置全选状态
    isAllSelected.value = _isAllSelected;
  };

  // 通过rowKey获取所有子节点的个数
  const getChildrenCount = (rowKey: string) => {
    if (!vm || !vm.store) {
      return 0;
    }

    // 树形
    const { treeData } = vm.store.states;

    // 子节点数量
    let count = 0;

    // 有子节点
    const children = treeData.value[rowKey]?.children;

    // 有子节点
    if (children) {
      count += children.length;

      children.forEach((childKey) => {
        count += getChildrenCount(childKey);
      });
    }

    return count;
  };

  // 清除选择行
  const clearSelection = () => {

    isAllSelected.value = false;

    const oldSelection = selection.value;

    // 有选择行
    if (oldSelection.length) {
      selection.value = [];

      vm.emit('on-selection-change', []);
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
    isSelected,
    toggleRowSelection,
    updateAllSelected,
    clearSelection,
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
      isAllSelected,
      selectable,
      reserveSelection,
      selection,
      ...expandStates,
      ...treeStates,
      ...currentData
    }
  };
}

export default useWatcher;
