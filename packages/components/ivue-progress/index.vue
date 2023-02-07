<template>
  <div :class="wrapClasses">
    <!-- 进度条 -->
    <div :class="outerClasser">
      <!-- 内容样式 -->
      <div :class="innerClasser">
        <!-- 背景 -->
        <div :class="bgClasser" :style="bgStyles">
          <!-- 百分比是否置于进度条内 -->
          <div :class="`${prefixCls}-inner-text`" v-if="textInside">
            {{ percent }}%
          </div>
        </div>
        <!-- 已完成的分段百分比 -->
        <div :class="successBgClasses" :style="successBgStyles"></div>
      </div>
    </div>
    <!-- 状态图标 -->
    <span :class="textClasses" v-if="!hideInfo && !textInside">
      <slot>
        <!-- 图标 -->
        <span v-if="isStatus" :class="textInnerClasses">
          <ivue-icon v-if="!icon">{{ statusIcon }}</ivue-icon>
          <i :class="icon" v-else></i>
        </span>
        <!-- 文案 -->
        <span v-else :class="textInnerClasses">{{ percent }}%</span>
      </slot>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from 'vue';
import { oneOf } from '../../utils/assist';

import IvueIcon from '../ivue-icon/index.vue';

// type
import type { Props } from './types/progress';

const prefixCls = 'ivue-progress';

export default defineComponent({
  name: prefixCls,
  emits: ['on-status-change'],
  props: {
    /**
     * 状态，可选值为normal、active、wrong、success
     *
     * @type {String}
     */
    status: {
      type: String,
      validator(value: string) {
        return oneOf(value, [
          'normal',
          'active',
          'wrong',
          'success',
          'warning',
        ]);
      },
      default: 'normal',
    },
    /**
     * 隐藏数值或状态图标
     *
     * @type  {Boolean}
     */
    hideInfo: {
      type: Boolean,
      default: false,
    },
    /**
     * 百分比是否置于进度条内
     *
     * @type  {Boolean}
     */
    textInside: {
      type: Boolean,
      default: false,
    },
    /**
     * 已完成的分段百分比
     *
     * @type {Number}
     */
    successPercent: {
      type: Number,
      default: 0,
    },
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
     * 进度条的线宽，单位 px
     *
     * @type {Number}
     */
    strokeWidth: {
      type: Number,
      default: 10,
    },
    /**
     * 是否在垂直方向显示
     *
     * @type {Boolean}
     */
    vertical: {
      type: Boolean,
      default: false,
    },
    /**
     * 进度条的颜色
     *
     * @type {String | Array}
     */
    strokeColor: {
      type: [String, Array],
    },
    /**
     * 进度条阴影颜色
     *
     * @type {String}
     */
    boxShadowColor: {
      type: String,
    },
    /**
     * 状态图标
     *
     * @type {String}
     */
    icon: {
      type: String,
    },
    /**
     * 是否为动画进度条
     *
     * @type {Boolean}
     */
    indeterminate: {
      type: Boolean,
      default: false,
    },
    /**
     * 控制动画进度条速度
     *
     * @type {Number}
     */
    duration: {
      type: Number,
      default: 3,
    },
  },
  setup(props: Props, { emit }) {
    // data
    const currentStatus = ref<string>(props.status);

    // computed

    // 外层样式
    const wrapClasses = computed(() => {
      return [
        `${prefixCls}`,
        `${prefixCls}-${currentStatus.value}`,
        {
          [`${prefixCls}-show-info`]: !props.hideInfo && !props.textInside,
          [`${prefixCls}-vertical`]: props.vertical,
        },
      ];
    });

    // 进度条样式
    const outerClasser = computed(() => {
      return `${prefixCls}-outer`;
    });

    // 内容样式
    const innerClasser = computed(() => {
      return `${prefixCls}-inner`;
    });

    //背景样式
    const bgClasser = computed(() => {
      return {
        [`${prefixCls}-bg`]: true,
        [`${prefixCls}-indeterminate`]: props.indeterminate,
      };
    });

    //状态样式
    const textClasses = computed(() => {
      return `${prefixCls}-text`;
    });

    // 文字样式
    const textInnerClasses = computed(() => {
      return `${prefixCls}-text`;
    });

    // 已完成的分段百分比 class
    const successBgClasses = computed(() => {
      return `${prefixCls}-success-bg`;
    });

    // 已完成的分段百分比 style
    const successBgStyles = computed(() => {
      let style = {};

      // 垂直方向
      if (props.vertical) {
        style = {
          height: `${props.successPercent}%`,
          width: `${props.strokeWidth}px`,
        };
      } else {
        style = {
          width: `${props.successPercent}%`,
          height: `${props.strokeWidth}px`,
        };
      }

      return style;
    });

    //背景样式
    const bgStyles = computed(() => {
      let style: {
        height?: string;
        width?: string;
        boxShadow?: string;
        animationDuration?: string;
        backgroundColor?: string;
        backgroundImage?: string;
      } = {};

      // 垂直方向
      if (props.vertical) {
        style = {
          height: `${props.percent}%`,
          width: `${props.strokeWidth}px`,
        };
      } else {
        style = {
          width: `${props.percent}%`,
          height: `${props.strokeWidth}px`,
          boxShadow: `0 0px 5px ${props.boxShadowColor}`,
        };
      }

      // 是否有进度条颜色
      if (props.strokeColor) {
        if (typeof props.strokeColor === 'string') {
          style.backgroundColor = props.strokeColor;
        } else {
          style.backgroundImage = `linear-gradient(to right, ${props.strokeColor[0]} 0%, ${props.strokeColor[1]} 100%)`;
        }
      }

      style.animationDuration = `${props.duration}s`;

      return style;
    });

    // 状态图标
    const statusIcon = computed(() => {
      let type = '';

      // 警告
      if (currentStatus.value === 'warning') {
        type = 'warning';
      }

      // 错误
      if (currentStatus.value === 'wrong') {
        type = 'cancel';
      }

      // 成功
      if (currentStatus.value === 'success') {
        type = 'check_circle';
      }

      return type;
    });

    // 是否有状态
    const isStatus = computed(() => {
      return (
        currentStatus.value === 'wrong' ||
        currentStatus.value === 'success' ||
        currentStatus.value === 'warning'
      );
    });

    // methods

    // 状态事件
    const handleStatus = (init: boolean) => {
      // 初始化
      if (init) {
        currentStatus.value = 'normal';

        emit('on-status-change', 'normal');
      }
      // 成功状态
      else {
        if (parseInt(`${props.percent}`, 10) == 100) {
          currentStatus.value = 'success';

          emit('on-status-change', 'success');
        }
      }
    };

    // onMounted
    onMounted(() => {
      handleStatus(false);
    });

    // watch

    // 监听进度条
    watch(
      () => props.percent,
      (value, oldValue) => {
        if (value < oldValue) {
          handleStatus(true);
        } else {
          handleStatus(false);
        }
      }
    );

    // 监听状态
    watch(
      () => props.status,
      (status) => {
        currentStatus.value = status;
      }
    );

    return {
      prefixCls,

      // data
      currentStatus,

      // computed
      wrapClasses,
      outerClasser,
      innerClasser,
      bgClasser,
      bgStyles,
      textClasses,
      textInnerClasses,
      statusIcon,
      isStatus,
      successBgClasses,
      successBgStyles,

      // methods
      handleStatus,
    };
  },
  components: {
    IvueIcon,
  },
});
</script>
