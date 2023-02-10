<script lang="ts">
import {
  defineComponent,
  h,
  computed,
  withDirectives,
  resolveDirective,
  unref,
} from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

import { Ripple } from '@ivue-material-plus/directives';

// switch
import { switchProps, switchEmits } from './switch';
// use
import { useSwitch } from './use-switch';

const prefixCls = 'ivue-switch';

export default defineComponent({
  name: prefixCls,
  directives: {
    Ripple,
  },
  emits: switchEmits,
  props: switchProps,
  setup(props, { emit, slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    const {
      inputId,
      setTextColor,
      inputDisabled,
      currentValue,

      // computed
      computedRipple,
      setColor,

      // methods
      toggle,
    } = useSwitch(props, emit);

    // 解析指令
    const rippleDirective = resolveDirective('ripple');

    // computed

    // 外部样式
    const wrapClasses = computed(() => {
      // 是否开启浮雕
      if (props.emboss) {
        return {
          [bem.b('emboss')]: true,
          [bem.is('emboss-disabled')]: inputDisabled.value,
        };
      }

      return {
        [bem.b()]: true,
        [bem.is('false')]: props.falseColor,
        [bem.is('checked')]: currentValue.value === props.trueValue,
        [bem.is('disabled')]: inputDisabled.value,
        [bem.is('loading')]: props.loading,
        [bem.is(props.size)]: props.size,
      };
    });

    // 浮雕样式
    const embossClass = computed(() => {
      return {
        [bem.be('emboss', 'content')]: true,
        [bem.is('disabled')]: inputDisabled.value,
        [bem.is(props.size)]: props.size,
      };
    });

    // 浮雕进度条
    const embossTrackClass = computed(() => {
      return [
        bem.be('emboss', 'track'),
        {
          [bem.is('checked')]: currentValue.value === props.trueValue,
        },
      ];
    });

    // 浮雕指示器
    const embossThumbClass = computed(() => {
      return [
        bem.be('emboss', 'thumb'),
        {
          [bem.is('checked')]: currentValue.value === props.trueValue,
        },
      ];
    });

    // 进度条样式
    const embossLoadingClass = computed(() => {
      return {
        [bem.is('loading')]: props.loading,
      };
    });

    // 浮雕ripple
    const embossRippleClass = computed(() => {
      return [
        bem.be('emboss', 'ripple'),
        {
          [bem.is('checked')]: currentValue.value === props.trueValue,
        },
      ];
    });

    // methods

    // 输入框
    const genInput = () => {
      return h('input', {
        class: bem.e('input'),
        id: unref(inputId),
        type: 'checkbox',
        role: 'switch',
        trueValue: props.trueValue,
        falseValue: props.falseValue,
        ariaChecked: unref(currentValue),
        ariaDisabled: unref(inputDisabled),
        checked: unref(currentValue),
      });
    };

    // 渲染浮雕
    const genEmboss = () => {
      return h(
        'div',
        {
          class: unref(embossClass),
        },
        [
          // 浮雕进度条
          h(
            'span',
            setTextColor(unref(setColor), {
              class: unref(embossTrackClass),
            })
          ),
          h(
            // 浮雕指示器
            'span',
            setTextColor(unref(setColor), {
              class: unref(embossThumbClass),
            }),
            [
              // 进度条颜色
              h(
                'span',
                setTextColor(props.embossLoadingColor, {
                  class: unref(embossLoadingClass),
                })
              ),
            ]
          ),
          withDirectives(
            // 浮雕ripple
            h('span', {
              class: unref(embossRippleClass),
            }),
            [[rippleDirective, unref(computedRipple)]]
          ),
        ]
      );
    };

    // 渲染内容
    const genInner = () => {
      const name = unref(currentValue) === props.trueValue;
      const close = unref(currentValue) === props.falseValue;

      return h(
        'span',
        {
          // 内部文字样式
          class: bem.e('inner'),
        },
        [
          name
            ? slots.open && slots.open()
            : close
            ? slots.close && slots.close()
            : '',
        ]
      );
    };

    return () => {
      return h(
        'span',
        setTextColor(!props.emboss ? unref(setColor) : '', {
          class: unref(wrapClasses),
          tabindex: '0',
          onClick: toggle,
        }),
        [genInput(), props.emboss && genEmboss(), genInner()]
      );
    };
  },
});
</script>
