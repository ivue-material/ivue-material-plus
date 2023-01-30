import {
  getCurrentInstance,
  onMounted,
  computed,
  onUpdated,
  onBeforeMount,
  onUnmounted,
} from 'vue';
import { throwError } from '../../utils/error';

// ts
import type { Table } from './table/defaults';
import type { TableHeader } from './table-header/types';
import type TableLayout from './table-layout';

function useLayoutObserver(root: Table) {
  // vm
  const vm = getCurrentInstance() as TableHeader;

  // computed

  // 表格布局
  const tableLayout = computed(() => {
    const layout = root.layout as TableLayout;

    if (!layout) {
      throwError('ivue-table', 'Can not find table layout');
    }

    return layout;
  });

  // methods

  // 列宽度改变
  const handleColumnsChange = (layout: TableLayout) => {
    // 获取col
    const cols = root.vnode.el?.querySelectorAll('colgroup > col') || [];

    if (!cols.length) {
      return;
    }

    // 扁平化列
    const flattenColumns = layout.getFlattenColumns();
    // 获取列的id
    const columnsMap = {};

    flattenColumns.forEach((column) => {
      columnsMap[column.id] = column;
    });

    // 设置列的宽度啊
    for (let i = 0, j = cols.length; i < j; i++) {
      const col = cols[i];
      const name = col.getAttribute('name');
      const column = columnsMap[name];

      if (column) {
        col.setAttribute('width', column.columnWidth || column.width);
      }
    }
  };

  // 设置滚动宽度
  const handleScrollableWidthChange = (layout: TableLayout) => {
    const cols =
      root.vnode.el?.querySelectorAll('colgroup > col[name=gutter]') || [];

    for (let i = 0, j = cols.length; i < j; i++) {
      const col = cols[i];
      col.setAttribute(
        'width',
        layout.scrollY.value ? layout.gutterWidth : '0'
      );
    }

    // gutter
    const ths = root.vnode.el?.querySelectorAll('th.gutter') || [];
    for (let i = 0, j = ths.length; i < j; i++) {
      const th = ths[i];
      th.style.width = layout.scrollY.value ? `${layout.gutterWidth}px` : '0';
      th.style.display = layout.scrollY.value ? '' : 'none';
    }
  };

  // 在实例初始化之后、进行数据侦听和事件/侦听器的配置之前同步调用。
  onBeforeMount(() => {
    // 吧当前 vm 对象添加到观察者
    tableLayout.value.addObserver(vm);
  });

  // 卸载组件实例后调用
  onUnmounted(() => {
    tableLayout.value.removeObserver(vm);
  });

  // onMounted
  onMounted(() => {
    // 列改变
    handleColumnsChange(tableLayout.value);

    // 设置滚动宽度
    handleScrollableWidthChange(tableLayout.value);
  });

  // onUpdated
  // 在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用
  onUpdated(() => {
    // 列宽度改变
    handleColumnsChange(tableLayout.value);

    // 设置滚动宽度
    handleScrollableWidthChange(tableLayout.value);
  });

  return {
    handleColumnsChange,
    handleScrollableWidthChange,
  };
}

export default useLayoutObserver;
