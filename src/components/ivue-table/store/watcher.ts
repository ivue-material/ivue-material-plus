import { ref } from 'vue';

function useWatcher() {

  // 选择或取消选择所有行的值
  const selectOnIndeterminate = ref(false);
  // 选择全部
  const isAllSelected = ref(false);

  // 选择列表
  const selection = ref([]);


  // 用于多选表格，切换全选和全不选
  const _toggleAllSelection = () => {
    // 当只选择了一些行（但不是全部）时，选择或取消选择所有行
    // 取决于 selectOnIndeterminate 的值
    const value = selectOnIndeterminate.value ? !isAllSelected.value : !(isAllSelected.value || selection.value.length);
    // 设置是否选择全部
    isAllSelected.value = value;

  };

  return {
    _toggleAllSelection
  };
}

export default useWatcher;
