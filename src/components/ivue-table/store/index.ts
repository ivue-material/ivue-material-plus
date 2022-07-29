import { getCurrentInstance, unref } from 'vue';
import useWatcher from './watcher';

// ts
import type { Ref } from 'vue';
import type { Table } from '../table/defaults';
import type { TableColumnCtx, } from '../table-column/defaults';

// 监听props的数据
interface WatcherPropsData<T> {
  data: Ref<T[]>
  rowKey: Ref<string>
}

// 排序列
function sortColumn<T>(array: TableColumnCtx<T>[]) {
  array.forEach((item) => {

    // 当前index
    item.currentIndex = item.getColumnIndex?.();

    // 有子节点
    if (item.children?.length) {
      sortColumn(item.children);
    }
  });

  array.sort((cur, pre) => cur.currentIndex - pre.currentIndex);
}

// 设置列数
function replaceColumn<T>(
  array: TableColumnCtx<T>[],
  column: TableColumnCtx<T>
) {
  return array.map((item) => {
    // id是否相同返回当前列
    if (item.id === column.id) {
      return column;
    }
    // 有子列 获取子列的数据
    else if (item.children?.length) {
      item.children = replaceColumn(item.children, column);
    }

    return item;
  });
}


function useStore<T>() {
  // 获取当前实例
  const vm = getCurrentInstance() as Table<T>;

  // 监听函数
  const watcher = useWatcher<T>();

  // ts
  // 状态 ts
  type states = typeof watcher.states

  // 同步
  const mutations = {

    setData(states, data) {
      // 数据是否有改变
      const dataInstanceChanged = unref(states._data) !== data;

      states.data.value = data;
      states._data.value = data;


      // 数据变化，更新部分数据。
      // 没有使用 computed，而是手动更新部分数据 https://github.com/vuejs/vue/issues/6660#issuecomment-331417140
      vm.store.updateCurrentRowData();
    },

    // 用于多选表格，切换全选和全不选
    toggleAllSelection() {

    },
    // 设置当前行hover
    setHoverRow(states: states, row: T) {
      states.hoverRow.value = row;
    },
    // 插入列
    insertColumn(
      states: states,
      column: TableColumnCtx<T>,
      parent: TableColumnCtx<T>
    ) {
      const array = unref(states._columns);

      let newColumns = [];

      // 不是组合头部
      if (!parent) {
        array.push(column);

        newColumns = array;
      }
      // 组合头部
      else {
        if (parent && !parent.children) {
          parent.children = [];
        }

        // 设置子列
        parent.children.push(column);

        // 设置为新的列
        newColumns = replaceColumn(array, parent);
      }

      // 排序列
      sortColumn(newColumns);

      // 记录当前列
      states._columns.value = newColumns;

      // 多选框
      // if (column.type === 'selection') {
      // }

      // 用于动态插入列
      if (vm.$ready) {
        vm.store.updateColumns();
        // vm.store.scheduleLayout();
      }
    },
    // 选择当前行
    setCurrentRow(_states, row: T) {
      vm.store.updateCurrentRow(row);
    },
  };

  // 调用数据
  const commit = (name: keyof typeof mutations, ...args) => {
    const mutations: any = vm.store.mutations;

    // 判断 mutations 是否存在当前方法
    if (mutations[name]) {
      mutations[name].apply(vm, [vm.store.states].concat(args));
    }
    // 提示错误
    else {
      throw new Error(`Action not found: ${String(name)}`);
    }

  };

  return {
    ...watcher,
    mutations,
    commit,
  };
}

export default useStore;

class HelperStore<T> {
  Return = useStore<T>()
}

type Store<T> = HelperStore<T>['Return']

export type { Store, WatcherPropsData };
