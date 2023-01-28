import { hasOwn } from '@vue/shared';
import Node from './node';

// type
import type {
  TreeKey,
  TreeStoreOptions,
  TreeData,
  TreeStoreNodesMap,
  TreeOptionProps,
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
}
