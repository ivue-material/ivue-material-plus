// type
import type { SetupContext } from 'vue';
import type Node from './store/node';
import type { TreeNodeData, TreeKey, TreeContext } from './types/tree';

export const NODE_KEY = '$treeNodeId';

// 设置一个节点数据标记
export const markNodeData = (node: Node, data: TreeNodeData): void => {
  // 没有数据
  if (!data || data[NODE_KEY]) {
    return;
  }

  // 创建一个真正的常量属性
  Object.defineProperty(data, NODE_KEY, {
    value: node.id,
    enumerable: false,
    // 不能在数据属性和访问器属性之间更改
    // 不能被删除
    configurable: false,
    // 不可写入
    writable: false,
  });
};

// 获取节点的key
export const getNodeKey = (key: TreeKey, data: TreeNodeData): any => {
  if (!key) {
    return data[NODE_KEY];
  }

  return data[key];
};

// 当前点击事件
export const handleCurrentChange = (
  store: TreeContext['store'],
  emit: SetupContext['emit'],
  setCurrent: () => void
) => {
  // 上一个点击节点
  const preCurrentNode = store.value.currentNode;
  // 设置当前节点
  setCurrent();

  // 当前点击的节点
  const currentNode = store.value.currentNode;

  // 点击相同的节点
  if (preCurrentNode === currentNode) {
    return;
  }

  // 当前选中节点变化时触发的事件
  emit('on-current-change', currentNode ? currentNode.data : null, currentNode);
};
