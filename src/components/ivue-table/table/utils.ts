

import type { Store } from '../store';

function useUtils<T>(store: Store<T>) {

  // 设置当前选择的行
  const setCurrentRow = (row: T) => {
    store.commit('setCurrentRow', row);
  };


  return {
    // 设置当前选择的行
    setCurrentRow
  };
}

export default useUtils;
