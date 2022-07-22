
import {
  computed,
  ref,
  onMounted,
  nextTick
} from 'vue';
import { useResizeObserver } from '@vueuse/core';

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
        // height: !Number.isNaN(Number(props.height)) ? `${props.height}px` : props.height,
      };
    }

    // 有最大高度
    if (props.maxHeight) {
      obj = {
        // maxHeight: !Number.isNaN(Number(props.maxHeight)) ? `${props.maxHeight}px` : props.maxHeight,
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
      props.height ||
      props.maxHeight
      // store.states.fixedColumns.value.length > 0 ||
      // store.states.rightFixedColumns.value.length > 0
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
    return {};
  });

  // methods

  // 绑定事件
  const handleBindEvents = () => {
    // 列的宽度自撑开
    if (props.fit) {
      // 绑定resize
      useResizeObserver(table.vnode.el as HTMLElement, handleResizeListener);
    }
  };

  // 鼠标离开
  const handleMouseLeave = () => {
    // 清除列hover
    // table.store.commit('setHoverRow', null);

    // // 清除列hover
    // if (table.hoverState) {
    //   table.hoverState = null;
    // }
  };

  // 鼠标滚轮
  const handleMousewheel = (event, data) => {
    // const { pixelX, pixelY } = data;

    // // x 大于 y
    // if (Math.abs(pixelX) >= Math.abs(pixelY)) {
    //   table.refs.bodyWrapper.scrollLeft += data.pixelX / 5;
    // }
  };

  // 拖拽显示
  const handleDragVisible = (visible: boolean) => {
    // dragging.value = visible;
  };

  // 更新布局
  const handleLayout = () => {
    // 更新列的宽度
    layout.updateColumnsWidth();
  };

  // 大小改变
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
    const tableHeader: HTMLElement = table.refs.header;
    if (props.showHeader && tableHeader.offsetHeight !== oldHeaderHeight) {
      shouldUpdateLayout = true;
    }


    if (shouldUpdateLayout) {
      resizeState.value = {
        width,
        height,
        headerHeight: props.showHeader ? tableHeader.offsetHeight : null,
      };

      // 更新布局
      handleLayout();
    }

  };

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
    handleLayout,
    handleBindEvents,
  };
}

export default useStyle;
