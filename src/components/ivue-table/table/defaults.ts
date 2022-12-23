
import type {
  ComponentInternalInstance,
  VNode,
  Ref,
  PropType,
  CSSProperties,
  InjectionKey
} from 'vue';
import { oneOf } from '../../../utils/assist';

import type { TableColumnCtx } from '../table-column/defaults';
import type { Store } from '../store/index';
import type TableLayout from '../table-layout';

// 列表行hover状态
type HoverState = NonNullable<{
  cell: HTMLElement
  column: TableColumnCtx
  row: TableColumnCtx
}>;

// 渲染可展开的按钮的内容
type RenderExpanded = ({
  row,
  $index,
  store,
  expanded,
}: Column) => VNode;

// 列表行
type Column = { row: TableColumnCtx; $index: number; store: Store; expanded: boolean };

// 列表行样式
type ColumnCls = string | ((data: { row: TableColumnCtx; rowIndex: number }) => string);

type ColumnStyle =
  | CSSProperties
  | ((data: { row: TableColumnCtx; rowIndex: number }) => CSSProperties);


// 自定义的合计计算方法
type SummaryMethod = (data: {
  columns: TableColumnCtx[]
  data: any[]
}) => string[];

// 设置表格单元、行和列的布局方式
type Layout = 'fixed' | 'auto';

type CellStyle =
  | CSSProperties
  | ((data: {
    row: TableColumnCtx
    rowIndex: number
    column: TableColumnCtx
    columnIndex: number
  }) => CSSProperties);

type CellCls =
  | string
  | ((data: {
    row: TableColumnCtx
    rowIndex: number
    column: TableColumnCtx
    columnIndex: number
  }) => string);

// refs
interface TableRefs {
  tableWrapper?: HTMLElement;
  headerWrapper?: HTMLElement;
  footerWrapper?: HTMLElement;
  fixedBodyWrapper?: HTMLElement;
  rightFixedBodyWrapper?: HTMLElement;
  bodyWrapper?: HTMLElement;
  [key: string]: any;
}

// 树节点
interface TreeNode {
  expanded?: boolean;
  loading?: boolean;
  noLazyChildren?: boolean;
  indent?: number;
  level?: number;
  display?: boolean;
}


// 渲染行数据
interface RenderRowData {
  treeNode?: TreeNode
  store: Store
  _self: Table
  expanded: boolean
  column: TableColumnCtx
  row: TableColumnCtx
  $index: number
  cellIndex: number
}

// 表格状态
interface TableState {
  isGroup: Ref<boolean>;
  resizeState: Ref<{
    width: null | number
    height: null | number
  }>;
  updateLayout: () => void;
  debouncedUpdateLayout: () => void;
}

// 过滤
interface Filter {
  column: TableColumnCtx;
  values: string[];
  silent: boolean;
}


interface Sort {
  prop: string;
  order: 'ascending' | 'descending';
  init?: boolean;
  silent?: boolean;
}

// 表格 data
interface Table extends ComponentInternalInstance {
  // onMounted 是否渲染完成
  $ready?: boolean;
  // 列表行hover状态
  hoverState?: HoverState | null;
  // 渲染可展开的按钮的内容
  renderExpanded?: RenderExpanded;
  // store
  store?: Store;
  // layout
  layout?: TableLayout;
  // refs
  refs: TableRefs;
  // id
  tableId?: string;
  // 行id
  columnId?: string;
  // 表格状态
  state?: TableState;
}

