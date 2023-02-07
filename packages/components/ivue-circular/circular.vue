<template>
  <div :class="wrapClasses" :style="wrapStyles">
    <svg viewBox="0 0 100 100">
      <defs v-if="strokeColorIsString">
        <linearGradient :id="id" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" :stop-color="`${strokeColor[0]}`" />
          <stop offset="100%" :stop-color="`${strokeColor[1]}`" />
        </linearGradient>
      </defs>
      <path
        :d="pathString"
        :stroke="trailColor"
        :stroke-width="trailWidth"
        :fill-opacity="0"
        :style="trailStyle"
        :stroke-linecap="strokeLinecap"
      />

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
    <div :class="`${prefixCls}-inner`">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { oneOf } from '../../utils/assist';
import { getRandomStr } from '../../utils/helpers';

// type
import { Props } from './types/circular';

const prefixCls = 'ivue-circular';

export default defineComponent({
  name: prefixCls,
  props: {
    /**
     * 百分比
     *
     * @type {Number}
     */
    percent: {
      type: Number,
      default: 0,
    },
    /**
     * 圆圈大小，单位 px
     *
     * @type {String | Number}
     */
    size: {
      type: [String, Number],
      default: 120,
    },
    /**
     * 是否显示为仪表盘
     *
     * @type {Boolean}
     */
    dashboard: {
      type: Boolean,
      default: false,
    },
    /**
     * 进度环的线宽
     *
     * @type {Number}
     */
    strokeWidth: {
      type: Number,
      default: 6,
    },
    /**
     * 进度环背景的颜色
     *
     * @type {String}
     */
    trailColor: {
      type: String,
      default: '#F8F9FD',
    },
    /**
     * 进度环背景的线宽
     *
     * @type {Number}
     */
    trailWidth: {
      type: Number,
      default: 6,
    },
    /**
     * 进度环顶端的形状，可选值为square（方）和round（圆）
     *
     * @type {String}
     */
    strokeLinecap: {
      type: null,
      validator(value: string) {
        return oneOf(value, ['square', 'round']);
      },
      default: 'round',
    },
    /**
     * 进度环的颜色
     *
     * @type {String | Array}
     */
    strokeColor: {
      type: [String, Array],
      default: '#5B8EFF',
    },
  },
  setup(props: Props) {
    // ref
    const id = ref<string>(`ivu-chart-circle-${getRandomStr(3)}`);

    // 外层样式
    const wrapClasses = computed(() => {
      return [prefixCls];
    });

    // 外层样式style
    const wrapStyles = computed(() => {
      const regexp = new RegExp(/[a-zA-Z]/g);

      // 是否有单位
      const isUnit = regexp.test(`${props.size}`);

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
      let style = {};

      if (props.dashboard) {
        style = {
          'stroke-dasharray': `${len.value - 75}px ${len.value}px`,
          'stroke-dashoffset': `-${75 / 2}px`,
          transition:
            'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s',
        };
      }

      return style;
    });

    // 进度值
    const strokeValue = computed(() => {
      let color = props.strokeColor;

      if (typeof props.strokeColor !== 'string') {
        color = `url(#${id.value})`;
      }

      return color as string;
    });

    // 计算进度条宽度
    const computedStrokeWidth = computed(() => {
      return props.percent === 0 && props.dashboard ? 0 : props.strokeWidth;
    });

    // 路径样式
    const pathStyles = computed(() => {
      let style = {};

      // 仪表盘
      if (props.dashboard) {
        style = {
          'stroke-dasharray': `${(props.percent / 100) * (len.value - 75)}px ${
            len.value
          }px`,
          'stroke-dashoffset': `-${75 / 2}px`,
          transition:
            'stroke-dashoffset .3s ease 0s, stroke-dasharray .6s ease 0s, stroke .6s, stroke-width .06s ease .6s',
        };
      } else {
        style = {
          'stroke-dasharray': `${len.value}px ${len.value}px`,
          'stroke-dashoffset': `${((100 - props.percent) / 100) * len.value}px`,
          transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease',
        };
      }
      return style;
    });

    // 进度环的颜色是否是字符串
    const strokeColorIsString = computed(() => {
      return typeof props.strokeColor !== 'string';
    });

    return {
      prefixCls,

      // id
      id,
      // computed
      wrapClasses,
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
