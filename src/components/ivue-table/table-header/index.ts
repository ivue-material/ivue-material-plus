import {
  h,
  defineComponent
} from 'vue';

import useUtils from './utils';
import useStyle from './style';

// ts
import type { PropType, Ref } from 'vue';
import type { Store } from '../store';
import type { DefaultRow, Sort } from '../table/defaults';

export interface TableHeaderProps<T> {
  fixed: string
  store: Store<T>
  border: boolean
  defaultSort: Sort
}

export default defineComponent({
  props: {
    /**
     * 列是否固定在左侧或者右侧。 true 表示固定在左侧
     *
     * @type {String}
     */
    fixed: {
      type: String,
      default: '',
    },
    /**
     * store
     *
     * @type {Object}
     */
    store: {
      required: true,
      type: Object as PropType<TableHeaderProps<DefaultRow>['store']>,
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
     * 默认的排序列的 prop 和顺序。
     *
     * @type {Object}
     */
    defaultSort: {
      type: Object as PropType<TableHeaderProps<DefaultRow>['defaultSort']>,
      default: () => {
        return {
          prop: '',
          order: '',
        };
      },
    },
  },
  setup(props) {
    const {
      columnRows
    } = useUtils(props as TableHeaderProps<unknown>);

    const {
      getHeaderCellClass,
    } = useStyle(props as TableHeaderProps<unknown>);


    // methods

    // 渲染 th
    const renderTh = (list, rowSpan, rowIndex) => {
      return list.map((column, cellIndex) => {
        if (column.rowSpan > rowSpan) {
          rowSpan = column.rowSpan;
        }

        return h('th', {
          class: getHeaderCellClass(
            rowIndex,
            cellIndex,
            list,
            column
          ),
          colspan: column.colSpan,
          key: `${column.id}-thead`,
          rowspan: column.rowSpan,
        }, [
          // cell
          h('div',
            {
              class: [
                'cell'
              ]
            },
            [
              column.label
            ]
          )
        ]);
      });
    };


    return {
      columnRows,
      renderTh
    };

  },
  render() {

    const {
      columnRows,
      renderTh
    } = this;

    const rowSpan = 1;

    return h(
      'thead',
      {
        class: {
        }
      },
      columnRows.map((item, rowIndex) => {
        return h('tr',
          {
            key: rowIndex
          },
          renderTh(item, rowSpan, rowIndex)
        );
      })
    );
  }
});
