import { ref, computed } from 'vue';

// type
import type { ButtonProps } from './button';

export const useButton = (props: ButtonProps) => {
  // 波纹效果激活
  const rippleActive = ref<boolean | TouchEvent | Event>(false);

  // 是否是移动端
  const mobile = ref<boolean>(false);

  // computed

  // 是否显示涟漪效果
  const rippleWorks = computed(() => {
    return !props.disabled && !props.loading;
  });

  // 涟漪效果
  const computedRipple = computed(() => {
    // loading效果
    if (props.loading) {
      return false;
    }

    // 涟漪居中
    if (props.ripple && props.center) {
      return {
        center: true,
      };
    }
    // 是否开启涟漪
    else if (props.ripple && !props.disabled) {
      return props.ripple;
    }

    return false;
  });

  return {
    // data
    rippleActive,
    mobile,

    // computed
    rippleWorks,
    computedRipple,
  };
};
