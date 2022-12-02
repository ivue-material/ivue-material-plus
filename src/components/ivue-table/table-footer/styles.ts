import { inject } from 'vue';

import type { TableFooter } from './types';

import {
  ensurePosition,
  getFixedColumnOffset,
  getFixedColumnsClass,
} from '../utils';

// ts
import type { TableColumnCtx } from '../table-column/defaults';
import {  TableContextKey } from '../table/defaults';

const prefixCls = 'ivue-table';

function useStyle(props: TableFooter) {
  const table = inject(TableContextKey);

  const store = table.store;

  // 列数据
  const columns = store.states.columns;

  // class
  const getCellClass = (columns: TableColumnCtx[], cellIndex: number) => {
    const column = columns[cellIndex];

    const classes = [
      'ivue-table-cell',
      column.id,
      // 对齐方式
      column.align,
      // 当前列标题的自定义类名
      column.labelClassName,
      // 固定列样式
      ...getFixedColumnsClass(prefixCls, cellIndex, column.fixed, props.store),
    ];

    // className
    if (column.className) {
      classes.push(column.className);
    }

    // 没有子项
    if (!column.children) {
      classes.push('is-leaf');
    }

    return classes;
  };

  // styles
  const getCellStyle = (column: TableColumnCtx, cellIndex: number) => {
    const fixedStyle = getFixedColumnOffset(
      cellIndex,
      column.fixed,
      props.store
    );


    ensurePosition(fixedStyle, 'left');
    ensurePosition(fixedStyle, 'right');

    return fixedStyle;
  };

  return {
    columns,
    getCellClass,
    getCellStyle
  };
}

export default useStyle;
