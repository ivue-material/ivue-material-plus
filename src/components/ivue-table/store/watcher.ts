import { ref, getCurrentInstance, unref } from 'vue';
import { hasOwn } from '@vue/shared';

// 展开行
import useExpand from './expand';
// 嵌套数据
import useTree from './tree';
// 当前数据
import useCurrent from './current';

import {
  getKeysMap,
  getRowIdentity,
  toggleRowStatus,
  orderBy
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

// 排序数据
const sortData = (data, states) => {
  // 排序列
  const sortingColumn = states.sortingColumn;

  // 没有排序
  if (!sortingColumn || typeof sortingColumn.sortable === 'string') {
    return data;
  }

  // 对数据进行排序
  return orderBy(
    data,
    // 排序的key 对应列内容的字段名
    states.sortProp,
    // 数据在排序时所使用排序策略的轮转顺序
    states.sortOrder,
    // 自定义排序方法
    sortingColumn.sortMethod,
    // 指定数据按照哪个属性进行排序
    sortingColumn.sortBy
  );
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

  // 保存数据更新前选中的值
  const reserveSelection = ref(false);

  // 排序的key 对应列内容的字段名
  const sortProp = ref(null);

  // 需要排序的列
  const sortingColumn = ref(null);

  // 排序
  const sortOrder = ref(null);

  // 过滤的数据
  const filteredData = ref(null);

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
    vm.emit('on-select-all', selection.value);
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

  // 更新 DOM 更新列数据
  const scheduleLayout = (needUpdateColumns?: boolean, immediate = false) => {
    // 更新列数据 未扁平化列数据 | 扁平化后的列数据 | 是否有固定列
    if (needUpdateColumns) {
      updateColumns();
    }

    // 立即执行更新布局
    if (immediate) {
      vm.state.updateLayout();
    }
    // 延迟50毫秒更新布局
    else {
      vm.state.debouncedUpdateLayout();
    }
  };

  // 选择多选
  const isSelected = (row) => {
    return selection.value.includes(row);
  };

  // 多选选择的行
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

  // 清除多选选择行
  const clearSelection = () => {

    isAllSelected.value = false;

    const oldSelection = selection.value;

    // 有选择行
    if (oldSelection.length) {
      selection.value = [];

      vm.emit('on-selection-change', []);
    }
  };

  // 清洁选择
  const cleanRedundantSelection = () => {

    // 需要删除的数据
    let deleted;

    // 有rowKey
    if (rowKey.value) {
      deleted = [];

      // 行数据的Key
      const selectedMap = getKeysMap(selection.value, rowKey.value);

      // 获取列数据 {index, row}
      const dataMap = getKeysMap(data.value, rowKey.value);

      for (const key in selectedMap) {
        // 是否存在数据
        if (hasOwn(selectedMap, key) && !dataMap[key]) {

          // 获取需要删除的数据(当前数据列表中不存在的数据)
          deleted.push(selectedMap[key].row);
        }
      }
    }
    // 没有设置rowKey
    else {
      // 获取需要删除的数据(当前数据列表中不存在的数据)
      deleted = selection.value.filter((item) => !data.value.includes(item));
    }

    // 有需要删除的数组
    if (deleted.length) {

      // 过滤数据获取最新的选择数据
      const newSelection = selection.value.filter(
        (item) => !deleted.includes(item)
      );

      selection.value = newSelection;

      // 选择的数据
      vm.emit('on-selection-change', newSelection);
    }
  };

  // 根据 filters 与 sort 去过滤 data
  const handleExecQueryData = (filter = true) => {
    filteredData.value = unref(_data);

    // 过滤数据
    if (filter) {
      handleFilter();
    }

    // 排序数据
    handleSortData();
  };

  // 排序数据
  const handleSortData = () => {
    data.value = sortData(filteredData.value, {
      // 需要排序的列
      sortingColumn: sortingColumn.value,
      // 排序的key 对应列内容的字段名
      sortProp: sortProp.value,
      // 排序顺序
      sortOrder: sortOrder.value,
    });
  };

  // 过滤数据
  const handleFilter = () => {
    const sourceData = unref(_data);

    // Object.keys(filters.value).forEach((columnId) => {
    //   const values = filters.value[columnId];
    //   if (!values || values.length === 0) return;
    //   const column = getColumnById(
    //     {
    //       columns: columns.value,
    //     },
    //     columnId
    //   );
    //   if (column && column.filterMethod) {
    //     sourceData = sourceData.filter((row) => {
    //       return values.some((value) =>
    //         column.filterMethod.call(null, value, row, column)
    //       );
    //     });
    //   }
    // });

    filteredData.value = sourceData;
  };

  // 更新排序属性
  const updateSort = (column, prop, order) => {

    // 重置排序排序顺序
    if (sortingColumn.value && sortingColumn.value !== column) {
      sortingColumn.value.order = null;
    }

    // 重新设置排序顺序
    sortingColumn.value = column;

    // 排序的key 对应列内容的字段名
    sortProp.value = prop;

    // 排序方向
    sortOrder.value = order;
  };

  // 检查 rowKey 是否存在
  const assertRowKey = () => {
    if (!rowKey.value) {
      throw new Error('prop row-key is required');
    }
  };

  // 更新过滤的数据
  const updateFilters = (columns, values) => {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }


    const obj: any = {
      value: {}
    };

    // 获取列表数据
    columns.forEach((item) => {
      obj.value[`${item.id}`] = values;


      obj[item.columnKey || item.id] = values;
    });


    return obj;
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
    cleanRedundantSelection,
    handleExecQueryData,
    updateSort,
    assertRowKey,
    updateFilters,
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
      sortProp,
      sortingColumn,
      sortOrder,
      ...expandStates,
      ...treeStates,
      ...currentData
    }
  };
}

export default useWatcher;
