import { createPopper } from '@popperjs/core';
import { get } from 'lodash-unified';

import { useZIndex } from '../../utils/helpers';

// ts
import type { TableColumnCtx } from './table-column/defaults';

// 是否是对象
const isObject = function (obj: unknown): boolean {
  return obj !== null && typeof obj === 'object';
};

// 获取数组的key
export const getKeysMap = function <T>(
  array: T[],
  rowKey: string
): Record<string, { row: T; index: number }> {
  const arrayMap = {};

  // arrayMap
  (array || []).forEach((row, index) => {
    // 获取rowKey对应的数据
    arrayMap[getRowIdentity(row, rowKey)] = { row, index };
  });

  return arrayMap;
};


// 获取rowKey对应的数据
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

// 固定列样式
export const getFixedColumnsClass = <T>(
  namespace: string,
  index: number,
  fixed: string | boolean,
  store: any,
  columns?: TableColumnCtx<T>[]
) => {
  const classes: string[] = [];

  const { direction, start } = isFixedColumn(index, fixed, store, columns);

  // 有方向
  if (direction) {
    const isLeft = direction === 'left';

    // 方向
    classes.push(`${namespace}-fixed-column--${direction}`);

    // 左边固定列
    if (isLeft && start === store.states.fixedLeafColumnsLength.value - 1) {
      classes.push('is-last-column');
    }
    // 其他
    else if (
      !isLeft &&
      start ===
      store.states.columns.value.length -
      store.states.rightFixedLeafColumnsLength.value
    ) {
      classes.push('is-first-column');
    }
  }


  return classes;
};

// 是否是固定列
export const isFixedColumn = <T>(
  index: number,
  fixed: string | boolean,
  store: any,
  realColumns?: TableColumnCtx<T>[]
) => {
  let start = 0;
  let after = index;

  // 有列
  if (realColumns) {
    // 判断是否是组合列
    if (realColumns[index].colSpan > 1) {
      return {};
    }


    for (let i = 0; i < index; i++) {
      start += realColumns[i].colSpan;
    }

    after = start + realColumns[index].colSpan - 1;
  }
  // 没有列
  else {
    start = index;
  }


  let fixedLayout;
  const columns: any = store.states.columns;

  switch (fixed) {
    // 左固定列
    case 'left':
      if (after < store.states.fixedLeafColumnsLength.value) {
        fixedLayout = 'left';
      }
      break;
    // 右固定列
    case 'right':
      if (
        start >=
        columns.value.length - store.states.rightFixedLeafColumnsLength.value
      ) {
        fixedLayout = 'right';
      }
      break;
    // 固定列默认值
    default:
      if (after < store.states.fixedLeafColumnsLength.value) {
        fixedLayout = 'left';
      } else if (
        start >=
        columns.value.length - store.states.rightFixedLeafColumnsLength.value
      ) {
        fixedLayout = 'right';
      }
  }

  return fixedLayout ? {
    direction: fixedLayout,
    start,
    after,
  } : {};
};

// 固定列偏移位置
export const getFixedColumnOffset = <T>(
  index: number,
  fixed: string | boolean,
  store: any,
  realColumns?: TableColumnCtx<T>[]
) => {

  const { direction, start = 0 } = isFixedColumn(
    index,
    fixed,
    store,
    realColumns
  );

  // 没有方向
  if (!direction) {
    return;
  }

  // styles
  const styles: any = {};

  // 左边
  const isLeft = direction === 'left';

  const columns = store.states.columns.value;

  // 左边
  if (isLeft) {
    styles.left = columns.slice(0, index).reduce(getOffset, 0);
  }
  // 其他
  else {
    styles.right = columns
      .slice(start + 1)
      .reverse()
      .reduce(getOffset, 0);
  }


  return styles;
};

// 偏移的位置
function getOffset<T>(offset: number, column: TableColumnCtx<T>) {
  return (
    offset +
    (column.columnWidth === null || Number.isNaN(column.columnWidth)
      ? Number(column.width)
      : column.columnWidth)
  );
}


// 设置定位位置
export const ensurePosition = (style, key: string) => {
  if (!style) {
    return;
  }

  if (!Number.isNaN(style[key])) {
    style[key] = `${style[key]}px`;
  }
};


