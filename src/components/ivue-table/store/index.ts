import { getCurrentInstance, unref } from 'vue';
import useWatcher from './watcher';

function useStore() {
  // 获取当前实例
  const instance = getCurrentInstance();

  // 监听函数
  const watcher = useWatcher();

  // 同步
  const mutations = {

    setData(states, data) {
      // 如果参数是一个 ref，则返回内部值，否则返回参数本身
      const dataInstanceChanged = unref(states._data) !== data;

      states.data.value = data;
      states._data.value = data;

    }
  };

  return {
    ...watcher,
    mutations
  };
}

export default useStore;
