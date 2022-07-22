import {
  h,
  defineComponent,
  inject,
  getCurrentInstance
} from 'vue';

import useUtils from './utils';
import useStyle from './style';
import useTableLayoutObserver from '../table-layout-observer';

// ts
import type { PropType, ComponentInternalInstance, Ref } from 'vue';
import type { Store } from '../store';
import type { DefaultRow, Sort } from '../table/defaults';

export interface TableHeader extends ComponentInternalInstance {
  state: {
    handleColumnsChange
  }
  filterPanels: Ref<unknown>
}

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
    // vm
    const vm = getCurrentInstance() as TableHeader;

    // inject
    const IvueTable: any = inject('ivue-table');

    const {
      // 获取当前列的行数
      columnRows
    } = useUtils(props as TableHeaderProps<unknown>);

    const {
      // 头部行样式
      getHeaderCellClass,
    } = useStyle(props as TableHeaderProps<unknown>);


    // 布局改变监听
    const { handleColumnsChange } = useTableLayoutObserver(IvueTable);

    vm.state = {
      handleColumnsChange,
    };

    // methods

    // 渲染 th
    const renderTh = (list, rowSpan, rowIndex) => {
      return list.map((column, cellIndex) => {

        // 规定单元格可横跨的行数
        if (column.rowSpan > rowSpan) {
          rowSpan = column.rowSpan;
        }

        return h('th', {
          // 合并样式s
          class: getHeaderCellClass(
            rowIndex,
            cellIndex,
            list,
            column
          ),
          // 规定单元格可横跨的列数。
          colspan: column.colSpan,
          // 规定单元格可横跨的行数
          rowspan: column.rowSpan,
          key: `${column.id}-thead`,
        }, [
          // cell
          h('div',
            {
              class: 'cell'
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
      handleColumnsChange,
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
