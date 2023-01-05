import { defineComponent, h, Fragment, ref } from 'vue';

const prefixCls = 'ivue-form-label-wrap';

export default defineComponent({
  name: prefixCls,
  props: {
    /**
     * 标签宽度auto
     *
     * @type {Boolean}
     */
    isAutoWidth: {
      type: Boolean
    }
  },
  setup(props: any, { slots }) {

    // dom
    const el = ref<HTMLElement>();

    return () => {
      if (!slots) {
        return null;
      }

      // return h(
      //   Fragment,
      //   {
      //     ref: el
      //   },
      //   slots && slots.default()
      // );
      return <Fragment ref={el}>{slots.default?.()}</Fragment>;
    };
  }
});
