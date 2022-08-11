import {
  inject,
} from 'vue';

import { hasClass, removeClass } from '../../../utils/assist';

// ts
import type { TableHeaderProps } from './index';
import type { TableColumnCtx } from '../table-column/defaults';

const prefixCls = 'ivue-table';

function useEvent<T>(props: TableHeaderProps<T>, emit) {
  // inject
  const IvueTable: any = inject(prefixCls);

  // 切换排序
  const toggleOrder = ({ order, sortOrders }) => {

    // 表示升序
    if (order === '') {
      return sortOrders[0];
    }

    // 下标
    const index = sortOrders.indexOf(order || null);

    return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1];
  };

  // 点击排序
  const handleSortClick = (
    event: Event,
    column: TableColumnCtx<T>,
    givenOrder: string | boolean
  ) => {

    // stopPropagation
    event.stopPropagation();

    // 顺序
    const order = column.order === givenOrder ? null : givenOrder || toggleOrder(column);

    let target = event.target as HTMLElement;
    while (target && target.tagName !== 'TH') {
      target = target.parentNode as HTMLElement;
    }

    // 点击th
    if (target && target.tagName === 'TH') {

      // 是否有 noclick
      if (hasClass(target, 'noclick')) {
        removeClass(target, 'noclick');

        return;
      }
    }

    // 没有排序
    if (!column.sortable) {
      return;
    }

    // states
    const states = props.store.states;

    // 排序的key 对应列内容的字段名
    let sortProp = states.sortProp.value;
    // 需要排序的列
    const sortingColumn = states.sortingColumn.value;

    // 排序
    let sortOrder;

    // 不是当前列
    if (
      sortingColumn !== column ||
      (sortingColumn === column && sortingColumn.order === null)
    ) {

      // 初始化排序
      if (sortingColumn) {
        sortingColumn.order = null;
      }

      // 保存当前列
      states.sortingColumn.value = column;

      // 排序的key 对应列内容的字段名
      sortProp = column.property;
    }

    // 没有排序顺序
    if (!order) {
      column.order = null;
      sortOrder = null;
    }
    // 设置排序顺序
    else {
      sortOrder = order;
      column.order = order;
    }

    // 排序的key 对应列内容的字段名
    states.sortProp.value = sortProp;
    // 设置排序顺序 descending | ascending | null
    states.sortOrder.value = sortOrder;

    // 改变排序
    IvueTable?.store.commit('changeSortCondition');
  };


  // 头部点击
  const handleHeaderClick = (event: Event, column: TableColumnCtx<T>) => {

    // 没有过滤筛选数据，只有排序
    if (!column.filters && column.sortable) {
      handleSortClick(event, column, false);
    }
    // 有过滤属性 没有排序
    else if (column.filterable && !column.sortable) {
      handleFilterClick(event);
    }

    IvueTable?.emit('on-header-click', column, event);
  };

  // 开启过滤后点击
  const handleFilterClick = (event: Event) => {
    // event.stopPropagation();

    // return;
  };

  return {
    handleSortClick,
    handleHeaderClick,
    handleFilterClick
  };
}

export default useEvent;
