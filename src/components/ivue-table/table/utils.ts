

import type { Store } from '../store';

function useUtils<T>(store: Store<T>) {

  // 设置当前选择的行
  const setCurrentRow = (row: T) => {
    store.commit('setCurrentRow', row);
  };

  // 选中当前行
  const toggleRowSelection = (row: T, selected: boolean) => {
    store.toggleRowSelection(row, selected, false);
    store.updateAllSelected();
  };

  // 清除选择行
  const clearSelection = () => {
    store.clearSelection();
  };

  return {
    // 设置当前选择的行
    setCurrentRow,
    // 选中当前行
    toggleRowSelection,
    // 清除选择行
    clearSelection
  };
}

export default useUtils;
