import { ref } from 'vue';

// ts
import type { WatcherPropsData } from './index';

// 展开行数据
function useExpand<T>(watcherData: WatcherPropsData<T>) {

  // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  const defaultExpandAll = ref(false);


  return {
    states: {
      defaultExpandAll,
    },
  };
}

export default useExpand;
