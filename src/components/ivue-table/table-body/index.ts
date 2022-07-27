
import {
  defineComponent,
  h,
  getCurrentInstance,
  inject
} from 'vue';
import defaultProps from './defaults';
import useRender from './render';

// ts
import type { VNode } from 'vue';

const prefixCls = 'ivue-table-body';

export default defineComponent({
  name: prefixCls,
  props: defaultProps,
  setup(props: any) {
    // vm
    const vm = getCurrentInstance();

    // inject
    const IvueTable: any = inject('ivue-table');


    const { wrappedRowRender } = useRender(props);

    // methods

    // 渲染行数据
    const renderRow = () => {
      const list = props.store.states.data.value || [];

      return list.reduce((prev: VNode[], row) => {
        return prev.concat(wrappedRowRender(row, prev.length));
      }, []);
    };


    return {
      // methods
      renderRow
    };
  },
  render() {
    return h('tbody', {}, [
      this.renderRow()
    ]);
  }
});
