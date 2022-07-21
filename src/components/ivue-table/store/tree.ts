

import { ref, getCurrentInstance } from 'vue';

// ts
import type { WatcherPropsData } from './index';
import type { Table, TableProps } from '../table/defaults';

function useTree<T>(watcherData: WatcherPropsData<T>) {
  const vm = getCurrentInstance() as Table<T>;

  // data

  // 展示树形数据时，树节点的缩进
  const indent = ref(16);

  // 是否懒加载子节点数据
  const lazy = ref(false);

  // 树数据
  const treeData = ref<unknown>({});

  // 懒加载子节点数据
  const lazyColumnIdentifier = ref('hasChildren');

  // 子节点
  const childrenColumnName = ref('children');


  // methods

  // 树形数据与懒加载
  const loadOrToggle = (row) => {

    // 检查 rowKey 是否存在
    vm.store.isRowKey();
    vm.store.updateSelectionByRowKey();

  };

  return {
    loadOrToggle,
    states: {
      indent,
      lazy,
      treeData,
      lazyColumnIdentifier,
      childrenColumnName
    }
  };
}

export default useTree;
