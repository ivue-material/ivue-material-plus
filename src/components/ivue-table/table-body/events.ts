
import type { TableBodyProps } from './defaults';

function useEvents<T>(props: Partial<TableBodyProps<T>>) {

  // 点击行
  const handleClickTr = (event: Event, row: T) => {
    // 当前选择的row
    props.store.commit('setCurrentRow', row);
  };


  return {
    handleClickTr
  };
}

export default useEvents;
