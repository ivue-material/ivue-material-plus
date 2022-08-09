import {
  defineComponent,
  h,
  getCurrentInstance,
  ref,
  computed,
  onMounted,
  onBeforeMount,
  Fragment,
  onBeforeUnmount
} from 'vue';
import {
  isString,
} from '@vue/shared';

import defaultProps from './defaults';

import useRender from './render';
import useWatcher from './watcher';

import { cellStyles, mergeOptions, compose } from '../config';

// ts
import type { TableColumn, TableColumnCtx } from './defaults';
import type { DefaultRow } from '../table/defaults';

const prefixCls = 'ivue-table-column';
let columnIdSeed = 1;

export default defineComponent({
  name: prefixCls,
  props: defaultProps,
  setup(props, { slots }) {
    const vm = getCurrentInstance() as TableColumn<DefaultRow>;

    // data

    // 列参数
    const columnConfig = ref<Partial<TableColumnCtx<DefaultRow>>>({});

    // computed

    // 获取父级元素
    const parentDom = computed(() => {
      let parent = vm.parent as any;

      // 没有表格id
      while (parent && !parent.tableId) {
        parent = parent.parent;
      }

      return parent;
    });


    // 开始渲染
    const {
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
      setColumnProps,
    } = useRender(props as unknown as TableColumnCtx<unknown>, slots, parentDom);

    const { registerNormalWatchers, registerComplexWatchers } = useWatcher(
      parentDom,
      props
    );

    // methods

    // 初始化
    const initData = () => {
      // 是否是嵌套的子列 获取 hiddenColumns 节点
      const children = isSubColumn.value ? parent.vnode.el.children : parent.refs.hiddenColumns?.children;

      // 获取当前行index
      const getColumnIndex = () => {
        return getColumnDomIndex(children || [], vm.vnode.el);
      };

      // 列参数
      columnConfig.value.getColumnIndex = getColumnIndex;

      // 插入列
      const columnIndex = getColumnIndex();

      // 存在列组件插入列节点
      if (columnIndex > -1) {
        parentDom.value.store.commit(
          'insertColumn',
          columnConfig.value,
          isSubColumn.value ? parent.columnConfig.value : null
        );
      }

    };

    // 在挂载开始之前被调用
    const initBeforeMount = () => {
      // 是否是嵌套的子列 父级不相等
      isSubColumn.value = parentDom.value !== parent;

      // 对应列的类型
      const type = props.type || 'default';

      // 对应列是否可以排序
      const sortable = props.sortable === '' ? true : props.sortable;

      // 默认参数
      const defaults = {
        // 行样式
        ...cellStyles[type],
        // id
        id: columnId.value,
        // 对应列的类型
        type,
        // 对应列内容的字段名
        property: props.prop || props.property,
        // 对齐方式
        align: align,
        // 表头对齐方式
        headerAlign: headerAlign,
        // 表头对齐方式
        showOverflowTooltip: props.showOverflowTooltip,
        // filter 相关属性
        filterable: props.filters || props.filterMethod,
        // 选中的数据过滤项
        filterValue: [],
        // 过滤弹出框的定位
        filterPlacement: '',
        // 过滤开启
        filterOpened: false,
        // 是否是嵌套的子列
        isSubColumn: false,
        // 对应列是否可以排序
        sortable,
        // index 列
        index: props.index,
        // <column key="xxx" />
        // 列 vode key
        rawColumnKey: vm.vnode.key,
      };

      // 基础 props
      const basicProps = [
        'columnKey',
        'label',
        'className',
        'labelClassName',
        'type',
        'renderHeader',
        'formatter',
        'fixed',
        'resizable',
      ];

      // 排序 props
      const sortProps = ['sortMethod', 'sortBy', 'sortOrders'];
      // 多选 props
      const selectProps = ['selectable', 'reserveSelection'];
      // 过滤 props
      const filterProps = [
        'filterMethod',
        'filters',
        'filterMultiple',
        'filterOpened',
        'filteredValue',
        'filterPlacement',
      ];

      // 获取props值
      let column = getPropsData(basicProps, sortProps, selectProps, filterProps);

      // 合并props值
      column = mergeOptions(defaults, column);

      // 合并函数
      const chains = compose(
        // 列渲染函数
        columnRender,
        // 设置列宽度
        setColumnWidth,
        // 设置列 props
        setColumnProps
      );

      column = chains(column);

      // 列参数
      columnConfig.value = column;

      // 注册 watcher

      // 注册普通观察者
      registerNormalWatchers();
      registerComplexWatchers();
    };

    // onBeforeMount
    onBeforeMount(() => {
      // 在挂载开始之前被调用
      initBeforeMount();
    });

    // onMounted
    onMounted(() => {
      // 初始化
      initData();
    });

    // onBeforeUnmount
    onBeforeUnmount(() => {
      parentDom.value.store.commit(
        'removeColumn',
        columnConfig.value,
        isSubColumn.value ? parent.columnConfig.value : null
      );
    });

    // 获取父级
    const parent = columnParent.value;
    // 设置列id
    columnId.value = `${parent.tableId || parent.columnId}-column-${columnIdSeed++}`;

    // 设置列id
    vm.columnId = columnId.value;

    // 列参数
    vm.columnConfig = columnConfig;
  },
  render() {
    try {
      const slotsList = this.$slots.default?.({
        row: {},
        column: {},
        $index: -1,
      });

      const slot = [];

      // 有插槽
      if (Array.isArray(slotsList)) {
        for (const childNode of slotsList) {
          // ivue-table-column 或者 函数组件 ((FUNCTIONAL_COMPONENT = 1 << 1) = 2) & 2 === 1
          if (
            childNode.type?.name === prefixCls || childNode.shapeFlag & 2
          ) {
            slot.push(childNode);
          }
          // 是否是片段 Fragment 多个根节点
          else if (
            childNode.type === Fragment &&
            Array.isArray(childNode.children)
          ) {
            childNode.children.forEach((vnode) => {
              /**
               * vnode为动态槽或文本时不渲染
               *
               * 1024
               * 表示具有动态插槽的组件（例如，引用 v-for 的插槽
               * 迭代值或动态插槽名称）。
               * 带有这个标志的组件总是被强制更新。
               */
              if (vnode?.patchFlag !== 1024 && !isString(vnode?.children)) {
                slot.push(vnode);
              }
            });
          }
        }
      }

      const vnode = h('div', slot);

      return vnode;
    }
    catch {
      return h('div', []);
    }
  }
});
