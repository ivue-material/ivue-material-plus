<template>
  <div :class="wrapperClasses" ref="treeRef">
    <!-- 节点 -->
    <tree-node
      v-for="child in root.childNodes"
      :node="child"
      :accordion="accordion"
      :show-checkbox="showCheckbox"
      :render-after-expand="renderAfterExpand"
      :render-content="renderContent"
      :props="props"
      :key="getTreeNodeKey(child)"
      @on-node-expand="handleNodeExpand"
    ></tree-node>
    <!-- 没有数据 -->
    <div :class="`${prefixCls}-no-data`" v-if="isEmpty">
      {{ emptyText }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  provide,
  ComponentInternalInstance,
  PropType,
  watch,
} from 'vue';
import TreeStore from './store/tree-store';
import { getNodeKey } from './utils';
import { useNodeExpandEventBroadcast } from './hooks/useNodeExpandEventBroadcast';
import { useKeydown } from './hooks/useKeydown';
import { useDragNodeHandler } from './hooks/useDragNode';

import TreeNode from './node.vue';

// type
import type Node from './store/node';
import type { Props, TreeNodeData, TreeKey, TreeData } from './types/tree';
import { TreeContextKey, IconPropType } from './types/tree';

const prefixCls = 'ivue-tree';

export default defineComponent({
  name: prefixCls,
  emits: [
    'on-current-change',
    'on-node-collapse',
    'on-node-expand',
    'on-node-click',
    'on-check',
    'on-check-change',
    'on-node-drag-start',
  ],
  props: {
    /**
     * tree数据
     *
     * @type {Array}
     */
    data: {
      type: Array,
      default: () => [],
    },
    /**
     * 是否懒加载子节点，需与 load 方法结合使用
     *
     * @type {Boolean}
     */
    lazy: {
      type: Boolean,
      default: false,
    },
    /**
     * tree 配置选项
     *
     * @type {Object}
     */
    props: {
      type: Object as PropType<Props['props']>,
      default: () => ({
        children: 'children',
        label: 'label',
        disabled: 'disabled',
      }),
    },
    /**
     * 暂无数据文案
     *
     * @type {String}
     */
    emptyText: {
      type: String,
      default: '暂无数据',
    },
    /**
     * 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
     *
     * @type {String}
     */
    nodeKey: {
      type: String,
    },
    /**
     * 相邻级节点间的水平缩进，单位为像素
     *
     * @type {Number}
     */
    indent: {
      type: Number,
      default: 18,
    },
    /**
     * 自定义树节点图标组件
     *
     * @type {IconPropType}
     */
    icon: {
      type: IconPropType,
      default: 'arrow_right',
    },
    /**
     * 树节点的内容区的渲染方法
     *
     * @type {Function}
     */
    renderContent: {
      type: Function as PropType<Props['renderContent']>,
    },
    /**
     * 是否在点击节点的时候展开或者收缩节点
     *
     * @type {Boolean}
     */
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否每次只打开一个同级树节点展开
     *
     * @type {Boolean}
     */
    accordion: {
      type: Boolean,
      default: false,
    },
    /**
     * 设置节点是否被选中
     *
     * @type {Boolean}
     */
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    /**
     * 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
     *
     * @type {Boolean}
     */
    checkBoxStrictly: {
      type: Boolean,
      default: false,
    },
    /**
     * 加载子树数据的方法，仅当 lazy 属性为true 时生效
     *
     * @type {Function}
     */
    load: {
      type: Function as PropType<Props['load']>,
    },
    /**
     * 默认勾选的节点的 key 的数组
     *
     * @type {Array}
     */
    defaultCheckedKeys: {
      type: Array as PropType<Props['defaultCheckedKeys']>,
    },
    /**
     * 默认展开的节点的 key 的数组
     *
     * @type {Array}
     */
    defaultExpandedKeys: {
      type: Array as PropType<Props['defaultExpandedKeys']>,
    },
    /**
     * 展开子节点的时候是否自动展开父节点
     *
     * @type {Boolean}
     */
    autoExpandParent: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否默认展开所有节点
     *
     * @type {Boolean}
     */
    defaultExpandAll: {
      type: Boolean,
    },
    /**
     * 是否在第一次展开某个树节点后才渲染其子节点
     *
     * @type {Boolean}
     */
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否高亮当前选中节点
     *
     * @type {Boolean}
     */
    highlightCurrent: {
      type: Boolean,
    },
    /**
     * 当前选中的节点
     *
     * @type {String | Number}
     */
    currentNodeKey: {
      type: [String, Number],
    },
    /**
     * 对树节点进行筛选时执行的方法， 返回 false 则表示这个节点会被隐藏
     *
     * @type {Function}
     */
    filterNodeMethod: {
      type: Function as PropType<Props['filterNodeMethod']>,
    },
    /**
     * 是否在点击节点的时候选中节点
     *
     * @type {Boolean}
     */
    checkOnClickNode: {
      type: Boolean,
    },
    /**
     * 是否开启拖拽节点功能
     *
     * @type {Boolean}
     */
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, ctx) {
    // 派发事件到所有子节点是否关闭展开
    const { broadcastExpanded } = useNodeExpandEventBroadcast(props);

    // data

    // tree 存储
    const store = ref<TreeStore>(
      new TreeStore({
        key: props.nodeKey,
        data: props.data,
        lazy: props.lazy,
        props: props.props,
        checkBoxStrictly: props.checkBoxStrictly,
        load: props.load,
        defaultCheckedKeys: props.defaultCheckedKeys,
        defaultExpandedKeys: props.defaultExpandedKeys,
        autoExpandParent: props.autoExpandParent,
        defaultExpandAll: props.defaultExpandAll,
        filterNodeMethod: props.filterNodeMethod,
      })
    );

    // 初始化
    store.value.initialize();

    // 根节点数据
    const root = ref<Node>(store.value.root);
    // 当前节点
    const currentNode = ref<Node>(null);
    // 跟节点
    const treeRef = ref<HTMLElement>(null);

    // 拖动时显示的线条
    const dropIndicator = ref<HTMLElement>(null);

    // 键盘事件
    useKeydown(treeRef, store);

    // 拖动事件
    useDragNodeHandler({
      props,
      ctx,
      treeRef,
      dropIndicator,
      store,
    });

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}-highlight-current`]: props.highlightCurrent,
        },
      ];
    });

    // 是否没有数据
    const isEmpty = computed(() => {
      const { childNodes } = root.value;

      return (
        !childNodes ||
        childNodes.length === 0 ||
        childNodes.every(({ visible }) => !visible)
      );
    });

    // methods

    // 获取节点key
    const getTreeNodeKey = (node: Node) => {
      return getNodeKey(props.nodeKey, node.data);
    };

    // 节点展开
    const handleNodeExpand = (
      nodeData: TreeNodeData,
      node: Node,
      instance: ComponentInternalInstance
    ) => {
      // 派发展开事件
      broadcastExpanded(node);
      // 节点被展开时触发的事件
      ctx.emit(
        'on-node-expand',
        // 传递给 data 属性的数组中该节点所对应的对象
        nodeData,
        // 节点对应的 Node
        node,
        // 节点组件本身
        instance
      );
    };

    // 返回当前选中节点的数组
    const getCheckedNodes = (
      // 返回当前选中节点的子节点
      leafOnly?: boolean,
      // 返回值包含不确定选中节点数据
      includeHalfChecked?: boolean
    ): TreeNodeData[] => {
      return store.value.getCheckedNodes(leafOnly, includeHalfChecked);
    };

    // 返回当前选中节点 key 的数组
    const getCheckedKeys = (leafOnly?: boolean): TreeKey[] => {
      return store.value.getCheckedKeys(leafOnly);
    };

    // 设置目前勾选的节点，使用此方法必须提前设置 node-key 属性
    const setCheckedNodes = (nodes: Node[], leafOnly?: boolean) => {
      if (!props.nodeKey) {
        throw new Error('[Ivue Tree] nodeKey is required in setCheckedNodes');
      }

      store.value.setCheckedNodes(nodes, leafOnly);
    };

    // 设置目前选中的节点，使用此方法必须设置 node-key 属性
    const setCheckedKeys = (keys, leafOnly?: boolean) => {
      if (!props.nodeKey) {
        throw new Error('[Ivue Tree] nodeKey is required in setCheckedKeys');
      }

      store.value.setCheckedKeys(keys, leafOnly);
    };

    // 为节点设置新数据，只有当设置 node-key 属性的时候才可用
    const updateKeyChildren = (key: TreeKey, data: TreeData) => {
      if (!props.nodeKey) {
        throw new Error('[Ivue Tree] nodeKey is required in updateKeyChild');
      }

      store.value.updateChildren(key, data);
    };

    // 过滤所有树节点，过滤后的节点将被隐藏
    const filter = (value) => {
      if (!props.filterNodeMethod) {
        throw new Error('[Ivue Tree] filterNodeMethod is required when filter');
      }

      store.value.filter(value);
    };

    // watch

    // 监听数据变化
    watch(
      () => props.data,
      (value) => {
        store.value.setData(value);
      },
      {
        deep: true,
      }
    );

    // 监听在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
    watch(
      () => props.checkBoxStrictly,
      (newVal) => {
        store.value.checkBoxStrictly = newVal;
      }
    );

    // 监听当前选中的节点
    watch(
      () => props.currentNodeKey,
      (newVal) => {
        store.value.setCurrentNodeKey(newVal);
      }
    );

    // 监听默认勾选的节点的 key 的数组
    watch(
      () => props.defaultCheckedKeys,
      (newVal) => {
        store.value.setDefaultCheckedKey(newVal);
      }
    );

    // 监听默认展开的节点的 key 的数组
    watch(
      () => props.defaultExpandedKeys,
      (newVal) => {
        store.value.setDefaultExpandedKeys(newVal);
      }
    );

    // provide
    provide(TreeContextKey, {
      props,
      ctx,
      store,
      currentNode,
    });

    return {
      prefixCls,

      // dom
      treeRef,
      dropIndicator,

      // data
      root,

      // computed
      wrapperClasses,
      isEmpty,

      // methods
      handleNodeExpand,
      getTreeNodeKey,
      getCheckedNodes,
      getCheckedKeys,
      setCheckedNodes,
      setCheckedKeys,
      updateKeyChildren,
      filter,
    };
  },
  components: {
    TreeNode,
  },
});
</script>
