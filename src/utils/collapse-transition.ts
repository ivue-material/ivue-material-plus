import { h, Transition } from 'vue';
import { addClass, removeClass } from './assist';

const handle = {
  onBeforeEnter(el) {
    addClass(el, 'collapse-transition');

    if (!el.dataset) el.dataset = {};

    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;

    // 初始化
    el.style.height = '0';
    el.style.paddingTop = 0;
    el.style.paddingBottom = 0;
  },
  onEnter(el) {
    el.dataset.oldOverflow = el.style.overflow;

    // 设置高度
    if (el.scrollHeight !== 0) {
      el.style.height = `${el.scrollHeight}px`;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.paddingBottom;
    } else {
      el.style.height = '';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }

    el.style.overflow = 'hidden';
  },
  onAfterEnter(el) {
    //对于safari：删除类然后重置高度是必要的
    removeClass(el, 'collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
  },
  onBeforeLeave(el) {
    if (!el.dataset) el.dataset = {};

    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;

    // 设置高度
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = 'hidden';
  },
  onLeave(el) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height, or it will jump to zero height suddenly, weired
      addClass(el, 'collapse-transition');

      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    }
  },
  onAfterLeave(el) {
    removeClass(el, 'collapse-transition');

    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
    el.style.paddingTop = el.dataset.oldPaddingTop;
    el.style.paddingBottom = el.dataset.oldPaddingBottom;
  },
};

const collapseTransition = (props, context) => {
  return h(Transition, handle, context.slots);
};

export default collapseTransition;