// 修改当前行的状态
export function toggleRowStatus<T>(
  statusArr: T[],
  row: T,
  newVal: boolean
): boolean {
  let changed = false;

  // 当前选择的行列表中是否存在当前行
  const index = statusArr.indexOf(row);

  const included = index !== -1;

  // 添加行
  const addRow = () => {
    statusArr.push(row);
    changed = true;
  };

  // 删除行
  const removeRow = () => {
    statusArr.splice(index, 1);
    changed = true;
  };

  // boolean
  if (typeof newVal === 'boolean') {
    // 添加行
    if (newVal && !included) {
      addRow();
    }
    // 删除行
    else if (!newVal && included) {
      removeRow();
    }
  }
  // 不是 boolean
  else {
    if (included) {
      removeRow();
    } else {
      addRow();
    }
  }

  return changed;

}

// 获取当前单元格元素
export const getCell = (event: Event): HTMLElement => {
  let cell = event.target as HTMLElement;

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {

    // td
    if (cell.tagName.toUpperCase() === 'TD') {
      return cell;
    }

    // 返回父节点
    cell = cell.parentNode as HTMLElement;
  }

  return null;
};

// 单元格
export const getColumnByCell = <T>(
  table: {
    columns: TableColumnCtx<T>[]
  },
  cell: HTMLElement,
  namespace: string
): null | TableColumnCtx<T> => {

  // 获取列id
  const matches = (cell.className || '').match(
    new RegExp(`${namespace}-[^\\s]+`, 'gm')
  );

  // ['ivue-table-1-column-3', 'ivue-table-cell']
  // 是否有列id
  if (matches) {
    return getColumnById(table, matches[0]);
  }
  return null;
};

// 通过id寻找对应的列数据
export const getColumnById = <T>(
  // 列数组
  table: {
    columns: TableColumnCtx<T>[]
  },
  // 列id
  columnId: string
): null | TableColumnCtx<T> => {
  let column = null;

  // 根据id获取当前列
  table.columns.forEach((item) => {
    // 是否相同
    if (item.id === columnId) {
      column = item;
    }
  });

  return column;
};

// 通过key寻找对应的列数据
export const getColumnByKey = function <T>(
  table: {
    columns: TableColumnCtx<T>[]
  },
  columnKey: string
): TableColumnCtx<T> {
  let column = null;

  for (let i = 0; i < table.columns.length; i++) {
    const item = table.columns[i];

    // 没有设置columnKey
    if (!item.columnKey) {
      throw ('column does not have columnKey set');
    }

    // 是否有相同的key->对应的列
    if (item.columnKey === columnKey) {
      column = item;

      break;
    }
  }

  return column;
};


export let removePopper;

// 创建pooper
export const createTablePopper = (
  parentNode: HTMLElement | undefined,
  trigger: HTMLElement,
  popperContent: string,
  popperOptions: any,
) => {
  // 下一个zindex数值
  const { nextZIndex } = useZIndex();

  // 获取滚动dom
  const scrollContainer = parentNode?.querySelector('.ivue-scrollbar-wrapper');

  // 渲染三角形
  const renderArrow = (): HTMLDivElement => {
    // arrow
    const arrow = document.createElement('div');
    arrow.className = 'ivue-tooltip-arrow';

    return arrow;
  };

  // 渲染三角形
  const arrow = renderArrow();

  // 渲染内容
  const renderContent = (): HTMLDivElement => {
    // wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'ivue-tooltip-popper';
    wrapper.style.zIndex = String(nextZIndex());

    // content
    const content = document.createElement('div');
    content.className = 'ivue-tooltip-content';

    // 文本内容
    const inner = document.createElement('div');
    inner.className = 'ivue-tooltip-inner';
    inner.innerHTML = popperContent;

    // arrow
    content.appendChild(arrow);
    // inner
    content.appendChild(inner);

    wrapper.appendChild(content);

    // Avoid side effects caused by append to body
    parentNode?.appendChild(wrapper);

    return wrapper;
  };


  // 渲染内容
  const content = renderContent();

  let popperInstance = null;

  popperInstance = createPopper(trigger, content, {
    strategy: 'absolute',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 0],
        },
      },
      {
        name: 'arrow',
        options: {
          element: arrow,
          padding: 10,
        },
      },
    ],
    ...popperOptions,
  });

  // 显示popper
  const showPopper = () => {
    popperInstance && popperInstance.update();
  };

  // 删除popper
  removePopper = () => {
    // 销毁popper
    popperInstance && popperInstance.destroy();

    // 删除节点
    content && parentNode && parentNode?.removeChild(content);

    // 删除事件
    trigger.removeEventListener('mouseenter', showPopper);
    trigger.removeEventListener('mouseleave', removePopper);
    scrollContainer?.removeEventListener('scroll', removePopper);

    removePopper = undefined;
  };

  // 当前trigger移动
  trigger.addEventListener('mouseenter', showPopper);
  trigger.addEventListener('mouseleave', removePopper);
  scrollContainer?.addEventListener('scroll', removePopper);

  return popperInstance;
};


