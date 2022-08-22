
import type {
  ComponentInternalInstance,
  VNode,
  Ref,
  PropType,
  CSSProperties
} from 'vue';
import type { TableColumnCtx } from '../table-column/defaults';
import type { Store } from '../store/index';
import type TableLayout from '../table-layout';

// 泛型
export type DefaultRow = any

// 列表行hover状态
type HoverState<T> = Nullable<{
  cell: HTMLElement
  column: TableColumnCtx<T>
  row: T
}>

// 渲染可展开的按钮的内容
type RenderExpanded<T> = ({
  row,
  $index,
  store,
  expanded: boolean,
}: Column<T>) => VNode

// 列表行
type Column<T> = { row: T; $index: number; store: Store<T>; expanded: boolean }

// 列表行样式
type ColumnCls<T> = string | ((data: { row: T; rowIndex: number }) => string)

type ColumnStyle<T> =
  | CSSProperties
  | ((data: { row: T; rowIndex: number }) => CSSProperties)


// 自定义的合计计算方法
type SummaryMethod<T> = (data: {
  columns: TableColumnCtx<T>[]
  data: T[]
}) => string[]

// 设置表格单元、行和列的布局方式
type Layout = 'fixed' | 'auto'

type CellStyle<T> =
  | CSSProperties
  | ((data: {
    row: T
    rowIndex: number
    column: TableColumnCtx<T>
    columnIndex: number
  }) => CSSProperties)

type CellCls<T> =
  | string
  | ((data: {
    row: T
    rowIndex: number
    column: TableColumnCtx<T>
    columnIndex: number
  }) => string)

// refs
interface TableRefs {
  tableWrapper: HTMLElement
  headerWrapper: HTMLElement
  footerWrapper: HTMLElement
  fixedBodyWrapper: HTMLElement
  rightFixedBodyWrapper: HTMLElement
  bodyWrapper: HTMLElement
  [key: string]: any
}

// 树节点
interface TreeNode {
  expanded?: boolean
  loading?: boolean
  noLazyChildren?: boolean
  indent?: number
  level?: number
  display?: boolean
}


// 渲染行数据
interface RenderRowData<T> {
  treeNode?: TreeNode
  store: Store<T>
  _self: Table<T>
  expanded: boolean
  column: TableColumnCtx<T>
  row: T
  $index: number
  cellIndex: number
}

// 表格状态
interface TableState {
  isGroup: Ref<boolean>
  resizeState: Ref<{
    width: any
    height: any
  }>
  updateLayout: () => void
  debouncedUpdateLayout: () => void
}

// 过滤
interface Filter<T> {
  column: TableColumnCtx<T>
  values: string[]
  silent: any
}


interface Sort {
  prop: string
  order: 'ascending' | 'descending'
  init?: any
  silent?: any
}

// 表格 data
interface Table<T> extends ComponentInternalInstance {
  // onMounted 是否渲染完成
  $ready: boolean
  // 列表行hover状态
  hoverState?: HoverState<T>
  // 渲染可展开的按钮的内容
  renderExpanded: RenderExpanded<T>
  // store
  store: Store<T>
  // layout
  layout: TableLayout<T>
  // refs
  refs: TableRefs
  // id
  tableId: string
  // 表格状态
  state: TableState,
}

