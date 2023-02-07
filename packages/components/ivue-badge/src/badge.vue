<template>
  <!-- 状态点 -->
  <span :class="bem.b()" v-if="dot">
    <slot></slot>
    <!-- dot -->
    <sup :style="supStyles" :class="dotClasses" v-show="showBadge"></sup>
  </span>
  <!-- 状态点的颜色 -->
  <span v-else-if="status" :class="bem.b('status')">
    <!-- status -->
    <span :class="statusClasses" :style="statusStyles"></span>
    <!-- text -->
    <span :class="bem.bm('status', 'text')">
      <slot name="text">{{ text }}</slot>
    </span>
  </span>
  <!-- 普通显示 -->
  <span :class="bem.b()" v-else>
    <!-- slot -->
    <slot></slot>
    <!-- dot -->
    <transition name="fade">
      <!-- slots.count -->
      <sup
        :style="slotsStyles"
        :class="countSlotsClasses"
        v-if="$slots.count"
        v-show="showBadge"
      >
        <slot name="count"></slot>
      </sup>
      <!-- count -->
      <sup
        :style="supStyles"
        :class="countClasses"
        v-show="showBadge"
        v-else-if="hasCount"
      >
        <sup>
          <slot name="text">{{ finalCount }}</slot>
        </sup>
      </sup>
    </transition>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import hexToRgba from 'hex-to-rgba';

import { useNamespace } from '@ivue-material-plus/hooks';
import { isCssColor, oneOf } from '@ivue-material-plus/utils';

// badge
import { badgeProps, initColorList } from './badge';
// use
import { useBadge } from './use-badge';

// type
import type { CSSProperties } from 'vue';

const prefixCls = 'ivue-badge';

export default defineComponent({
  name: prefixCls,
  // props
  props: badgeProps,
  setup(props, { slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    const {
      // computed
      alone,
      hasCount,
      showBadge,
      finalCount,
    } = useBadge(props, slots);

    // computed

    // 原始class
    const dotClasses = computed(() => {
      let _color = {};

      // 自定义颜色
      if (!isCssColor(props.color)) {
        _color = { [props.color]: true };
      }

      return [bem.m('dot'), _color];
    });

    // 数值样式
    const countClasses = computed(() => {
      const { color, className } = props;

      let _color = {
        [`${className}`]: !!className,
        // 独立展示
        [bem.is('alone')]: alone.value,
      };

      // 自定义颜色
      if (!isCssColor(color)) {
        _color = {
          ..._color,
          [color]: true,
        };
      }

      return [bem.m('count'), _color];
    });

    // 数值slot样式
    const countSlotsClasses = computed(() => {
      const { color, className } = props;

      let _color = {
        [`${className}`]: !!className,
      };

      // 自定义颜色
      if (!isCssColor(color)) {
        _color = {
          ..._color,
          [color]: true,
        };
      }

      return [bem.m('count'), bem.is('slot'), _color];
    });

    // 状态点的颜色
    const statusClasses = computed(() => {
      const { status, color } = props;

      let _color = {
        [bem.is(color)]: !!color && oneOf(color, initColorList),
      };

      // 自定义颜色
      if (!isCssColor(status)) {
        _color = {
          ..._color,
          [bem.is(status)]: !!status,
        };
      }

      return [bem.bm('status', 'dot'), _color];
    });

    // 状态点的颜色
    const statusStyles = computed<CSSProperties>(() => {
      const { status } = props;

      // 是颜色参数
      if (isCssColor(status)) {
        return {
          backgroundColor: status,
        };
      }

      return {};
    });

    // 微标位置
    const supStyles = computed<CSSProperties>(() => {
      // 有偏移位置
      if (props.offset && props.offset.length === 2) {
        return {
          marginTop: `${props.offset[0]}px`,
          marginRight: `${props.offset[1]}px`,
        };
      }

      // 有自定义颜色
      if (isCssColor(props.color)) {
        return {
          backgroundColor: props.color,
          boxShadow: `0 0 2px 1px ${hexToRgba(props.color, '0.5')}`,
        };
      }

      return {};
    });

    // 微标位置
    const slotsStyles = computed<CSSProperties>(() => {
      // 没有数字偏移位置
      if (!(props.offset && props.offset.length === 2)) {
        return;
      }

      return {
        marginTop: `${props.offset[0]}px`,
        marginRight: `${props.offset[1]}px`,
      };
    });

    return {
      // bem
      bem,

      // computed
      dotClasses,
      countClasses,
      countSlotsClasses,
      statusClasses,
      slotsStyles,
      statusStyles,
      supStyles,
      finalCount,
      showBadge,
      hasCount,
      alone,
    };
  },
});
</script>
