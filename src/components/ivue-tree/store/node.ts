import { reactive } from 'vue';
import { hasOwn } from '@vue/shared';
import { markNodeData } from '../utils';

// type
import type { TreeNodeData, TreeNodeOptions } from '../types/tree';
import type TreeStore from './tree-store';
import type { TreeKey, FakeNode } from '../types/tree';
import type {
  TreeNodeChildState,
  TreeNodeLoadedDefaultProps,
} from '../types/node';

// 节点id
let nodeIdSeed = 0;

/**
 * 获取 data tree数据 中的属性
 * label 指定节点标签为节点对象的某个属性值
 * @type {string, function(data, node)}
 *
 * children	指定子树为节点对象的某个属性值
 * @type {string}
 *
 * disabled 指定节点选择框是否禁用为节点对象的某个属性值
 * @type {string, function(data, node)}
 *
 * isLeaf 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
 * @type {string, function(data, node)}
 *
 * class 自定义节点类名
 *
 * @type {string, function(data, node)}
 */
const getPropsFromData = (node: Node, prop: string): any => {
  const props = node.store.props;
  const data = node.data || {};

  // 获取 tree 配置选项的属性
  const config = props[prop];

  // function
  if (typeof config === 'function') {
    return config(data, node);
  }
  // string
  else if (typeof config === 'string') {
    return data[config];
  }
  // undefined
  else if (typeof config === 'undefined') {
    const dataProp = data[prop];

    return dataProp === undefined ? '' : dataProp;
  }
};

// 获取子节点状态
const getChildState = (node: Node[]): TreeNodeChildState => {
  let all = true;
  let none = true;
  let allWithoutDisable = true;

  for (let i = 0; i < node.length; i++) {
    const nodeData = node[i];

    // 没有选中 || 是不确定状态
    if (nodeData.checked !== true || nodeData.indeterminate) {
      all = false;

      // 没有禁用
      if (!nodeData.disabled) {
        allWithoutDisable = false;
      }
    }

    // 选中 || 是不确定状态
    if (nodeData.checked !== false || nodeData.indeterminate) {
      none = false;
    }
  }

  return {
    all,
    none,
    allWithoutDisable,
    half: !all && !none,
  };
};

// 重新初始化多选
const reInitChecked = (node: Node): void => {
  // 没有子节点 || 加载中
  if (node.childNodes.length === 0 || node.loading) {
    return;
  }

  // 获取子节点状态
  const { all, none, half } = getChildState(node.childNodes);

  // 选中所有多选
  if (all) {
    node.checked = true;
    node.indeterminate = false;
  }
  // 多选不确定的状态
  else if (half) {
    node.checked = false;
    node.indeterminate = true;
  }
  // 没有选择
  else if (none) {
    node.checked = false;
    node.indeterminate = false;
  }

  const parent = node.parent;

  // 层级只有一个
  if (!parent || parent.level === 0) {
    return;
  }

  // 继续递归
  if (!node.store.checkBoxStrictly) {
    reInitChecked(parent);
  }
};

// tree 节点对象
class Node {
  // tree 节点数据对象
  data: TreeNodeData;
  // tree 存储数据对象
  store: TreeStore;
  // 当前节点id
  id: number;
  // 子节点数组
  childNodes: Node[];
  // 当前节点层级
  level: number;
  // 父节点
  parent: Node;
  // 是否显示节点
  visible: boolean;
  // 节点是否展开
  expanded: boolean;
  // 是否是当前点击的节点
  isCurrent: boolean;
  // 节点是否可以获取焦点
  canFocus: boolean;
  // 是否是叶子节点
  isLeaf: boolean;
  // 是否是叶子节点
  isLeafByUser: boolean;
  // 是否加载完成
  loaded: boolean;
  // 加载中
  loading: boolean;
  // 是否选中
  checked: boolean;
  // 多选不确定状态
  indeterminate: boolean;

  constructor(options: TreeNodeOptions) {
    // tree 节点数据对象
    this.data = null;
    // 当前节点id
    this.id = nodeIdSeed++;
    // 是否显示节点
    this.visible = true;
    // 父节点
    this.parent = null;
    // 节点是否展开
    this.expanded = false;
    // 是否是当前点击的节点
    this.isCurrent = false;
    // 节点是否可以获取焦点
    this.canFocus = false;
    // 是否选中
    this.checked = false;
    // 多选不确定状态
    this.indeterminate = false;

    // 将外部值赋值给属性
    for (const name in options) {
      // 检测是否属性是否拥有
      if (hasOwn(options, name)) {
        // 赋值给当前 class 属性
        this[name] = options[name];
      }
    }

    // 子节点
    this.childNodes = [];
    // 当前节点层级
    this.level = 0;
    // 是否加载完成
    this.loaded = false;
    // 加载中
    this.loading = false;

    // 有父节点
    if (this.parent) {
      this.level = this.parent.level + 1;
    }
  }

