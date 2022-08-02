import {
  Comment,
  computed,
  getCurrentInstance,
  ref,
  watchEffect,
  h,
} from 'vue';

import {
  defaultRenderCell,
  treeCellPrefix,
  cellForced,
  getDefaultClassName
} from '../config';
import { parseWidth, parseMinWidth } from '../utils';

// ts
import type { TableColumn, TableColumnCtx } from './defaults';
import type { ComputedRef } from 'vue';

const prefixCls = 'ivue-table';

function useRender<T>(
  props: TableColumnCtx<T>,
  slots,
  parentDom: ComputedRef<any>
) {
  const vm = getCurrentInstance() as TableColumn<T>;

  // 列id
  const columnId = ref('');
  // 是否是嵌套的子列
  const isSubColumn = ref(false);
  // 对齐方向
  const align = ref<string>();
  // 表头对齐方式
  const headerAlign = ref<string>();
  // 对应列的宽度
  const columnWidth = ref(parseWidth(props.width));
  // 对应列的最小宽度
  const columnMinWidth = ref(parseMinWidth(props.minWidth));

  // computed

  // 列的父级
  const columnParent = computed(() => {
    let parent: any = vm.vnode.vParent || vm.parent;

    // 没有表格id 没有列id
    while (parent && !parent.tableId && !parent.columnId) {
      parent = parent.vnode.vParent || parent.parent;
    }

    return parent;
  });

  // 是否有列数据
  const hasTreeColumn = computed<boolean>(() => {
    const { store }: any = vm.parent;

    // 没有 store
    if (!store) {
      return false;
    }

    const { treeData } = store.states;

    const treeDataValue = treeData.value;

    return treeDataValue && Object.keys(treeDataValue).length > 0;
  });

  // methods

  // 获取props值
  const getPropsData = (...propsKey: unknown[]) => {

    return propsKey.reduce((prev, cur) => {
      // 数组
      if (Array.isArray(cur)) {
        cur.forEach((key) => {
          prev[key] = props[key];
        });
      }

      return prev;
    }, {});
  };

  // 检查子列表
  const checkSubColumn = (children: TableColumn<T> | TableColumn<T>[]) => {
    // 数组
    if (Array.isArray(children)) {
      children.forEach((child) => check(child));
    }
    // 其他
    else {
      check(children);
    }

    // 检查是否是列表组件
    function check(item: TableColumn<T>) {
      if (item?.type?.name === `${prefixCls}-column`) {
        item.vParent = vm;
      }
    }

  };

  // 列渲染
  const columnRender = (column: TableColumnCtx<T>) => {
    // 不是多选框
    if ((column.type !== 'selection') && (column.type !== 'index')) {
      column.renderHeader = (scope) => {
        vm.columnConfig.value['label'];

        // 是否有头部插槽
        const renderHeader = slots.header;

        return renderHeader ? renderHeader(scope) : column.label;
      };
    }

    // 渲染行函数
    let originRenderCell = column.renderCell;

    const hasTreeColumnValue = hasTreeColumn.value;

    // 可展开行
    if (column.type === 'expand') {

      // 渲染行
      column.renderCell = (data) => {
        return h('div', {
          class: 'cell'
        }, [
          originRenderCell(data)
        ]);
      };

      parentDom.value.renderExpanded = (data) => {
        return slots.default ? slots.default(data) : slots.default;
      };
    }
    // 其他状态
    else {
      originRenderCell = originRenderCell || defaultRenderCell;

      // 渲染行
      column.renderCell = (data) => {
        let children = null;

        // 有默认插槽
        if (slots.default) {
          // 设置vnode
          const vnode = slots.default(data);

          // 判断是否是注释
          children = vnode.some((v) => v.type !== Comment) ? vnode : originRenderCell(data);
        }
        // 不是插槽
        else {
          children = originRenderCell(data);
        }


        // 列数据
        const shouldCreatePlaceholder = hasTreeColumnValue && data.cellIndex === 0;

        // 列的占位符-用于展示树形数据时，树节点的缩进
        const prefix = treeCellPrefix(data, shouldCreatePlaceholder);

        // props
        const props = {
          class: 'cell',
          style: {},
        };

        // 当内容过长被隐藏时显示 tooltip
        if (column.showOverflowTooltip) {
          props.class = `${props.class} ${prefixCls}-tooltip`;
          props.style = {
            width: `${(data.column.columnWidth || Number(data.column.width)) - 1}px`,
          };
        }

        // 检查子列表
        checkSubColumn(children);

        return h('div', props, [prefix, children]);
      };
    }


    return column;
  };

  // 设置列宽度
  const setColumnWidth = (column: TableColumnCtx<T>) => {
    if (columnWidth.value) {
      column.width = columnWidth.value;
    }

    // 最小宽度
    if (columnMinWidth.value) {
      column.minWidth = columnMinWidth.value;
    }


    // 没有设置最小宽度，默认最小宽度 80
    if (!column.minWidth) {
      column.minWidth = 80;
    }

    // 列宽度 minWidth 或者 width
    column.columnWidth = Number(
      column.width === undefined ? column.minWidth : column.width
    );

    return column;
  };

  // 设置列 props
  const setColumnProps = (column: TableColumnCtx<T>) => {

    // 对应列的类型
    const type = column.type;

    // 不应覆盖的值
    const source = cellForced[type] || {};

    // 替换列 column 对象的参数
    Object.keys(source).forEach((prop) => {
      // 获取值
      const value = source[prop];

      if (prop !== 'className' && value !== undefined) {
        column[prop] = value;
      }
    });

    const className = getDefaultClassName(type);

    // 有对应的class
    if (className) {
      column.className = column.className ? `${column.className} ${className}` : className;
    }

    return column;
  };


  // 获取列节点index
  const getColumnDomIndex = (children, el) => {
    return Array.prototype.indexOf.call(children, el);
  };

  // watch

  // 同步监听 对齐方向
  watchEffect(() => {
    align.value = props.align ? `is-${props.align}` : null;
    // nextline help render
    align.value;
  });

  // 同步监听 表头对齐方式
  watchEffect(() => {
    headerAlign.value = props.headerAlign ? `is-${props.headerAlign}` : align.value;

    // nextline help render
    headerAlign.value;
  });

  return {
    // data
    columnId,
    isSubColumn,
    align,
    headerAlign,

    // computed
    columnParent,

    // methods
    getPropsData,
    getColumnDomIndex,
    columnRender,
    setColumnWidth,
    setColumnProps
  };

}

export default useRender;
