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
  orderBy,
  getColumnById,
  getColumnByKey,
} from '../utils';

// ts
import type { Ref } from 'vue';
import type { TableColumnCtx } from '../table-column/defaults';
import type { Table } from '../table/defaults';
import type { StoreFilter } from './index';
import type { SortOrder } from '../table-header/types/index';

// 扁平化数组
const flattenColumns = (columns: TableColumnCtx[]) => {
  const result = [];

  columns.forEach((column: TableColumnCtx) => {
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

function useWatcher() {
  // vm
  const vm = getCurrentInstance() as Table;

  // data

  // 显示的数据
  const data = ref<TableColumnCtx[]>([]);
  const _data = ref<TableColumnCtx[]>([]);
  // 行数据的 Key
  const rowKey = ref<string | null>(null);
  // 选择或取消选择所有行的值
  const selectOnIndeterminate = ref<boolean>(false);
  // 选择全部
  const isAllSelected = ref<boolean>(false);
  // 选择列表
  const selection = ref<TableColumnCtx[]>([]);
  // 是否有固定列
  const isFixedColumns = ref<boolean>(false);
  // hover行
  const hoverRow = ref<TableColumnCtx>(null);
  // 列数据
  const originColumns = ref<TableColumnCtx[]>([]);
  // 列
  const columns = ref<TableColumnCtx[]>([]);
  // 备份列
  const _columns = ref<TableColumnCtx[]>([]);
  // 固定列
  const fixedColumns = ref<TableColumnCtx[]>([]);
  // 右边固定列
  const rightFixedColumns = ref<TableColumnCtx[]>([]);

  // 固定列长度
  const leafColumnsLength = ref<number>(0);
  // 固定列长度
  const fixedLeafColumnsLength = ref<number>(0);
  // 右边固定列长度
  const rightFixedLeafColumnsLength = ref<number>(0);

  // 仅对 type=selection 的列有效，
  // 类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
  const selectable: Ref<(row: TableColumnCtx, index: number) => boolean> | any =
    ref(null);

  // 保存数据更新前选中的值
  const reserveSelection = ref<boolean>(false);

  // 排序的key 对应列内容的字段名
  const sortProp = ref<string | null>(null);

  // 需要排序的列
  const sortingColumn = ref<TableColumnCtx | null>(null);

  // 排序
  const sortOrder = ref<SortOrder>(null);

  // 过滤的数据
  const filteredData = ref<any[]>([]);

  // 选择过滤的列
  // 例子
  // 列id: [
  //   选择过滤的数据
  // ]
  const filters: Ref<StoreFilter> = ref({});

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
  const {
    toggleRowExpansion,
    updateExpandRows,
    setExpandRowKeys,
    isRowExpanded,
    states: expandStates,
  } = useExpand({
    data,
    rowKey,
  });

  // 嵌套数据
  const {
    loadOrToggle,
    updateTreeData,
    updateTreeExpandKeys,
    toggleTreeExpansion,
    states: treeStates,
  }: any = useTree({
    data,
    rowKey,
  });

  // 检查 rowKey 是否存在
  const isRowKey = () => {
    if (!rowKey.value) {
      throw new Error('[Ivue Table] prop row-key is required');
    }
  };

  // 更新多选框key
  const updateSelectionByRowKey = () => {
    // 获取多选框标志
    const selectedMap = getKeysMap(selection.value, rowKey.value);

    data.value.forEach((row) => {
      // 获取rowKey对应的数据
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
    fixedColumns.value =
      _columns.value.filter(
        (column) => column.fixed === true || column.fixed === 'left'
      ) || [];

    // 右边固定列
    rightFixedColumns.value = _columns.value.filter(
      (column) => column.fixed === 'right'
    );

    // 未扁平化列数据
    originColumns.value = [];
    originColumns.value = originColumns.value
      .concat(fixedColumns.value)
      .concat(notFixedColumns)
      .concat(rightFixedColumns.value);

    // 扁平化不是固定列
    const leafColumns = flattenColumns(notFixedColumns);
    // 扁平化固定列
    const fixedLeafColumns: any[] = flattenColumns(fixedColumns.value);
    // 扁平化右边固定列
    const rightFixedLeafColumns = flattenColumns(rightFixedColumns.value);

    leafColumnsLength.value = leafColumns.length;
    fixedLeafColumnsLength.value = fixedLeafColumns.length;
    rightFixedLeafColumnsLength.value = rightFixedLeafColumns.length;

    // 扁平化后的列数据
    columns.value = [];
    columns.value = columns.value
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
    setCurrentRowKey,
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
  const isSelected = (row: TableColumnCtx) => {
    return selection.value.includes(row);
  };

  // 多选返回当前选中的行
  const getSelectionRows = () => {
    return (selection.value || []).slice();
  };

  // 多选选择的行
  const toggleRowSelection = (
    row: any,
    selected: any = undefined,
    emitChange = true
  ) => {
    const changed = toggleRowStatus(selection.value, row, selected);

    if (changed) {
      const newSelection = (selection.value || []).slice();

      // 通过api调用时触发
      if (emitChange) {
        vm.emit('on-select', newSelection, row);
      }

      vm.emit('on-selection-change', newSelection);
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
    // 过滤数据
    if (filter) {
      initFilterData();
    }

    // 排序数据
    initSortData();
  };

  // 排序数据
  const initSortData = () => {
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
  const initFilterData = () => {
    let sourceData = unref(_data);

    // 循环列
    Object.keys(filters.value).forEach((columnId) => {
      // 列的值->选择过滤的数据
      const values = filters.value[columnId];

      // 没有选择数据
      if (!values || values.length === 0) {
        return;
      }

      // 根据当前选择需要筛选的列id -> 获取表格中的当前选择列数据
      const column = getColumnById(
        {
          columns: columns.value,
        },
        columnId
      );

      // 是否有自定义过滤方法
      if (column && column.filterMethod) {
        sourceData = sourceData.filter((row) => {
          return values.some((value) =>
            column.filterMethod.call(null, value, row, column)
          );
        });
      }
    });

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
      throw new Error('[Ivue Table] prop row-key is required');
    }
  };

  // 更新过滤的数据
  const updateFilters = (columns, values) => {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }

    const obj: any = {};

    // 获取列表数据
    columns.forEach((item) => {
      filters.value[`${item.id}`] = values;

      obj[item.columnKey || item.id] = values;
    });

    return obj;
  };

  // 用于清空排序条件，数据会恢复成未排序的状态
  const clearSort = () => {
    // 没有排序
    if (!sortingColumn.value) {
      return;
    }

    // 更新排序属性
    updateSort(null, null, null);

    vm.store.commit('changeSortCondition', {
      silent: true,
    });
  };

  // 传入由columnKey 组成的数组以清除指定列的过滤条件
  //  如果没有参数，清除所有过滤器
  const clearFilter = (columnKeys) => {
    const { tableHeaderContent } = vm.refs;

    // 没有头部
    if (!tableHeaderContent) {
      return;
    }

    // 当前有哪些过滤列表
    const panels = Object.assign({}, tableHeaderContent.filterPanels);

    const keys = Object.keys(panels);

    // 没有过滤列表
    if (!keys.length) {
      return;
    }

    // 清除指定列的过滤条件
    if (typeof columnKeys === 'string') {
      columnKeys = [columnKeys];
    }

    // 有过滤条件
    if (Array.isArray(columnKeys)) {
      const _columns = columnKeys.map((key) =>
        getColumnByKey(
          {
            columns: columns.value,
          },
          key
        )
      );

      // 清空过滤的值
      keys.forEach((key) => {
        const column = _columns.find((col) => col.id === key);

        // 清空过滤的值
        if (column) {
          column.filteredValue = [];
        }
      });

      // 发送事件 过滤改变
      vm.store.commit('filterChange', {
        column: _columns,
        values: [],
        silent: true,
        multi: true,
      });
    }
    // 没有过滤条件清空全部过滤列表
    else {
      // 清空全部过滤列表
      keys.forEach((key) => {
        const column = columns.value.find((col) => col.id === key);
        if (column) {
          column.filteredValue = [];
        }
      });

      filters.value = {};

      // 发送事件 过滤改变
      vm.store.commit('filterChange', {
        column: {},
        values: [],
        silent: true,
      });
    }
  };

  // 展开行与 TreeTable 都要使用
  const toggleRowExpansionAdapter = (
    row: TableColumnCtx,
    expanded: boolean
  ) => {
    // 是否是展开列
    const hasExpandColumn = columns.value.some(({ type }) => type === 'expand');

    // 展开列
    if (hasExpandColumn) {
      toggleRowExpansion(row, expanded);
    }
    // 切换树节点展开
    else {
      toggleTreeExpansion(row, expanded);
    }
  };

  // 适配层，expand-row-keys 在 Expand 与 TreeTable 中都有使用
  const setExpandRowKeysAdapter = (val: string[]) => {
    // 这里会触发额外的计算，但为了兼容性，暂时这么做
    setExpandRowKeys(val);
    // 更新树节点展开
    updateTreeExpandKeys(val);
  };

  return {
    _toggleAllSelection,
    toggleAllSelection: () => {},
    isRowKey,
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
    clearSort,
    clearFilter,
    getSelectionRows,
    toggleRowExpansion,
    toggleRowExpansionAdapter,
    updateExpandRows,
    setExpandRowKeysAdapter,
    setCurrentRowKey,
    isRowExpanded,
    updateTreeData,
    loadOrToggle,
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
      ...currentData,
    },
  };
}

export default useWatcher;