// 表格 props
interface TableProps {
  data: any[];
  // 列的宽度是否自撑开
  fit?: boolean;
  // 是否带有纵向边框
  border: boolean;
  // Table 的最大高度。 合法的值为数字或者单位为 px 的高度。
  maxHeight: string | number;
  // 是否显示表头
  showHeader?: boolean;
  // 渲染嵌套数据的配置选项
  // { hasChildren: 'hasChildren', children: 'children' }
  treeProps?: {
    hasChildren?: string
    children?: string
  };
  // 行数据的 Key
  rowKey?: string | ((row: TableColumnCtx) => string);
  // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  defaultExpandAll?: boolean;
  // 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。
  // 若为 true，则选中所有行；若为 false，则取消选择所有行
  selectOnIndeterminate?: boolean;
  // 是否懒加载子节点数据
  lazy?: boolean;
  // 是否在表尾显示合计行
  showSummary?: boolean;
  // 设置表格单元、行和列的布局方式
  tableLayout: Layout;
  // Table 的高度 默认为自动高度
  height?: string | number;
  // 默认的排序列的 prop 和顺序。
  // 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序
  defaultSort?: Sort;
  // 内容
  context?: Table;
  // 是否为斑马纹 table
  stripe?: boolean;
  // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
  rowClassName?: ColumnCls;
  // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style
  rowStyle?: ColumnStyle;
  // 是否要高亮当前行
  highlightCurrentRow?: boolean;
  // 以通过该属性设置 Table 目前的展开行
  expandRowKeys?: any[];
  // 加载子节点数据的函数
  load?: (row: TableColumnCtx, treeNode: TreeNode, resolve: (data: any[]) => void) => void;
  // 合计行第一列的文本
  sumText?: string;
  // 自定义的合计计算方法
  summaryMethod?: SummaryMethod;
  // 合并行或列的计算方法
  spanMethod?: (data: {
    row: TableColumnCtx
    rowIndex: number
    column: TableColumnCtx
    columnIndex: number
  }) =>
    | number[]
    | {
      rowspan: number
      colspan: number
    }
    | undefined;
  // 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style
  headerCellStyle?: CellStyle;
  // 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className
  headerCellClassName?: CellCls;
  // 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style
  headerRowStyle?: ColumnStyle;
  // 表头行的 className 的回调方法
  headerRowClassName?: ColumnCls;
  // 单元格的 style 的回调方法
  cellStyle?: CellStyle;
  // 单元格的 className 的回调方法
  cellClassName?: CellCls;
  // tooltip 主题
  tooltipTheme?: 'dark' | 'light';
  // tooltip点击是否阻止当前事件在捕获和冒泡阶段的进一步传播
  tooltipStop?: boolean
}

// 行样式
type rowClass = string | ((data: { row: TableColumnCtx; rowIndex: number }) => string)

// 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
type rowStyle = | CSSProperties | ((data: { row: TableColumnCtx; rowIndex: number }) => CSSProperties)

export const TableContextKey: InjectionKey<Table> =
  Symbol('ivue-table');

