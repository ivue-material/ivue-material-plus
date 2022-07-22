
import type { PropType } from 'vue';
import type { Store } from '../store';
import type {
  rowClass,
  rowStyle,
  Table,
  DefaultRow
} from '../table/defaults';


interface TableBodyProps<T> {
  store: Store<T>
  stripe?: boolean
  context: Table<T>
  rowClassName: rowClass<T>
  rowStyle: rowStyle<T>
  fixed: string
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
};

export { TableBodyProps };
