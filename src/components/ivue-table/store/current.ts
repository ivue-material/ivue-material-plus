import { getCurrentInstance, ref, unref } from 'vue';

// ts
import type { Ref } from 'vue';
import type { WatcherPropsData } from './index';


function useCurrent<T>(watcherData: WatcherPropsData<T>) {

  // 当前行数据
  const currentRow: Ref<T> = ref(null);
  // 当前行key
  const _currentRowKey = ref<string>(null);

  // 更新当前行数据
  const updateCurrentRowData = () => {
    const rowKey = watcherData.rowKey.value;
    // data 为 null 时，解构时的默认值会被忽略
    const data = watcherData.data.value || [];

    // 上一个行数据
    const oldCurrentRow = currentRow.value;

    // 当 currentRow 不在 data 中时尝试更新数据
    if (!data.includes(oldCurrentRow) && oldCurrentRow) {
    }
    // 当前行key
    else if (_currentRowKey.value) {
      // 把初始时下设置的 rowKey 转化成 rowData
      // setCurrentRowByKey(_currentRowKey.value)
      // restoreCurrentRowKey()
    }
    console.log('?_currentRowKey.value?', _currentRowKey.value);

  };

  return {
    updateCurrentRowData
  };
}

export default useCurrent;
