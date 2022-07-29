import { getCurrentInstance, ref, unref } from 'vue';
import { getRowIdentity } from '../utils';

// ts
import type { Ref } from 'vue';
import type { WatcherPropsData } from './index';
import type { Table } from '../table/defaults';

function useCurrent<T>(watcherData: WatcherPropsData<T>) {
  const vm = getCurrentInstance() as Table<T>;

  // 当前行数据
  const currentRow: Ref<T> = ref(null);
  // 当前行key
  const _currentRowKey = ref<string>(null);

  // 更新当前行数据
  const updateCurrentRowData = () => {
    // 行数据的 Ke
    const rowKey = watcherData.rowKey.value;
    // data 为 null 时，解构时的默认值会被忽略
    const data = watcherData.data.value || [];

    // 上一个行数据
    const oldCurrentRow = currentRow.value;

    // 当 currentRow 不在 data 中时尝试更新数据
    if (!data.includes(oldCurrentRow) && oldCurrentRow) {
      // 行数据的key
      if (rowKey) {
        const currentRowKey = getRowIdentity(oldCurrentRow, rowKey);

        // 设置当前行数据的key
        setCurrentRowKey(currentRowKey);
      }
      // 没有key
      else {
        currentRow.value = null;
      }

      // 当表格的当前行发生变化的时候会触发该事件
      if (currentRow.value === null) {
        vm.emit('on-current-change', null, oldCurrentRow);
      }
    }
    // 当前行key
    else if (_currentRowKey.value) {
      // 把初始时下设置的 rowKey 转化成 rowData
      setCurrentRowKey(_currentRowKey.value);

      // 恢复当前行键
      restoreCurrentRowKey();
    }
  };

  // 设置当前行的key
  const setCurrentRowKey = (key: string) => {
    const { data, rowKey } = watcherData;

    let _currentRow = null;

    // 行数据的key
    if (rowKey.value) {
      _currentRow = (unref(data) || []).find(
        (item) => getRowIdentity(item, rowKey.value) === key
      );
    }

    // 当前行数据的key
    currentRow.value = _currentRow;

    vm.emit('on-current-change', currentRow.value, null);
  };

  // 恢复当前行key
  const restoreCurrentRowKey = () => {
    _currentRowKey.value = null;
  };

  // 当前选择的行
  const updateCurrentRow = (_currentRow: T) => {

    // 上一个数据
    const oldCurrentRow = currentRow.value;

    // 是否有上一个数据
    if (_currentRow && (_currentRow !== oldCurrentRow)) {
      // 当前行数据
      currentRow.value = _currentRow;

      // 当表格的当前行发生变化的时候会触发该事件
      vm.emit('on-current-change', currentRow.value, oldCurrentRow);
    }

    // 没有当前数据
    if (!_currentRow && oldCurrentRow) {
      currentRow.value = null;

      // 当表格的当前行发生变化的时候会触发该事件
      vm.emit('current-change', null, oldCurrentRow);
    }
  };

  return {
    updateCurrentRowData,
    updateCurrentRow,
    states: {
      _currentRowKey,
      currentRow,
    },
  };
}

export default useCurrent;
