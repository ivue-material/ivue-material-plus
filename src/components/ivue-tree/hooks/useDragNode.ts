import { ref, provide } from 'vue';

// type
import type { InjectionKey } from 'vue';
import type Node from '../store/node';

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
  // treeNodeDragEnd: (event: DragEvent) => void;
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
  const dragState = ref({
    showDropIndicator: false,
    draggingNode: null,
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

    // 当前拖动节点
    dragState.value.draggingNode = treeNode;

    // 节点开始拖拽时触发的事件
    ctx.emit('on-node-drag-start', treeNode.node, event);
  };

  // 拖动到目标
  const treeNodeDragOver = ({ event, treeNode }: DragOptions) => {
    // 拖动到目标的元素
    const dropNode = treeNode;

    // 上一个拖动到目标的元素
    const oldDropNode = dragState.value.dropNode;
  };

  // provide
  provide(dragEventsKey, {
    treeNodeDragStart,
    treeNodeDragOver,
  });
}
