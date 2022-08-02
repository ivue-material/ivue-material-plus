
import { inject } from 'vue';


// ts
import type { TableBodyProps } from './defaults';
import type { TableColumnCtx } from '../table-column/defaults';
import { getFixedColumnsClass, getFixedColumnOffset, ensurePosition } from '../utils';

const prefixCls = 'ivue-table';

function useStyles<T>(props: Partial<TableBodyProps<T>>) {

  // inject
  const IvueTable: any = inject(prefixCls);

  // 行样式
  const getRowStyle = (row: T, rowIndex: number) => {
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
  const getRowClass = (row: T, rowIndex: number) => {
    const classes = [
      `${prefixCls}-row`,
      {
        // 斑马纹
        [`${prefixCls}-row--stripe`]: props.stripe && (rowIndex % 2 === 1),
        // 高亮当前行
        ['highlight-current-row']: IvueTable?.props.highlightCurrentRow && (row === props.store.states.currentRow.value)
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
    row: T,
    column: TableColumnCtx<T>,
    rowIndex: number,
    columnIndex: number
  ) => {
    // 单元格可横跨的列数
    const rowspan = 1;
    // 单元格可横跨的列数
    const colspan = 1;

    return { rowspan, colspan };
  };


  // 单元格样式
  const getCellClass = (
    rowIndex: number,
    columnIndex: number,
    row: T,
    column: TableColumnCtx<T>
  ) => {
    const fixedClasses = column.isSubColumn
      ? []
      : getFixedColumnsClass(prefixCls, columnIndex, props?.fixed, props.store);


    const classes = [column.id, column.align, column.className, 'ivue-table-cell', ...fixedClasses];

    return classes.filter((className) => Boolean(className)).join(' ');
  };

  // 单元格样式
  const getCellStyle = (
    rowIndex: number,
    columnIndex: number,
    row: T,
    column: TableColumnCtx<T>
  ) => {

    // fixedStyle
    const fixedStyle = column.isSubColumn
      ? null
      : getFixedColumnOffset(columnIndex, props?.fixed, props.store);

    // 左边
    ensurePosition(fixedStyle, 'left');
    // 右边
    ensurePosition(fixedStyle, 'right');

    return Object.assign({}, fixedStyle);
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
