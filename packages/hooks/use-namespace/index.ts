// type
type BEM = {
  block?: string;
  blockSuffix?: string;
  element?: string;
  modifier?: string;
};

const statePrefix = 'is-';

// BEM
const _bem = ({ block, blockSuffix, element, modifier }: BEM) => {
  let cls = `${block}`;

  // 块元素
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }

  // 子元素
  if (element) {
    cls += `__${element}`;
  }

  // 修饰符或者状态
  if (modifier) {
    cls += `--${modifier}`;
  }

  return cls;
};

// 设置 BEM 规范
export const useNamespace = (block: string) => {
  // 块元素
  const b = (blockSuffix?: string) => {
    return _bem({ block, blockSuffix });
  };

  // 修饰符或者状态
  const m = (modifier?: string) => {
    return modifier ? _bem({ block, modifier }) : '';
  };

  // 子元素
  const e = (element?: string) => {
    return element ? _bem({ block, element }) : '';
  };

  // 块元素的子元素
  const be = (blockSuffix?: string, element?: string) => {
    return blockSuffix && element ? _bem({ block, blockSuffix, element }) : '';
  };

  // 子元素的修饰符或者状态
  const em = (element?: string, modifier?: string) => {
    return element && modifier ? _bem({ block, element, modifier }) : '';
  };

  // 块元素的修饰符或者状态
  const bm = (blockSuffix?: string, modifier?: string) => {
    return blockSuffix && modifier
      ? _bem({ block, blockSuffix, modifier })
      : '';
  };

  // 块元素的子元素的修饰符或者状态
  const bem = (blockSuffix?: string, element?: string, modifier?: string) => {
    return blockSuffix && element && modifier
      ? _bem({ block, blockSuffix, element, modifier })
      : '';
  };

  // 控制状态的类名格式
  const is: {
    (name: string, state: boolean | undefined): string;
    (name: string): string;
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true;

    // 有名称  && 有状态 ? 名称-状态 : ''
    return name && state ? `${statePrefix}${name}` : '';
  };

  return {
    // 块元素
    b,
    // 修饰符或者状态
    m,
    // 子元素
    e,
    // 块元素的子元素
    be,
    // 子元素的修饰符或者状态
    em,
    // 块元素的修饰符或者状态
    bm,
    // 块元素的子元素的修饰符或者状态
    bem,
    // 控制状态的类名格式
    is,
  };
};

export type UseNamespaceReturn = ReturnType<typeof useNamespace>;
