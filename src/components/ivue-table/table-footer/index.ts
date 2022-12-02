import { defineComponent, h, PropType } from 'vue';
import useStyle from './styles';
import IvueColgroup from '../colgroup';

// type
import { TableFooter, Props } from './types';
import type { TableColumnCtx } from '../table-column/defaults';

const prefixCls = 'ivue-table-footer';


export default defineComponent({
  name: prefixCls,
  props: {
    /**
     * 是否带有纵向边框
     *
     * @type {Boolean}
     */
    border: {
      type: Boolean
    },
    /**
     * store
     *
     * @type {Object}
     */
    store: {
      required: true,
      type: Object as PropType<TableFooter['store']>,
    },
    /**
     * 自定义的合计计算方法
     *
     * @type {Function}
     */
    summaryMethod: Function as PropType<TableFooter['summaryMethod']>,
    /**
     * 合计行第一列的文本
     *
     * @type {String}
     */
    sumText: {
      type: String,
    },
    /**
     * 默认的排序列的 prop 和顺序。
     *
     * @type {Object}
     */
    defaultSort: {
      type: Object as PropType<TableFooter['defaultSort']>,
      default: () => {
        return {
          prop: '',
          order: '',
        };
      },
    },
  },
  setup(props: Props) {
    const {
      columns,
      getCellClass,
      getCellStyle,
    } = useStyle(props);

    // methods

    // 渲染 colgroup
    const renderColgroup = () => {
      return h(IvueColgroup, {
        columns: columns.value
      });
    };

    // 渲染td
    const renderTd = () => {
      let sums = [];

      // 没行的数据
      const data = props.store.states.data.value;

      // 自定义的合计计算方法
      if (props.summaryMethod) {
        sums = props.summaryMethod({
          columns: columns.value,
          data,
        });
      }
      // 没有自定义的合计计算方法
      else {
        columns.value.forEach((column: TableColumnCtx, index: number) => {

          // 合计行第一列的文本
          if (index === 0) {
            sums[index] = props.sumText;

            return;
          }

          const values = data.map((item) => {
            return Number(item[column.property]);
          });

          const precisions: number[] = [];
          let notNumber = true;

          values.forEach((value) => {
            if (!Number.isNaN(+value)) {
              notNumber = false;

              const decimal = `${value}`.split('.')[1];

              precisions.push(decimal ? decimal.length : 0);
            }
          });

          const precision = Math.max.apply(null, precisions);

          // 是数字
          if (!notNumber) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);

              // 是数字
              if (!Number.isNaN(+value)) {
                // 保留两位小数
                return Number.parseFloat(
                  (prev + curr).toFixed(Math.min(precision, 20))
                );
              } else {
                return prev;
              }
            }, 0);
          }
          // 不是数字
          else {
            sums[index] = '';
          }
        });
      }

      return columns.value.map((column, cellIndex) => {
        return h('td',
          {
            key: cellIndex,
            colspan: column.colSpan,
            rowspan: column.rowSpan,
            class: getCellClass(columns.value, cellIndex),
            style: getCellStyle(column, cellIndex),
          },
          [
            h(
              'div',
              {
                class: ['cell', column.labelClassName],
              },
              [sums[cellIndex]]
            ),
          ]
        );
      });
    };


    return {
      renderColgroup,
      renderTd
    };

  },
  render() {

    return h('table',
      {
        class: prefixCls,
        cellspacing: '0',
        cellpadding: '0',
        border: '0',
      },
      [
        this.renderColgroup(),
        h('tbody', [
          h('tr', {}, [
            this.renderTd()
          ])
        ])
      ]
    );
  }
});
