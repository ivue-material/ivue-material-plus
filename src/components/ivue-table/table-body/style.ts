
import { inject } from 'vue';


// ts
import type { TableBodyProps } from './defaults';
import type { TableColumnCtx } from '../table-column/defaults';

function useStyles<T>(props: Partial<TableBodyProps<T>>) {

  // inject
  const IvueTable: any = inject('ivue-table');



  // 行样式
  const getRowClass = (row: T, rowIndex: number) => {
    const classes = [
      'ivue-table-row'
    ];



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
    const classes = [column.id, column.align, column.className, 'ivue-table-cell'];

    return classes.filter((className) => Boolean(className)).join(' ');
  };


  return {
    getRowClass,
    getTableSpan,
    getCellClass
  };
}

export default useStyles;
