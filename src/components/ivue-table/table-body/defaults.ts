
import type { PropType } from 'vue';
import type { Store } from '../store';
import type {
  ColumnCls,
  rowStyle,
  Table,
} from '../table/defaults';

interface TableBodyProps {
  store: Store;
  stripe?: boolean;
  context?: Table;
  rowClassName?: ColumnCls;
  rowStyle?: rowStyle;
  fixed?: string | any;
  highlight?: boolean;
  tooltipTheme?: 'dark' | 'light';
}

export default {
  /**
   * store
   *
   * @type {Object}
   */
  store: {
    required: true,
    type: Object as PropType<TableBodyProps['store']>,
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
    type: [String, Function] as PropType<TableBodyProps['rowClassName']>,
  },
  /**
   * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。。
   *
   * @type {String | Function}
   */
  rowStyle: {
    type: [Object, Function] as PropType<TableBodyProps['rowStyle']>,
  },
  /**
  * tooltip主题
  *
  * @type {String}
  */
  tooltipTheme: {
    type: String as PropType<TableBodyProps['tooltipTheme']>,
  }
};

export { TableBodyProps };
