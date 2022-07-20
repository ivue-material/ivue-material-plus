import { ref } from 'vue';

// 展开行
import useExpand from './expand';
// 嵌套数据
import useTree from './tree';

// ts
import type { Ref } from 'vue';
import type { TableColumnCtx } from '../table-column/defaults';


function useWatcher<T>() {

  // 显示的数据
  const data: Ref<T[]> = ref([]);
  // 行数据的 Key
  const rowKey: Ref<string> = ref(null);
  // 选择或取消选择所有行的值
  const selectOnIndeterminate = ref(false);
  // 选择全部
  const isAllSelected = ref(false);
  // 选择列表
  const selection = ref([]);
  // 是否有固定列
  const isFixedColumns = ref(false);
  // hover行
  const hoverRow = ref(null);
  // 列数据
  const originColumns: Ref<TableColumnCtx<T>[]> = ref([]);
  // 列
  const columns: Ref<TableColumnCtx<T>[]> = ref([]);

  // 用于多选表格，切换全选和全不选
  const _toggleAllSelection = () => {
    // // 当只选择了一些行（但不是全部）时，选择或取消选择所有行
    // // 取决于 selectOnIndeterminate 的值
    // const value = selectOnIndeterminate.value ? !isAllSelected.value : !(isAllSelected.value || selection.value.length);
    // // 设置是否选择全部
    // isAllSelected.value = value;

  };

  // 展开行数据
  const {
    states: expandStates,
  } = useExpand({
    data,
    rowKey,
  });

  // 嵌套数据
  const {
    states: treeStates,
  } = useTree({
    data,
    rowKey,
  });

  return {
    _toggleAllSelection,
    toggleAllSelection: null,
    // 状态
    states: {
      data,
      rowKey,
      selectOnIndeterminate,
      isFixedColumns,
      hoverRow,
      columns,
      originColumns,
      ...expandStates,
      ...treeStates
    }
  };
}

export default useWatcher;
