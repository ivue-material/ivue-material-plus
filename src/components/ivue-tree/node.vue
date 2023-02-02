<template>
  <div
    tabindex="-1"
    role="treeItem"
    :class="wrapperClasses"
    :data-key="getTreeNodeKey(node)"
    :draggable="tree.props.draggable"
    @click.stop="handleNodeClick"
    v-show="node.visible"
    @dragstart.stop="handleDragStart"
    @dragover.stop.prevent="handleDragOver"
    @dragend.stop.prevent="handleDragEnd"
    @drop.stop.prevent
    ref="nodeRef"
  >
    <!-- 标题 -->
    <div :class="`${prefixCls}--content`" :style="contentStyles">
      <!-- icon -->
      <ivue-icon
        :class="iconClasses"
        @click.stop="handleExpandIconClick"
        v-if="tree.props.icon && !node.loading"
      >
        <component
          :is="tree.props.icon"
          v-if="!isString(tree.props.icon)"
        ></component>
        <template v-if="isString(tree.props.icon)">
          {{ tree.props.icon }}
        </template>
      </ivue-icon>
      <!-- loading -->
      <loading v-if="node.loading"></loading>
      <!-- checkbox -->
      <ivue-checkbox
        :class="`${prefixCls}--checkbox`"
        :model-value="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.stop
        @change="handleCheckChange"
        v-if="showCheckbox"
      ></ivue-checkbox>

      <!-- text -->
      <node-content :node="node" :render-content="renderContent" />
    </div>
    <!-- 子节点 -->
    <collapse-transition>
      <div
        :class="`${prefixCls}--children`"
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
      >
        <ivue-tree-node
          v-for="child in node.childNodes"
          :node="child"
          :accordion="accordion"
          :show-checkbox="showCheckbox"
          :render-after-expand="renderAfterExpand"
          :key="getTreeNodeKey(child)"
          :render-content="renderContent"
          :props="props"
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
  PropType,
} from 'vue';
import { getNodeKey, handleCurrentChange } from './utils';
import { isString, isFunction } from '@vue/shared';
import CollapseTransition from '../../utils/collapse-transition';
import { useNodeExpandEventBroadcast } from './hooks/useNodeExpandEventBroadcast';
import { dragEventsKey } from './hooks/useDragNode';
import { debugWarn } from '../../utils/error';

// components
import IvueIcon from '../ivue-icon/index.vue';
import IvueCheckbox from '../ivue-checkbox/index.vue';
import NodeContent from './node-content.vue';
import Loading from './loading.vue';

// type
import type { Props } from './types/node';
import type { TreeOptionProps } from './types/tree';

