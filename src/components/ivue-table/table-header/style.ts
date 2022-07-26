import { inject } from 'vue';

// ts
import type { TableHeaderProps } from './index';
import type { TableColumnCtx } from '../table-column/defaults';

const prefixCls = 'ivue-table';

function useStyle<T>(props: TableHeaderProps<T>) {
  // inject
  const parent: any = inject('ivue-table');

  // 头部行样式
  const getHeaderCellClass = (
    rowIndex: number,
    columnIndex: number,
    row: T,
    column: TableColumnCtx<T>
  ) => {
    const classes = [
      column.id,
      column.order,
      column.headerAlign,
      column.className,
      column.labelClassName,
    ];


    // 没有子项
    if (!column.children) {
      classes.push('is-leaf');
    }

    // cell
    classes.push(`${prefixCls}-cell`);

    // 过滤
    return classes.filter((className) => Boolean(className)).join(' ');
  };


  return {
    getHeaderCellClass
  };
}

export default useStyle;
