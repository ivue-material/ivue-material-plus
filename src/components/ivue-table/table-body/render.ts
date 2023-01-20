useRender;
import { h, inject, computed } from 'vue';
import useStyles from './styles';
import useEvents from './events';
import { getRowIdentity } from '../utils';

// ts
import type { TableProps, RenderRowData, TreeNode } from '../table/defaults';
import type { TableBodyProps } from './defaults';
import type { TableColumnCtx } from '../table-column/defaults';

import { TableContextKey } from '../table/defaults';

function useRender(props: Partial<TableBodyProps>) {
  // inject
  const IvueTable = inject(TableContextKey);

  // 样式
  const { getRowClass, getRowStyle, getTableSpan, getCellClass, getCellStyle } =
    useStyles(props);

  // 事件
  const {
    handleClickTr,
    handleCellMouseEnter,
    handleCellMouseLeave,
    handleMouseEnter,
    handleMouseLeave,
  } = useEvents(props);

  // computed

  // 是否是默认索引
  const firstDefaultColumnIndex = computed(() => {
    return props.store?.states.columns.value.findIndex(
      ({ type }) => type === 'default'
    );
  });

  // methods

  // 获取行key
  const getRowKey = (row: TableColumnCtx, index: number) => {
    const rowKey = (IvueTable.props as Partial<TableProps>).rowKey;

    // 有自定义 rowKey
    if (rowKey) {
      // 获取rowKey对应的数据
      return getRowIdentity(row, rowKey);
    }

    return index;
  };

  // 渲染行
  const rowRender = (
    row: TableColumnCtx,
    $index: number,
    treeRowData?: TreeNode,
    // 展开状态
    expanded = false
  ) => {
    const { store } = props;

    const { columns, indent } = store.states;

    // 行样式
    const rowClasses = getRowClass(row, $index);

    let display = true;

    // 是否是子节点数据
    if (treeRowData) {
      rowClasses.push(`ivue-table-level-${treeRowData.level}`);

      display = treeRowData.display;
    }

    // tr 隐藏显示用于树形节点
    const displayStyle = display
      ? null
      : {
          display: 'none',
        };

    return h(
      'tr',
      {
        class: rowClasses,
        style: [displayStyle, getRowStyle(row, $index)],
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
        const { rowspan, colspan } = getTableSpan(
          row,
          column,
          $index,
          cellIndex
        );

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
        const data: RenderRowData = {
          store: props?.store,
          _self: props.context || IvueTable,
          column: columnData,
          row,
          $index,
          cellIndex,
          // 展开状态
          expanded,
        };

        // 设置子节点数据
        if (cellIndex === firstDefaultColumnIndex.value && treeRowData) {
          data.treeNode = {
            indent: treeRowData.level * indent.value,
            level: treeRowData.level,
          };

          // 是否有展开
          if (typeof treeRowData.expanded === 'boolean') {
            data.treeNode.expanded = treeRowData.expanded;

            // 表明是懒加载
            if ('loading' in treeRowData) {
              data.treeNode.loading = treeRowData.loading;
            }

            // 没有懒加载节点
            if ('noLazyChildren' in treeRowData) {
              data.treeNode.noLazyChildren = treeRowData.noLazyChildren;
            }
          }
        }

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
            onMouseenter: (event) => {
              handleCellMouseEnter(event, row);
            },
            // 鼠标离开
            onMouseleave: (event) => {
              handleCellMouseLeave(event);
            },
          },
          [
            // 渲染单元格
            column.renderCell(data),
          ]
        );
      })
    );
  };

  // 渲染行
  const wrappedRowRender = (row: TableColumnCtx, $index: number): any => {
    const store = props.store;

    const { isRowExpanded, assertRowKey } = store;

    const { treeData, lazyTreeNodeMap, childrenColumnName, rowKey } =
      store.states;

    const columns = store?.states.columns.value;

    // 是否是展开行
    const hasExpandColumn = columns.some(({ type }) => type === 'expand');

    // 是否是展开行
    if (hasExpandColumn) {
      // 是否展开行
      const expanded = isRowExpanded(row);

      // tr
      const tr = rowRender(
        row,
        $index,
        undefined,
        // 展开状态
        expanded
      );

      // 展开的内容
      const renderExpanded = IvueTable.renderExpanded;
      // 展开
      if (expanded) {
        // 没有展开内容
        if (!renderExpanded) {
          // eslint-disable-next-line no-console
          console.error('[Error]renderExpanded is required.');

          return tr;
        }

        return [
          [
            tr,
            h(
              'tr',
              {
                key: `expanded-row__${tr.key as string}`,
              },
              [
                h(
                  'td',
                  {
                    colspan: columns.length,
                    class: ['ivue-table-cell', 'ivue-table--expand-cell'],
                  },
                  [
                    renderExpanded({
                      row,
                      $index,
                      store,
                      // 展开状态
                      expanded,
                    }),
                  ]
                ),
              ]
            ),
          ],
        ];
      }
      // 未展开
      else {
        return [[tr]];
      }
    }
    // 子节点渲染
    else if (Object.keys(treeData.value).length) {
      // 检查 rowKey 是否存在
      assertRowKey();

      // TreeTable 时，rowKey 必须由用户设定，不使用 getKeyOfRow 计算
      // 在调用 rowRender 函数时，仍然会计算 rowKey，

      // 获取rowKey对应的数据
      const rowKeyData = getRowIdentity(row, rowKey.value);

      // 子节点数据
      let childrenData = treeData.value[rowKeyData];

      // 每一行的节点数据
      let treeRowData = null;

      // 子节点数据
      if (childrenData) {
        treeRowData = {
          expanded: childrenData.expanded,
          level: childrenData.level,
          display: true,
        };

        // 懒加载数据
        if (typeof childrenData.lazy === 'boolean') {
          // 加载完成
          if (typeof childrenData.loaded === 'boolean' && childrenData.loaded) {
            // 没有子节点
            treeRowData.noLazyChildren = !(
              childrenData.children && childrenData.children.length
            );
          }

          // 加载
          treeRowData.loading = childrenData.loading;
        }
      }

      const dom = [rowRender(row, $index, treeRowData)];

      // 渲染嵌套数据
      if (childrenData) {
        // currentRow 记录的是 index，所以还需主动增加 TreeTable 的 index
        let i = 0;

        // 递归方法
        const traverse = (children, parent) => {
          // 没有数据
          if (!(children && children.length && parent)) {
            return;
          }

          children.forEach((node) => {
            // 父节点的 display 状态影响子节点的显示状态
            const innerTreeRowData = {
              display: parent.display && parent.expanded,
              level: parent.level + 1,
              expanded: false,
              noLazyChildren: false,
              loading: false,
            };

            // 获取rowKey对应的数据
            const childKey = getRowIdentity(node, rowKey.value);
            if (childKey === undefined || childKey === null) {
              throw new Error('For nested data item, row-key is required.');
            }

            childrenData = { ...treeData.value[childKey] };

            // 对于当前节点，分成有无子节点两种情况。
            // 如果包含子节点的，设置 expanded 属性。
            // 对于它子节点的 display 属性由它本身的 expanded 与 display 共同决定。
            if (childrenData) {
              innerTreeRowData.expanded = childrenData.expanded;

              // 懒加载的某些节点，level 未知
              childrenData.level = childrenData.level || innerTreeRowData.level;
              childrenData.display = !!(
                childrenData.expanded && innerTreeRowData.display
              );

              // 懒加载
              if (typeof childrenData.lazy === 'boolean') {
                // 加载完成
                if (
                  typeof childrenData.loaded === 'boolean' &&
                  childrenData.loaded
                ) {
                  // 没有子节点
                  innerTreeRowData.noLazyChildren = !(
                    childrenData.children && childrenData.children.length
                  );
                }

                // 加载中
                innerTreeRowData.loading = childrenData.loading;
              }
            }

            i++;

            // 添加节点
            dom.push(rowRender(node, $index + i, innerTreeRowData));

            if (childrenData) {
              // 懒加载节点 | 子节点 = 获取行数据
              const nodes =
                lazyTreeNodeMap.value[childKey] ||
                node[childrenColumnName.value];

              traverse(nodes, childrenData);
            }
          });
        };

        // 对于 root 节点，display 一定为 true
        childrenData.display = true;

        // 懒加载节点 | 子节点 = 获取行数据
        const nodes =
          lazyTreeNodeMap.value[rowKeyData] || row[childrenColumnName.value];

        // 递归方法
        traverse(nodes, childrenData);
      }

      return dom;
    }
    // 普通渲染
    else {
      return rowRender(row, $index);
    }
  };

  return {
    wrappedRowRender,
  };
}

export default useRender;