// 表格 props
interface TableProps<T> {
  data: T[]
  // 列的宽度是否自撑开
  fit?: boolean
  // 是否带有纵向边框
  border: boolean
  // Table 的最大高度。 合法的值为数字或者单位为 px 的高度。
  maxHeight: string | number
  // 是否显示表头
  showHeader?: boolean,
  // 渲染嵌套数据的配置选项
  // { hasChildren: 'hasChildren', children: 'children' }
  treeProps?: {
    hasChildren?: string
    children?: string
  },
  // 行数据的 Key
  rowKey?: string | ((row: T) => string)
  // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  defaultExpandAll?: boolean
  // 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。
  // 若为 true，则选中所有行；若为 false，则取消选择所有行
  selectOnIndeterminate?: boolean,
  // 是否懒加载子节点数据
  lazy?: boolean,
  // 是否在表尾显示合计行
  showSummary?: boolean,
  // 设置表格单元、行和列的布局方式
  tableLayout: Layout,
  // Table 的高度 默认为自动高度
  height?: string | number,
  // 默认的排序列的 prop 和顺序。
  // 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序
  defaultSort?: Sort
  // 内容
  context?: Table<T>
  // 是否为斑马纹 table
  stripe?: boolean
  // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
  rowClassName?: ColumnCls<T>
  // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style
  rowStyle?: ColumnStyle<T>
  // 是否要高亮当前行
  highlightCurrentRow?: boolean,
  // 以通过该属性设置 Table 目前的展开行
  expandRowKeys?: any[],
  // 加载子节点数据的函数
  load?: (row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => void
  // 合计行第一列的文本
  sumText?: string
  // 自定义的合计计算方法
  summaryMethod?: SummaryMethod<T>
  // 合并行或列的计算方法
  spanMethod?: (data: {
    row: T
    rowIndex: number
    column: TableColumnCtx<T>
    columnIndex: number
  }) =>
    | number[]
    | {
      rowspan: number
      colspan: number
    }
    | undefined
  // 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style
  headerCellStyle?: CellStyle<T>
  // 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className
  headerCellClassName?: CellCls<T>
}

// 行样式
type rowClass<T> = string | ((data: { row: T; rowIndex: number }) => string)

// 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
type rowStyle<T> = | CSSProperties | ((data: { row: T; rowIndex: number }) => CSSProperties)

export default {
  /**
   * 显示的数据
   *
   * @type {Array}
   */
  data: {
    type: Array as PropType<DefaultRow[]>,
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
    type: [String, Number] as PropType<any>,
    default: null,
  },
  /**
   * Table 的最大高度。 合法的值为数字或者单位为 px 的高度。
   *
   * @type {String, Number}
   */
  maxHeight: {
    type: [String, Number] as PropType<any>,
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
    type: Object as PropType<TableProps<DefaultRow>['treeProps']>,
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
  rowKey: [String, Function] as PropType<TableProps<DefaultRow>['rowKey']>,
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
    default: 'fixed',
  },
  /**
   * 默认的排序列的 prop 和顺序。
   * 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序
   *
   * @type {object}
   */
  defaultSort: {
    type: Object as PropType<TableProps<DefaultRow>['defaultSort']>,
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
    type: [String, Function] as PropType<TableProps<DefaultRow>['rowClassName']>,
  },
  /**
   * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
   *
   * @type {Object, Function}
   */
  rowStyle: {
    type: [Object, Function] as PropType<TableProps<DefaultRow>['rowStyle']>,
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
    type: Array as PropType<TableProps<DefaultRow>['expandRowKeys']>,
  },
  /**
   * 加载子节点数据的函数
   *
   * @type {Function}
   */
  load: {
    type: Function as PropType<TableProps<DefaultRow>['load']>
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
    type: Function as PropType<TableProps<DefaultRow>['summaryMethod']>,
  },
  /**
   * 合并行或列的计算方法
   *
   * @type {Function}
   */
  spanMethod: {
    type: Function as PropType<TableProps<DefaultRow>['spanMethod']>
  },
  /**
   * 表头单元格的 style 的回调方法，
   * 也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style
   *
   * @type {Object, Function}
   */
  headerCellStyle: {
    type: [Object, Function] as PropType<TableProps<DefaultRow>['headerCellStyle']>,
  },
  /**
   * 表头单元格的 className 的回调方法，
   * 也可以使用字符串为所有表头单元格设置一个固定的 className
   *
   * @type {String, Function}
   */
  headerCellClassName: {
    type: [String, Function] as PropType<TableProps<DefaultRow>['headerCellClassName']>,
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
  SummaryMethod
};