  // 获取key
  get key(): TreeKey {
    // tree 存储数据对象的 key 属性
    const nodeKey = this.store.key;

    // 有数据
    if (this.data) {
      // 获取 data 中对应 key 属性的值
      return this.data[nodeKey];
    }

    return null;
  }

  // 标题
  get label(): string {
    return getPropsFromData(this, 'label');
  }

  // 是否禁用
  get disabled(): boolean {
    return getPropsFromData(this, 'disabled');
  }

  // 初始化数据
  initialize() {
    const store = this.store;

    // 没有 tree 存储数据对象
    if (!store) {
      throw new Error('[Node]store is required!');
    }

    // 注册节点
    store.registerNode(this);

    // 是否是叶子节点
    const props = store.props;
    if (props && typeof props.isLeaf !== 'undefined') {
      // 指定节点是否为叶子节点
      const isLeaf = getPropsFromData(this, 'isLeaf');

      // boolean
      if (typeof isLeaf === 'boolean') {
        this.isLeafByUser = isLeaf;
      }
    }

    // 不是懒加载子节点 && 有数据
    if (store.lazy !== true && this.data) {
      this.setData(this.data);

      // 展开全部子节点
      if (store.defaultExpandAll) {
        this.expanded = true;
        this.canFocus = true;
      }
    }
    // 是懒加载子节点 && 展开全部子节点
    else if (this.level > 0 && store.lazy && store.defaultExpandAll) {
      this.expand();
    }

    // data 不是数组
    if (!Array.isArray(this.data)) {
      markNodeData(this, this.data);
    }

    // 没有数据
    if (!this.data) {
      return;
    }

    // 默认展开的节点的 keys 数组
    const defaultExpandedKeys = store.defaultExpandedKeys;
    // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
    const key = store.key;

    // 展开对应的节点
    if (key && defaultExpandedKeys && defaultExpandedKeys.includes(this.key)) {
      this.expand(null, store.autoExpandParent);
    }

    // 设置当前节点
    if (
      key &&
      store.currentNodeKey !== undefined &&
      // 获取key === 当前点击节点的key
      this.key === store.currentNodeKey
    ) {
      store.currentNode = this;
      store.currentNode.isCurrent = true;
    }

    // 有懒加载 初始化默认勾选节点
    if (store.lazy) {
      store.initDefaultCheckedNode(this);
    }

    // 更新叶子节点状态
    this.updateLeafState();

    // 有父节点 && 有节点层级 || 展开节点 设置可以获取焦点
    if (this.parent && (this.level === 1 || this.parent.expanded === true)) {
      this.canFocus = true;
    }
  }

  // 设置数据
  setData(data: TreeNodeData): void {
    // 不是数组
    if (!Array.isArray(data)) {
      markNodeData(this, data);
    }

    // tree 节点数据对象
    this.data = data;
    // 子节点
    this.childNodes = [];

    let children;

    // 当前节点层级为父级
    if (this.level === 0 && Array.isArray(this.data)) {
      children = this.data;
    } else {
      children = getPropsFromData(this, 'children') || [];
    }

    // 循环 tree 配置选项 的 children属性
    for (let i = 0; i < children.length; i++) {
      this.insertChild({ data: children[i] });
    }
  }

  // 插入 children 数据
  insertChild(child?: FakeNode | Node, index?: number, batch?: boolean): void {
    // 没有数据
    if (!child) {
      throw new Error('InsertChild error: child is required.');
    }

    // 不是 tree 节点对象
    if (!(child instanceof Node)) {
      // 是否是批量插入 children
      if (!batch) {
        const children = this.getChildren(true);

        // 判断一个数组是否包含一个指定的值
        if (!children.includes(child.data)) {
          // 没有index
          if (typeof index === 'undefined' || index < 0) {
            children.push(child.data);
          }
          // 在数组中添加新数据
          else {
            children.splice(index, 0, child.data);
          }
        }
      }

      // 插入对象
      Object.assign(child, {
        // 父节点
        parent: this,
        // tree 存储数据对象
        store: this.store,
      });

      // child 设置为 reactive
      child = reactive(new Node(child as TreeNodeOptions));
      if (child instanceof Node) {
        child.initialize();
      }
    }

    // 增加当前节点层级
    (child as Node).level = this.level + 1;

    // 没有下标
    if (typeof index === 'undefined' || index < 0) {
      // 子节点
      this.childNodes.push(child as Node);
    }
    // 插入子节点
    else {
      this.childNodes.splice(index, 0, child as Node);
    }
  }

