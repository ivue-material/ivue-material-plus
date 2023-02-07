import { inject, provide, InjectionKey } from 'vue';

// type
import type Node from '../store/node';

interface NodeMap {
  treeNodeCollapse(node: Node): void;
  children: NodeMap[];
}

const TreeNodeMapContextKey: InjectionKey<NodeMap> =
  Symbol('ivue-tree-node-map');

// 派发展开事件
export function useNodeExpandEventBroadcast(props) {
  const parentNodeMap = inject(TreeNodeMapContextKey, null);

  // 当前节点
  const currentNodeMap: NodeMap = {
    // tree 节点关闭
    treeNodeCollapse: (node) => {
      if (props.node !== node) {
        props.node.collapse();
      }
    },
    children: [],
  };

  // 有父节点
  if (parentNodeMap) {
    parentNodeMap.children.push(currentNodeMap);
  }

  provide(TreeNodeMapContextKey, currentNodeMap);

  return {
    broadcastExpanded: (node: Node): void => {
      // 是否每次只打开一个同级树节点展开
      if (!props.accordion) {
        return;
      }

      for (const childNode of currentNodeMap.children) {
        childNode.treeNodeCollapse(node);
      }
    },
  };
}
