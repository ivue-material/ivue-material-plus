import { getCurrentInstance, unref, nextTick } from 'vue';
import useWatcher from './watcher';

// ts
import type { Ref } from 'vue';
import type { Table, Sort, Filter } from '../table/defaults';
import type { TableColumnCtx } from '../table-column/defaults';

// 监听props的数据
interface WatcherPropsData<T> {
  data: Ref<T[]>
  rowKey: Ref<string>
}

// 排序列
function sortColumn<T>(array: TableColumnCtx<T>[]) {
  array.forEach((item) => {

    // 当前index
    item.currentIndex = item.getColumnIndex?.();

    // 有子节点
    if (item.children?.length) {
      sortColumn(item.children);
    }
  });

  // 排序
  array.sort((cur, pre) => cur.currentIndex - pre.currentIndex);
}

// 设置列数
function replaceColumn<T>(
  array: TableColumnCtx<T>[],
  column: TableColumnCtx<T>
) {
  return array.map((item) => {
    // id是否相同返回当前列
    if (item.id === column.id) {
      return column;
    }
    // 有子列 获取子列的数据
    else if (item.children?.length) {
      item.children = replaceColumn(item.children, column);
    }

    return item;
  });
}


function useStore<T>() {
  // 获取当前实例
  const vm = getCurrentInstance() as Table<T>;

  // 监听函数
  const watcher = useWatcher<T>();

  // ts
  // 状态 ts
  type states = typeof watcher.states

  // 同步
  const mutations = {

    setData(states, data) {
      // 数据是否有改变
      const dataInstanceChanged = unref(states._data) !== data;

      states.data.value = data;
      states._data.value = data;

      // 根据 filters 与 sort 去过滤 data
      vm.store.handleExecQueryData();

      // 数据变化，更新部分数据。
      // 没有使用 computed，而是手动更新部分数据 https://github.com/vuejs/vue/issues/6660#issuecomment-331417140
      vm.store.updateCurrentRowData();

      // 更新展开行
      vm.store.updateExpandRows();

      // 更新树数据
      vm.store.updateTreeData(
        vm.store.states.defaultExpandAll.value
      );

      // 保存数据更新前选中的值
      if (unref(states.reserveSelection)) {
        // 检查 rowKey 是否存在
        vm.store.assertRowKey();
        // 更新多选框key
        vm.store.updateSelectionByRowKey();
      }
      else {
        // 数据变化，更新部分数据。
        if (dataInstanceChanged) {
          vm.store.clearSelection();
        }
        // 删除多余的数据(选择后当前表格中不存在的数据)
        else {
          vm.store.cleanRedundantSelection();
        }
      }

      // 更新是否选择全部行
      vm.store.updateAllSelected();

      // 初始化完成
      if (vm.$ready) {
        // 更新布局
        vm.store.scheduleLayout();
      }
    },
    // 用于多选表格，切换全选和全不选
    toggleAllSelection() {
      vm.store.toggleAllSelection();
    },
    // 设置当前行hover
    setHoverRow(states: states, row: T) {
      states.hoverRow.value = row;
    },
    // 插入列
    insertColumn(
      states: states,
      column: TableColumnCtx<T>,
      parent: TableColumnCtx<T>
    ) {
      const array = unref(states._columns);

      let newColumns: TableColumnCtx<T>[] = [];

      // 不是组合头部
      if (!parent) {
        array.push(column);

        newColumns = array;
      }
      // 组合头部
      else {
        if (parent && !parent.children) {
          parent.children = [];
        }

        // 设置子列
        parent.children && parent.children.push(column);

        // 设置为新的列
        newColumns = replaceColumn(array, parent);
      }

      // 排序列
      sortColumn(newColumns);

      // 记录当前列
      states._columns.value = newColumns;

      // 多选框
      if (column.type === 'selection') {
        // 仅对 type=selection 的列有效，类型为 Function，
        // Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
        states.selectable.value = column.selectable;

        // 保存数据更新前选中的值
        states.reserveSelection.value = column.reserveSelection;
      }

      // 用于动态插入列
      if (vm.$ready) {
        // 更新列数据
        vm.store.updateColumns();
        // 更新 DOM
        vm.store.scheduleLayout();
      }
    },
    // 删除行
    removeColumn(
      states: states,
      column: TableColumnCtx<T>,
      parent: TableColumnCtx<T>
    ) {
      const array = unref(states._columns) || [];

      // 有父节点
      if (parent && parent.children) {
        const findIndex = parent.children.findIndex((item) => item.id === column.id);

        // 移除当前行
        parent.children.splice(findIndex, 1);

        // 清空列表
        if (parent.children.length === 0) {
          delete parent.children;
        }

        states._columns.value = replaceColumn(array, parent);
      }
      // 没有父节点
      else {
        const index = array.indexOf(column);

        if (index > -1) {
          array.splice(index, 1);

          states._columns.value = array;
        }
      }

      // 用于动态插入列
      if (vm.$ready) {
        // 更新列数据
        vm.store.updateColumns();
        // 更新 DOM
        vm.store.scheduleLayout();
      }

    },
    // 单选选择当前行
    setCurrentRow(_states, row: T) {
      vm.store.updateCurrentRow(row);
    },
    // 多选
    rowSelectedChanged(_states, row: T) {
      vm.store.toggleRowSelection(row);
      vm.store.updateAllSelected();
    },
    // 改变排序
    changeSortCondition(states: states, options: Sort) {
      const { sortingColumn, sortProp, sortOrder } = states;

      // 没有排序
      if (unref(sortOrder) === null) {
        // 初始化需要排序的列
        states.sortingColumn.value = null;

        // 排序的key 对应列内容的字段名
        states.sortProp.value = null;
      }

      // 根据 filters 与 sort 去过滤 data
      vm.store.handleExecQueryData(false);

      // 没有选项不是初始化
      if (!options || !(options.silent || options.init)) {
        vm.emit('on-sort-change', {
          column: unref(sortingColumn),
          prop: unref(sortProp),
          order: unref(sortOrder),
        });
      }

      // 更新y轴滚动高度
      vm.store.updateTableScrollY();
    },
    // 初始化排序
    sort(states: states, options: Sort) {
      // 排序的key 对应列内容的字段名 | 排序顺序 ｜ 是否初始化
      const { prop, order, init } = options;

      // 排序的key 对应列内容的字段名
      if (prop) {

        // 找到需要排序的列
        const column = unref(states.columns).find(
          (column) => column.property === prop
        );

        // 有需要排序的列
        if (column) {
          // 排序顺序
          column.order = order;

          vm.store.updateSort(column, prop, order);
          vm.store.commit('changeSortCondition', { init });
        }
      }
    },
    // 过滤改变
    filterChange(states: states, options: Filter<T>) {
      const { column, values, silent } = options;

      const newFilters = vm.store.updateFilters(column, values);

      //  根据 filters 与 sort 去过滤 data
      vm.store.handleExecQueryData();

      // 是否不执行发送事件
      if (!silent) {
        vm.emit('on-filter-change', newFilters);
      }

      // 更新y轴滚动高度
      vm.store.updateTableScrollY();
    }
  };

  // 调用数据
  const commit = (name: keyof typeof mutations, ...args) => {
    const mutations: any = vm.store.mutations;

    // 判断 mutations 是否存在当前方法
    if (mutations[name]) {
      mutations[name].apply(vm, [vm.store.states].concat(args));
    }
    // 提示错误
    else {
      throw new Error(`Action not found: ${String(name)}`);
    }
  };

  // 更新y轴滚动高度
  const updateTableScrollY = () => {
    nextTick(() => {
      vm.layout.updateScrollY.apply(vm.layout);
    });
  };

  return {
    ...watcher,
    mutations,
    commit,
    updateTableScrollY
  };
}

export default useStore;

class HelperStore<T> {
  Return = useStore<T>()
}

type Store<T> = HelperStore<T>['Return']
type StoreFilter = Record<string, string[]>

export type { Store, WatcherPropsData, StoreFilter };
