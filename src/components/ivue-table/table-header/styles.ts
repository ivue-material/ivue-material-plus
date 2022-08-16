import { inject } from 'vue';

import { getFixedColumnsClass, getFixedColumnOffset, ensurePosition } from '../utils';

// ts
import type { TableHeaderProps } from './index';
import type { TableColumnCtx } from '../table-column/defaults';

const prefixCls = 'ivue-table';

function useStyle<T>(props: TableHeaderProps<T>) {
  // inject
  const parent: any = inject('ivue-table');


  // 头部行样式
  const getHeaderCellStyle = (
    rowIndex: number,
    columnIndex: number,
    row: T,
    column: TableColumnCtx<T>
  ) => {

    // fixedStyle
    const fixedStyle = column.isSubColumn
      ? null
      : getFixedColumnOffset<T>(
        columnIndex,
        column.fixed,
        props.store,
        row as unknown as TableColumnCtx<T>[]
      );

    // 左边
    ensurePosition(fixedStyle, 'left');
    // 右边
    ensurePosition(fixedStyle, 'right');

    return Object.assign({}, fixedStyle);
  };

  // 头部行样式
  const getHeaderCellClass = (
    rowIndex: number,
    columnIndex: number,
    row: T,
    column: TableColumnCtx<T>
  ) => {

    // 固定列样式
    const fixedClasses = column.isSubColumn
      ? []
      : getFixedColumnsClass<T>(
        prefixCls,
        columnIndex,
        column.fixed,
        props.store,
        row as unknown as TableColumnCtx<T>[]
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

    // cell
    classes.push(`${prefixCls}-cell`);

    // 过滤
    return classes.filter((className) => Boolean(className)).join(' ');
  };


  return {
    getHeaderCellClass,
    getHeaderCellStyle,
  };
}

export default useStyle;
