import { h } from 'vue';
import { hasOwn } from '@vue/shared';
import { get, set } from 'lodash-unified';
import IvueCheckbox from '../ivue-checkbox/index.vue';
import IvueIcon from '../ivue-icon/index.vue';
import Loading from './loading.vue';

// ts
import type { VNode } from 'vue';
import type { TableColumnCtx } from './table-column/defaults';
import type { TreeNode } from './table/defaults';
import type { Store } from './store';

const defaultClassNames = {
  selection: 'ivue-table-column--selection',
  expand: 'ivue-table--expand-column',
};


export type Arrayable<T> = T | T[]

// 行样式
export const cellStyles = {
  default: {
    order: '',
  },
  selection: {
    width: 48,
    minWidth: 48,
    columnWidth: 48,
    order: '',
  },
  expand: {
    width: 48,
    minWidth: 48,
    columnWidth: 48,
    order: '',
  },
  index: {
    width: 48,
    minWidth: 48,
    columnWidth: 48,
    order: '',
  },
};


// 合并选项
export function mergeOptions<T, K>(defaults: T, config: K): T & K {
  const options = {} as T & K;

  let key;

  // 复制对象
  for (key in defaults) {
    options[key] = defaults[key];
  }

  // config
  for (key in config) {
    if (hasOwn(config as unknown as Record<string, any>, key)) {
      const value = config[key];
      if (typeof value !== 'undefined') {
        options[key] = value;
      }
    }
  }

  return options;
}

// https://github.com/reduxjs/redux/blob/master/src/compose.js
// 函数执行的顺序是从右到左
export function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

// 渲染行
export function defaultRenderCell<T>({
  row,
  column,
  $index,
}: {
  row: T
  column: TableColumnCtx<T>
  $index: number
}) {
  // 字段名称 对应列内容的字段名
  const property = column.property;
  const value = property && getProp(row, property).value;

  // 是否有格式化内容
  if (column && column.formatter) {
    return column.formatter(row, column, value, $index);
  }

  // 普通渲染
  return value?.toString?.() || '';
}

// 获取props
export const getProp = <T = any>(
  obj: Record<string, any>,
  path: Arrayable<string>,
  defaultValue?: any
): { value: T } => {
  return {
    get value() {
      return get(obj, path, defaultValue);
    },
    set value(val: any) {
      set(obj, path, val);
    },
  };
};


// 列
export function treeCellPrefix<T>(
  {
    row,
    treeNode,
    store,
  }: {
    row: T
    treeNode: TreeNode
    store: Store<T>
  },
  createPlacehoder = false
) {

  // 不是树节点
  if (!treeNode) {
    // 创建占位符
    if (createPlacehoder) {
      return [
        h('span', {
          class: 'ivue-table-indent--placeholder'
        }),
      ];
    }

    return null;
  }

  // ele
  const ele: VNode[] = [];

  const callback = (event) => {
    event.stopPropagation();

    // 加载中
    if (treeNode.loading) {
      return;
    }

    // 树形数据与懒加载
    store.loadOrToggle(row);
  };

  // 展示树形数据时，树节点的缩进
  if (treeNode.indent) {
    ele.push(
      h('span', {
        class: 'ivue-table-indent',
        style: {
          'padding-left': `${treeNode.indent}px`
        },
      })
    );
  }

  // 展开行
  if (typeof treeNode.expanded === 'boolean' && !treeNode.noLazyChildren) {
    const expandClasses = [
      'ivue-table--expand-icon',
      {
        ['ivue-table--expand-icon__expandend']: treeNode.expanded
      }
    ];

    let icon = 'chevron_right';

    // 加载中
    if (treeNode.loading) {
      icon = '';
    }

    // 解析指令

    ele.push(
      h(
        'div',
        {
          class: expandClasses,
          onClick: callback,
        },
        {
          default: () => {
            return [
              icon ?
                h(IvueIcon, null, {
                  default: () => icon
                }) :
                h(Loading)
            ];
          },
        }
      )
    );
  }
  // 其他
  else {
    ele.push(
      h('span', {
        class: 'ivue-table-indent--placeholder'
      })
    );
  }

  return ele;

}


// 需要替换的渲染函数
export const cellForced = {
  // 多选
  selection: {
    // 渲染头部
    renderHeader<T>({ store }: { store: Store<T> }) {
      return h(IvueCheckbox, {
        // 没有数据禁用
        disabled: store.states.data.value && store.states.data.value.length === 0,
        // 是否选择了全部
        modelValue: store.states.isAllSelected.value,
        // 更新modelValue
        'onUpdate:modelValue': store.toggleAllSelection,
        // 中间状态
        indeterminate: store.states.selection.value.length > 0 && !store.states.isAllSelected.value,
        // onClick
        onClick: (event: Event) => {
          event.stopPropagation();
        }
      });
    },
    // 渲染单元格
    renderCell<T>({
      row,
      column,
      store,
      $index
    }: {
      row: T
      column: TableColumnCtx<T>
      store: Store<T>
      $index: string
    }) {
      return h(IvueCheckbox, {
        disabled: column.selectable
          ? !column.selectable.call(null, row, $index)
          : false,
        modelValue: store.isSelected(row),
        onChange: () => {
          store.commit('rowSelectedChanged', row);
        },
        // 阻止捕获和冒泡阶段中当前事件
        onClick: (event: Event) => event.stopPropagation(),
      });
    },
    // 对应列是否可以排序
    sortable: false,
    // 对应列是否可以通过拖动改变宽度
    resizable: false,
  },
  // 索引
  index: {
    // 渲染头部
    renderHeader<T>({ column }: { column: TableColumnCtx<T> }) {
      return column.label || '#';
    },
    // 渲染单元格
    renderCell<T>({ column, $index, }: {
      column: TableColumnCtx<T>
      $index: number
    }) {
      let i = $index + 1;

      const index = column.index;

      // number
      if (typeof index === 'number') {
        i = $index + index;
      }
      // function
      else if (typeof index === 'function') {
        i = index($index);
      }

      return h('div', {}, [i]);
    },
  },
  expand: {
    // 渲染头部
    renderHeader<T>({ column }: { column: TableColumnCtx<T> }) {
      return column.label || '';
    },
    renderCell<T>({
      row,
      store,
      expanded,
    }: {
      row: T
      store: Store<T>
      expanded: boolean
    }) {
      // 切换展开
      const handleToggleRowExpansion = (event: Event) => {
        event.stopPropagation();

        // 切换行展开
        store.toggleRowExpansion(row);
      };

      return h(
        'div',
        {
          class: [
            'ivue-table--expand-icon',
            {
              ['ivue-table--expand-icon__expandend']: expanded
            }
          ],
          onClick: handleToggleRowExpansion,
        },
        {
          default: () => {
            return [
              h(IvueIcon, null, {
                default: () => 'chevron_right'
              }),
            ];
          },
        }
      );
    },
    sortable: false,
    resizable: false,
  }
};

// 获取默认的class
export const getDefaultClassName = (type) => {
  return defaultClassNames[type] || '';
};