export default {
  /**
   * 显示的数据
   *
   * @type {Array}
   */
  data: {
    type: Array as PropType<TableColumnCtx[]>,
    default: () => {
      return [];
    },
  },
  /**
   * 列的宽度是否自撑开
   *
   * @type {Boolean}
   */
  fit: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否带有纵向边框
   *
   * @type {Boolean}
   */
  border: {
    type: Boolean,
    default: false,
  },
  /**
   * Table 的高度， 默认为自动高度。
   * 如果 height 为 number 类型，单位 px；
   * 如果 height 为 string 类型，
   * 则这个高度会设置为 Table 的 style.height 的值，
   * Table 的高度会受控于外部样式。
   *
   * @type {String | Number}
   */
  height: {
    type: [String, Number],
    default: null,
  },
  /**
   * Table 的最大高度。 合法的值为数字或者单位为 px 的高度。
   *
   * @type {String, Number}
   */
  maxHeight: {
    type: [String, Number],
    default: null,
  },
  /**
   * 是否显示表头
   *
   * @type {Boolean}
   */
  showHeader: {
    type: Boolean,
    default: true,
  },
  /**
   * 渲染嵌套数据的配置选项
   *
   * { hasChildren: 'hasChildren', children: 'children' }
   *
   * @type {Object}
   */
  treeProps: {
    type: Object as PropType<TableProps['treeProps']>,
    default: () => {
      return {
        hasChildren: 'hasChildren',
        children: 'children',
      };
    },
  },
  /**
   * 行数据的 Key
   *
   * @type {String, Function}
   */
  rowKey: {
    type: [String, Function] as PropType<TableProps['rowKey']>,
  },
  /**
   * 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
   *
   * @type {Boolean}
   */
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  /**
   * 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。
   * 若为 true，则选中所有行；若为 false，则取消选择所有行
   *
   * @type {Boolean}
   */
  selectOnIndeterminate: {
    type: Boolean,
    default: true,
  },
  /**
   * indent	展示树形数据时，树节点的缩进
   *
   * @type {Number}
   */
  indent: {
    type: Number,
    default: 16,
  },
  /**
   * 是否懒加载子节点数据
   *
   * @type {Boolean}
   */
  lazy: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否在表尾显示合计行
   *
   * @type {Boolean}
   */
  showSummary: {
    type: Boolean,
    default: false,
  },
  /**
   * 设置表格单元、行和列的布局方式
   *
   * fixed / auto
   *
   * @type {String}
   */
  tableLayout: {
    type: String as PropType<Layout>,
    validator(value: string) {
      return oneOf(value, ['fixed', 'auto']);
    },
    default: 'fixed',
  },
  /**
   * 默认的排序列的 prop 和顺序。
   * 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序
   *
   * @type {object}
   */
  defaultSort: {
    type: Object as PropType<TableProps['defaultSort']>,
  },
  /**
   * 提示
   *
   * @type {String}
   */
  placeholder: {
    type: String,
    default: 'No Data'
  },
  /**
   * 滚动条总是显示
   *
   * @type {Boolean}
   */
  scrollbarAlways: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否为斑马纹 table
   *
   * @type {Boolean}
   */
  stripe: {
    type: Boolean,
    default: false,
  },
  /**
   * 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
   *
   * @type {String | Function}
   */
  rowClassName: {
    type: [String, Function] as PropType<TableProps['rowClassName']>,
  },
  /**
   * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
   *
   * @type {Object, Function}
   */
  rowStyle: {
    type: [Object, Function] as PropType<TableProps['rowStyle']>,
  },
  /**
   * 是否要高亮当前行
   *
   * @type {Boolean}
   */
  highlightCurrentRow: {
    type: Boolean,
    default: false,
  },
  /**
   * 可以通过该属性设置 Table 目前的展开行
   *
   * @type {Array}
   */
  expandRowKeys: {
    type: Array as PropType<TableProps['expandRowKeys']>,
  },
  /**
   * 加载子节点数据的函数
   *
   * @type {Function}
   */
  load: {
    type: Function as PropType<TableProps['load']>
  },
  /**
   * 合计行第一列的文本
   *
   * @type {String}
   */
  sumText: {
    type: String,
    default: '合计'
  },
  /**
   * 自定义的合计计算方法
   *
   * @type {Function}
   */
  summaryMethod: {
    type: Function as PropType<TableProps['summaryMethod']>,
  },
  /**
   * 合并行或列的计算方法
   *
   * @type {Function}
   */
  spanMethod: {
    type: Function as PropType<TableProps['spanMethod']>
  },
  /**
   * 表头单元格的 style 的回调方法，
   * 也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style
   *
   * @type {Object, Function}
   */
  headerCellStyle: {
    type: [Object, Function] as PropType<TableProps['headerCellStyle']>,
  },
  /**
   * 表头单元格的 className 的回调方法，
   * 也可以使用字符串为所有表头单元格设置一个固定的 className
   *
   * @type {String, Function}
   */
  headerCellClassName: {
    type: [String, Function] as PropType<TableProps['headerCellClassName']>,
  },
  /**
   * 表头行的 style 的回调方法，
   * 也可以使用一个固定的 Object 为所有表头行设置一样的 Style
   *
   * @type {Object, Function}
   */
  headerRowStyle: {
    type: [Object, Function] as PropType<TableProps['headerRowStyle']>
  },
  /**
   * 表头行的 className 的回调方法
   *
   * @type {String, Function}
   */
  headerRowClassName: {
    type: [String, Function] as PropType<TableProps['headerRowClassName']>,
  },
  /**
   * 单元格的 style 的回调方法
   *
   * @type {Object, Function}
   */
  cellStyle: {
    type: [Object, Function] as PropType<TableProps['cellStyle']>,
  },
  /**
   * 单元格的 className 的回调方法
   *
   * @type {String, Function}
   */
  cellClassName: {
    type: [String, Function] as PropType<TableProps['cellClassName']>,
  },
  /**
   * tooltip主题
   *
   * @type {String}
   */
  tooltipTheme: {
    type: String as PropType<TableProps['tooltipTheme']>,
    validator(value: string) {
      return oneOf(value, ['dark', 'light']);
    },
    default: 'dark'
  },
  /**
  * tooltip点击是否阻止当前事件在捕获和冒泡阶段的进一步传播
  *
  * @type {String}
  */
  tooltipStop: {
    type: Boolean,
    default: false
  }
};

export type {
  Table,
  TableProps,
  TreeNode,
  RenderRowData,
  Sort,
  rowClass,
  rowStyle,
  ColumnCls,
  Filter,
  SummaryMethod,
  TableRefs,
  RenderExpanded
};
