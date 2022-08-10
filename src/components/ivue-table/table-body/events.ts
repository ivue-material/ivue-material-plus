import {
  inject,
} from 'vue';
import { debounce } from 'lodash-unified';

import { getCell, getColumnByCell, createTablePopper } from '../utils';
import { hasClass, getStyle } from '../../../utils/assist';

// ts
import type { TableBodyProps } from './defaults';

const prefixCls = 'ivue-table';

function useEvents<T>(props: Partial<TableBodyProps<T>>) {
  // inject
  const IvueTable: any = inject(prefixCls);

  // 点击行
  const handleClickTr = (event: Event, row: T) => {
    // 当前选择的row
    props.store.commit('setCurrentRow', row);
  };

  // 鼠标进入
  const handleCellMouseEnter = (
    event: MouseEvent,
    row: T
  ) => {
    const cell = getCell(event);

    // 是否有单元格
    if (cell) {

      const column = getColumnByCell(
        {
          // 列的vm对象
          columns: props.store.states.columns.value,
        },
        // 单元格
        cell,
        prefixCls
      );

      IvueTable.hoverState = { cell, column, row };

      const hoverState = IvueTable.hoverState;

      IvueTable?.emit(
        'on-cell-mouse-enter',
        hoverState.row,
        hoverState.column,
        hoverState.cell,
        event
      );
    }

    // 判断是否text-overflow, 如果是就显示tooltip

    // 获取单元格dom
    const cellChild = (event.target as HTMLElement).querySelector(
      '.cell'
    ) as HTMLElement;

    // 没有tooltip && 没有内容
    if (
      !(hasClass(cellChild, `${prefixCls}-tooltip`) &&
        cellChild.childNodes.length)
    ) {
      return;
    }

    // 使用范围宽度而不是scrollWidth来判断文本是否溢出
    // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3

    // 创建范围
    const range = document.createRange();
    // 开始范围
    range.setStart(cellChild, 0);
    // 结束范围
    range.setEnd(cellChild, cellChild.childNodes.length);

    // 元素的大小及其相对于视口的位置
    const rangeWidth = range.getBoundingClientRect().width;

    // 获取padding
    const padding =
      (Number.parseInt(getStyle(cellChild, 'paddingLeft'), 10) || 0) +
      (Number.parseInt(getStyle(cellChild, 'paddingRight'), 10) || 0);

    // 文字内容 > 单元格dom宽度
    // 元素滚动的内容宽度 > 单元格dom宽度
    if (
      (rangeWidth + padding) > cellChild.offsetWidth ||
      cellChild.scrollWidth > cellChild.offsetWidth
    ) {

      createTablePopper(
        IvueTable?.refs.tableWrapper,
        cell,
        cell.innerText || cell.textContent,
        {
          placement: 'top',
          strategy: 'fixed',
        },
      );
    }
  };

  // 行鼠标进入
  const handleMouseEnter = debounce((index: number) => {
    props.store.commit('setHoverRow', index);
  }, 30);

  // 行鼠标离开
  const handleMouseLeave = debounce(() => {
    props.store.commit('setHoverRow', null);
  }, 30);


  return {
    handleClickTr,
    handleCellMouseEnter,
    handleMouseEnter,
    handleMouseLeave
  };
}

export default useEvents;
