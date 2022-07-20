import {
  h,
  defineComponent
} from 'vue';

import useUtils from './utils-helper';

// ts
import type { PropType, Ref } from 'vue';
import type { Store } from '../store';
import type { DefaultRow, Sort } from '../table/defaults';

export interface TableHeaderProps<T> {
  fixed: string
  store: Store<T>
  border: boolean
  defaultSort: Sort
}


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
      type: Object as PropType<TableHeaderProps<DefaultRow>['store']>,
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
      type: Object as PropType<TableHeaderProps<DefaultRow>['defaultSort']>,
      default: () => {
        return {
          prop: '',
          order: '',
        };
      },
    },
  },
  setup(props) {
    useUtils(
      props as TableHeaderProps<unknown>
    );
  },
  render() {
    console.log('///');

    return h('thead', '1221');
  }
});
