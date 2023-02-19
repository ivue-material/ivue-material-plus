<script lang="ts">
import { defineComponent, h, computed, unref } from 'vue';

import { useNamespace } from '@ivue-material-plus/hooks';
import { colorable } from '@ivue-material-plus/utils/mixins/colorable';

// bottom-nav
import { bottomNavProps, backTopEmits } from './bottom-nav';
// use
import { useBottomBav } from './use-bottom-nav';

const prefixCls = 'ivue-bottom-nav';

export default defineComponent({
  name: prefixCls,
  // 声明事件
  emits: backTopEmits,
  // props
  props: bottomNavProps,
  setup(props, { emit, slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    // 背景颜色
    const { setBackgroundColor } = colorable();

    // use
    useBottomBav(props, emit);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return {
        // 导航栏固定位置 position
        [bem.is('absolute')]: props.position === 'absolute',
        // 导航栏固定位置 fixed
        [bem.is('fixed')]: props.position === 'fixed',
        // 控制可见性
        [bem.is('active')]: props.visible,
        // 导航缩放效果
        [bem.is('active-scale')]: props.visible && props.scale,
        // 不是激活状态时隐藏按钮上的文字
        [bem.is('shift')]: props.shift,
      };
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      return {
        height: `${unref(computedHeight)}`,
        transform: `translate3d(0, ${
          props.visible ? 0 : `calc(${unref(computedHeight)} + 4px)`
        }, 0)`,
      };
    });

    // 实时计算高度
    const computedHeight = computed(() => {
      return !Number.isNaN(Number(props.height))
        ? `${props.height}px`
        : props.height;
    });

    return () =>
      h(
        'div',
        setBackgroundColor(props.color, {
          class: [bem.b(), unref(wrapperClasses)],
          style: unref(wrapperStyles),
        }),
        // 插槽
        slots && slots?.default?.()
      );
  },
});
</script>
