<template>
  <div
    :class="wrapperClasses"
    tabindex="-1"
    :data-key="getTreeNodeKey(node)"
    @click.stop="handleNodeClick"
  >
    <!-- 标题 -->
    <div :class="`${prefixCls}--content`" :style="contentStyles">
      <!-- icon -->
      <ivue-icon :class="iconClasses" v-if="tree.props.icon">
        <component
          :is="tree.props.icon"
          v-if="!isString(tree.props.icon)"
        ></component>
        <template v-if="isString(tree.props.icon)">
          {{ tree.props.icon }}
        </template>
      </ivue-icon>
      <!-- text -->
      <node-content :node="node" :render-content="renderContent" />
    </div>
    <!-- 子节点 -->
    <collapse-transition>
      <div
        :class="`${prefixCls}--children`"
        v-if="childNodeRendered"
        v-show="expanded"
      >
        <ivue-tree-node
          v-for="child in node.childNodes"
          :node="child"
          :accordion="accordion"
          :key="getTreeNodeKey(child)"
          @on-node-expand="handleChildNodeExpand"
        ></ivue-tree-node>
      </div>
    </collapse-transition>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  provide,
  getCurrentInstance,
  ref,
  watch,
  nextTick,
  ComponentInternalInstance,
} from 'vue';
import { getNodeKey, handleCurrentChange } from './utils';
import { isString } from '@vue/shared';
import CollapseTransition from '../../utils/collapse-transition';
import { useNodeExpandEventBroadcast } from './hooks/useNodeExpandEventBroadcast';

// components
import IvueIcon from '../ivue-icon/index.vue';
import NodeContent from './node-content.vue';

// type
import Node from './store/node';
import { TreeContextKey, TreeNodeData } from './types/tree';
import type { Props } from './types/node';
import { TreeNodeContextKey } from './types/node';

const prefixCls = 'ivue-tree-node';

export default defineComponent({
  name: prefixCls,
  emits: ['on-node-expand'],
  props: {
    /**
     * tree 节点对象
     *
     * @type {Node}
     */
    node: {
      type: Node,
      default: () => ({}),
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
     * 是否每次只打开一个同级树节点展开
     *
     * @type {Boolean}
     */
    accordion: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, { emit }) {
    // vm
    const instance = getCurrentInstance();

    // 根树节点数据
    const tree = inject(TreeContextKey);

    // data

    // 展开子节点
    const expanded = ref(false);
    // 子节点是否可以渲染
    const childNodeRendered = ref(false);
    // 派发事件到所有子节点是否关闭展开
    const { broadcastExpanded } = useNodeExpandEventBroadcast(props);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        prefixCls,
        {
          ['is-expanded']: expanded.value,
        },
      ];
    });

    // 内容样式
    const contentStyles = computed(() => {
      return {
        paddingLeft: (props.node.level - 1) * tree.props.indent + 'px',
      };
    });

    // icon样式
    const iconClasses = computed(() => {
      return [
        `${prefixCls}--expand-icon`,
        {
          ['expanded']: expanded.value,
          ['is-leaf']: props.node.isLeaf,
        },
      ];
    });

    // methods

    // 获取节点key
    const getTreeNodeKey = (node: Node) => {
      return getNodeKey(tree.props.nodeKey, node.data);
    };

    // 点击子节点
    const handleNodeClick = () => {
      // 设置当前点击的子节点
      handleCurrentChange(tree.store, tree.ctx.emit, () =>
        tree.store.value.setCurrentNode(props.node)
      );

      // 设置当前点击节点
      tree.currentNode.value = props.node;

      // 是否在点击节点的时候展开或者收缩节点
      if (tree.props.expandOnClickNode) {
        handleExpandIconClick();
      }
    };

    // 点击展开图标
    const handleExpandIconClick = () => {
      // 是否是叶子节点
      if (props.node.isLeaf) {
        return;
      }

      // 已经展开
      if (expanded.value) {
        // 节点被关闭时触发的事件
        tree.ctx.emit(
          'on-node-collapse',
          props.node.data,
          props.node,
          instance
        );

        // 关闭节点
        props.node.collapse();
      }
      // 展开
      else {
        // 展开节点
        props.node.expand();

        // 节点被展开时触发的事件
        emit('on-node-expand', props.node.data, props.node, instance);
      }
    };

    // 节点展开
    const handleChildNodeExpand = (
      nodeData: TreeNodeData,
      node: Node,
      instance: ComponentInternalInstance
    ) => {
      // 派发展开事件
      broadcastExpanded(node);
      // 节点被展开时触发的事件
      tree.ctx.emit('on-node-expand', nodeData, node, instance);
    };

    // watch

    // 监听展开子节点
    watch(
      () => props.node.expanded,
      (value) => {
        nextTick(() => {
          expanded.value = value;
        });

        if (value) {
          childNodeRendered.value = true;
        }
      }
    );

    // provide
    provide(TreeNodeContextKey, instance);

    return {
      prefixCls,

      // inject
      tree,

      // data
      expanded,
      childNodeRendered,

      // computed
      wrapperClasses,
      contentStyles,
      iconClasses,

      // methods
      getTreeNodeKey,
      isString,
      handleNodeClick,
      handleChildNodeExpand,
    };
  },
  components: {
    IvueIcon,
    NodeContent,
    CollapseTransition,
  },
});
</script>
