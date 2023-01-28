import type { InjectionKey, Component, PropType, SetupContext, Ref } from 'vue';
import type TreeStore from '../store/tree-store';
import type Node from '../store/node';

export const definePropType = <T>(val: any): PropType<T> => val;

// tree 节点数据对象
export declare interface TreeNodeData {
  [key: string]: any;
}

// 当前选中的节点
export declare type TreeKey = string | number;

// tree 数据
export declare type TreeData = TreeNodeData[];

// tree 存储选项
export declare interface TreeStoreOptions {
  data: TreeData;
  lazy: boolean;
  props: TreeOptionProps;
}

// tree 节点外部传入属性
export declare interface TreeNodeOptions {
  data: TreeNodeData;
  store: TreeStore;
  parent?: Node;
}

// tree 存储的树节点
export declare interface TreeStoreNodesMap {
  [key: string]: Node;
}

// tree 配置选项
export declare interface TreeOptionProps {
  children?: string;
  // label?: string | ((data: TreeNodeData, node: Node) => string);
  // disabled?: string | ((data: TreeNodeData, node: Node) => string);
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean);
  // class?: (
  //   data: TreeNodeData,
  //   node: Node
  // ) => string | { [key: string]: boolean } | string;
}

// 虚拟节点
export declare interface FakeNode {
  data: TreeNodeData;
}

// Context
export interface TreeContext {
  props: Props;
  ctx: SetupContext<any>;
  store: Ref<TreeStore>;
  currentNode: Ref<Node>;
}

export const TreeContextKey: InjectionKey<TreeContext> = Symbol('ivue-tree');

// IconPropType
export const IconPropType = definePropType<string | Component>([
  String,
  Object,
  Function,
]);

// props
export interface Props {
  data: any[];
  lazy: boolean;
  props: TreeOptionProps;
  emptyText: string;
  nodeKey: string;
  indent: number;
  icon: string | Component;
  renderContent: any;
  expandOnClickNode: boolean;
  accordion: boolean;
}
