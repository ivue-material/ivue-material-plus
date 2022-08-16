

import { ref, getCurrentInstance, computed, unref } from 'vue';
import { getRowIdentity, walkTreeNode } from '../utils';

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

  // 子节点数据
  const childrenColumnName = ref('children');

  // 懒加载节点
  const lazyTreeNodeMap = ref({});

  // 以通过该属性设置 Table 目前的展开行
  const expandRowKeys = ref<string[]>([]);

  // computed

  // 格式化数据
  const normalizedData = computed(() => {
    // 行数据的Key
    if (!watcherData.rowKey.value) {
      return {};
    }

    // 原始数据
    const data = watcherData.data.value || [];

    // 格式化数据
    return normalize(data);
  });

  // 格式化懒加载节点
  const normalizedLazyNode = computed(() => {
    const rowKey = watcherData.rowKey.value;

    const keys = Object.keys(lazyTreeNodeMap.value);

    const res = {};

    // 没有数据
    if (!keys.length) {
      return res;
    }

    // keys.forEach((key) => {
    //   if (lazyTreeNodeMap.value[key].length) {
    //     const item = { children: [] }
    //     lazyTreeNodeMap.value[key].forEach((row) => {
    //       const currentRowKey = getRowIdentity(row, rowKey)
    //       item.children.push(currentRowKey)
    //       if (row[lazyColumnIdentifier.value] && !res[currentRowKey]) {
    //         res[currentRowKey] = { children: [] }
    //       }
    //     })
    //     res[key] = item
    //   }
    // })

    return res;
  });

  // methods

  // 格式化数据
  const normalize = (data) => {
    // 行数据的Key
    const rowKey = watcherData.rowKey.value;

    const res = {};

    walkTreeNode(
      data,
      (parent, children, level) => {
        // 获取rowKey对应的数据
        const rowKeyData = getRowIdentity(parent, rowKey);

        // 数组
        if (Array.isArray(children)) {
          res[rowKeyData] = {
            // 获取rowKey对应的数据
            children: children.map((row) => getRowIdentity(row, rowKey)),
            // 层级
            level,
          };
        }
        // 懒加载节点
        else {
          // 当 children 不存在且 lazy 为 true，该节点即为懒加载的节点
          res[rowKeyData] = {
            children: [],
            lazy: true,
            level,
          };
        }
      },
      // 子节点
      childrenColumnName.value,
      // 懒加载子节点数据
      lazyColumnIdentifier.value
    );

    return res;
  };

  // 树形数据与懒加载
  const loadOrToggle = (row) => {

    // 检查 rowKey 是否存在
    // vm.store.isRowKey();
    // vm.store.updateSelectionByRowKey();

  };

  // 更新树数据
  const updateTreeData = (
    ifChangeExpandRowKeys = false,
    ifExpandAll = vm.store?.states.defaultExpandAll.value
  ) => {
    // 格式化后的数据
    const nested = normalizedData.value;
    // 懒加载节点
    const normalizedLazyNode_ = normalizedLazyNode.value;

    // 格式化数据值
    const keys = Object.keys(nested);

    // 树节点数据
    const newTreeData = {};

    // 格式化数据值
    if (keys.length) {
      const oldTreeData = unref(treeData);

      const rootLazyRowKeys = [];

      // 是否展开行
      const getExpanded = (oldValue, key) => {
        // 展开行键是否改变了
        if (ifChangeExpandRowKeys) {
          // 可以通过该属性设置 Table 目前的展开行
          if (expandRowKeys.value) {
            // 展开全部 || 找到对应值
            return ifExpandAll || expandRowKeys.value.includes(key);
          }
          // 是否展开全部
          else {
            return !!(ifExpandAll || oldValue?.expanded);
          }
        }
      };

      // 合并 expanded 与 display，确保数据刷新后，状态不变
      // [3]:{
      //   children: [31, 32]
      //   level: 0
      // }
      // 父节点值 [3]
      keys.forEach((key) => {
        // 上一个子节点的值
        const oldValue = oldTreeData[key];
        // 最新子节点的值
        //   children: [31, 32]
        //   level: 0
        const newValue = { ...nested[key] };

        // 当前子节点是否展开行
        newValue.expanded = getExpanded(oldValue, key);

        // 是否懒加载子节点数据
        if (newValue.lazy) {
          const { loaded = false, loading = false } = oldValue || {};

          // 已加载
          newValue.loaded = !!loaded;
          // 加载中
          newValue.loading = !!loading;

          rootLazyRowKeys.push(key);
        }

        // 树节点数据
        // children: ['31', '32']
        // expanded: true
        // level: 0
        newTreeData[key] = newValue;
      });

      // 根据懒加载数据更新 treeData
      const lazyKeys = Object.keys(normalizedLazyNode_);
      // if (lazy.value && lazyKeys.length && rootLazyRowKeys.length) {

      // }
    }

    // 树数据
    treeData.value = newTreeData;

    // 更新y轴滚动高度
    vm.store?.updateTableScrollY();
  };

  return {
    loadOrToggle,
    updateTreeData,
    states: {
      indent,
      lazy,
      treeData,
      lazyColumnIdentifier,
      childrenColumnName,
      lazyTreeNodeMap
    }
  };
}

export default useTree;
