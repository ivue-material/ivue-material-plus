// @ts-nocheck

// 跨多个浏览器的鼠标滚轮标准化
import normalizeWheel from 'normalize-wheel-es';

// ts
import type { DirectiveBinding, ObjectDirective } from 'vue';

const mousewheel = (element, callback) => {
  if (element && element.addEventListener) {
    const fn = function (this: any, event) {
      const normalized = normalizeWheel(event);
      callback && Reflect.apply(callback, this, [event, normalized]);
    };

    // 滚轮
    element.addEventListener('wheel', fn, { passive: true });
  }
};

const Mousewheel: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    mousewheel(el, binding.value);
  },
};

export default Mousewheel;
