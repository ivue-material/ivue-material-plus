<script lang="ts">
import { defineComponent, Transition, h } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// mixins
import { colorable } from '@ivue-material-plus/utils/mixins/colorable';
import { pickerProps } from './picker';

const prefixCls = 'ivue-picker';

export default defineComponent({
  name: prefixCls,
  props: pickerProps,
  setup(props, { slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    // mixins
    const { setBackgroundColor } = colorable();

    // methods

    // 渲染标题
    const genTitle = () => {
      return h(
        'div',
        setBackgroundColor(props.color || bem.is('primary'), {
          class: {
            [bem.b('title')]: true,
          },
        }),
        slots.title!()
      );
    };

    // 渲染日期选择 body 动画
    const genBodyTransition = () => {
      return h(
        Transition,
        {
          name: props.transition,
        },
        {
          default: () => slots.default!(),
        }
      );
    };

    // 渲染日期选择body
    const genBody = () => {
      return h(
        'div',
        {
          class: bem.b('body'),
          style: props.fullWidth
            ? undefined
            : {
                width: `${props.width}px`,
              },
        },
        // 渲染日期选择 body 动画
        genBodyTransition()
      );
    };

    return () =>
      h(
        'div',
        {
          class: [
            bem.b(),
            // 日历方向
            {
              [bem.is('landscape')]: props.landscape,
            },
          ],
          // 日历方向
          style: props.fullWidth
            ? { display: 'block' }
            : { display: 'inline-flex' },
        },
        [
          // 标题
          slots.title ? genTitle() : null,
          // body
          genBody(),
        ]
      );
  },
});
</script>
