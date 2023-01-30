import { hasOwn, isObject } from '@vue/shared';
import Node from './node';
import { getNodeKey } from '../utils';

// type
import type {
  TreeKey,
  TreeStoreOptions,
  TreeData,
  TreeStoreNodesMap,
  TreeOptionProps,
  LoadFunction,
  TreeNodeData,
  FilterValue,
  FilterNodeMethodFunction,
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
  // 存储tree子节点
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
  // 对树节点进行筛选时执行的方法， 返回 false 则表示这个节点会被隐藏
  filterNodeMethod: FilterNodeMethodFunction;

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

    // 存储tree子节点
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
        // 存储tree子节点
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

  // 获取半选中节点
  getHalfCheckedNodes(): TreeNodeData[] {
    const halfCheckedNodes: TreeNodeData[] = [];

    // 递归遍历子节点
    const traverse = (node: TreeStore | Node) => {
      // 获取根节点数据的子项 || 子节点数据的子项
      const childNodes = (node as TreeStore).root
        ? (node as TreeStore).root.childNodes
        : (node as Node).childNodes;

      childNodes.forEach((child) => {
        // 有半选中状态
        if (child.indeterminate) {
          halfCheckedNodes.push(child.data);
        }

        // 递归遍历子节点
        traverse(child);
      });
    };

    // 递归遍历子节点
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

  // 设置目前勾选的节点，使用此方法必须提前设置 node-key 属性
  setCheckedNodes(array: Node[], leafOnly = false): void {
    const key = this.key;
    const checkedKeys = {};

    // 创建多选框key
    array.forEach((item) => {
      checkedKeys[(item || {})[key]] = true;
    });

    // 设置多选框key
    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  // 设置目前选中的节点
  setCheckedKeys(keys: TreeKey[], leafOnly = false): void {
    const key = this.key;
    const checkedKeys = {};

    // 默认勾选的节点的
    this.defaultCheckedKeys = keys;

    keys.forEach((key) => {
      checkedKeys[key] = true;
    });

    // 设置多选框key
    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  // 设置多选框key
  _setCheckedKeys(
    key: TreeKey,
    leafOnly = false,
    checkedKeys: { [key: string]: boolean }
  ): void {
    const allNodes = this.getAllNodes().sort((a, b) => b.level - a.level);
    // 父级数据的key
    const parentKeys = {};
    // 外部传入的key
    const keys = Object.keys(checkedKeys);

    // 先取消所有多选框选中
    allNodes.forEach((node) => {
      node.setChecked(false, false);
    });

    for (let i = 0; i < allNodes.length; i++) {
      // 节点
      const node = allNodes[i];
      // 节点key
      const nodeKey = node.data[key].toString();
      // 匹配外部传入是否选中
      const checked = keys.includes(nodeKey);

      // 取消选中
      if (!checked) {
        // 激活了 && 不是父级数据的子节点
        if (node.checked && !parentKeys[nodeKey]) {
          node.setChecked(false, false);
        }

        continue;
      }

      let parent = node.parent;

      // 父级层级 > 0
      while (parent && parent.level > 0) {
        // 父级数据的key
        parentKeys[parent.data[key]] = true;

        parent = parent.parent;
      }

      // 叶子节点 || 是否严格的遵循父子不互相关联的做法
      if (node.isLeaf || this.checkBoxStrictly) {
        // 选中
        node.setChecked(true, false);

        continue;
      }

      // 选中
      node.setChecked(true, true);

      // 叶子节点
      if (leafOnly) {
        // 取消选中
        node.setChecked(false, false);

        // 遍历子节点
        const traverse = (node: Node): void => {
          const childNodes = node.childNodes;

          childNodes.forEach((child) => {
            // 不是叶子节点 取消选中
            if (!child.isLeaf) {
              child.setChecked(false, false);
            }

            traverse(child);
          });
        };

        traverse(node);
      }
    }
  }

  // 获取所有节点
  getAllNodes(): Node[] {
    const allNodes: Node[] = [];
    const nodesMap = this.nodesMap;

    for (const nodeKey in nodesMap) {
      // 检测是否属性是否拥有
      if (hasOwn(nodesMap, nodeKey)) {
        allNodes.push(nodesMap[nodeKey]);
      }
    }

    return allNodes;
  }

  // 设置数据
  setData(value: TreeData): void {
    // 数据不一样
    const instanceChanged = value !== this.root.data;

    if (instanceChanged) {
      this.root.setData(value);

      // 初始化默认勾选节点
      this.initDefaultCheckedNodes();
    } else {
      // 更新子节点
      this.root.updateChildren();
    }
  }

  // 更新子节点
  updateChildren(key: TreeKey, data: TreeData): void {
    // 获取对应的节点
    const node = this.nodesMap[key];

    if (!node) {
      return;
    }

    const childNodes = node.childNodes;

    // 删除节点 -> 从后向前找
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const child = childNodes[i];

      this.remove(child.data);
    }

    // 添加节点
    for (let i = 0, j = data.length; i < j; i++) {
      const child = data[i];

      this.append(child, node.data);
    }
  }

  // 删除节点
  remove(data: TreeNodeData | Node): void {
    // 获取节点
    const node = this.getNode(data);

    // 有节点 && 有父节点
    if (node && node.parent) {
      // 清除当前节点
      if (node === this.currentNode) {
        this.currentNode = null;
      }

      node.parent.removeChild(node);
    }
  }

  // 添加节点
  append(data: TreeNodeData, parentData: TreeNodeData | TreeKey | Node): void {
    // 是否有父节点
    const parentNode = parentData ? this.getNode(parentData) : this.root;

    if (parentNode) {
      parentNode.insertChild({ data });
    }
  }

  // 获取节点
  getNode(data: TreeKey | TreeNodeData): Node {
    if (data instanceof Node) {
      return data;
    }

    // 获取节点的key
    const key = isObject(data) ? getNodeKey(this.key, data) : data;

    // 存储的树节点
    return this.nodesMap[key] || null;
  }

  // 注销节点
  deregisterNode(node: Node): void {
    const key = this.key;
    if (!key || !node || !node.data) {
      return;
    }

    // 递归调用
    node.childNodes.forEach((child) => {
      this.deregisterNode(child);
    });

    // 删除存储的树节点
    delete this.nodesMap[node.key];
  }

  // 设置默认勾选的节点的 key 数组
  setDefaultCheckedKey(value: TreeKey[]): void {
    if (value !== this.defaultCheckedKeys) {
      this.defaultCheckedKeys = value;

      // 初始化默认勾选节点
      this.initDefaultCheckedNodes();
    }
  }

  // 设置默认展开的节点的 key 的数组
  setDefaultExpandedKeys(keys: TreeKey[]) {
    keys = keys || [];

    this.defaultExpandedKeys = keys;

    keys.forEach((key) => {
      // 获取节点
      const node = this.getNode(key);

      // 设置展开
      if (node) {
        node.expand(null, this.autoExpandParent);
      }
    });
  }

  // 设置当前激活的key
  setCurrentNodeKey(key?: TreeKey, shouldAutoExpandParent = true): void {
    // 没有key
    if (key === null || key === undefined) {
      // 重置当前选中的节点
      this.currentNode && (this.currentNode.isCurrent = false);
      this.currentNode = null;

      return;
    }

    // 获取节点
    const node = this.getNode(key);

    // 有节点
    if (node) {
      // 点击当前节点
      this.setCurrentNode(node);

      // 有自动展开 && 节点层级 > 1
      if (shouldAutoExpandParent && this.currentNode.level > 1) {
        // 展开
        this.currentNode.parent.expand(null, true);
      }
    }
  }

  // 过滤所有树节点，过滤后的节点将被隐藏
  filter(value: FilterValue): void {
    const filterNodeMethod = this.filterNodeMethod;
    const lazy = this.lazy;

    const traverse = (node: TreeStore | Node) => {
      // 子节点
      const childNodes = (node as TreeStore).root
        ? (node as TreeStore).root.childNodes
        : (node as Node).childNodes;

      // 循环子节点
      childNodes.forEach((child) => {
        child.visible = filterNodeMethod.call(child, value, child.data, child);

        // 继续循环获取子节点
        traverse(child);
      });

      // 没有隐藏 && 有子节点
      if (!(node as Node).visible && childNodes.length) {
        let allHidden = true;
        // 是否符合隐藏全部条件
        allHidden = !childNodes.some((child) => child.visible);

        // 跟节点
        if ((node as TreeStore).root) {
          // 隐藏根节点
          (node as TreeStore).root.visible = allHidden === false;
        }
        // 隐藏子节点
        else {
          (node as Node).visible = allHidden === false;
        }
      }

      // 没有输入
      if (!value) {
        return;
      }

      // 隐藏了子节点 && 不是叶子节点 && 不是懒加载节点
      if ((node as Node).visible && !(node as Node).isLeaf && !lazy) {
        // 展开节点
        (node as Node).expand();
      }
    };

    // 遍历子节点
    traverse(this);
  }

  // 插入到节点前面
  insertBefore(data: TreeNodeData, refData: TreeKey | TreeNodeData): void {
    // 获取节点
    const refNode = this.getNode(refData);

    // 插入到节点
    refNode.parent.insertBefore({ data }, refNode);
  }

  // 插入到节点后面
  insertAfter(data: TreeNodeData, refData: TreeKey | TreeNodeData): void {
    // 获取节点
    const refNode = this.getNode(refData);

    // 插入到节点
    refNode.parent.insertAfter({ data }, refNode);
  }

  // 设置节点是否被选中, 使用此方法必须设置 node-key 属性
  setChecked(
    // 要选中的节点的 key 或者数据
    data: TreeKey | TreeNodeData,
    // 一个布尔类型参数表明是否选中
    checked: boolean,
    // 一个布尔类型参数表明是否递归选中子节点
    deep: boolean
  ): void {
    // 获取节点
    const node = this.getNode(data);

    // 设置选中
    if (node) {
      node.setChecked(!!checked, deep);
    }
  }

  // 返回当前被选中节点的数据
  getCurrentNode(): Node {
    return this.currentNode;
  }
}
