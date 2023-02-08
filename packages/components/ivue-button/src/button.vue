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
import { colorable } from '@ivue-material-plus/utils/mixins/colorable';
import { Ripple } from '@ivue-material-plus/directives';

// button
import { buttonProps, ButtonAttrs, buttonEmits } from './button';

// use
import { useButton } from './use-button';

import IvueButtonContent from './content.vue';

const prefixCls = 'ivue-button';

export default defineComponent({
  name: prefixCls,
  directives: {
    Ripple,
  },
  emits: buttonEmits,
  props: buttonProps,
  // 组合式 API
  setup(props, { emit, slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    // mixins
    const { setBackgroundColor, setTextColor } = colorable();

    const {
      // data
      rippleActive,
      mobile,

      // computed
      rippleWorks,
      computedRipple,
    } = useButton(props);

    // computed

    // 按钮样式
    const btnClasses = computed(() => {
      return {
        [`${prefixCls}--raised`]: !props.flat,
        [`${prefixCls}--flat`]: props.flat,
        [`${prefixCls}--depressed`]:
          (props.depressed && !props.flat) || props.outline,
        [`${prefixCls}--icon`]: props.icon,
        [`${prefixCls}--outline`]: props.outline,
        [`${prefixCls}--radius`]: props.radius,
        [`${prefixCls}--${props.status}`]: props.status && !props.flat,
        [`${prefixCls}--${props.status}__color`]:
          props.status && (props.flat || props.outline),
      };
    });

    return () => {
      let _tag = 'button';

      // 按钮内容
      const buttonContent = h(
        IvueButtonContent,
        {
          loading: props.loading,
        },
        slots.default
      );

      // 按钮属性
      const buttonAttrs: ButtonAttrs = {
        class: {
          [bem.b()]: true,
          // 移动端
          isMobile: unref(mobile),
          // 按钮激活
          'ivue-button--active': props.isActive,
          // 蒙版
          [`${prefixCls}--mask`]: props.loading,
          ...unref(btnClasses),
        },
        href: props.href,
        type: (!props.href && (props.type || 'button')) || '',
        onTouchstart: (event: TouchEvent) => {
          // 是否显示涟漪效果
          if (unref(rippleWorks)) {
            rippleActive.value = event;
          }

          mobile.value = true;
        },
        onTouchmove: (event: TouchEvent) => {
          // 是否显示涟漪效果
          if (unref(rippleWorks)) {
            rippleActive.value = event;
          }
        },
        onClick: (event: Event) => {
          // 是否显示涟漪效果
          if (unref(rippleWorks)) {
            rippleActive.value = event;
          }

          emit('click', unref(rippleActive), props.index);
        },
      };

      // 是否禁用
      if (props.disabled) {
        buttonAttrs.disabled = props.disabled;
      }

      // a 标签
      if (props.href) {
        _tag = 'a';
      }

      // 设置颜色
      const setColor =
        !props.outline && !props.flat ? setBackgroundColor : setTextColor;

      // 解析指令
      const rippleDirective = resolveDirective('ripple');

      return withDirectives(
        h(_tag, setColor(props.color, buttonAttrs), [buttonContent]),
        [[rippleDirective, computedRipple]]
      );
    };
  },
});
</script>
