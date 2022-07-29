import { getCurrentInstance, watch } from 'vue';
import { hasOwn } from '@vue/shared';

// ts
import type { ComputedRef } from 'vue';
import type { TableColumnCtx, TableColumn, ValueOf } from './defaults';
import { parseWidth, parseMinWidth } from '../utils';


// 获取所有别名
function getAllAliases(props, aliases) {
  return props.reduce((prev, cur) => {
    prev[cur] = cur;
    return prev;
  }, aliases);
}

function useWatcher<T>(
  parentDom: ComputedRef<any>,
  _props: any
) {

  // vm
  const vm = getCurrentInstance() as TableColumn<T>;

  // 注册复杂观察者
  const registerComplexWatchers = () => {

    // 固定
    const props = ['fixed'];

    const aliases = {
      columnWidth: 'width',
      columnMinWidth: 'minWidth',
    };

    const allAliases = getAllAliases(props, aliases);

    Object.keys(allAliases).forEach((key) => {

      // 行key
      const columnKey = aliases[key];

      // 是否有该属性
      if (hasOwn(_props, columnKey)) {
        // 注册监听者
        watch(
          () => _props[columnKey],
          (newVal) => {
            let value: ValueOf<TableColumnCtx<T>> = newVal;

            // 对应列的宽度
            if (columnKey === 'width' && key === 'columnWidth') {
              value = parseWidth(newVal);
            }

            // 对应列的最小宽度
            if (columnKey === 'minWidth' && key === 'columnMinWidth') {
              value = parseMinWidth(newVal);
            }

            // 更新行的porps
            vm.columnConfig.value[columnKey as any] = value;
            vm.columnConfig.value[key] = value;


            // 如果是固定列 更新 DOM
            const updateColumns = columnKey === 'fixed';
            parentDom.value.store.scheduleLayout(updateColumns);
          }
        );
      }
    });
  };

  // 注册watch
  const registerNormalWatchers = () => {

    // props
    const props = [
      'label',
      'filters',
      'filterMultiple',
      'sortable',
      'index',
      'formatter',
      'className',
      'labelClassName',
      'showOverflowTooltip',
    ];

    // aliases
    const aliases = {
      property: 'prop',
      align: 'realAlign',
      headerAlign: 'realHeaderAlign',
    };

    // 获取所有别名
    const allAliases = getAllAliases(props, aliases);

    Object.keys(allAliases).forEach((key) => {
      const columnKey = aliases[key];

      // 是否有该属性
      if (hasOwn(_props, columnKey)) {
        // 注册监听者
        watch(
          () => _props[columnKey],
          (newVal) => {
            // 更新行的porps
            vm.columnConfig.value[key] = newVal;
          }
        );
      }
    });
  };



  return {
    registerNormalWatchers,
    registerComplexWatchers
  };
}

export default useWatcher;
