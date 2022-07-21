
import {
  computed,
  ref,
  onMounted,
  nextTick
} from 'vue';


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


  // methods

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

    // x 大于 y
    if (Math.abs(pixelX) >= Math.abs(pixelY)) {
      table.refs.bodyWrapper.scrollLeft += data.pixelX / 5;
    }
  };

  // 拖拽显示
  const handleDragVisible = (visible: boolean) => {
    dragging.value = visible;
  };


  // onMounted
  onMounted(() => {
    // 更新列
    store.updateColumns();

    // 初始化完成
    table.$ready = true;
  });

  return {
    // data
    dragging,
    renderExpanded,

    // computed
    tableLayout,
    contentStyles,
    tableStyles,

    // methods
    handleMouseLeave,
    handleMousewheel,
    handleDragVisible
  };
}

export default useStyle;
