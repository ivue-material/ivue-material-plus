
import { isRef, ref } from 'vue';

// ts
import type { Ref } from 'vue';
import { hasOwn } from '@vue/shared';

import type { Table } from './table/defaults';
import type { Store } from './store';

class TableLayout<T> {
  store: Store<T>
  table: Table<T>
  fit: boolean
  showHeader: boolean
  scrollX: Ref<boolean>
  scrollY: Ref<boolean>
  bodyWidth: Ref<null | number>

  constructor(options: Record<string, any>) {

    // 表格 scrollX
    this.scrollX = ref(false);

    // 表格 scrollY
    this.scrollY = ref(false);

    // 内容宽度
    this.bodyWidth = ref(null);

    // 设置内部函数
    for (const name in options) {
      // 检测是否属性是否拥有
      if (hasOwn(options, name)) {
        // 检查值是否为一个 ref 对象。
        if (isRef(this[name])) {
          this[name as string].value = options[name];
        }
        // 其他
        else {
          this[name as string] = options[name];
        }
      }
    }
  }
}

export default TableLayout;
