import type { InjectionKey, ComponentInternalInstance } from 'vue';
import type Node from '../store/node';

// provide
export const TreeNodeContextKey: InjectionKey<ComponentInternalInstance> =
  Symbol('ivue-tree-node');

// props
export interface Props {
  node: Node;
  renderContent: any;
}
