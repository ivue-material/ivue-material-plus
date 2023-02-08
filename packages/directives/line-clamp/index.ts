// @ts-nocheck

import { Ref } from 'vue';
import { addClass, removeClass } from '@ivue-material-plus/utils';

// 限制文本最多显示几行，以...结束，仅适用于 webkit 内核浏览器

export default {
  mounted(el: HTMLElement, binding: Ref<string | number>) {
    if (binding.value) {
      // 1行省略使用兼容样式
      if (Number(binding.value) === 1) {
        addClass(el, 'ivue-line-clamp-nowrap');
      }
      // 多行
      else {
        addClass(el, 'ivue-line-clamp');

        el.style['-webkit-line-clamp'] = binding.value;
      }
    }
  },
  updated(el: HTMLElement, binding: Ref<string | number>) {
    if (binding.value) {
      // 先删除样式
      removeClass(el, 'ivue-line-clamp');
      removeClass(el, 'ivue-line-clamp-nowrap');

      // 1行省略使用兼容样式
      if (Number(binding.value) === 1) {
        addClass(el, 'ivue-line-clamp-nowrap');
      }
      // 多行
      else {
        addClass(el, 'ivue-line-clamp');

        el.style['-webkit-line-clamp'] = binding.value;
      }
    }
  },
  unmounted(el: HTMLElement) {
    removeClass(el, 'ivue-line-clamp');
    removeClass(el, 'ivue-line-clamp-nowrap');

    el.style['-webkit-line-clamp'] = null;
  },
};
