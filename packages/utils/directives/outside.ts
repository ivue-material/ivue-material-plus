// @ts-nocheck

import { isClient } from '../helpers';

export default {
  beforeMount(el, binding) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false;
      }

      binding.value(e);
    }

    el.__vueClickOutside__ = documentHandler;
    isClient && document.addEventListener('click', documentHandler);
  },
  unmounted(el) {
    isClient && document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};
