
import type { PropType } from 'vue';
import type { Store } from '../store';
import type {
  ColumnCls,
  rowStyle,
  Table,
  DefaultRow
} from '../table/defaults';


interface TableBodyProps<T> {
  store: Store<T>
  stripe?: boolean
  context: Table<T>
  rowClassName: ColumnCls<T>
  rowStyle: rowStyle<T>
  fixed: string | any
  highlight: boolean
  tooltipEffect: string
}

export default {
  /**
   * store
   *
   * @type {Object}
   */
  store: {
    required: true,
    type: Object as PropType<TableBodyProps<DefaultRow>['store']>,
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
    type: [String, Function] as PropType<TableBodyProps<DefaultRow>['rowClassName']>,
  },
  /**
   * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。。
   *
   * @type {String | Function}
   */
  rowStyle: {
    type: [Object, Function] as PropType<TableBodyProps<DefaultRow>['rowStyle']>,
  }
};

export { TableBodyProps };
