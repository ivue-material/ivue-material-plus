import { CSSProperties, computed, ref } from 'vue';
import { isDef, isNumeric } from './validate';

// 文件上传类型
export type UploaderResultType = 'dataUrl' | 'text' | 'file' | 'url';

export type Interceptor = (...args: any[]) => Promise<boolean> | boolean;

export type UploaderMaxSize = number | string | ((file: File) => boolean);

export type UploaderFileListItem = {
  url?: string;
  file?: File;
  content?: string;
  status?: '' | 'uploading' | 'done' | 'failed';
  message?: string;
  beforeDelete?: Interceptor;
};

// 读取文件内容
export function readFileContent(file: File, resultType: UploaderResultType) {
  return new Promise<string | void>((resolve) => {
    // 文件类型
    if (resultType === 'file') {
      resolve();

      return;
    }

    // url
    if (resultType === 'url') {
      const url = URL.createObjectURL(file);

      resolve(url);

      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      resolve((event.target as FileReader).result as string);
    };

    // base64
    if (resultType === 'dataUrl') {
      reader.readAsDataURL(file);
    }
    // 文本类型
    else if (resultType === 'text') {
      reader.readAsText(file);
    }
  });
}

// 文件是否超出大小
export function isOversize(
  items: UploaderFileListItem | UploaderFileListItem[],
  maxSize: UploaderMaxSize
): boolean {
  return toArray(items).some((item) => {
    if (item.file) {
      if (isFunction(maxSize)) {
        return maxSize(item.file);
      }

      return item.file.size > maxSize;
    }
    return false;
  });
}

// 设置为数组
export function toArray<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item;
  }

  return [item];
}

// 是否是方法
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

// 过滤文件
export function filterFiles(
  items: UploaderFileListItem[],
  maxSize: UploaderMaxSize
) {
  const valid: UploaderFileListItem[] = [];
  const invalid: UploaderFileListItem[] = [];

  items.forEach((item) => {
    if (isOversize(item, maxSize)) {
      invalid.push(item);
    } else {
      valid.push(item);
    }
  });

  return { valid, invalid };
}

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

const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;

export function isImageUrl(url: string): boolean {
  return IMAGE_REGEXP.test(url);
}

// 是图片
export function isImageFile(item): boolean {
  // some special urls cannot be recognized
  // user can add `isImage` flag to mark it as an image url

  if (item.isImage) {
    return true;
  }

  // 文件类型
  if (item.file && item.file.type) {
    return item.file.type.indexOf('image') === 0;
  }

  // 有链接
  if (item.url) {
    return isImageUrl(item.url);
  }

  // base64
  if (typeof item.content === 'string') {
    return item.content.indexOf('data:image') === 0;
  }

  return false;
}

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

export const EVENT_CODE = {
  tab: 'Tab',
  enter: 'Enter',
  space: 'Space',
  left: 'ArrowLeft', // 37
  up: 'ArrowUp', // 38
  right: 'ArrowRight', // 39
  down: 'ArrowDown', // 40
  esc: 'Escape',
  delete: 'Delete',
  backspace: 'Backspace',
};

// 创建数组范围
export function createRange(length) {
  return Array.from({ length }, (v, k) => k);
}

// 是否是颜色
export function isCssColor(color) {
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
export function isValueNumber(value) {
  return /^[0-9][0-9]*$/.test(value + '');
}

// 已经获取滚动条宽度
let cached;

// 获取滚动条宽度
export function getScrollBarSize(fresh?) {
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

// 是否是对象
export const isObject = (obj: unknown): boolean => {
  return obj !== null && typeof obj === 'object';
};

// 是否是Element
export const isElement = (el: HTMLElement) => {
  return typeof HTMLElement === 'object' && el instanceof HTMLElement;
};

// 下载文件
export async function downloadFile(url, name = '') {
  if (!isClient) {
    return Promise.reject();
  }

  try {
    const res = await fetch(url);
    const blob = await res.blob();

    const split = res.url.split('/');
    // 文件名称
    const fileName = split[split.length - 1];

    if (!blob) {
      return Promise.reject();
    }

    const localUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', localUrl);
    a.setAttribute('download', name || fileName);
    a.click();

    URL.revokeObjectURL(localUrl);

    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

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
export function findComponentsUpward(context, componentName) {
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
export function findComponentUpward(context, componentName, componentNames?) {
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
