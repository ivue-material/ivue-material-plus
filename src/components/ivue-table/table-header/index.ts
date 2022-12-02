import {
  h,
  defineComponent,
  inject,
  getCurrentInstance,
  onMounted,
  nextTick,
  ref
} from 'vue';
import IvueIcon from '../../ivue-icon/index.vue';

import useUtils from './utils';
import useStyle from './styles';
import useEvent from './events';
import useTableLayoutObserver from '../table-layout-observer';

import FilterPanel from '../table/filter-panel.vue';

// ts
import { TableContextKey } from '../table/defaults';
import type { TableColumnCtx } from '../table-column/defaults';
import type { PropType } from 'vue';
import type { TableHeader, FilterPanelInstance, TableHeaderProps } from './types';

const prefixCls = 'ivue-table';


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
      type: Object as PropType<TableHeaderProps['store']>,
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
      type: Object as PropType<TableHeaderProps['defaultSort']>,
      default: () => {
        return {
          prop: '',
          order: '',
        };
      },
    },
  },
  setup(props: TableHeaderProps, { emit }) {
    // vm
    const vm = getCurrentInstance() as TableHeader;

    // inject
    const IvueTable = inject(TableContextKey);

    // data

    // 过滤的列节点
    const filterPanels = ref<Record<number, FilterPanelInstance>>({});

    const {
      // 获取当前列的行数
      columnRows,
      isGroup
    } = useUtils(props);

    const {
      // 头部行样式
      getHeaderCellClass,
      getHeaderCellStyle,
      getHeaderRowStyle,
      getHeaderRowClass
    } = useStyle(props);

    // 事件
    const {
      handleSortClick,
      handleHeaderClick,
      handleMouseDown,
      handleMouseMove,
      handleMouseOut
    } = useEvent(props, emit);

    // 布局改变监听
    const { handleColumnsChange, handleScrollableWidthChange } = useTableLayoutObserver(IvueTable);

    vm.state = {
      handleColumnsChange,
      handleScrollableWidthChange
    };

    vm.filterPanels = filterPanels;

    // methods

    // 渲染排序
    const renderSortable = (column) => {

      // 是否有排序
      if (!column.sortable) {
        return null;
      }

      return h(
        'span',
        {
          class: `${prefixCls}-header--sortable`
        },
        [
          // 上按钮
          h(IvueIcon, {
            class: `${prefixCls}-header--ascending`,
            onClick: ($event: Event) => {
              handleSortClick($event, column, 'ascending');
            }
          },
            {
              default: () => 'arrow_drop_up'
            }
          ),
          // 下按钮
          h(IvueIcon, {
            class: `${prefixCls}-header--descending`,
            onClick: ($event: Event) => {
              handleSortClick($event, column, 'descending');
            }
          },
            {
              default: () => 'arrow_drop_down'
            }
          ),
        ]
      );
    };

    // 渲染头部
    const renderHeader = (column, cellIndex: number) => {
      // 是否有头部
      if (!column.renderHeader) {
        return column.label;
      }

      return h(
        'span',
        {},
        [
          column.renderHeader({
            column,
            $index: cellIndex,
            store: props.store,
            _self: vm.$parent,
          })
        ]);
    };

    // 渲染过滤
    const renderFilter = (column: TableColumnCtx) => {
      if (!column.filterable) {
        return null;
      }

      return h(
        FilterPanel,
        {
          // 当前列
          column,
          // store
          store: props.store,
          // 过滤弹出框的定位
          placement: column.filterPlacement,
          // 更新列数据
          upDataColumn: (key: string, value: boolean) => {
            column[key] = value;
          },
        });
    };

    // 渲染 th
    const renderTh = (list: TableColumnCtx[], rowSpan: number, rowIndex: number) => {
      return list.map((column: TableColumnCtx, cellIndex: number) => {
        // 规定单元格可横跨的行数
        if (column.rowSpan > rowSpan) {
          rowSpan = column.rowSpan;
        }

        return h('th', {
          // class
          class: getHeaderCellClass(
            rowIndex,
            cellIndex,
            list,
            column
          ),
          // style
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
          // key
          key: `${column.id}-thead`,
          onClick: ($event: Event) => {
            // 头部点击
            handleHeaderClick($event, column);
          },
          // 鼠标按下
          onMousedown: ($event: MouseEvent) => {
            handleMouseDown($event, column);
          },
          // 鼠标移动
          onMousemove: ($event: MouseEvent) => {
            handleMouseMove($event, column);
          },
          // 鼠标退出
          onMouseout: () => {
            handleMouseOut();
          },
        }, [
          // cell
          h('div',
            {
              class: [
                'cell',
                // 是否有选择过滤
                column.filteredValue && column.filteredValue.length > 0
                  ? 'highlight'
                  : '',
              ]
            },
            h('div',
              {
                class: 'cell-content'
              },
              [
                // 渲染头部
                renderHeader(column, cellIndex),
                // 排序
                renderSortable(column),
                // 渲染过滤
                renderFilter(column)
              ]
            )
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
      // data
      filterPanels,

      // computed
      isGroup,
      columnRows,

      // methods
      renderTh,
      handleColumnsChange,
      getHeaderRowStyle,
      getHeaderRowClass
    };

  },
  render() {
    const {
      columnRows,
      renderTh,
      isGroup,
      getHeaderRowStyle,
      getHeaderRowClass
    } = this;

    const rowSpan = 1;

    return h(
      'thead',
      {
        class: {
          ['is-group']: isGroup
        }
      },
      columnRows.map((item: TableColumnCtx, rowIndex: number) => {
        return h('tr',
          {
            class: getHeaderRowClass(rowIndex),
            style: getHeaderRowStyle(rowIndex),
            key: rowIndex
          },
          renderTh(item, rowSpan, rowIndex)
        );
      })
    );
  }
});
