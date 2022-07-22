

import type { TableBodyProps } from './defaults';

function useStyles<T>(props: Partial<TableBodyProps<T>>) {


  // 行样式
  const getRowClass = (row: T, rowIndex: number) => {
    const classes = [
      'ivue-table-row'
    ];


    return classes;
  };


  return {
    getRowClass
  };
}

export default useStyles;
