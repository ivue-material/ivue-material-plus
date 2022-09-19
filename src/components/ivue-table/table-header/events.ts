import {
  inject,
  ref,
  getCurrentInstance,
} from 'vue';

import { hasClass, removeClass, addClass } from '../../../utils/assist';
import { on, off } from '../../../utils/dom';

// ts
import type { TableHeaderProps } from './index';
import type { TableColumnCtx } from '../table-column/defaults';

const prefixCls = 'ivue-table';

function useEvent<T>(props: TableHeaderProps<T>, emit) {

  // vm
  const vm = getCurrentInstance();

  // inject
  const IvueTable: any = inject(prefixCls);

  // data

  // 当前鼠标移动到的拖动列
  const draggingColumn: any = ref(null);

  // 拖动中
  const dragging = ref(false);

  // 拖动开始
  const dragState = ref({});

  // 切换排序
  const toggleOrder = ({ order, sortOrders }) => {
    // 表示升序
    if (order === '') {
      return sortOrders[0];
    }

    // 下标
    const index = sortOrders.indexOf(order || null);

    return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1];
  };

  // 点击排序
  const handleSortClick = (
    event: Event,
    column: TableColumnCtx<T>,
    givenOrder: string | boolean
  ) => {
    // stopPropagation
    event.stopPropagation();

    // 顺序
    const order = column.order === givenOrder ? null : givenOrder || toggleOrder(column);

    let target = event.target as HTMLElement;
    while (target && target.tagName !== 'TH') {
      target = target.parentNode as HTMLElement;
    }

    // 点击th
    if (target && target.tagName === 'TH') {

      // 是否有 noclick 防止开启排序时点击
      if (hasClass(target, 'noclick')) {
        removeClass(target, 'noclick');

        return;
      }
    }

    // 没有排序
    if (!column.sortable) {
      return;
    }

    // states
    const states = props.store.states;

    // 排序的key 对应列内容的字段名
    let sortProp = states.sortProp.value;
    // 需要排序的列
    const sortingColumn = states.sortingColumn.value;

    // 排序
    let sortOrder;

    // 不是当前列
    if (
      sortingColumn !== column ||
      (sortingColumn === column && sortingColumn.order === null)
    ) {

      // 初始化排序
      if (sortingColumn) {
        sortingColumn.order = null;
      }

      // 保存当前列
      states.sortingColumn.value = column;

      // 排序的key 对应列内容的字段名
      sortProp = column.property;
    }

    // 没有排序顺序
    if (!order) {
      column.order = null;
      sortOrder = null;
    }
    // 设置排序顺序
    else {
      sortOrder = order;
      column.order = order;
    }

    // 排序的key 对应列内容的字段名
    states.sortProp.value = sortProp;
    // 设置排序顺序 descending | ascending | null
    states.sortOrder.value = sortOrder;

    // 改变排序
    IvueTable?.store.commit('changeSortCondition');
  };

  // 头部点击
  const handleHeaderClick = (event: Event, column: TableColumnCtx<T>) => {
    event.preventDefault();

    // 没有过滤筛选数据，只有排序
    if (!column.filters && column.sortable) {
      handleSortClick(event, column, false);
    }

    IvueTable?.emit('on-header-click', column, event);
  };


  // 鼠标按下
  const handleMouseDown = (event: MouseEvent, column: TableColumnCtx<T>) => {

    // 有子节点
    if (column.children && column.children.length > 0) {
      return;
    }

    // 可以拖动列 有开启边框
    if (draggingColumn.value && props.border) {
      // 拖动中
      dragging.value = true;


      emit('on-drag-visible', true);

      // 表格节点
      const tableDom = IvueTable?.vnode.el;

      // 表格距离左边窗口的距离
      const tableLeft = tableDom.getBoundingClientRect().left;

      // 当前拖动的列
      const currentColumnDom = vm!.vnode.el!.querySelector(`th.${column.id}`);

      // 当前列距离窗口的距离
      const columnRect = currentColumnDom.getBoundingClientRect();

      // 单元格宽度
      const cellDom = currentColumnDom.querySelector('.cell-content');

      // 最小左边距离
      const minLeft = columnRect.left - tableLeft + (cellDom.offsetWidth + 30);

      // 添加class noclick 防止开启排序时点击
      addClass(currentColumnDom, 'noclick');

      // 开始拖动
      dragState.value = {
        // 触发点相对浏览器可视区域左距离
        startMouseLeft: event.clientX,
        // 当前列距离窗口的距离右边 - 表格距离左边窗口的距离
        startLeft: columnRect.right - tableLeft,
        // 当前列距离窗口的距离 - 表格距离左边窗口的距离
        startColumnLeft: columnRect.left - tableLeft,
        // 表格距离左边窗口的距离
        tableLeft,
      };

      // 拖拽时的虚线
      const draggingDottedDom = IvueTable?.refs.draggingDotted as HTMLElement;

      // 设置拖拽时的虚线距离
      draggingDottedDom.style.left = `${(dragState.value as any).startLeft}px`;

      // 禁止document选择事件
      document.onselectstart = () => {
        return false;
      };

      // 禁止document拖拽事件
      document.ondragstart = () => {
        return false;
      };

      // 鼠标移动
      const handleDocumentMouseMove = (event) => {
        // 当前触发点相对浏览器可视区域左距离 - 开始拖动时 触发点相对浏览器可视区域左距离
        const deltaLeft = event.clientX - (dragState.value as any).startMouseLeft;

        // 可拖动最大值
        let maxLeft = (dragState.value as any).startLeft + deltaLeft;

        // 最大表格宽度
        if (maxLeft >= tableDom.offsetWidth) {
          maxLeft = tableDom.offsetWidth;
        }

        // minLeft ｜ maxLeft
        draggingDottedDom.style.left = `${Math.max(minLeft, maxLeft)}px`;
      };

      // 鼠标放开
      const handleDocumentMouseUp = () => {
        // 拖动中
        if (dragging.value) {
          const { startColumnLeft, startLeft } = dragState.value as any;

          // 拖拽时的虚线位置
          const draggingDottedDomLeft = Number.parseInt(draggingDottedDom.style.left, 10);

          // 列的宽度 = 拖拽虚线后的位置 - 开始列左边到窗口的距离
          const columnWidth = draggingDottedDomLeft - startColumnLeft;

          // 设置列的宽度
          column.width = columnWidth;
          column.columnWidth = columnWidth;

          IvueTable?.emit(
            'on-header-dragend',
            // 设置列的宽度
            column.width,
            // 拖拽后的位置
            startLeft - startColumnLeft,
            column,
            event
          );

          // 更新dom重新执行布局
          requestAnimationFrame(() => {
            props.store.scheduleLayout(false, true);
          });

          // 初始化样式
          document.body.style.cursor = '';

          // 拖动中
          dragging.value = false;

          // 当前鼠标移动到的拖动列
          draggingColumn.value = null;

          // 拖动开始
          dragState.value = {};

          // 隐藏拖动虚线
          emit('on-drag-visible', false);
        }

        // 移除鼠标移动
        off(document, 'mousemove', handleDocumentMouseMove);
        // 移除鼠标放开
        off(document, 'mouseup', handleDocumentMouseUp);

        // 开启document选择事件
        document.onselectstart = null;
        // 开启document拖拽事件
        document.ondragstart = null;

        // 删除样式
        setTimeout(() => {
          removeClass(currentColumnDom, 'noclick');
        }, 0);
      };

      // 鼠标移动
      on(document, 'mousemove', handleDocumentMouseMove);
      // 鼠标放开
      on(document, 'mouseup', handleDocumentMouseUp);
    }

  };

  // 鼠标移动
  const handleMouseMove = (event: MouseEvent, column: TableColumnCtx<T>) => {
    // 有子节点
    if (column.children && column.children.length > 0) {
      return;
    }

    // 获取当前节点的父节点->列的头部
    let target = event.target as HTMLElement;

    // 获取th
    while (target && target.tagName !== 'TH') {
      target = target.parentNode as HTMLElement;
    }

    // 不能拖动
    if (!column || !column.resizable) {
      return;
    }

    // 没有拖动 开启边框
    if (!dragging.value && props.border) {
      // 当前头部的大小
      const rect = target.getBoundingClientRect();

      // body样式
      const bodyStyle = document.body.style;

      // dom宽度 > 12px  && dom右边距离body的距离 - 当前手势距离窗口的距离 < 8px
      if (rect.width > 12 && rect.right - event.pageX < 8) {
        bodyStyle.cursor = 'col-resize';

        // 是否有排序
        if (hasClass(target, 'is-sortable')) {
          target.style.cursor = 'col-resize';
        }

        // 当前鼠标移动到的拖动列
        draggingColumn.value = column;
      }
      // 没有拖动初始化手势样式
      else if (!dragging.value) {
        bodyStyle.cursor = '';

        // 是否有排序
        if (hasClass(target, 'is-sortable') && column.filterable) {
          target.style.cursor = 'inherit';
        }
        // 是否有排序
        else if (hasClass(target, 'is-sortable')) {
          target.style.cursor = 'pointer';
        }

        // 当前鼠标移动到的拖动列
        draggingColumn.value = null;
      }
    }
  };

  // 鼠标退出
  const handleMouseOut = () => {
    document.body.style.cursor = '';
  };

  return {
    handleSortClick,
    handleHeaderClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseOut
  };
}

export default useEvent;
