import { inject } from 'vue';

import { getFixedColumnsClass, getFixedColumnOffset, ensurePosition } from '../utils';

// ts
import type { TableHeaderProps } from './types';
import type { TableColumnCtx } from '../table-column/defaults';
import { TableContextKey } from '../table/defaults';

const prefixCls = 'ivue-table';

function useStyle(props: TableHeaderProps) {
  // inject
  const IvueTable = inject(TableContextKey);

  // 头部行样式
  const getHeaderCellStyle = (
    rowIndex: number,
    columnIndex: number,
    row: TableColumnCtx[],
    column: TableColumnCtx
  ) => {
    let headerCellStyles = IvueTable?.props.headerCellStyle ?? {};

    if (typeof headerCellStyles === 'function') {
      headerCellStyles = headerCellStyles.call(null, {
        rowIndex,
        columnIndex,
        row,
        column,
      });
    }

    // fixedStyle
    const fixedStyle = column.isSubColumn
      ? null
      : getFixedColumnOffset(
        columnIndex,
        column.fixed,
        props.store,
        row
      );

    // 左边
    ensurePosition(fixedStyle, 'left');
    // 右边
    ensurePosition(fixedStyle, 'right');

    return Object.assign({}, headerCellStyles, fixedStyle);
  };

  // 头部行样式
  const getHeaderCellClass = (
    rowIndex: number,
    columnIndex: number,
    row: TableColumnCtx[],
    column: TableColumnCtx
  ) => {
    // 固定列样式
    const fixedClasses = column.isSubColumn
      ? []
      : getFixedColumnsClass(
        prefixCls,
        columnIndex,
        column.fixed,
        props.store,
        row
      );

    // class
    const classes = [
      column.id,
      column.order,
      column.headerAlign,
      column.className,
      column.labelClassName,
      ...fixedClasses,
    ];

    // 没有子项
    if (!column.children) {
      classes.push('is-leaf');
    }

    // 排序
    if (column.sortable) {
      classes.push('is-sortable');
    }

    // 过滤
    if (column.filterable) {
      classes.push('is-filterable');
    }

    // 表头单元格的 className 的回调方法，
    // 也可以使用字符串为所有表头单元格设置一个固定的 className
    const headerCellClassName = IvueTable?.props.headerCellClassName;

    // 字符串
    if (typeof headerCellClassName === 'string') {
      classes.push(headerCellClassName);
    }
    // 方法
    else if (typeof headerCellClassName === 'function') {
      classes.push(
        headerCellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column,
        })
      );
    }

    // cell
    classes.push(`${prefixCls}-cell`);

    // 过滤
    return classes.filter((className) => Boolean(className)).join(' ');
  };

  // 表头行的 style 的回调方法
  const getHeaderRowStyle = (rowIndex: number) => {
    const headerRowStyle = IvueTable.props.headerRowStyle;

    // 方法
    if (typeof headerRowStyle === 'function') {
      return headerRowStyle.call(null, { rowIndex });
    }

    return headerRowStyle;
  };

  // 表头行的 className 的回调方法
  const getHeaderRowClass = (rowIndex: number): string => {
    const classes: string[] = [];

    const headerRowClassName = IvueTable.props.headerRowClassName;

    // 字符串
    if (typeof headerRowClassName === 'string') {
      classes.push(headerRowClassName);
    }
    // 方法
    else if (typeof headerRowClassName === 'function') {
      classes.push(headerRowClassName.call(null, { rowIndex }));
    }

    return classes.join(' ');
  };

  return {
    getHeaderCellClass,
    getHeaderCellStyle,
    getHeaderRowStyle,
    getHeaderRowClass
  };
}

export default useStyle;
