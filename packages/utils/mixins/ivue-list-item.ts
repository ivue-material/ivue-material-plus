import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    /**
     * 禁用
     *
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 禁用涟漪
     *
     * @type {Boolean}
     */
    rippleDisabled: {
      type: Boolean,
      default: false,
    },
  },
});