  // 获取 children 属性 子树为节点对象的某个属性值
  getChildren(init = false): TreeNodeData | TreeNodeData[] {
    // 当前 children 为父级
    if (this.level === 0) {
      return this.data;
    }

    // 没有 tree 节点数据对象
    const data = this.data;
    if (!data) {
      return null;
    }

    // tree 配置选项
    const props = this.store.props;

    let children = 'children';

    // 有配置选项
    if (props) {
      // 设置是使用用户自定义的 children 属性 还是默认 children
      children = props.children || 'children';
    }

    // 没有 children 属性
    if (data[children] === undefined) {
      data[children] = null;
    }

    // 没有数据初始化 children 属性
    if (init && !data[children]) {
      data[children] = [];
    }

    return data[children];
  }

  // 收起节点
  collapse(): void {
    this.expanded = false;

    this.childNodes.forEach((item) => {
      item.canFocus = false;
    });
  }

  // 展开节点
  expand(callback?: () => void, expandParent?: boolean): void {
    const done = (): void => {
      // 展开父级
      if (expandParent) {
        let parent = this.parent;

        // 设置对应的父级属性
        while (parent.level > 0) {
          parent.expanded = true;

          // 指向上一级的父节点
          parent = parent.parent;
        }
      }

      // 展开节点
      this.expanded = true;

      // 有回调函数
      if (callback) {
        callback();
      }

      // 子节点数组全部都可以获取焦点
      this.childNodes.forEach((item) => {
        item.canFocus = true;
      });
    };

    if (this.shouldLoadData()) {
      this.loadData((data) => {
        if (Array.isArray(data)) {
          // 多选选中
          if (this.checked) {
            this.setChecked(true, true);
          }
          // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
          else if (!this.store.checkBoxStrictly) {
            reInitChecked(this);
          }

          // 展开节点
          done();
        }
      });
    }

    done();
  }

  // 更新叶子节点状态
  updateLeafState(): void {
    if (
      // 是懒加载节点
      this.store.lazy === true &&
      // 没有加载完成
      this.loaded !== true &&
      // 是否是叶子节点
      typeof this.isLeafByUser !== 'undefined'
    ) {
      // 叶子节点
      this.isLeaf = this.isLeafByUser;

      return;
    }

    const childNodes = this.childNodes;

    if (
      !this.store.lazy ||
      (this.store.lazy === true && this.loaded === true)
    ) {
      // 是叶子节点
      this.isLeaf = !childNodes || childNodes.length === 0;

      return;
    }

    // 不是叶子节点
    this.isLeaf = false;
  }

  // 设置多选
  setChecked(
    value?: boolean | string,
    deep?: boolean,
    recursion?: boolean,
    passValue?: boolean
  ) {
    this.indeterminate = value === 'half';
    // 设置选中
    this.checked = value === true;

    // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
    if (this.store.checkBoxStrictly) {
      return;
    }

    // 没有加载数据
    if (!this.shouldLoadData()) {
      // 获取子节点状态
      const { all, allWithoutDisable } = getChildState(this.childNodes);

      // 不是叶子节点 && 没有选中全部 && 全部禁用
      if (!this.isLeaf && !all && allWithoutDisable) {
        this.checked = false;
        value = false;
      }

      // 深度遍历处理所有子节点
      const handDeepChildNodes = (): void => {
        //  深度遍历
        if (deep) {
          const childNodes = this.childNodes;
          for (let i = 0; i < childNodes.length; i++) {
            const child = childNodes[i];

            // 是否有外部传入值
            passValue = passValue || value !== false;

            // 设置选中
            const isCheck = child.disabled ? child.checked : passValue;

            // 设置子节点选中状态
            child.setChecked(isCheck, deep, true, passValue);
          }

          const { half, all } = getChildState(childNodes);

          // 没有选中全部
          if (!all) {
            this.checked = all;
            this.indeterminate = half;
          }
        }
      };

      handDeepChildNodes();
    }

    const parent = this.parent;
    if (!parent || parent.level === 0) return;

    // 递归
    if (!recursion) {
      reInitChecked(parent);
    }
  }

  // 显示加载数据
  shouldLoadData(): boolean {
    return this.store.lazy === true && this.store.load && !this.loaded;
  }

  // 创建子节点
  createChildren(
    array: TreeNodeData[],
    defaultProps: TreeNodeLoadedDefaultProps = {}
  ): void {
    // 插入 children 数据
    array.forEach((item) => {
      this.insertChild(
        Object.assign({ data: item }, defaultProps),
        undefined,
        true
      );
    });
  }

  // 加载数据
  loadData(
    callback: (node: Node) => void,
    defaultProps: TreeNodeLoadedDefaultProps = {}
  ) {
    if (
      // 是懒加载节点
      this.store.lazy === true &&
      // 有加载方法
      this.store.load &&
      // 没有加载完成
      !this.loaded &&
      // 没有加载中
      (!this.loading || Object.keys(defaultProps).length)
    ) {
      // 加载中
      this.loading = true;
    }
  }
}

export default Node;
