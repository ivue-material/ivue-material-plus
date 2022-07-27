
import { isRef, ref, nextTick } from 'vue';
import { hasOwn } from '@vue/shared';

// ts
import type { Ref } from 'vue';
import type { Store } from './store';
import type { Table } from './table/defaults';
import type { TableColumnCtx } from './table-column/defaults';
import type { TableHeader } from './table-header';

class TableLayout<T> {
  store: Store<T>
  table: Table<T>
  fit: boolean
  showHeader: boolean
  scrollX: Ref<boolean>
  scrollY: Ref<boolean>
  bodyWidth: Ref<null | number>
  observers: TableHeader[]
  height: Ref<null | number>

  constructor(options: Record<string, any>) {

    // 表格 scrollX
    this.scrollX = ref(false);

    // 表格 scrollY
    this.scrollY = ref(false);

    // 内容宽度
    this.bodyWidth = ref(null);

    // 表格高度
    this.height = ref(null);

    // 观察者列表
    this.observers = [];

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


  // 扁平化列
  getFlattenColumns(): TableColumnCtx<T>[] {
    const flattenColumns = [];

    // 列
    const columns = this.table.store.states.columns.value;

    columns.forEach((column) => {
      // 是列组合头部
      if (column.isColumnGroup) {
        // eslint-disable-next-line prefer-spread
        flattenColumns.push.apply(flattenColumns, column.columns);
      }
      // 不是是列组合头部
      else {
        flattenColumns.push(column);
      }
    });

    return flattenColumns;
  }

  // 添加观察者
  addObserver(observer: TableHeader) {
    this.observers.push(observer);
  }

  // 移除观察者
  removeObserver(observer: TableHeader) {
    const index = this.observers.indexOf(observer);

    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  // 通知观察者
  notifyObservers(event: string) {
    const observers = this.observers;

    observers.forEach((item) => {
      // 设置列的宽度
      if (event === 'columns') {
        item.state?.handleColumnsChange(this);
      }

      // 设置滚动宽度
      if (event === 'scrollable') {
        item.state?.handleScrollableWidthChange(this);
      }
    });
  }

  // 更新列宽度
  updateColumnsWidth() {
    // 列的宽度是否自撑开
    const fit = this.fit;
    // 获取表宽度
    const bodyWidth = this.table.vnode.el.clientWidth;
    // 最小宽度
    let bodyMinWidth = 0;

    // 扁平化列
    const flattenColumns = this.getFlattenColumns();

    // 需要自动撑开的列
    const flexColumns = flattenColumns.filter((item) => typeof item.width !== 'number');

    // 重置列的宽度
    flattenColumns.forEach((item) => {
      // 初始化列宽度
      if (typeof item.width === 'number' && item.columnWidth)
        item.columnWidth = null;
    });


    // 列的宽度是否自撑开
    if (flexColumns.length > 0 && fit) {
      flattenColumns.forEach((item) => {
        // 获取所有列相加的宽度
        bodyMinWidth += Number(item.width || item.minWidth || 80);
      });

      // 不是滚动的表格
      if (bodyMinWidth <= bodyWidth) {
        // 表格 scrollX
        this.scrollX.value = false;

        // 可以自动撑开的宽度
        const totalFlexWidth = bodyWidth - bodyMinWidth;

        // 只有一个自动撑开的列沾满屏幕剩余宽度
        if (flexColumns.length === 1) {
          flexColumns[0].columnWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth;
        }
        // 多个自动撑开列
        else {
          // 获取自动撑开列的最小宽度
          const allColumnWidth = flexColumns.reduce((prev, item) => prev + Number(item.minWidth || 80), 0);
          const flexWidthPerPixel = totalFlexWidth / allColumnWidth;

          // 不是第一个的宽度
          let noneFirstWidth = 0;

          // 自动撑开的列
          flexColumns.forEach((item, index) => {
            // 忽略第一个
            if (index === 0) {
              return;
            }

            // 自动撑开的宽度
            const flexWidth = Math.floor(Number(item.minWidth || 80) * flexWidthPerPixel);
            noneFirstWidth += flexWidth;

            item.columnWidth = Number(item.minWidth || 80) + flexWidth;
          });

          // 自动睁开的第一个宽度等于剩余的宽度
          flexColumns[0].columnWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
        }
      }
      // 是滚动表格
      else {
        this.scrollX.value = true;

        // 设置列宽度为最小宽度
        flexColumns.forEach((item) => {
          item.columnWidth = Number(item.minWidth);
        });

      }

      // 设置表格快读
      this.bodyWidth.value = Math.max(bodyMinWidth, bodyWidth);
      // 调整表格大小
      this.table.state.resizeState.value.width = this.bodyWidth.value;
    }
    // 不是自动撑开
    else {
      flattenColumns.forEach((item) => {

        // 没有宽度
        if (!item.width && !item.minWidth) {
          item.columnWidth = 80;
        }
        // 有宽度
        else {
          item.columnWidth = Number(item.width || item.minWidth);
        }

        bodyMinWidth += item.columnWidth;
      });

      this.scrollX.value = bodyMinWidth > bodyWidth;

      this.bodyWidth.value = bodyMinWidth;
    }

    // 通知观察者
    this.notifyObservers('columns');
  }

  // 设置高度
  setHeight(value: string | number, prop = 'height') {
    const el = this.table.vnode.el;

    value = this.parseHeight(value);

    this.height.value = Number(value);

    // 没有节点下个线程执行
    if (!el && (value || value === 0)) {
      return nextTick(() => {
        this.setHeight(value, prop);
      });
    }

    // number
    if (typeof value === 'number') {
      el.style[prop] = `${value}px`;

      // 更新表格高度
      this.updateTableContentHeight();
    }
    // string
    else if (typeof value === 'string') {
      el.style[prop] = value;

      // 更新表格高度
      this.updateTableContentHeight();
    }
  }

  // 设置高度
  parseHeight(height: number | string) {

    // number
    if (typeof height === 'number') {
      return height;
    }

    // string
    if (typeof height === 'string') {

      // 是否有px
      if (/^\d+(?:px)?$/.test(height)) {
        return Number.parseInt(height, 10);
      }
      // 其他
      else {
        return height;
      }
    }

    return null;
  }

  // 更新表格高度
  updateTableContentHeight() {
    // 更新y轴滚动高度
    this.updateScrollY();

    // 设置滚动高度
    this.notifyObservers('scrollable');
  }

  // 更新y轴滚动高度
  updateScrollY() {
    const height = this.height.value;

    // 高度未初始化时为空
    // 表格初始化后，未配置高度时，高度为0

    if (!height) {
      return false;
    }

    const scrollbar = this.table.refs.scrollbar;

    // 是否渲染完成
    if (this.table.vnode.el && scrollbar) {
      let scrollY = true;

      // 之前的值
      const prevScrollY = this.scrollY.value;

      // 是否可以滚动
      scrollY = scrollbar.scrollbarWrapper.scrollHeight > scrollbar.scrollbarWrapper.clientHeight;

      // 是否可以滚动
      this.scrollY.value = scrollY;

      // 是否相等 是否有滚动过
      return prevScrollY !== scrollY;
    }


    return false;
  }
}

export default TableLayout;
