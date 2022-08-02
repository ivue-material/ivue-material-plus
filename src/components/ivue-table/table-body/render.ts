
import { h, inject } from 'vue';
import useStyles from './style';
import useEvents from './events';

// ts
import type { TableProps, TreeNode, RenderRowData } from '../table/defaults';
import type { TableBodyProps } from './defaults';

function useRender<T>(props: Partial<TableBodyProps<T>>) {

  // inject
  const IvueTable: any = inject('ivue-table');

  // 样式
  const {
    getRowClass,
    getRowStyle,
    getTableSpan,
    getCellClass,
    getCellStyle,
  } = useStyles(props);

  // 事件
  const {
    handleClickTr,
    handleCellMouseEnter
  } = useEvents(props);

  // methods

  // 获取行key
  const getRowKey = (row: T, index: number) => {
    const rowKey = (IvueTable.props as Partial<TableProps<T>>).rowKey;


    // if (rowKey) {
    // }

    return index;
  };

  // 渲染行
  const rowRender = (
    row: T,
    $index: number,
    expanded = false
  ) => {
    const { store } = props;

    const { columns } = store.states;

    // 行样式
    const rowClasses = getRowClass(row, $index);

    return h('tr', {
      class: rowClasses,
      style: [getRowStyle(row, $index)],
      key: getRowKey(row, $index),
      onClick: ($event) => {
        handleClickTr($event, row);
      }
    },
      columns.value.map((column, cellIndex) => {

        // 获取单元格样式
        const { rowspan, colspan } = getTableSpan(row, column, $index, cellIndex);

        // 是否存在单元格样式
        if (!rowspan || !colspan) {
          return null;
        }

        const baseKey = `${$index},${cellIndex}`;
        const columnData = { ...column };

        const patchKey = columnData.rawColumnKey || '';

        const data: RenderRowData<T> = {
          store: props.store,
          _self: props.context || IvueTable,
          column: columnData,
          row,
          $index,
          cellIndex,
          expanded,
        };

        return h(
          'td',
          {
            style: getCellStyle($index, cellIndex, row, column),
            class: getCellClass($index, cellIndex, row, column),
            rowspan,
            colspan,
            key: `${patchKey}${baseKey}`,
            onMouseenter: ($event) => {
              handleCellMouseEnter($event, row);
            }
          },
          [
            column.renderCell(data)
          ]
        );
      })
    );
  };

  // 渲染行
  const wrappedRowRender = (row: T, $index: number) => {


    return rowRender(row, $index);
  };

  return {
    wrappedRowRender
  };
}

export default useRender;
