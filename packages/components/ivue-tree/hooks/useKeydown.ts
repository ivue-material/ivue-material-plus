import { onMounted, onUpdated, shallowRef, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import { EVENT_CODE } from '../../../utils/helpers';

// type
import type { Ref } from 'vue';
import type TreeStore from '../store/tree-store';

export const useKeydown = (el: Ref<HTMLElement>, store: Ref<TreeStore>) => {
  // tree元素数组
  const treeItems = shallowRef<HTMLElement[]>([]);
  // checkbox元素数组
  const checkboxItems = shallowRef<HTMLElement[]>([]);

  // methods

  // 设置当前焦点
  const initTabIndex = (): void => {
    // tree元素数组
    treeItems.value = Array.from(
      el.value.querySelectorAll('.is-focusable[role=treeItem]')
    );

    // checkbox元素数组
    checkboxItems.value = Array.from(
      el.value.querySelectorAll('input[type=checkbox]')
    );

    // 多选选中的元素
    const checkedItem = el.value.querySelectorAll('.is-checked[role=treeItem]');

    if (checkedItem.length) {
      checkedItem[0].setAttribute('tabindex', '0');

      return;
    }

    treeItems.value[0]?.setAttribute('tabindex', '0');
  };

  // 键盘按下
  const handleKeydown = (event: KeyboardEvent): void => {
    const currentItem = event.target as HTMLElement;

    if (!currentItem.className.includes('ivue-tree-node')) {
      return;
    }

    // 键盘事件类型
    const code = event.code;

    // tree元素数组
    treeItems.value = Array.from(
      el.value.querySelectorAll('.is-focusable[role=treeItem]')
    );

    // 当前下标
    const currentIndex = treeItems.value.indexOf(currentItem);
    let nextIndex;

    // 向上或者向下
    if ([EVENT_CODE.up, EVENT_CODE.down].includes(code)) {
      event.preventDefault();

      // 向上
      if (code === EVENT_CODE.up) {
        // 第一个
        if (currentIndex === -1) {
          nextIndex = 0;
        }
        // 不是第一个 -1 向上选择焦点
        else if (currentIndex !== 0) {
          nextIndex = currentIndex - 1;
        }
        // 到达第一个后继续向上选择焦点重置为最后一个
        else {
          nextIndex = treeItems.value.length - 1;
        }

        // 开始的下标
        const startIndex = nextIndex;

        treeItems.value.forEach(() => {
          if (
            // 当前节点是否可以获取焦点
            store.value.getNode(treeItems.value[nextIndex].dataset.key).canFocus
          ) {
            return;
          }

          // 下标递减
          nextIndex--;

          // 是否等于第一个
          if (nextIndex === startIndex) {
            nextIndex = -1;

            return;
          }

          if (nextIndex < 0) {
            nextIndex = treeItems.value.length - 1;
          }
        });
      }
      // 向下
      else {
        // 第一个
        if (currentIndex === -1) {
          nextIndex = 0;
        }
        // 当前下标 < 数组的长度
        else if (currentIndex < treeItems.value.length - 1) {
          // 下标增加
          nextIndex = currentIndex + 1;
        }
        // 重置为第一个
        else {
          nextIndex = 0;
        }

        const startIndex = nextIndex;

        treeItems.value.forEach(() => {
          // 当前节点是否可以获取焦点
          if (
            store.value.getNode(treeItems.value[nextIndex].dataset.key).canFocus
          ) {
            return;
          }

          // 向上增加
          nextIndex++;

          // 等于最后一个
          if (nextIndex === startIndex) {
            nextIndex = -1;

            return;
          }

          // 重置为第一个下标
          if (nextIndex >= treeItems.value.length) {
            nextIndex = 0;
          }
        });
      }

      // 设置焦点
      nextIndex !== -1 && treeItems.value[nextIndex].focus();
    }

    // 键盘向左 ｜ 键盘向右
    if ([EVENT_CODE.left, EVENT_CODE.right].includes(code)) {
      event.preventDefault();

      // 点击元素
      currentItem.click();
    }

    // 当前元素
    const hasInput = currentItem.querySelector(
      '[type="checkbox"]'
    ) as HTMLInputElement;

    // 键盘确认 ｜ 键盘空格
    if ([EVENT_CODE.enter, EVENT_CODE.space].includes(code) && hasInput) {
      event.preventDefault();

      // 多选框点击
      hasInput.click();
    }
  };

  // watch

  // 监听checkbox元素数组
  watch(checkboxItems, (value) => {
    // 重新设置取消焦点
    value.forEach((checkbox) => {
      checkbox.setAttribute('tabindex', '-1');
    });
  });

  // onMounted
  onMounted(() => {
    // 设置当前焦点
    initTabIndex();

    useEventListener(el, 'keydown', handleKeydown);
  });

  // onUpdated
  onUpdated(() => {
    treeItems.value = Array.from(el.value.querySelectorAll('[role=treeItem]'));

    checkboxItems.value = Array.from(
      el.value.querySelectorAll('input[type=checkbox]')
    );
  });
};
