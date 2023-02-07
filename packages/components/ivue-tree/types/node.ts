import type { InjectionKey, ComponentInternalInstance } from 'vue';
import type Node from '../store/node';
import type { TreeOptionProps } from './tree';

// provide
export const TreeNodeContextKey: InjectionKey<ComponentInternalInstance> =
  Symbol('ivue-tree-node');

// tree 子节点状态
export declare interface TreeNodeChildState {
  all: boolean;
  none: boolean;
  allWithoutDisable: boolean;
  half: boolean;
}

// tree 节点默认配置项
export declare interface TreeNodeLoadedDefaultProps {
  checked?: boolean;
}

// props
export interface Props {
  node: Node;
  renderContent: any;
  accordion: boolean;
  showCheckbox: boolean;
  renderAfterExpand: boolean;
  props: TreeOptionProps;
}
