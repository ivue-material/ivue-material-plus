import {
  inject
} from 'vue';
import { getCell } from '../utils';

// ts
import type { TableBodyProps } from './defaults';

function useEvents<T>(props: Partial<TableBodyProps<T>>) {
  // inject
  const IvueTable: any = inject('ivue-table');

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
    const namespace = IvueTable?.vnode.el?.dataset.prefix;

    // 是否有单元格
    if (cell) {
      console.log('cell', namespace);
    }

  };


  return {
    handleClickTr,
    handleCellMouseEnter
  };
}

export default useEvents;
