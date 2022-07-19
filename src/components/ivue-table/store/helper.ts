
import { debounce } from 'lodash-unified';
import useStore from './index';

// 创建 store
export function createStore(table, props) {
  if (!table) {
    throw new Error('Table is required.');
  }

  const store = useStore();

  // 用于多选表格，切换全选和全不选
  // 将 toggleAllSelection 设置为实例属性
  store.toggleAllSelection = debounce(store._toggleAllSelection, 10);

  console.log('??', store);
}
