import { watch } from 'vue';
import { debounce } from 'lodash-unified';

import useStore from './index';

// ts
import type { Table, TableProps } from '../table/defaults';
import type { Store } from './index';

// 初始化 state 状态
const initialState = {
  rowKey: 'rowKey',
  defaultExpandAll: 'defaultExpandAll',
  selectOnIndeterminate: 'selectOnIndeterminate',
  indent: 'indent',
  lazy: 'lazy',
  data: 'data',
  ['treeProps.hasChildren']: {
    key: 'lazyColumnIdentifier',
    default: 'hasChildren',
  },
  ['treeProps.children']: {
    key: 'childrenColumnName',
    default: 'children',
  },
};

// 创建 store
export function createStore(table: Table, props: TableProps) {
  if (!table) {
    throw new Error('Table is required.');
  }

  const store = useStore();

  // 用于多选表格，切换全选和全不选
  // 将 toggleAllSelection 设置为实例属性
  store.toggleAllSelection = debounce(store._toggleAllSelection, 10);

  // 获取对应的值对比
  Object.keys(initialState).forEach((key) => {
    setStatesValue(getArrKeysValue(props, key), key, store);
  });

  // 监听表格props
  proxyTableProps(store, props);

  return store;
}

// 监听表格props
function proxyTableProps(store: Store, props: TableProps) {
  Object.keys(initialState).forEach((key) => {
    watch(
      () => getArrKeysValue(props, key),
      (value) => {
        setStatesValue(value, key, store);
      }
    );
  });
}

// 设置stats值
function setStatesValue(value, propsKey: string, store: Store) {
  // 最新值
  let newVal = value;

  // 获取 state key
  let storeKey = initialState[propsKey];

  // 是否存在值
  if (typeof initialState[propsKey] === 'object') {
    storeKey = storeKey.key;
    newVal = newVal || initialState[propsKey].default;
  }

  store.states[storeKey].value = newVal;
}

// 获取对应的值
function getArrKeysValue(props: TableProps, keys: string) {
  // 分割字符串成数组赋值
  if (keys.includes('.')) {
    const keyList = keys.split('.');
    let value = props;

    // 把 props 赋值给 initialState
    keyList.forEach((key) => {
      value = value[key];
    });

    return value;
  }
  // 普通赋值
  else {
    return props[keys];
  }
}
