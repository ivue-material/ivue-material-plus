
import { h, inject } from 'vue';
import useStyles from './styles';
import useEvents from './events';
import { getRowIdentity } from '../utils';

// ts
import type { TableProps, RenderRowData } from '../table/defaults';
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
    handleCellMouseEnter,
    handleMouseEnter,
    handleMouseLeave
  } = useEvents(props);

  // methods

  // 获取行key
  const getRowKey = (row: T, index: number) => {
    const rowKey = (IvueTable.props as Partial<TableProps<T>>).rowKey;

    // 有自定义 rowKey
    if (rowKey) {
      // 获取自定义的行标志
      return getRowIdentity(row, rowKey);
    }

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
      },
      // 鼠标进入
      onMouseenter: () => {
        handleMouseEnter($index);
      },
      // 鼠标离开
      onMouseleave: () => {
        handleMouseLeave();
      },
    },
      columns.value.map((column, cellIndex) => {

        // 获取单元格样式
        const { rowspan, colspan } = getTableSpan(row, column, $index, cellIndex);

        // 是否存在单元格样式
        if (!rowspan || !colspan) {
          return null;
        }

        // key
        const baseKey = `${$index},${cellIndex}`;

        // 当前列的数据
        const columnData = { ...column };

        // column 的 key |  列 vode key
        const patchKey = columnData.columnKey || columnData.rawColumnKey || '';

        // data
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
            // class
            class: getCellClass($index, cellIndex, row, column),
            // style
            style: getCellStyle($index, cellIndex, row, column),
            rowspan,
            colspan,
            // key
            key: `${patchKey}${baseKey}`,
            // 鼠标进入
            onMouseenter: ($event) => {
              handleCellMouseEnter($event, row);
            }
          },
          [
            // 渲染单元格
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
