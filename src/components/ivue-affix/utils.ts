import type { BindElement } from './types/affix';

/**
 * 获取目标节点的元素大小及其相对于视口的位置的信息 top和bottom
 *
 * @param target 当前节点
 * @returns {DOMRect}
 */
export function getTargetRect(target: BindElement): DOMRect {
  // 是否是window节点
  return target !== window
    ? // 不是则使用 getBoundingClientRect
      (target as HTMLElement).getBoundingClientRect()
    : // 否者自定义对象
      ({ top: 0, bottom: window.innerHeight } as DOMRect);
}

/**
 * 获取固定到顶部的位置
 *
 * @param placeholderReact 占位节点
 * @param targetRect 目标节点
 * @param offsetTop 固定位置
 * @returns
 */
export function getFixedTop(
  placeholderReact: DOMRect,
  targetRect: DOMRect,
  offsetTop?: number
): number | undefined {
  // 目标节点 top > 占位节点 top - 固定位置
  if (
    offsetTop !== undefined &&
    targetRect.top > placeholderReact.top - offsetTop
  ) {
    // 距离窗口顶部达到指定偏移量后触发 + 目标元素 top
    return offsetTop + targetRect.top;
  }

  return undefined;
}

/**
 * 获取固定到底部的位置
 *
 * @param placeholderReact 占位节点
 * @param targetRect 目标节点
 * @param offsetBottom 固定位置
 * @returns
 */
export function getFixedBottom(
  placeholderReact: DOMRect,
  targetRect: DOMRect,
  offsetBottom?: number
): number | undefined {
  // 目标节点 bottom < 占位节点 bottom + 固定位置
  if (
    offsetBottom !== undefined &&
    targetRect.bottom < placeholderReact.bottom + offsetBottom
  ) {
    // innerHeight - 目标元素 bottom
    const targetBottomOffset = window.innerHeight - targetRect.bottom;

    // 距离窗口底部达到指定偏移量后触发 + targetBottomOffset
    return offsetBottom + targetBottomOffset;
  }

  return undefined;
}

// 获取默认目标节点
export function getDefaultTarget(): Window | null {
  return typeof window !== 'undefined' ? window : null;
}
