import { ref, getCurrentInstance } from 'vue';

import { toggleRowStatus, getKeysMap, getRowIdentity } from '../utils';

// ts
import type { Ref } from 'vue';
import type { WatcherPropsData } from './index';
import type { Table } from '../table/defaults';

// 展开行数据
function useExpand<T>(watcherData: WatcherPropsData<T>) {
  // vm
  const vm = getCurrentInstance() as Table<T>;

  // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  const defaultExpandAll = ref(false);

  // 展开的行
  const expandRows: Ref<T[]> = ref([]);

  // 更新展开行
  const updateExpandRows = () => {
    // 数据
    const data = watcherData.data.value || [];
    // 行key
    const rowKey = watcherData.rowKey.value;
    // 展开所有行
    if (defaultExpandAll.value) {
      // 浅拷贝数组->防止修改原始数据
      expandRows.value = data.slice();
    }
    // 行key
    else if (rowKey) {
      const expandRowsMap = getKeysMap(expandRows.value, rowKey);

      expandRows.value = data.reduce((prev: T[], row: T) => {
        // 获取rowKey对应的数据
        const rowId = getRowIdentity(row, rowKey);

        const rowInfo = expandRowsMap[rowId];

        if (rowInfo) {
          prev.push(row);
        }

        return prev;
      }, []);
    }
    //其他
    else {
      expandRows.value = [];
    }
  };

  // 切换行展开
  const toggleRowExpansion = (row: T, expanded?: boolean) => {
    const changed = toggleRowStatus(expandRows.value, row, expanded);

    // 当用户对某一行展开或者关闭的时候会触发该事件
    if (changed) {
      vm.emit('on-expand-change', row, expandRows.value.slice());
    }
  };

  // 设置展开行的key
  const setExpandRowKeys = (rowKeys: string[]) => {
    // 检查 rowKey 是否存在
    vm.store.assertRowKey();

    // 数据
    const data = watcherData.data.value || [];
    // rowkey
    const rowKey = watcherData.rowKey.value;
    // 获取数组的key
    const keysMap = getKeysMap(data, rowKey);

    // 展开的行
    expandRows.value = rowKeys.reduce((prev: T[], cur: string) => {

      // 当前内容
      const info = keysMap[cur];

      // 行数据
      if (info) {
        prev.push(info.row);
      }

      return prev;
    }, []);
  };

  // 当前行是否有展开
  const isRowExpanded = (row: T): boolean => {
    const rowKey = watcherData.rowKey.value;
    // 行key
    if (rowKey) {

      // 获取数组的key
      const expandMap = getKeysMap(expandRows.value, rowKey);

      // 获取rowKey对应的数据
      return !!expandMap[getRowIdentity(row, rowKey)];
    }

    // 是否存在当前行
    return expandRows.value.includes(row);
  };


  return {
    updateExpandRows,
    toggleRowExpansion,
    setExpandRowKeys,
    isRowExpanded,
    states: {
      defaultExpandAll,
      expandRows,
    },
  };
}

export default useExpand;
