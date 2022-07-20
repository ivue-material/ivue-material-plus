import { h } from 'vue';

colgroup.props = ['columns', 'tableLayout'];

function colgroup(props) {
  // table-layout布局方式
  const isAuto = props.tableLayout === 'auto';

  let columns = props.columns || [];

  // auto
  if (isAuto) {
    if (columns.every((column) => column.width === undefined)) {
      columns = [];
    }
  }

  const getPropsData = (column) => {

    const propsData = {
      key: `${props.tableLayout}-${column.id}`,
      style: {},
      name: undefined,
    };

    // auto
    if (isAuto) {
      propsData.style = {
        width: `${column.width}px`,
      };
    }
    // fixed
    else {
      propsData.name = column.id;
    }

    return propsData;
  };

  return h(
    'colgroup',
    {},
    columns.map((column) => h('col', getPropsData(column)))
  );
}

export default colgroup;
