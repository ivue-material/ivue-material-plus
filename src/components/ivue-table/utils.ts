


// 获取数组的key
export const getKeysMap = function <T>(
  array: T[],
  rowKey: string
): Record<string, { row: T; index: number }> {
  const arrayMap = {};

  // arrayMap
  (array || []).forEach((row, index) => {
    arrayMap[getRowIdentity(row, rowKey)] = { row, index };
  });

  return arrayMap;
};


// 获取行标志
export const getRowIdentity = <T>(
  row: T,
  rowKey: string | ((row: T) => any)
): string => {
  if (!row) {
    throw new Error('Row is required when get row identity');
  }

  // 字符串
  if (typeof rowKey === 'string') {

    // 分割字符串成数组
    if (!rowKey.includes('.')) {
      return `${row[rowKey]}`;
    }

    const key = rowKey.split('.');

    let current = row;

    for (const element of key) {
      current = current[element];
    }

    return `${current}`;
  }
  // 函数
  else if (typeof rowKey === 'function') {
    return rowKey.call(null, row);
  }
};

// 宽度判断
export function parseWidth(width: number | string): number | string {
  // 空字符串
  if (width === '') {
    return width;
  }

  // 没有宽度
  if (width !== undefined) {
    width = Number.parseInt(width as string, 10);

    if (Number.isNaN(width)) {
      width = '';
    }

  }

  return width;
}

// 最小宽度判断
export function parseMinWidth(minWidth: number | string): number | string {

  // 空字符串
  if (minWidth === '') {
    return minWidth;
  }

  // 没有宽度
  if (minWidth !== undefined) {
    minWidth = parseWidth(minWidth);
    if (Number.isNaN(minWidth)) {
      minWidth = 80;
    }
  }

  return minWidth;
}
