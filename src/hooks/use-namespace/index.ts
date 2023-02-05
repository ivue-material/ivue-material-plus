type BEM = {
  block?: string;
  blockSuffix?: string;
  element?: string;
  modifier?: string;
};

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

  // 子元素
  const m = (modifier?: string) => {
    return modifier ? _bem({ block, modifier }) : '';
  };

  return {
    // 块元素
    b,
    // 子元素
    m,
  };
};

export type UseNamespaceReturn = ReturnType<typeof useNamespace>;
