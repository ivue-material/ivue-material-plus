<template>
  <div :class="bem.b()" :style="styles">
    <div :class="contentClasses" :style="contentStyles"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';

// utils
import { letter, isCssColor } from '@ivue-material-plus/utils';
// hooks
import { useNamespace } from '@ivue-material-plus/hooks';

// slider
import { sliderProps } from './slider';

const prefixCls = 'ivue-tabs-slider';

export default defineComponent({
  name: prefixCls,
  props: sliderProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // 是否初始化完成
    const isInit = ref<boolean>(false);

    // computed

    // styles
    const styles = computed(() => {
      // 是否有单位
      const isUnitSliderLeft = letter.test(`${props.sliderLeft}`);
      const isUnitSliderWidth = letter.test(`${props.sliderWidth}`);

      return {
        left: !isUnitSliderLeft ? `${props.sliderLeft}px` : props.sliderLeft,
        width: !isUnitSliderWidth
          ? `${props.sliderWidth}px`
          : props.sliderWidth,
        transition: isInit.value ? '' : 'none 0s',
      };
    });

    // 内容
    const contentClasses = computed(() => {
      return [
        bem.e('content'),
        {
          [props.color]: !isCssColor(props.color),
        },
      ];
    });

    // 内容
    const contentStyles = computed(() => {
      if (isCssColor(props.color)) {
        return {
          backgroundColor: props.color,
          borderColor: props.color,
        };
      }

      return {};
    });

    // onMounted
    onMounted(() => {
      setTimeout(() => {
        isInit.value = true;
      });
    });

    return {
      // bem
      bem,

      // computed
      styles,
      contentClasses,
      contentStyles,
    };
  },
});
</script>
