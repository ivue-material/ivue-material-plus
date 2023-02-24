<template>
  <span :class="wrapperClasses" :style="wrapperStyles" ref="wrapper">
    <!-- 图片 -->
    <slot name="img">
      <img
        :class="bem.e('img')"
        v-if="src"
        :src="src"
        @error="handleImageError"
      />
    </slot>
    <!-- icon -->
    <slot name="icon">
      <ivue-icon v-if="icon">{{ icon }}</ivue-icon>
    </slot>
    <!-- text -->
    <span :style="slotStyles" ref="text" v-if="$slots.default">
      <slot></slot>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed, unref } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';
import { colorable } from '@ivue-material-plus/utils/mixins/colorable';
import { letter } from '@ivue-material-plus/utils';

// avatar
import { avatarProps, avatarEmits } from './avatar';
// use
import { useAvatar } from './use-avatar';

// components
import { IvueIcon } from '@ivue-material-plus/components';

// type
import type { CSSProperties } from 'vue';

const prefixCls = 'ivue-avatar';

export default defineComponent({
  name: prefixCls,
  // emits
  emits: avatarEmits,
  // props
  props: avatarProps,
  setup(props, { emit, slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    // mixins
    const { setBackgroundColor } = colorable();

    const {
      // dom
      text,
      wrapper,

      // data
      isSlotShow,
      slotScale,
      slotWidth,

      // methods
      handleImageError,
    } = useAvatar(props, emit, slots);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      const _class = setBackgroundColor(props.color).class;

      return [
        bem.b(),
        _class,
        {
          [bem.is(props.shape)]: true,
        },
      ];
    });

    // 外层样式
    const wrapperStyles = computed<CSSProperties>(() => {
      const _style = setBackgroundColor(props.color).style;

      // 是否有大小
      if (props.size) {
        // 是否有单位
        const isUnit = letter.test(`${props.size}`);

        // 大小
        const size = !isUnit ? `${props.size}px` : props.size;

        return [
          {
            height: size,
            width: size,
            lineHeight: size,
          },
          _style,
        ];
      }

      return _style;
    });

    // slot样式
    const slotStyles = computed<CSSProperties>(() => {
      if (!unref(isSlotShow)) {
        return {};
      }

      return {
        position: 'absolute',
        transform: `scale(${unref(slotScale)})`,
        display: 'inline-block',
        left: `calc(50% - ${Math.round(unref(slotWidth) / 2)}px)`,
      };
    });

    return {
      bem,

      // dom
      text,
      wrapper,

      // data
      isSlotShow,
      slotScale,
      slotWidth,

      // computed
      wrapperClasses,
      wrapperStyles,
      slotStyles,

      // methods
      handleImageError,
    };
  },
  components: {
    IvueIcon,
  },
});
</script>
