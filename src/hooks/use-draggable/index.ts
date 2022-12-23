
/* eslint-disable */

import { watchEffect, onBeforeUnmount, } from 'vue';
import { on, off } from '../../utils/dom';

// ts
import type { Ref, ComputedRef } from 'vue';

export const useDraggable = (
  targetRef: Ref<HTMLElement | undefined>,
  dragRef: Ref<HTMLElement | undefined>,
  dragData: Record<string, any>,
  draggable: ComputedRef<boolean>,
  options: {
    sticky: boolean
    stickyDistance: number
  }
) => {

  // 拖动开始
  const handleMoveStart = (event: MouseEvent) => {
    if (!draggable.value) {
      return false;
    }

    const rect = targetRef.value.getBoundingClientRect();

    dragData.rect = rect;

    // 初始位置
    dragData.x = rect.x || rect.left;
    dragData.y = rect.y || rect.top;


    // 当前点击在屏幕中的位置
    const distance = {
      x: event.clientX,
      y: event.clientY,
    };


    dragData.dragX = distance.x;
    dragData.dragY = distance.y;

    // 开始拖动
    dragData.dragging = true;

    on(window, 'mousemove', handleMoveMove);
    on(window, 'mouseup', handleMoveEnd);
  };

  // 拖动中
  const handleMoveMove = (event: MouseEvent) => {
    if (!draggable.value) {
      return false;
    }

    // 当前鼠标在屏幕中的位置
    const distance = {
      x: event.clientX,
      y: event.clientY,
    };

    // 上一个拖动值 和 拖动中的差值
    const diffDistance = {
      x: distance.x - dragData.dragX,
      y: distance.y - dragData.dragY,
    }

    // 拖拽时，是否吸附屏幕边缘
    if (options.sticky) {
      // 视口宽度
      const clientWidth = document.documentElement.clientWidth;
      // 视口高度
      const clientHeight = document.documentElement.clientHeight;

      // 左边吸附
      // 上一个拖动值 + 差值 <= 自动吸附屏幕边缘的临界距离 && diffDistance
      if (dragData.x + diffDistance.x <= options.stickyDistance && diffDistance.x < 0) {
        dragData.x = 0;
      }
      // 右边吸附
      // 上一个拖动值 + dom的宽度 - 视口宽度
      else if (
        dragData.x + dragData.rect.width - clientWidth > -options.stickyDistance
        && diffDistance.x > 0
      ) {
        // 拖动的位置 = 视口宽度 - dom的宽度
        dragData.x = clientWidth - dragData.rect.width
      }
      else {
        dragData.x += diffDistance.x;
      }

      // 顶部边吸附
      // 上一个拖动值 + 差值 <= 自动吸附屏幕边缘的临界距离 && diffDistance
      if (dragData.y + diffDistance.y <= options.stickyDistance && diffDistance.y < 0) {
        dragData.y = 0;
      }
      // 底部边吸附
      // 上一个拖动值 + dom的高度 - 视口宽度
      else if (
        dragData.y + dragData.rect.height - clientHeight > -options.stickyDistance
        && diffDistance.y > 0
      ) {
        // 拖动的位置 = 视口高度 - dom的高度
        dragData.y = clientHeight - dragData.rect.height
      }
      else {
        dragData.y += diffDistance.y;
      }

    }
    // 普通移动
    else {
      dragData.x += diffDistance.x;
      dragData.y += diffDistance.y;
    }


    // 拖动位置
    dragData.dragX = distance.x;
    dragData.dragY = distance.y;
  }

  // 拖动结束
  const handleMoveEnd = () => {
    // 拖动结束
    dragData.dragging = false;

    off(window, 'mousemove', handleMoveMove);
    off(window, 'mouseup', handleMoveEnd);
  }

  // 注册拖动
  const onDraggable = () => {
    if (dragRef.value) {
      dragRef.value.addEventListener('mousedown', handleMoveStart);
    }
  };

  // 销毁拖动
  const offDraggable = () => {
    if (dragRef.value) {
      dragRef.value.removeEventListener('mousedown', handleMoveStart);
    }
  };

  watchEffect(() => {
    onDraggable();
  });

  // 销毁
  onBeforeUnmount(() => {
    offDraggable();
  });
};
