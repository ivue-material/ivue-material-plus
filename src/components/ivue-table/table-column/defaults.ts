
import type { VNode } from 'vue';

// 插槽内容 slots
type SlotsContent<T> = { column: TableColumnCtx<T>; $index: number }

type FilterMethods<T> = (value, row: T, column: TableColumnCtx<T>) => void

// 数据过滤的选项
// 数组格式，数组中的元素需要有 text 和 value 属性。 数组中的每个元素都需要有 text 和 value 属性。
// array[{ text, value }]
type Filters = {
  text: string
  value: string
}[]

// 列表行
interface TableColumnCtx<T> {
  id: string
  realWidth: number
  type: string
  label: string
  className: string
  labelClassName: string
  property: string
  prop: string
  width: string | number
  minWidth: string | number
  renderHeader: (data: SlotsContent<T>) => VNode
  sortable: boolean | string
  sortMethod: (a: T, b: T) => number
  sortBy: string | ((row: T, index: number) => string) | string[]
  resizable: boolean
  columnKey: string
  rawColumnKey: string
  align: string
  headerAlign: string
  showTooltipWhenOverflow: boolean
  showOverflowTooltip: boolean
  fixed: boolean | string
  formatter: (
    row: T,
    column: TableColumnCtx<T>,
    cellValue,
    index: number
  ) => VNode | string
  selectable: (row: T, index: number) => boolean
  reserveSelection: boolean
  filterMethod: FilterMethods<T>
  filteredValue: string[]
  filters: Filters
  filterPlacement: string
  filterMultiple: boolean
  index: number | ((index: number) => number)
  sortOrders: ('ascending' | 'descending' | null)[]
  renderCell: (data: any) => void
  colSpan: number
  rowSpan: number
  children: TableColumnCtx<T>[]
  level: number
  filterable: boolean | FilterMethods<T> | Filters
  order: string
  isColumnGroup: boolean
  isSubColumn: boolean
  columns: TableColumnCtx<T>[]
  getColumnIndex: () => number
  no: number
  filterOpened?: boolean
}

export type { TableColumnCtx };
