import { getCurrentInstance, } from 'vue';
import useWatcher from './watcher';

// ts
import type { Ref } from 'vue';
import type { Table } from '../table/defaults';

// 监听props的数据
interface WatcherPropsData<T> {
  data: Ref<T[]>
  rowKey: Ref<string>
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

    // setData(states, data) {
    //   // 如果参数是一个 ref，则返回内部值，否则返回参数本身
    //   const dataInstanceChanged = unref(states._data) !== data;

    //   states.data.value = data;
    //   states._data.value = data;
    // }

    // 用于多选表格，切换全选和全不选
    toggleAllSelection() {

    },
    // 设置当前行hover
    setHoverRow(states: states, row: T) {
      states.hoverRow.value = row;
    }
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
