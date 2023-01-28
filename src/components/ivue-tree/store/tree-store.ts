import { hasOwn } from '@vue/shared';
import Node from './node';

// type
import type {
  TreeKey,
  TreeStoreOptions,
  TreeData,
  TreeStoreNodesMap,
  TreeOptionProps,
  LoadFunction,
  TreeNodeData,
} from '../types/tree';

// tree 存储数据对象
export default class TreeStore {
  // 当前节点的key
  currentNodeKey: TreeKey;
  // 当前节点
  currentNode: Node;
  // 根节点数据
  root: Node;
  // tree 数据
  data: TreeData;
  // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
  key: TreeKey;
  // 存储的树节点
  nodesMap: TreeStoreNodesMap;
  // 是否懒加载子节点，需与 load 方法结合使用
  lazy: boolean;
  // tree 配置选项
  props: TreeOptionProps;
  // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
  checkBoxStrictly: boolean;
  // 加载子树数据的方法
  load: LoadFunction;
  // 默认勾选的节点的 key 的数组
  defaultCheckedKeys: TreeKey[];
  // 默认展开的节点的 key 的数组
  defaultExpandedKeys: TreeKey[];
  // 展开子节点的时候是否自动展开父节点
  autoExpandParent: boolean;
  // 是否默认展开所有节点
  defaultExpandAll: boolean;

  constructor(options: TreeStoreOptions) {
    // 当前节点的key
    this.currentNodeKey = null;
    // 当前节点
    this.currentNode = null;

    // 将外部值赋值给属性
    for (const name in options) {
      // 检测是否属性是否拥有
      if (hasOwn(options, name)) {
        // 赋值给当前 class 属性
        this[name] = options[name];
      }
    }

    // 存储的树子节点
    this.nodesMap = {};
  }

  // 初始化数据
  initialize() {
    this.root = new Node({
      data: this.data,
      store: this,
    });

    // 初始化节点属性
    this.root.initialize();

    // 是懒加载节点 && 有加载子树数据的方法
    if (this.lazy && this.load) {
      this.load(this.root, (data) => {
        this.root.createChildren(data);

        // 初始化默认勾选节点
        this.initDefaultCheckedNodes();
      });
    }
    // 其他节点
    else {
      // 初始化默认勾选节点
      this.initDefaultCheckedNodes();
    }
  }

  // 注册节点
  registerNode(node: Node): void {
    const key = this.key;

    // 没有节点 || 没有节点数据
    if (!node || !node.data) {
      return;
    }

    // 当前树没有唯一key
    if (!key) {
      // 用节点的id去存储节点
      this.nodesMap[node.id] = node;
    }
    // 有定义key
    else {
      const nodeKey = node.key;

      if (nodeKey !== undefined) {
        this.nodesMap[node.key] = node;
      }
    }
  }

  // 点击当前节点
  setCurrentNode(currentNode: Node): void {
    // 上一个点击的节点
    const preCurrentNode = this.currentNode;

    // 初始化上一个节点数据
    if (preCurrentNode) {
      preCurrentNode.isCurrent = false;
    }

    // 设置当前节点
    this.currentNode = currentNode;
    this.currentNode.isCurrent = true;
  }

  // 获取选中的节点
  getCheckedNodes(
    leafOnly = false,
    includeHalfChecked = false
  ): TreeNodeData[] {
    // 选中的节点数组
    const checkedNodes: TreeNodeData[] = [];

    // 递归遍历子节点
    const traverse = (node: TreeStore | Node) => {
      // 获取子节点数组
      const childNodes = (node as TreeStore).root
        ? (node as TreeStore).root.childNodes
        : (node as Node).childNodes;

      childNodes.forEach((child) => {
        if (
          // 选中 || 是不确定的选中状态
          (child.checked || (includeHalfChecked && child.indeterminate)) &&
          // 不是叶子节点 || 是叶子节点
          (!leafOnly || (leafOnly && child.isLeaf))
        ) {
          checkedNodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return checkedNodes;
  }

  // 获取选中节点的key
  getCheckedKeys(leafOnly = false): TreeKey[] {
    return this.getCheckedNodes(leafOnly).map((data) => (data || {})[this.key]);
  }

  // 获取不确定选中节点
  getHalfCheckedNodes(): TreeNodeData[] {
    const halfCheckedNodes: TreeNodeData[] = [];

    // 递归遍历子节点
    const traverse = (node: TreeStore | Node) => {
      const childNodes = (node as TreeStore).root
        ? (node as TreeStore).root.childNodes
        : (node as Node).childNodes;

      childNodes.forEach((child) => {
        if (child.indeterminate) {
          halfCheckedNodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return halfCheckedNodes;
  }

  // 获取不确定选中节点key
  getHalfCheckedKeys(): TreeKey[] {
    return this.getHalfCheckedNodes().map((data) => (data || {})[this.key]);
  }

  // 初始化默认勾选节点
  initDefaultCheckedNodes(): void {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];

    const nodesMap = this.nodesMap;

    defaultCheckedKeys.forEach((checkedKey) => {
      // 获取默认勾选节点
      const node = nodesMap[checkedKey];

      // 设置勾选
      if (node) {
        node.setChecked(true, !this.checkBoxStrictly);
      }
    });
  }

  // 初始化默认勾选节点
  initDefaultCheckedNode(node: Node): void {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];

    // 激活当前节点
    if (defaultCheckedKeys.includes(node.key)) {
      node.setChecked(true, !this.checkBoxStrictly);
    }
  }
}
