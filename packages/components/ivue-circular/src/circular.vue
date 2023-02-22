<template>
  <div :class="bem.b()" :style="wrapStyles">
    <svg :class="bem.e('svg')" viewBox="0 0 100 100">
      <!-- 进度环的颜色是否是字符串 -->
      <defs v-if="strokeColorIsString">
        <linearGradient :id="id" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" :stop-color="`${strokeColor[0]}`" />
          <stop offset="100%" :stop-color="`${strokeColor[1]}`" />
        </linearGradient>
      </defs>
      <!-- 路径 -->
      <path
        :d="pathString"
        :stroke="trailColor"
        :stroke-width="trailWidth"
        :fill-opacity="0"
        :style="trailStyle"
        :stroke-linecap="strokeLinecap"
      />
      <!-- 进度条 -->
      <path
        fill-opacity="0"
        :d="pathString"
        :stroke-linecap="strokeLinecap"
        :stroke="strokeValue"
        :stroke-width="computedStrokeWidth"
        :style="pathStyles"
      />
    </svg>
    <!-- 文字 -->
    <div :class="bem.b('inner')">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// utils
import { getRandomStr, letter } from '@ivue-material-plus/utils';

// circular
import { circularProps } from './circular';

const prefixCls = 'ivue-circular';

export default defineComponent({
  name: prefixCls,
  props: circularProps,
  setup(props) {
    // bem
    const bem = useNamespace(prefixCls);

    // ref
    const id = ref<string>(`ivu-chart-circle-${getRandomStr(3)}`);

    // 外层样式style
    const wrapStyles = computed(() => {
      // 是否有单位
      const isUnit = letter.test(`${props.size}`);

      return {
        height: !isUnit ? `${props.size}px` : props.size,
        width: !isUnit ? `${props.size}px` : props.size,
      };
    });

    // 圆角大小
    const radius = computed(() => {
      return 50 - props.strokeWidth / 2;
    });

    // 长度
    const len = computed(() => {
      return Math.PI * 2 * radius.value;
    });

    // 路径
    const pathString = computed(() => {
      // 显示为仪表盘
      if (props.dashboard) {
        return `
                M 50,50 m 0,
                ${radius.value}
                    a ${radius.value},${radius.value} 0 1 1 0,
                    -${2 * radius.value} a ${radius.value},
                    ${radius.value} 0 1 1 0,${2 * radius.value}`;
      }
      // 普通显示
      else {
        return `M 50,50 m 0,
                -${radius.value} a ${radius.value},
                ${radius.value} 0 1 1 0,
                ${2 * radius.value} a ${radius.value},
                ${radius.value} 0 1 1 0,-${2 * radius.value}`;
      }
    });

    // 轨道样式
    const trailStyle = computed(() => {
      if (props.dashboard) {
        return {
          'stroke-dasharray': `${len.value - 75}px ${len.value}px`,
          'stroke-dashoffset': `-${75 / 2}px`,
          transition:
            'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s',
        };
      }

      return {};
    });

    // 进度值
    const strokeValue = computed(() => {
      let color = props.strokeColor;

      if (typeof props.strokeColor !== 'string') {
        color = `url(#${id.value})`;
      }

      return `${color}`;
    });

    // 计算进度条宽度
    const computedStrokeWidth = computed(() => {
      return props.percent === 0 && props.dashboard ? 0 : props.strokeWidth;
    });

    // 路径样式
    const pathStyles = computed(() => {
      // 仪表盘
      if (props.dashboard) {
        return {
          strokeDasharray: `${(props.percent / 100) * (len.value - 75)}px ${
            len.value
          }px`,
          strokeDashoffset: `-${75 / 2}px`,
          transition:
            'stroke-dashoffset .3s ease 0s, stroke-dasharray .6s ease 0s, stroke .6s, stroke-width .06s ease .6s',
        };
      }

      return {
        strokeDasharray: `${len.value}px ${len.value}px`,
        strokeDashoffset: `${((100 - props.percent) / 100) * len.value}px`,
        transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease',
      };
    });

    // 进度环的颜色是否是字符串
    const strokeColorIsString = computed(() => {
      return typeof props.strokeColor !== 'string';
    });

    return {
      // bem
      bem,

      // id
      id,

      // computed
      wrapStyles,
      pathString,
      trailStyle,
      strokeValue,
      computedStrokeWidth,
      pathStyles,
      strokeColorIsString,
    };
  },
});
</script>
