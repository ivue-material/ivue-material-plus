
import { inject } from 'vue';

import { getFixedColumnsClass, getFixedColumnOffset, ensurePosition } from '../utils';

// type
import type { TableBodyProps } from './defaults';
import type { TableColumnCtx } from '../table-column/defaults';
import { TableContextKey } from '../table/defaults';

const prefixCls = 'ivue-table';

function useStyles(props: Partial<TableBodyProps>) {

  // inject
  const IvueTable = inject(TableContextKey);

  // 行样式
  const getRowStyle = (row: TableColumnCtx, rowIndex: number) => {
    const rowStyle = IvueTable?.props.rowStyle;

    // function
    if (typeof rowStyle === 'function') {
      return rowStyle.call(null, {
        row,
        rowIndex,
      });
    }

    return rowStyle || null;
  };

  // 行样式
  const getRowClass = (row: TableColumnCtx, rowIndex: number) => {
    const classes = [
      `${prefixCls}-row`,
      {
        // 斑马纹
        [`${prefixCls}-row--stripe`]: props.stripe && (rowIndex % 2 === 1),
        // 高亮当前行
        ['highlight-current-row']: IvueTable?.props.highlightCurrentRow && (row === props.store?.states.currentRow.value)
      }
    ];

    // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
    const rowClassName = IvueTable?.props.rowClassName;

    // 字符串
    if (typeof rowClassName === 'string') {
      classes.push(rowClassName);
    }
    // function
    else if (typeof rowClassName === 'function') {
      classes.push(
        // 执行方法
        rowClassName.call(null, {
          row,
          rowIndex,
        })
      );
    }

    return classes;
  };

  // 获取单元格样式
  const getTableSpan = (
    row: TableColumnCtx,
    column: TableColumnCtx,
    rowIndex: number,
    columnIndex: number
  ) => {
    // 单元格可横跨的列数
    let rowspan = 1;
    // 单元格可横跨的列数
    let colspan = 1;

    const spanMethod = IvueTable?.props.spanMethod;

    // 合并行或列的计算方法
    if (typeof spanMethod === 'function') {
      const result = spanMethod({
        // 当前行
        row,
        // 当前列
        column,
        // 当前行号
        rowIndex,
        // 当前列号
        columnIndex,
      });

      // 数组
      if (Array.isArray(result)) {
        rowspan = result[0];
        colspan = result[1];
      }
      // 对象
      else if (typeof result === 'object') {
        rowspan = result.rowspan;
        colspan = result.colspan;
      }
    }

    return { rowspan, colspan };
  };


  // 单元格样式
  const getCellClass = (
    rowIndex: number,
    columnIndex: number,
    row: TableColumnCtx,
    column: TableColumnCtx
  ) => {
    // 是否是嵌套的子列
    const fixedClasses = column.isSubColumn
      ? []
      : getFixedColumnsClass(prefixCls, columnIndex, props?.fixed, props.store);


    // classes
    const classes = [column.id, column.align, column.className, ...fixedClasses];

    const cellClassName = IvueTable?.props.cellClassName;

    // 字符串
    if (typeof cellClassName === 'string') {
      classes.push(cellClassName);
    }
    // 方法
    else if (typeof cellClassName === 'function') {
      classes.push(
        cellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column,
        })
      );
    }

    classes.push('ivue-table-cell');

    return classes.filter((className) => Boolean(className)).join(' ');
  };

  // 单元格样式
  const getCellStyle = (
    rowIndex: number,
    columnIndex: number,
    row: TableColumnCtx,
    column: TableColumnCtx
  ) => {

    // 单元格的 style 的回调方法
    const cellStyle = IvueTable?.props.cellStyle;

    let cellStyles = cellStyle ?? {};

    // 方法
    if (typeof cellStyle === 'function') {
      cellStyles = cellStyle.call(null, {
        rowIndex,
        columnIndex,
        row,
        column,
      });
    }

    // 是否是嵌套的子列
    const fixedStyle = column.isSubColumn
      ? null
      : getFixedColumnOffset(columnIndex, props?.fixed, props.store);

    // 左边
    ensurePosition(fixedStyle, 'left');
    // 右边
    ensurePosition(fixedStyle, 'right');

    return Object.assign({}, cellStyles, fixedStyle);
  };


  return {
    getRowClass,
    getRowStyle,
    getTableSpan,
    getCellClass,
    getCellStyle,
  };
}

export default useStyles;
