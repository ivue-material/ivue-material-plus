import {
  defineComponent,
  inject,
  Fragment,
  ref,
  onMounted,
  nextTick,
  onBeforeUnmount,
  onUpdated,
  watch,
  computed,
} from 'vue';
import { useResizeObserver } from '@vueuse/core';

// type
import type { CSSProperties } from 'vue';

// type
import { FormContextKey } from './form';
import { FormItemContextKey } from './form-item';

// prefixCls
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
      type: Boolean,
    },
    /**
     * form 设置宽度为 auto 更新所有 item
     *
     * @type {Boolean}
     */
    updateAll: {
      type: Boolean,
    },
  },
  setup(props, { slots }) {
    const formContext = inject(FormContextKey, undefined);
    const formItemContext = inject(FormItemContextKey, undefined);

    // dom
    const el = ref<HTMLElement>();

    // 标签宽度
    const computedWidth = ref<number>(0);

    // methods

    // 获取标签宽度
    const getLabelWidth = () => {
      // 第一个元素
      if (el.value?.firstElementChild) {
        const width = window.getComputedStyle(el.value.firstElementChild).width;

        // width
        return Math.ceil(Number.parseFloat(width));
      }
      // 没有元素
      else {
        return 0;
      }
    };

    // 更新标签宽度
    const updateLabelWidth = (action: 'update' | 'remove' = 'update') => {
      nextTick(() => {
        // 有 slots && 标签宽度 auto
        if (slots.default && props.isAutoWidth) {
          // 更新
          if (action === 'update') {
            // 标签宽度
            computedWidth.value = getLabelWidth();
          }
          // 删除
          else if (action === 'remove') {
            // 销毁标签宽度
            formContext?.deregisterLabelWidth(computedWidth.value);
          }
        }
      });
    };

    // 更新标签宽度
    const updateLabelWidthCallback = () => updateLabelWidth('update');

    // onMounted
    onMounted(() => {
      updateLabelWidthCallback();
    });

    // onUpdated
    onUpdated(() => {
      updateLabelWidthCallback();
    });

    // onBeforeUnmount
    onBeforeUnmount(() => {
      updateLabelWidth('remove');
    });

    // 绑定resize
    useResizeObserver(
      computed(
        () => (el.value?.firstElementChild ?? null) as HTMLElement | null
      ),
      // 更新标签宽度
      updateLabelWidthCallback
    );

    // watch

    // 监听标签宽度
    watch(computedWidth, (value, oldValue) => {
      // form 设置宽度为 auto 更新所有 item
      if (props.updateAll) {
        formContext?.registerLabelWidth(value, oldValue);
      }
    });

    return () => {
      // 没有内容
      if (!slots) {
        return null;
      }

      const { isAutoWidth } = props;

      // 标签宽度auto
      if (isAutoWidth) {
        // 标签宽度 auto
        const autoLabelWidth = formContext?.autoLabelWidth;

        // 有label
        const hasLabel = formItemContext?.hasLabel;

        const style: CSSProperties = {};

        // 有label 没有 宽度 auto
        if (hasLabel && autoLabelWidth && autoLabelWidth !== 'auto') {
          const marginWidth = Math.max(
            0,
            Number.parseInt(autoLabelWidth, 10) - computedWidth.value
          );

          // 标签位置
          const marginPosition =
            formContext.labelPosition === 'left' ? 'marginRight' : 'marginLeft';

          // 有宽度
          if (marginWidth) {
            style[marginPosition] = `${marginWidth}px`;
          }
        }

        return (
          <div ref={el} class={prefixCls} style={style}>
            {slots.default?.()}
          </div>
        );
      }
      // 普通渲染
      else {
        return <Fragment ref={el}>{slots.default?.()}</Fragment>;
      }
    };
  },
});