import Node from './store/node';
import { TreeContextKey, TreeNodeData } from './types/tree';
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
     * 是否在第一次展开某个树节点后才渲染其子节点
     *
     * @type {Boolean}
     */
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
    /**
     * 配置项
     *
     * @type {Object}
     */
    props: {
      type: Object as PropType<TreeOptionProps>,
      default: () => ({}),
    },
  },
  setup(props: Props, { emit }) {
    // vm
    const instance = getCurrentInstance();

    // 根树节点数据
    const tree = inject(TreeContextKey);
    // 拖动事件
    const dragEvents = inject(dragEventsKey);

    // dom
    const nodeRef = ref<HTMLElement>(null);

    // data

    // 展开子节点
    const expanded = ref<boolean>(false);
    // 子节点是否可以渲染
    const childNodeRendered = ref<boolean>(false);
    // 上一个选中状态
    const oldChecked = ref<boolean>(null);
    // 上一个不确定选中状态
    const oldIndeterminate = ref<boolean>(null);

    // 派发事件到所有子节点是否关闭展开
    const { broadcastExpanded } = useNodeExpandEventBroadcast(props);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        prefixCls,
        {
          ['is-expanded']: expanded.value,
          ['is-current']: props.node.isCurrent,
          ['is-focusable']: !props.node.disabled,
          ['is-checked']: !props.node.disabled && props.node.checked,
        },
        getNodeClass(props.node),
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

    // 初始化数据
    const initData = () => {
      // 有展开
      if (props.node.expanded) {
        expanded.value = true;

        // 子节点是否可以渲染
        childNodeRendered.value = true;
      }
    };

    // 获取节点key
    const getTreeNodeKey = (node: Node) => {
      return getNodeKey(tree.props.nodeKey, node.data);
    };

    // 获取节点class
    const getNodeClass = (node: Node) => {
      const nodeClassFunc = props.props.class;

      if (!nodeClassFunc) {
        return {};
      }

      let className;

      // 方法
      if (isFunction(nodeClassFunc)) {
        const { data } = node;
        className = nodeClassFunc(data, node);
      }
      // 其他类型
      else {
        className = nodeClassFunc;
      }

      // 字符串
      if (isString(className)) {
        return {
          [className]: true,
        };
      }
      // 对象
      else {
        return className;
      }
    };

    // 点击子节点
    const handleNodeClick = (event: MouseEvent) => {
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

      // 是否在点击节点的时候选中节点
      if (tree.props.checkOnClickNode && !props.node.disabled) {
        handleCheckChange({
          target: { checked: !props.node.checked },
        });
      }

      // 当节点被点击的时候触发
      tree.ctx.emit(
        'on-node-click',
        // 点击节点的数据对象
        props.node.data,
        // 节点对应的 Node
        props.node,
        // 节点组件本身
        instance,
        // event
        event
      );
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
          // 传递给 data 属性的数组中该节点所对应的对象
          props.node.data,
          // 节点对应的 Node
          props.node,
          // 节点组件本身
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
        emit(
          'on-node-expand',
          // 传递给 data 属性的数组中该节点所对应的对象
          props.node.data,
          // 节点对应的 Node
          props.node,
          // 节点组件本身
          instance
        );
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
      tree.ctx.emit(
        'on-node-expand',
        // 传递给 data 属性的数组中该节点所对应的对象
        nodeData,
        // 节点对应的 Node
        node,
        // 节点组件本身
        instance
      );
    };

    // 点击多选
    const handleCheckChange = (event) => {
      props.node.setChecked(event.target.checked, !tree.props.checkBoxStrictly);

      nextTick(() => {
        const store = tree.store.value;

        // 点击节点复选框之后触发
        tree.ctx.emit('on-check', props.node.data, {
          // 获取选中的节点
          checkedNodes: store.getCheckedNodes(),
          // 获取选中节点的key
          checkedKeys: store.getCheckedKeys(),
          // 获取半选中节点
          halfCheckedNodes: store.getHalfCheckedNodes(),
          // 获取半选中节点key
          halfCheckedKeys: store.getHalfCheckedKeys(),
        });
      });
    };

    // 多选改变
    const handleSelectChange = (checked: boolean, indeterminate: boolean) => {
      if (
        oldChecked.value !== checked ||
        oldIndeterminate.value !== indeterminate
      ) {
        // 当复选框被点击的时候触发
        tree.ctx.emit(
          'on-check-change',
          // 传递给 data 属性的数组中该节点所对应的对象
          props.node.data,
          // 节点本身是否被选中
          checked,
          // 节点的子树中是否有半选中状态
          indeterminate
        );
      }

      oldChecked.value = checked;
      oldIndeterminate.value = indeterminate;
    };

    // 开始拖动
    const handleDragStart = (event: DragEvent) => {
      if (!tree.props.draggable) {
        return;
      }

      dragEvents.treeNodeDragStart({ event, treeNode: props });
    };

    // 拖动到目标
    const handleDragOver = (event: DragEvent) => {
      if (!tree.props.draggable) {
        return;
      }

      dragEvents.treeNodeDragOver({
        event,
        treeNode: {
          $el: nodeRef.value,
          node: props.node,
        },
      });
    };

    // 拖动结束
    const handleDragEnd = (event: DragEvent) => {
      if (!tree.props.draggable) {
        return;
      }

      dragEvents.treeNodeDragEnd(event);
    };

    // watch

    // 监听展开子节点
    watch(
      () => props.node.expanded,
      (value) => {
        nextTick(() => {
          expanded.value = value;
        });

        // 子节点是否可以渲染
        if (value) {
          childNodeRendered.value = true;
        }
      }
    );

    // 监听多选
    watch(
      () => props.node.checked,
      (value) => {
        handleSelectChange(value, props.node.indeterminate);
      }
    );

    // 监听多选半选中状态
    watch(
      () => props.node.indeterminate,
      (value) => {
        handleSelectChange(props.node.checked, value);
      }
    );

    // 监听子节点数据变化
    const childrenKey = tree.props['children'] || 'children';
    watch(
      () => {
        const children = props.node.data[childrenKey];

        return children && [...children];
      },
      () => {
        // 更新子节点
        props.node.updateChildren();
      }
    );

    // provide
    provide(TreeNodeContextKey, instance);

    // 初始化数据
    initData();

    // 没有树节点
    if (!tree) {
      debugWarn('Ivue Tree', 'Can not find node\'s tree.');
    }

    return {
      prefixCls,

      // inject
      tree,

      // dom
      nodeRef,

      // data
      expanded,
      childNodeRendered,

      // computed
      wrapperClasses,
      contentStyles,
      iconClasses,

      // methods
      isString,
      getTreeNodeKey,
      handleNodeClick,
      handleChildNodeExpand,
      handleCheckChange,
      handleExpandIconClick,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
    };
  },
  components: {
    IvueIcon,
    IvueCheckbox,
    NodeContent,
    CollapseTransition,
    Loading,
  },
});
</script>
