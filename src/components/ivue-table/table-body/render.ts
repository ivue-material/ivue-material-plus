
import { h } from 'vue';
import useStyles from './style';

// ts
import type { TreeNode } from '../table/defaults';
import type { TableBodyProps } from './defaults';

function useRender<T>(props: Partial<TableBodyProps<T>>) {


  const {
    getRowClass,
  } = useStyles(props);


  // methods

  // 渲染行
  const rowRender = (
    row: T,
    $index: number,
  ) => {
    const { store } = props;
    const { columns } = store.states;

    console.log('columns', columns);

    // 行样式
    const rowClasses = getRowClass(row, $index);

    return h('tr', {
      class: rowClasses,
    });
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
