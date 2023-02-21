import { CSSProperties, computed, ref } from 'vue';
import { isDef, isNumeric } from './validate';
export { isFunction } from 'lodash';

// 设置随机字符串
export const getRandomStr = (len = 32) => {
  const $chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const length = $chars.length;

  let str = '';

  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * length));
  }

  return str;
};

export function addUnit(value?: string | number): string | undefined {
  if (!isDef(value)) {
    return undefined;
  }

  return isNumeric(value) ? `${value}px` : String(value);
}

// 获取大小样式
export function getSizeStyle(
  originSize?: string | number
): CSSProperties | undefined {
  if (isDef(originSize)) {
    const size = addUnit(originSize);
    return {
      width: size,
      height: size,
    };
  }
}

// 创建数组范围
export function createRange(length: number) {
  return Array.from({ length }, (v, k) => k);
}

// 是否是颜色
export function isCssColor(color: string) {
  return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
}

// 设置文字颜色
export function setTextColor(color: string | string[]) {
  let style: {
    color?: string;
  } = {};

  // 是否是数组
  if (Array.isArray(color)) {
    style = {
      color: `${color[0]}`,
    };
  } else if (isCssColor(color)) {
    style = {
      color: `${color}`,
    };
  } else if (color) {
    const [colorName] = color.toString().trim().split(' ', 2);

    style = {
      color: `${colorName}--text`,
    };
  }

  return style;
}

// 是否是纯数字
export function isValueNumber(value: string | number) {
  return /^[0-9][0-9]*$/.test(value + '');
}

// 已经获取滚动条宽度
let cached: number;

// 获取滚动条宽度
export function getScrollBarSize(fresh?: boolean) {
  if (!isClient) {
    return 0;
  }

  if (fresh || cached === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');

    const outerStyle: CSSStyleDeclaration = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = '0px';
    outerStyle.left = '0px';
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);

    document.body.appendChild(outer);

    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }

    document.body.removeChild(outer);

    cached = widthContained - widthScroll;
  }

  return cached;
}

const zIndex = ref(0);

// 创建zindex
export const useZIndex = () => {
  const currentZIndex = computed(() => 2000 + zIndex.value);

  // 下一个数值
  const nextZIndex = () => {
    zIndex.value++;

    return currentZIndex.value;
  };

  return {
    currentZIndex,
    nextZIndex,
  };
};

// 是否是客户端
export const isClient = typeof window !== 'undefined';

// 是否是Element
export const isElement = (el: HTMLElement) => {
  return typeof HTMLElement === 'object' && el instanceof HTMLElement;
};

// requestAnimationFrame
export function raf(fn: FrameRequestCallback): number {
  return isClient ? requestAnimationFrame(fn) : -1;
}

// cancelAnimationFrame
export function cancelRaf(id: number) {
  if (isClient) {
    cancelAnimationFrame(id);
  }
}

// double raf for animation
export function doubleRaf(fn: FrameRequestCallback): void {
  raf(() => raf(fn));
}

// 是否是undefined
export const isUndefined = (val: any): val is undefined => val === undefined;

// Find components upward
export function findComponentsUpward(context: any, componentName: string): any {
  const parents = [];
  const parent = context.$parent;

  if (parent) {
    // 找到当前组件名称
    if (parent.$options.name === componentName) {
      parents.push(parent);
    }

    // 拼接数组
    return parents.concat(findComponentsUpward(parent, componentName));
  } else {
    return [];
  }
}

// Find components upward
export function findComponentUpward(context: any, componentName: string) {
  let componentNames: string | string[];
  // 当前组件名称
  if (typeof componentName === 'string') {
    componentNames = [componentName];
  } else {
    componentNames = componentName;
  }

  let parent = context.$parent;
  let name = parent.$options.name;

  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.name;
    }
  }

  return parent;
}
