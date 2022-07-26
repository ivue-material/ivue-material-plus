import {
  defineComponent,
  h,
  getCurrentInstance,
  ref,
  computed,
  onMounted,
  onBeforeMount,
} from 'vue';
import defaultProps from './defaults';

import useRender from './render';
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
      alignDirection,
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

    // 获取父级
    const parent = columnParent.value;

    // 设置列id
    columnId.value = `${parent.tableId || parent.columnId}-column-${columnIdSeed++}`;

    // onBeforeMount 在挂载开始之前被调用
    onBeforeMount(() => {
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
        align: alignDirection,
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
        // 是否是多头列表
        isColumnGroup: false,
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
    });


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

    // onMounted
    onMounted(() => {
      // const parent = columnParent.value;

      // 初始化
      initData();
    });
  },
  render() {
    return h('div', []);
  }
});
