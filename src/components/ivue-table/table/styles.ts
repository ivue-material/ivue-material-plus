
import {
  computed,
  ref,
  watch,
  unref,
  watchEffect,
} from 'vue';
import { useResizeObserver, useEventListener } from '@vueuse/core';

// ts
import type { Table, TableProps } from './defaults';
import type TableLayout from '../table-layout';
import type { Store } from '../store';

function useStyle<T>(
  props: TableProps<T>,
  layout: TableLayout<T>,
  store: Store<T>,
  table: Table<T>
) {
  // data

  // 拖动中
  const dragging = ref(false);

  // 是否可以展开
  const renderExpanded = ref(null);

  // 表格可滚动高度
  const tableScrollHeight = ref(0);

  // 表格头部滚动高度
  const headerScrollHeight = ref(0);

  // 表格缩放
  const resizeState = ref<{
    width: null | number
    height: null | number
    headerHeight: null | number
  }>({
    width: null,
    height: null,
    headerHeight: null,
  });

  // 表格宽度
  const tableWidth = ref();

  // 是否拥有多级表头
  const isGroup = ref(false);

  // 滚动组件样式
  const scrollbarContentStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
  };


  // computed

  // table-layout布局方式
  const tableLayout = computed(() => {
    // 有最大高度
    if (props.maxHeight) {
      return 'fixed';
    }

    return props.tableLayout;
  });

  // 内容样式
  const contentStyles = computed(() => {
    let obj = {};

    // 有固定高度
    if (props.height) {
      obj = {
        height: !Number.isNaN(Number(props.height)) ? `${props.height}px` : props.height,
      };
    }

    // 有最大高度
    if (props.maxHeight) {
      obj = {
        maxHeight: !Number.isNaN(Number(props.maxHeight)) ? `${props.maxHeight}px` : props.maxHeight,
      };
    }

    return obj;
  });

  // 表格内容宽度
  const tableStyles = computed(() => {
    return {
      width: layout.bodyWidth.value ? `${layout.bodyWidth.value}px` : '',
    };
  });

  // 高度是否有变化
  const shouldUpdateHeight = computed(() => {
    return (
      props.height
      || props.maxHeight
      || store.states.fixedColumns.value.length > 0
      || store.states.rightFixedColumns.value.length > 0
    );
  });

  // 提示样式
  const placeholderStyle = computed(() => {
    if (props.data && props.data.length) {
      return null;
    }

    const height = '100%';

    const width = tableWidth.value;

    return {
      width: width ? `${width}px` : '',
      height,
    };
  });

  // 内容宽度
  const tableBodyStyle = computed(() => {
    const { bodyWidth } = layout;

    const obj: any = {
      tableLayout: tableLayout.value
    };

    if (bodyWidth.value) {
      obj.width = `${(bodyWidth.value as number)}px`;
    }

    return obj;
  });

  // 滚动组件样式
  const scrollbarWrapperStyle = computed(() => {
    // 有设置高度
    if (props.height) {
      return {
        height: '100%',
      };
    }

    // 有最大高度
    if (props.maxHeight) {

      // number
      if (!Number.isNaN(Number(props.maxHeight))) {
        const headerHeight = table.refs.header?.scrollHeight || 0;
        const maxHeight = props.maxHeight;

        // 超过最大高度
        const reachMaxHeight = tableScrollHeight.value >= Number(maxHeight);

        // 表格内容高度
        if (reachMaxHeight) {
          return {
            maxHeight: `${tableScrollHeight.value - headerHeight}px`,
          };
        }
      }
      // string
      else {
        return {
          maxHeight: `calc(${props.maxHeight} - ${headerScrollHeight.value}px)`,
        };
      }
    }

    return {};
  });

  // methods

  // 绑定事件
  const handleBindEvents = () => {
    const scrollbar = table.refs.scrollbar;

    // 没有滚动条
    if (!scrollbar) {
      return;
    }

    // 有滚动条
    if (scrollbar.scrollbarWrapper) {
      useEventListener(scrollbar.scrollbarWrapper, 'scroll', handleScrollbarScroll, {
        passive: true,
      });
    }

    // 列的宽度自撑开
    if (props.fit) {
      // 绑定resize
      useResizeObserver(table.vnode.el as HTMLElement, handleResizeListener);
    }
    // 表格大小改变
    else {
      useEventListener(window, 'resize', handleResizeListener);
    }
  };

  // 鼠标离开
  const handleMouseLeave = () => {
    // 清除列hover
    table.store.commit('setHoverRow', null);

    // 清除列hover
    if (table.hoverState) {
      table.hoverState = null;
    }
  };

  // 鼠标滚轮
  const handleMousewheel = (event, data) => {
    const { pixelX, pixelY } = data;

    // x 大于 y table横向滚动
    if (Math.abs(pixelX) >= Math.abs(pixelY)) {
      table.refs.bodyWrapper.scrollLeft += data.pixelX / 5;
    }
  };

  // 拖拽显示
  const handleDragVisible = (visible: boolean) => {
    dragging.value = visible;
  };

  // 更新布局
  const updateLayout = () => {
    // 高度是否有变化更新高度
    if (shouldUpdateHeight.value) {
      layout.updateTableContentHeight();
    }

    // 更新列的宽度
    layout.updateColumnsWidth();

    // 滚动条滚动
    requestAnimationFrame(handleScrollbarScroll);
  };

  // 表格大小改变
  const handleResizeListener = () => {
    // 表格是否渲染完成
    if (!table.$ready) {
      return;
    }

    // 更新布局
    let shouldUpdateLayout = false;

    // 当前el
    const el = table.vnode.el;

    // 当前改变的值
    const {
      width: oldWidth,
      height: oldHeight,
      headerHeight: oldHeaderHeight,
    } = resizeState.value;

    // 当前表格宽度
    const width = (tableWidth.value = el.offsetWidth);

    // 有改变表格宽度
    if (oldWidth !== width) {
      shouldUpdateLayout = true;
    }

    // 监听高度变化
    const height = el.offsetHeight;
    if ((props.height || shouldUpdateHeight.value) && oldHeight !== height) {
      shouldUpdateLayout = true;
    }

    // 监听表格头部是否显示
    const tableHeader: HTMLElement = table.refs.header || {};

    if (tableHeader && (props.showHeader && tableHeader.offsetHeight !== oldHeaderHeight)) {
      shouldUpdateLayout = true;
    }

    // 表格可滚动高度
    tableScrollHeight.value = table.refs.tableWrapper.scrollHeight;

    // 表格头部滚动高度
    headerScrollHeight.value = table.refs.header?.scrollHeight || 0;

    if (shouldUpdateLayout) {
      resizeState.value = {
        width,
        height,
        headerHeight: props.showHeader ? tableHeader.offsetHeight : null,
      };

      // 更新布局
      updateLayout();
    }

  };

  // 滚动条滚动
  const handleScrollbarScroll = () => {
    const scrollbar = table.refs.scrollbar;

    // 没有滚动
    if (!scrollbar) {
      return;
    }

    // 是否可以滚动
    if (!layout.scrollX.value) {
      const scrollingNoneClass = 'is-scrolling-none';

      if (!hasClass(scrollingNoneClass)) {
        setTableClass(scrollingNoneClass);
      }
    }

    const scrollContainer = scrollbar.scrollbarWrapper;

    // 没有滚动条
    if (!scrollContainer) {
      return;
    }

    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer;
    const { header } = table.refs;

    // 设置头部滚动位置
    if (header) {
      header.scrollLeft = scrollLeft;
    }

    // 最大滚动位置
    const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;

    // 最右边
    if (scrollLeft >= maxScrollLeftPosition) {
      setTableClass('is-scrolling-right');
    }
    // 滚动到最左边
    else if (scrollLeft === 0) {
      setTableClass('is-scrolling-left');
    }
    // 滚动到中间
    else {
      setTableClass('is-scrolling-middle');
    }

  };

  // 是否有当前样式
  const hasClass = (className: string) => {
    const { tableWrapper } = table.refs;

    return !!(tableWrapper && tableWrapper.classList.contains(className));
  };

  // 设置表格样式
  const setTableClass = (className: string) => {
    const { tableWrapper } = table.refs;

    if (!tableWrapper) {
      return;
    }

    const classList = Array.from(tableWrapper.classList).filter(
      (item) => !item.startsWith('is-scrolling-')
    );

    classList.push(layout.scrollX.value ? className : 'is-scrolling-none');

    tableWrapper.className = classList.join(' ');

  };

  // 监听数据变化
  watch(
    () => props.data,
    (data) => {
      table.store.commit('setData', data);
    },
    {
      immediate: true,
      deep: true,
    }
  );

  // 监听行key
  watch(
    () => [store.states.rowKey],
    ([currentRowKey, rowKey]) => {
      if (!unref(rowKey)) {
        return;
      }

      // 设置当前行的key
      store.setCurrentRowKey(`${currentRowKey}`);
    },
    {
      immediate: true,
    }
  );

  // watchEffect

  // 监听高度变化设置表格高度
  watchEffect(() => {
    layout.setHeight(props.height);
  });

  // 监听高度变化设置表格最大高度
  watchEffect(() => {
    layout.setMaxHeight(props.maxHeight);
  });

  watchEffect(() => {
    if (props.expandRowKeys) {
      store.setExpandRowKeysAdapter(props.expandRowKeys);
    }
  });

  return {
    // data
    dragging,
    renderExpanded,
    resizeState,
    tableWidth,
    isGroup,

    // computed
    tableLayout,
    contentStyles,
    tableStyles,
    placeholderStyle,
    tableBodyStyle,
    scrollbarWrapperStyle,
    scrollbarContentStyle,

    // methods
    handleMouseLeave,
    handleMousewheel,
    handleDragVisible,
    updateLayout,
    handleBindEvents,
  };
}

export default useStyle;
