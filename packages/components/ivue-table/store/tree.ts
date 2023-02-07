import { ref, getCurrentInstance, computed, unref, watch } from 'vue';
import { getRowIdentity, walkTreeNode } from '../utils';

import { throwError } from '../../../utils/error';

// ts
import type { WatcherPropsData } from './index';
import type { Table, TableProps, TreeNode } from '../table/defaults';

function useTree(watcherData: WatcherPropsData) {
  const vm = getCurrentInstance() as Table;

  // data

  // 展示树形数据时，树节点的缩进
  const indent = ref<number>(16);

  // 是否懒加载子节点数据
  const lazy = ref<boolean>(false);

  // 树数据
  const treeData = ref<TreeNode>({});

  // 懒加载子节点数据
  const lazyColumnIdentifier = ref<string>('hasChildren');

  // 子节点数据
  const childrenColumnName = ref<string>('children');

  // 懒加载节点
  const lazyTreeNodeMap = ref<any>({});

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

    keys.forEach((key) => {
      // 有懒加载节点
      if (lazyTreeNodeMap.value[key].length) {
        const item = {
          children: [] as string[],
        };

        lazyTreeNodeMap.value[key].forEach((row) => {
          // 获取rowKey对应的数据
          const currentRowKey: string = getRowIdentity(row, rowKey);

          item.children.push(currentRowKey);

          // 是否嵌套的懒加载节点
          if (row[lazyColumnIdentifier.value] && !res[currentRowKey]) {
            res[currentRowKey] = {
              children: [],
            };
          }
        });

        res[key] = item;
      }
    });

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
    vm.store.assertRowKey();

    // 获取当前行key
    const rowKey = watcherData.rowKey.value;

    // 获取rowKey对应的数据
    const id = getRowIdentity(row, rowKey);

    const data = treeData.value[id];

    // 懒加载 | 没有加载完成
    if (lazy.value && data && 'loaded' in data && !data.loaded) {
      loadData(row, id, data);
    }
    // 子节点
    else {
      toggleTreeExpansion(row, undefined);
    }
  };

  // 懒加载数据
  const loadData = (row: any, key: string, treeNode) => {
    const { load } = vm.props as unknown as TableProps;

    // 加载子节点数据的函数 && 没加载完成
    if (load && !treeData.value[key].loaded) {
      // 加载中
      treeData.value[key].loading = true;

      // 当前行数据 ｜ 节点数据
      load(row, treeNode, (data) => {
        // 不是数组
        if (!Array.isArray(data)) {
          throw new TypeError('[Table] data must be an array');
        }

        // 取消loading
        treeData.value[key].loading = false;
        // 加载完成
        treeData.value[key].loaded = true;
        // 展开数据
        treeData.value[key].expanded = true;

        // 有数据
        if (data.length) {
          lazyTreeNodeMap.value[key] = data;
        }

        vm.emit('on-expand-change', row, true);
      });
    }
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

      const rootLazyRowKeys: string[] = [];

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
        // 没有改变展开
        else {
          // 展开全部 || 可以通过该属性设置 Table 目前的展开行
          const included =
            ifExpandAll ||
            (expandRowKeys.value && expandRowKeys.value.includes(key));

          return !!(oldValue?.expanded || included);
        }
      };

      // 合并 expanded 与 display，确保数据刷新后，状态不变
      // [3]:{
      //   children: [31, 32]
      //   level: 0
      // }
      // 父节点值 [3]
      keys.forEach((key: string) => {
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

      // 是否有懒加载后的数据
      if (lazy.value && lazyKeys.length && rootLazyRowKeys.length) {
        lazyKeys.forEach((key) => {
          // 上一个子节点的值
          const oldValue = oldTreeData[key];

          // 懒加载后的数据
          const lazyNodeChildren = normalizedLazyNode_[key].children;

          // 是否是当前节点
          if (rootLazyRowKeys.includes(key)) {
            // 懒加载的 root 节点，更新一下原有的数据，原来的 children 一定是空数组
            if (newTreeData[key].children.length !== 0) {
              throwError('ivue-table', 'children must be an empty array');
            }

            // 更新当前懒加载节点数据
            newTreeData[key].children = lazyNodeChildren;
          }
          // 其他节点数据
          else {
            const { loaded = false, loading = false } = oldValue || {};

            // 修改节点状态
            newTreeData[key] = {
              lazy: true,
              loaded: !!loaded,
              loading: !!loading,
              expanded: getExpanded(oldValue, key),
              children: lazyNodeChildren,
              level: '',
            };
          }
        });
      }
    }

    // 树数据
    treeData.value = newTreeData;

    // 更新y轴滚动高度
    vm.store?.updateTableScrollY();
  };

  // 切换树节点展开
  const toggleTreeExpansion = (row, expanded?: boolean) => {
    // 检查 rowKey 是否存在
    vm.store.assertRowKey();

    // 获取当前行key
    const rowKey = watcherData.rowKey.value;

    // 获取rowKey对应的数据
    const id = getRowIdentity(row, rowKey);

    // 子节点的数据
    const data = id && treeData.value[id];

    // 有展开
    if (id && data && 'expanded' in data) {
      const oldExpanded = data.expanded;

      // 重新赋值
      expanded = typeof expanded === 'undefined' ? !data.expanded : expanded;

      // 切换展开
      treeData.value[id].expanded = expanded;

      // 展开有改变
      if (oldExpanded !== expanded) {
        vm.emit('on-expand-change', row, expanded);
      }

      // 更新y轴滚动高度
      vm.store.updateTableScrollY();
    }
  };

  // 更新树节点展开
  const updateTreeExpandKeys = (value: string[]) => {
    expandRowKeys.value = value;

    updateTreeData();
  };

  // watch

  // 监听格式化后的数据
  watch(
    () => normalizedData.value,
    () => {
      updateTreeData();
    }
  );

  // 监听以通过该属性设置 Table 目前的展开行
  watch(
    () => expandRowKeys.value,
    () => {
      updateTreeData(true);
    }
  );

  // 监听格式化懒加载节点
  watch(
    () => normalizedLazyNode.value,
    () => {
      updateTreeData();
    }
  );

  return {
    loadOrToggle,
    updateTreeData,
    updateTreeExpandKeys,
    toggleTreeExpansion,
    states: {
      indent,
      lazy,
      treeData,
      lazyColumnIdentifier,
      childrenColumnName,
      lazyTreeNodeMap,
    },
  };
}

export default useTree;
