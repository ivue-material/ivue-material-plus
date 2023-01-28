<template>
  <div :class="wrapperClasses">
    <!-- 节点 -->
    <tree-node
      v-for="child in root.childNodes"
      :node="child"
      :accordion="accordion"
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
} from 'vue';
import TreeStore from './store/tree-store';
import { getNodeKey } from './utils';
import { useNodeExpandEventBroadcast } from './hooks/useNodeExpandEventBroadcast';

import TreeNode from './node.vue';

// type
import type Node from './store/node';
import type { Props, TreeNodeData } from './types/tree';
import { TreeContextKey, IconPropType } from './types/tree';

const prefixCls = 'ivue-tree';

export default defineComponent({
  name: prefixCls,
  emits: ['on-current-change', 'on-node-collapse', 'on-node-expand'],
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
      type: Object,
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
      type: Function,
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
  },
  setup(props: Props, ctx) {
    // 派发事件到所有子节点是否关闭展开
    const { broadcastExpanded } = useNodeExpandEventBroadcast(props);

    // data

    // tree 存储
    const store = ref<TreeStore>(
      new TreeStore({
        data: props.data,
        lazy: props.lazy,
        props: props.props,
      })
    );

    // 初始化
    store.value.initialize();

    // 根节点数据
    const root = ref<Node>(store.value.root);
    // 当前节点
    const currentNode = ref<Node>(null);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [prefixCls];
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
      ctx.emit('on-node-expand', nodeData, node, instance);
    };

    // provide
    provide(TreeContextKey, {
      props,
      ctx,
      store,
      currentNode,
    });

    return {
      prefixCls,

      // data
      root,

      // computed
      wrapperClasses,
      isEmpty,

      // methods
      getTreeNodeKey,
      handleNodeExpand,
    };
  },
  components: {
    TreeNode,
  },
});
</script>
