
import {
  defineComponent,
  h,
  getCurrentInstance,
  inject,
  onUnmounted,
  onUpdated,
  watch,
} from 'vue';
import defaultProps from './defaults';
import useRender from './render';
import useTableLayoutObserver from '../table-layout-observer';

import { removePopper } from '../utils';
import { addClass, removeClass } from '../../../utils/assist';

// ts
import type { VNode } from 'vue';
import type { TableBodyProps } from './defaults';
import { TableContextKey } from '../table/defaults';

const prefixCls = 'ivue-table-body';

export default defineComponent({
  name: prefixCls,
  props: defaultProps,
  setup(props: TableBodyProps) {
    // vm
    const vm = getCurrentInstance();

    // inject
    const IvueTable = inject(TableContextKey);

    const { wrappedRowRender } = useRender(props);

    const { handleColumnsChange, handleScrollableWidthChange } = useTableLayoutObserver(IvueTable);

    // methods

    // 渲染行数据
    const renderRow = () => {
      const list = props.store.states.data.value || [];

      return list.reduce((prev: VNode[], row) => {
        return prev.concat(wrappedRowRender(row, prev.length));
      }, []);
    };

    // watch
    watch(
      props.store.states.hoverRow,
      (newVal: number, oldVal: number) => {
        // 没有固定列
        if (!props.store.states.isFixedColumns.value) {
          return;
        }

        // 延迟执行
        let raf = window.requestAnimationFrame;
        if (!raf) {
          raf = (fn) => window.setTimeout(fn, 16);
        }

        raf(() => {
          const rows = vm?.vnode.el?.querySelectorAll('.ivue-table-row');

          const oldRow = rows[oldVal];
          const newRow = rows[newVal];

          // 删除之前的hover
          if (oldRow) {
            removeClass(oldRow, 'hover-row');
          }

          // 添加hover
          if (newRow) {
            addClass(newRow, 'hover-row');
          }
        });

      });


    // onUnmounted
    onUnmounted(() => {
      // tooltip显示时 删除popper
      removePopper?.();
    });

    // onUpdated
    onUpdated(() => {
      // tooltip显示时 删除popper
      removePopper?.();
    });


    return {
      // methods
      renderRow,
      handleColumnsChange,
      handleScrollableWidthChange
    };
  },
  render() {
    return h('tbody', {}, [
      this.renderRow()
    ]);
  }
});
