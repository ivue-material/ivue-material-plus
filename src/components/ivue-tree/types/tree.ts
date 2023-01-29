import type {
  InjectionKey,
  Component,
  PropType,
  SetupContext,
  Ref,
  h,
  VNode,
  ComponentInternalInstance,
} from 'vue';
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
  checkBoxStrictly: boolean;
  load: LoadFunction;
  key: TreeKey;
  defaultExpandedKeys: TreeKey[];
  defaultCheckedKeys: TreeKey[];
  autoExpandParent: boolean;
  defaultExpandAll: boolean;
  filterNodeMethod: FilterNodeMethodFunction;
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
  label?: string | ((data: TreeNodeData, node: Node) => string);
  disabled?: string | ((data: TreeNodeData, node: Node) => string);
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean);
  class?: (
    data: TreeNodeData,
    node: Node
  ) => string | { [key: string]: boolean } | string;
}

// 虚拟节点
export declare interface FakeNode {
  data: TreeNodeData;
}

export declare type hType = typeof h;

// 树节点的内容区的渲染方法
export declare type RenderContentFunction = (
  h: hType,
  context: RenderContentContext
) => VNode | VNode[];

// 树节点的内容区的渲染方法 context 数据
export declare interface RenderContentContext {
  _self: ComponentInternalInstance;
  node: Node;
  data: TreeNodeData;
  store: TreeStore;
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

// 加载子树数据的方法
export declare type LoadFunction = (
  rootNode: Node,
  loadedCallback: (data: TreeData) => void
) => void;

// 过滤value
export declare type FilterValue = any;
// 对树节点进行筛选时执行的方法，
export declare type FilterNodeMethodFunction = (
  value: FilterValue,
  data: TreeNodeData,
  child: Node
) => boolean;

// props
export interface Props {
  data: any[];
  lazy: boolean;
  props: TreeOptionProps;
  emptyText: string;
  nodeKey: string;
  indent: number;
  icon: string | Component;
  renderContent: RenderContentFunction;
  expandOnClickNode: boolean;
  accordion: boolean;
  showCheckbox: boolean;
  checkBoxStrictly: boolean;
  load: LoadFunction;
  defaultExpandedKeys: TreeKey[];
  defaultCheckedKeys: TreeKey[];
  autoExpandParent: boolean;
  defaultExpandAll: boolean;
  renderAfterExpand: boolean;
  highlightCurrent: boolean;
  currentNodeKey: string | number;
  filterNodeMethod: FilterNodeMethodFunction;
  checkOnClickNode: boolean;
  draggable: boolean;
}
