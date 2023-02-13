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

      // computed
      rippleWorks,
      computedRipple,
    } = useButton(props);

    // computed

    // 按钮样式
    const btnClasses = computed(() => {
      return {
        // 不是扁平按钮
        [bem.is('raised')]: !props.flat,
        // 是否扁平按钮
        [bem.is('flat')]: props.flat,
        // 凹陷的按钮依然保持其背景色，但没有框阴影
        [bem.is('depressed')]:
          (props.depressed && !props.flat) || props.outline,
          // 圆形图标
        [bem.is('icon')]: props.icon,
        // 轮廓按钮从当前色彩应用继承他们的边框颜色。
        [bem.is('outline')]: props.outline,
        // 圆角
        [bem.is('radius')]: props.radius,
        // 按钮状态
        [bem.is(`${props.status}`)]: props.status && !props.flat,
        // 有按钮状态
        [bem.is('status')]: props.status && !props.flat,
        [bem.is(`${props.status}-color`)]:
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
          // 按钮激活
          [bem.is('active')]: props.isActive,
          // 蒙版
          [bem.is('mask')]: props.loading,
          // 按钮样式
          ...unref(btnClasses),
        },
        href: props.href,
        type: (!props.href && (props.type || 'button')) || '',
        // onTouchstart
        onTouchstart: (event: TouchEvent) => {
          // 是否显示涟漪效果
          if (unref(rippleWorks)) {
            rippleActive.value = event;
          }
        },
        // onTouchmove
        onTouchmove: (event: TouchEvent) => {
          // 是否显示涟漪效果
          if (unref(rippleWorks)) {
            rippleActive.value = event;
          }
        },
        // onClick
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
        [[rippleDirective, unref(computedRipple)]]
      );
    };
  },
});
</script>
