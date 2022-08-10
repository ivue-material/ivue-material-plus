

import { computed, inject } from 'vue';

// ts
import type { TableHeaderProps } from './index';
import type { TableColumnCtx } from '../table-column/defaults';

// 获取所有列
const getAllColumns = <T>(
  columns: TableColumnCtx<T>[]
): TableColumnCtx<T>[] => {
  const result: TableColumnCtx<T>[] = [];

  columns.forEach((column) => {
    // 有子项
    if (column.children) {
      result.push(column);

      // eslint-disable-next-line prefer-spread
      result.push.apply(result, getAllColumns(column.children));
    }
    // 没有子项
    else {
      result.push(column);
    }
  });

  return result;
};

// 转换行
const convertToRows = <T>(
  originColumns: TableColumnCtx<T>[]
): TableColumnCtx<T>[] => {
  let maxLevel = 1;

  // 遍历
  const traverse = (column: TableColumnCtx<T>, parent: TableColumnCtx<T>) => {
    // 父
    if (parent) {
      column.level = parent.level + 1;

      if (maxLevel < column.level) {
        maxLevel = column.level;
      }
    }

    // 有子项
    if (column.children) {
      let colSpan = 0;

      column.children.forEach((subColumn) => {
        traverse(subColumn, column);

        // 单元格可横跨的列数
        colSpan += subColumn.colSpan;
      });

      // 单元格可横跨的列数
      column.colSpan = colSpan;
    }
    // 没有子项
    else {
      // 单元格可横跨的列数
      column.colSpan = 1;
    }
  };

  // 列数据
  originColumns.forEach((item) => {
    item.level = 1;

    traverse(item, undefined);
  });

  // 行数据
  const rows = [];

  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  // 获取所有列
  const allColumns: TableColumnCtx<T>[] = getAllColumns(originColumns);

  allColumns.forEach((item) => {
    // 没有子项
    if (!item.children) {
      // 单元格可横跨的行数
      item.rowSpan = maxLevel - item.level + 1;
    }
    // 有子项
    else {
      // 单元格可横跨的行数
      item.rowSpan = 1;
      // 设置是否是子项
      item.children.forEach((col) => (col.isSubColumn = true));
    }

    rows[item.level - 1].push(item);
  });

  return rows;
};


function useUtils<T>(props: TableHeaderProps<T>) {
  // inject
  const IvueTable: any = inject('ivue-table');

  // 获取当前列的行数
  const columnRows = computed(() => {
    return convertToRows(props.store.states.originColumns.value);
  });

  // 是否拥有多级表头
  const isGroup = computed(() => {
    const result = columnRows.value.length > 1;

    if (result && IvueTable) {
      IvueTable.state.isGroup.value = true;
    }

    return result;
  });


  return {
    isGroup,
    columnRows,
  };
}

export default useUtils;
