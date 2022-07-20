

import { ref } from 'vue';

// ts
import type { WatcherPropsData } from './index';

function useTree<T>(watcherData: WatcherPropsData<T>) {

  // 展示树形数据时，树节点的缩进
  const indent = ref(16);

  // 是否懒加载子节点数据
  const lazy = ref(false);

  // 懒加载子节点数据
  const lazyColumnIdentifier = ref('hasChildren');

  // 子节点
  const childrenColumnName = ref('children');

  return {
    states: {
      indent,
      lazy,
      lazyColumnIdentifier,
      childrenColumnName
    }
  };
}

export default useTree;
