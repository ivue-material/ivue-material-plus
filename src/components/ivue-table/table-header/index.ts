import {
  h,
  defineComponent,
  inject,
  getCurrentInstance,
  onMounted,
  nextTick
} from 'vue';
import IvueIcon from '../../ivue-icon/index.vue';

import useUtils from './utils';
import useStyle from './style';
import useEvent from './events';
import useTableLayoutObserver from '../table-layout-observer';

// ts
import type { PropType, ComponentInternalInstance, Ref } from 'vue';
import type { Store } from '../store';
import type { DefaultRow, Sort } from '../table/defaults';

const prefixCls = 'ivue-table';

export interface TableHeader extends ComponentInternalInstance {
  state: {
    handleColumnsChange
    handleScrollableWidthChange
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
  setup(props, { emit }) {
    // vm
    const vm: any = getCurrentInstance() as TableHeader;

    // inject
    const IvueTable: any = inject(prefixCls);

    const {
      // 获取当前列的行数
      columnRows,
      isGroup
    } = useUtils(props as TableHeaderProps<unknown>);

    const {
      // 头部行样式
      getHeaderCellClass,
      getHeaderCellStyle
    } = useStyle(props as TableHeaderProps<unknown>);

    // 事件
    const {
      handleSortClick,
      handleHeaderClick
    } = useEvent(props as TableHeaderProps<unknown>, emit);

    // 布局改变监听
    const { handleColumnsChange, handleScrollableWidthChange } = useTableLayoutObserver(IvueTable);

    vm.state = {
      handleColumnsChange,
      handleScrollableWidthChange
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
          style: getHeaderCellStyle(
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
          onClick: ($event) => {
            handleHeaderClick($event, column);
          }
        }, [
          // cell
          h('div',
            {
              class: 'cell'
            },
            [
              // 渲染头部
              column.renderHeader
                ? h('span', {}, [
                  column.renderHeader({
                    column,
                    $index: cellIndex,
                    store: props.store,
                    _self: vm.$parent,
                  })
                ])
                : column.label,
              // 排序
              column.sortable &&
              h(
                'span',
                {
                  class: `${prefixCls}-header--sortable`
                },
                [
                  h(IvueIcon, {
                    class: `${prefixCls}-header--ascending`,
                    onClick: ($event) => {
                      handleSortClick($event, column, 'ascending');
                    }
                  },
                    {
                      default: () => 'arrow_drop_up'
                    }
                  ),
                  h(IvueIcon, {
                    class: `${prefixCls}-header--descending`,
                    onClick: ($event) => {
                      handleSortClick($event, column, 'descending');
                    }
                  },
                    {
                      default: () => 'arrow_drop_down'
                    }
                  ),
                ]
              )
            ]
          )
        ]);
      });
    };


    // onMounted
    onMounted(() => {
      nextTick(() => {
        const { prop, order } = props.defaultSort;

        IvueTable?.store.commit('sort', { prop, order, init: true });
      });
    });

    return {
      columnRows,
      isGroup,
      handleColumnsChange,
      renderTh
    };

  },
  render() {
    const {
      columnRows,
      renderTh,
      isGroup
    } = this;

    const rowSpan = 1;

    return h(
      'thead',
      {
        class: {
          ['is-group']: isGroup
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