// 排序数据
export const orderBy = <T>(
  array: T[],
  sortKey: string,
  reverse: string | number,
  sortMethod,
  sortBy: string | (string | ((a: T, b: T, array?: T[]) => number))[]
) => {

  // 没有排序的key 对应列内容的字段名
  // 没有自定义排序方法
  // 没有指定数据按照哪个属性进行排序
  if (
    !sortKey &&
    !sortMethod &&
    (!sortBy || (Array.isArray(sortBy) && !sortBy.length))
  ) {
    return array;
  }

  // string
  if (typeof reverse === 'string') {
    reverse = reverse === 'descending' ? -1 : 1;
  } else {
    reverse = reverse && reverse < 0 ? -1 : 1;
  }

  // 获取key
  let getKey = null;

  // 没有自定义排序方法
  if (!sortMethod) {
    getKey = (value, index) => {

      // 指定数据按照哪个属性进行排序
      if (sortBy) {
        if (!Array.isArray(sortBy)) {
          sortBy = [sortBy];
        }

        return sortBy.map((by) => {
          // string
          if (typeof by === 'string') {
            return get(value, by);
          }
          // 函数
          else {
            return by(value, index, array);
          }
        });
      }

      // 排序的key对应列内容的字段名
      if (sortKey !== '$key') {
        if (isObject(value) && '$value' in value) {
          value = value.$value;
        }
      }

      // 对象 ？对象值 ｜ 当前值
      return [isObject(value) ? get(value, sortKey) : value];
    };
  }

  // 排序方法
  const sort = (a, b) => {
    // 是否有自定义排序方法
    if (sortMethod) {
      return sortMethod(a.value, b.value);
    }

    for (let i = 0, length = a.key.length; i < length; i++) {

      // 第一个小于第二个
      if (a.key[i] < b.key[i]) {
        return -1;
      }

      // 第一个大于第二个
      if (a.key[i] > b.key[i]) {
        return 1;
      }
    }

    // 两个相等返回 0
    return 0;
  };


  return array.map((value, index) => {
    return {
      value,
      index,
      // 当前行的数据 date
      key: getKey ? getKey(value, index) : null,
    };
  })
    // 排序
    .sort((a, b) => {
      let order = sort(a, b);

      // 是否需要排序
      if (!order) {
        // make stable https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
        order = a.index - b.index;
      }

      return order * +reverse;
    })
    // 返回当前行值
    .map((item) => item.value);
};

// 行树节点
export function walkTreeNode(
  root,
  cb,
  childrenKey = 'children',
  lazyKey = 'hasChildren'
) {

  // 是否有值
  const isNull = (array) => !(Array.isArray(array) && array.length);

  // 递归方法检查是否还有嵌套的数据
  function walker(parent, children, level) {
    cb(parent, children, level);

    children.forEach((item) => {
      // 懒加载子节点数据
      if (item[lazyKey]) {
        cb(item, null, level + 1);

        return;
      }

      // 子节点数据
      const children = item[childrenKey];

      // 是否有值
      if (!isNull(children)) {
        walker(item, children, level + 1);
      }
    });
  }

  // 原始数据
  root.forEach((item) => {
    // 懒加载子节点数据
    if (item[lazyKey]) {
      cb(item, null, 0);

      return;
    }

    // 子节点数据
    const children = item[childrenKey];

    // 是否有值
    if (!isNull(children)) {
      // 递归执行
      walker(item, children, 0);
    }
  });
}
