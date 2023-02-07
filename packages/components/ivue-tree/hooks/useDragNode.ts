import { provide, reactive } from 'vue';
import { removeClass, addClass } from '../../../utils/assist';
import { NODE_KEY } from '../utils';

// type
import type { InjectionKey } from 'vue';
import type Node from '../store/node';
import type { NodeDropType } from '../types/tree';

interface TreeNode {
  node: Node;
  $el?: HTMLElement;
}

interface DragOptions {
  event: DragEvent;
  treeNode: TreeNode;
}

// 拖动方法
export interface DragEvents {
  treeNodeDragStart: (options: DragOptions) => void;
  treeNodeDragOver: (options: DragOptions) => void;
  treeNodeDragEnd: (event: DragEvent) => void;
}

// 拖动元素key
export const dragEventsKey: InjectionKey<DragEvents> =
  Symbol('IvueTreeDragEvents');

// 拖动方法
export function useDragNodeHandler({
  props,
  ctx,
  treeRef,
  dropIndicator,
  store,
}) {
  // 拖动状态
  const dragState = reactive({
    showDropIndicator: false,
    draggingStartNode: null,
    dropNode: null,
    allowDrop: true,
    dropType: null,
  });

  // 节点开始拖动
  const treeNodeDragStart = ({ event, treeNode }: DragOptions) => {
    // 判断节点能否被拖拽
    if (
      typeof props.allowDrag === 'function' &&
      !props.allowDrag(treeNode.node)
    ) {
      event.preventDefault();

      return false;
    }

    // 一个项目可能会被移动到一个新的位置
    event.dataTransfer.effectAllowed = 'move';

    // 当第一个参数是 'text/plain' 时，包装在 try catch 中以解决 IE 的错误
    try {
      // setData is required for draggable to work in FireFox
      // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
      event.dataTransfer.setData('text/plain', '');
    } catch {
      /* empty */
    }

    // 开始拖动的节点
    dragState.draggingStartNode = treeNode;

    // 节点开始拖拽时触发的事件
    ctx.emit(
      'on-node-drag-start',
      // 被拖拽节点对应的 Node
      treeNode.node,
      event
    );
  };

  // 拖动到目标
  const treeNodeDragOver = ({ event, treeNode }: DragOptions) => {
    // 拖动到目标的元素
    const dropNode = treeNode;

    // 上一个拖动到目标的元素
    const oldDropNode = dragState.dropNode;

    // 上一个拖动到目标的元素 !== 拖动到目标的元素 删除拖动下划线
    if (oldDropNode && oldDropNode !== dropNode) {
      removeClass(oldDropNode.$el, 'ivue-tree-drop-indicator');
    }

    // 开始拖动的节点
    const draggingStartNode = dragState.draggingStartNode;

    // 没有开始拖动的节点 || 没有拖动到目标的元素
    if (!draggingStartNode || !dropNode) {
      return;
    }

    // 放置在目标节点前
    let dropPrev = true;
    // 插入至目标节点
    let dropInner = true;
    // 放置在目标节点后
    let dropNext = true;
    // 是否可以放置在元素内
    let userAllowDropInner = true;

    // 拖拽时判定目标节点能否成为拖动目标位置
    if (typeof props.allowDrop === 'function') {
      dropPrev = props.allowDrop(draggingStartNode.node, dropNode.node, 'prev');

      // 插入至目标节点
      dropInner = props.allowDrop(
        draggingStartNode.node,
        dropNode.node,
        'inner'
      );

      userAllowDropInner = dropInner;

      // 放置在目标节点后
      dropNext = props.allowDrop(draggingStartNode.node, dropNode.node, 'next');
    }

    // 设置在拖放操作
    event.dataTransfer.dropEffect =
      dropInner || dropPrev || dropNext ? 'move' : 'none';

    // 可以拖动  && 上一个拖动到目标的元素 !== 拖动到目标的元素
    if ((dropInner || dropPrev || dropNext) && oldDropNode !== dropNode) {
      // 上一个拖动到目标的元素
      if (
        oldDropNode &&
        oldDropNode.node.data[NODE_KEY] !== dropNode.node.data[NODE_KEY]
      ) {
        // 拖拽离开某个节点时触发的事件
        ctx.emit(
          'on-node-drag-leave',
          // 被拖拽节点对应的 Node
          draggingStartNode.node,
          // 所离开节点对应的 Node
          oldDropNode.node,
          event
        );
      }

      // 拖拽进入其他节点时触发的事件
      ctx.emit(
        'on-node-drag-enter',
        // 被拖拽节点对应的 Node
        draggingStartNode.node,
        // 当前进入节点对应的 Node
        dropNode.node,
        event
      );
    }

    // 是否可以拖动到目标元素
    if (dropPrev || dropInner || dropNext) {
      // 拖动到目标的元素
      dragState.dropNode = dropNode;
    }

    // 下一个兄弟节点 === 开始拖动的节点 不能放置在目标节点后
    if (dropNode.node.nextSibling === draggingStartNode.node) {
      dropNext = false;
    }

    // 上一个兄弟节点 === 开始拖动的节点 不能放置在目标节点前
    if (dropNode.node.prevSibling === draggingStartNode.node) {
      dropPrev = false;
    }

    // 拖动到目标的元素是否包含开始拖动的节点 不能放置在目标节点前
    if (dropNode.node.contains(draggingStartNode.node, false)) {
      dropInner = false;
    }

    if (
      // 拖动开始节点 === 拖动到目标的元素
      draggingStartNode.node === dropNode.node ||
      // 拖动开始的节点包含拖动到目标的元素
      draggingStartNode.node.contains(dropNode.node)
    ) {
      // 重置数据
      dropPrev = false;
      dropInner = false;
      dropNext = false;
    }

    // 当前目标元素位置
    const targetPosition = dropNode.$el.getBoundingClientRect();
    // tree位置
    const treePosition = treeRef.value.getBoundingClientRect();

    // 节点拖动类型
    let dropType: NodeDropType;

    // 放置在元素上面百分比差值
    const prevPercent = dropPrev
      ? dropInner
        ? 0.25
        : dropNext
        ? 0.45
        : 1
      : -1;

    // 放置在元素下面百分比差值
    const nextPercent = dropNext ? (dropInner ? 0.75 : dropPrev ? 0.55 : 0) : 1;

    let indicatorTop = -9999;

    // 拖动到目标的元素与拖动到目标节点
    const distance = event.clientY - targetPosition.top;

    // 插入到 拖动到目标的元素 前面
    if (distance < targetPosition.height * prevPercent) {
      dropType = 'before';
    }
    // 插入到 拖动到目标的元素 后面
    else if (distance > targetPosition.height * nextPercent) {
      dropType = 'after';
    }
    // 插入到 拖动到目标的元素 中间
    else if (dropInner) {
      dropType = 'inner';
    } else {
      dropType = 'none';
    }

    // 展开图标位置
    const iconPosition = dropNode.$el
      .querySelector('.ivue-tree-node--expand-icon')
      .getBoundingClientRect();

    // 下划线
    const _dropIndicator = dropIndicator.value;

    // 设置下划线位置
    if (dropType === 'before') {
      indicatorTop = iconPosition.top - treePosition.top;
    } else if (dropType === 'after') {
      indicatorTop = iconPosition.bottom - treePosition.top;
    }

    _dropIndicator.style.top = `${indicatorTop}px`;
    _dropIndicator.style.left = `${iconPosition.right - treePosition.left}px`;

    // 如果是插入到中间添加样式
    if (dropType === 'inner') {
      addClass(dropNode.$el, 'is-drop-inner');
    }
    // 移除中间样式
    else {
      removeClass(dropNode.$el, 'is-drop-inner');
      oldDropNode && removeClass(oldDropNode.$el, 'is-drop-inner');
    }

    // 是否显示拖动下划线
    dragState.showDropIndicator = dropType === 'before' || dropType === 'after';

    // 拖拽时判定目标节点能否成为拖动目标位置
    dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner;

    // 节点拖动类型
    dragState.dropType = dropType;

    // 在拖拽节点时触发的事件
    ctx.emit(
      'on-node-drag-over',
      // 被拖拽节点对应的 Node
      draggingStartNode.node,
      // 当前进入节点对应的 Node
      dropNode.node,
      event
    );
  };

  // 拖动结束
  const treeNodeDragEnd = (event: DragEvent) => {
    const { draggingStartNode, dropNode, dropType } = dragState;

    // 设置在拖放操作
    event.dataTransfer.dropEffect = 'move';

    // 有开始拖动节点 && 有拖动到目标节点
    if (draggingStartNode && dropNode) {
      const draggingStartNodeCopy = { data: draggingStartNode.node.data };

      // 删除节点
      if (dropType !== 'none') {
        draggingStartNode.node.remove();
      }

      // 插入到节点前面
      if (dropType === 'before') {
        dropNode.node.parent.insertBefore(draggingStartNodeCopy, dropNode.node);
      }
      // 插入到节点后面
      else if (dropType === 'after') {
        dropNode.node.parent.insertAfter(draggingStartNodeCopy, dropNode.node);
      }
      // 插入到节点中间
      else if (dropType === 'inner') {
        dropNode.node.insertChild(draggingStartNodeCopy);
      }

      // 注册节点
      if (dropType !== 'none') {
        store.value.registerNode(draggingStartNodeCopy);
      }

      // 删除拖动下划线样式
      removeClass(dropNode.$el, 'is-drop-inner');

      // 拖拽结束时触发的事件
      ctx.emit(
        'on-node-drag-end',
        // 被拖拽节点对应的 Node
        draggingStartNode.node,
        // 结束拖拽时最后进入的节点
        dropNode.node,
        // 被拖拽节点的放置位置
        dropType,
        event
      );

      // 拖拽成功完成时触发的事件
      if (dropType !== 'none') {
        ctx.emit(
          'on-node-drop',
          // 被拖拽节点对应的 Node
          draggingStartNode.node,
          // 结束拖拽时最后进入的节点
          dropNode.node,
          // 被拖拽节点的放置位置
          dropType,
          event
        );
      }
    }

    // 拖拽结束时未成功触发的事件
    if (draggingStartNode && !dropNode) {
      ctx.emit(
        'on-node-drag-end',
        draggingStartNode.node,
        null,
        dropType,
        event
      );
    }

    // 初始化数据
    dragState.showDropIndicator = false;
    dragState.draggingStartNode = null;
    dragState.dropNode = null;
    dragState.allowDrop = true;
  };

  // provide
  provide(dragEventsKey, {
    treeNodeDragStart,
    treeNodeDragOver,
    treeNodeDragEnd,
  });

  return {
    dragState,
  };
}
