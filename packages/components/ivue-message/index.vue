<template>
  <transition
    :name="`${prefixCls}-message-fade`"
    @before-leave="onClose"
    @after-leave="$emit('destroy')"
  >
    <div
      :class="classes"
      :style="wrapperStyles"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      v-show="data.visible"
    >
      <div :class="`${baseClasses}-content`" ref="content">
        <template v-if="type === 'loading'">
          <div class="ivue-progress-circular-indeterminate">
            <i :class="`ivue-icon ${loadingIcon}`" v-if="loadingIcon"></i>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              :viewBox="`${viewBoxSize} ${viewBoxSize} ${2 * viewBoxSize} ${
                2 * viewBoxSize
              }`"
              :class="`${prefixCls}-loading ivue-load-loop`"
              v-else
            >
              <circle
                fill="transparent"
                :cx="`${2 * viewBoxSize}`"
                :cy="`${2 * viewBoxSize}`"
                r="20"
                :stroke-width="`${strokeWidth}`"
                :stroke-dasharray="`${strokeDasharray}`"
                :stroke-dashoffset="`${strokeDashoffset}`"
                class="ivue-progress-circular-overlay"
              />
            </svg>
          </div>
          <span v-html="content"></span>
        </template>
        <template v-else>
          <!-- icon -->
          <i :class="`ivue-icon ${prefixCls}-icon ${prefixCls}-icon-${type}`">{{
            data.iconTypes[type]
          }}</i>
          <!-- render 渲染 -->
          <div :class="`${baseClasses}-content-text`" v-if="renderFunc">
            <render-cell :render="renderFunc"></render-cell>
          </div>
          <!-- 内容 -->
          <div
            :class="`${baseClasses}-content-text`"
            v-html="content"
            v-else
          ></div>
          <!-- 关闭按钮 -->
          <div
            :class="`${baseClasses}-close`"
            @click="handleClose"
            v-show="closable"
          >
            <i class="ivue-icon">close</i>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, onMounted, PropType } from 'vue';

import RenderCell from '../../utils/render';

// type
import type { Props, Data, Type } from './types/message';

const prefixCls = 'ivue-message';

export default defineComponent({
  emits: ['destroy'],
  name: prefixCls,
  props: {
    /**
     * 内容
     *
     * @type {String}
     */
    content: {
      type: String,
      default: '',
    },
    /**
     * 类型名称
     *
     * @type {String}
     */
    type: {
      type: String as PropType<Type>,
      default: 'normal',
    },
    /**
     * 样式名称
     *
     * @type {String}
     */
    className: {
      type: String,
    },
    /**
     * 是否有关闭按钮
     *
     * @type {Boolean}
     */
    closable: {
      type: Boolean,
      default: false,
    },
    /**
     * 背景颜色
     *
     * @type {Boolean}
     */
    background: {
      type: Boolean,
      default: false,
    },
    /**
     * render 渲染函数
     *
     * @type {Function}
     */
    render: {
      type: Function,
    },
    /**
     * 关闭方法
     *
     * @type {Function}
     */
    onClose: {
      type: Function,
    },
    /**
     * 组件名称
     *
     * @type {String}
     */
    id: {
      type: String,
      required: true,
    },
    /**
     * 延迟关闭时间
     *
     * @type {Function}
     */
    duration: {
      type: Number,
      default: 1500,
    },
    /**
     * 偏移位置
     *
     * @type {Number}
     */
    top: {
      type: Number,
      default: 0,
    },
    /**
     * 当前index
     *
     * @type {Number}
     */
    zIndex: {
      type: Number,
      default: 0,
    },
    /**
     * loading icon
     *
     * @type {String}
     */
    loadingIcon: {
      type: String,
    },
  },
  setup(props: Props) {
    const radius = 20;
    const size = 20;
    const percent = 20;
    const viewBoxSize = radius / (1 - 4 / +size);
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = ((100 - percent) / 100) * circumference + 'px';
    const strokeDasharray = Math.round(circumference * 1000) / 1000;
    const strokeWidth = (2 / +size) * viewBoxSize * 2;

    // data
    const data = reactive<Data>({
      /**
       * 关闭时间
       *
       * @type {Function}
       */
      closeTimer: null,
      /**
       * 显示
       *
       * @type {Boolean}
       */
      visible: false,
      /**
       * 图标类型
       *
       * @type {Object}
       */
      iconTypes: {
        success: 'check_circle',
        info: 'info',
        warning: 'warning',
        error: 'error',
      },
    });

    // computed

    // 原始class
    const baseClasses = computed(() => {
      return `${prefixCls}-notice`;
    });

    // 外层样式
    const classes = computed(() => {
      const _baseClass = baseClasses.value;

      return [
        'ivue-message',
        baseClasses.value,
        {
          [`${props.className}`]: !!props.className,
          [`${_baseClass}-closable`]: props.closable,
          [`${_baseClass}-have-background`]: props.background,
          [`${_baseClass}-have-background-${props.type}`]: props.background,
        },
      ];
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      return {
        top: `${props.top}px`,
        'z-index': props.zIndex,
      };
    });

    // 内容样式
    const contentClasses = computed(() => {
      const _baseClass = baseClasses.value;

      return {
        [`${_baseClass}-content`]: true,
        [`${_baseClass}-content-render`]: props.render,
      };
    });

    // 是否有图标
    const contentHaveIcon = computed(() => {
      return {
        [`${prefixCls}-content-have-icon`]: props.type !== 'normal',
      };
    });

    // render 函数
    const renderFunc = computed(() => {
      return props.render;
    });

    // methods

    // 关闭
    const handleClose = () => {
      data.visible = false;
    };

    // 清除关闭时间
    const clearCloseTimer = () => {
      if (data.closeTimer) {
        clearTimeout(data.closeTimer);
        data.closeTimer = null;
      }
    };

    // 开始时间
    const startTime = () => {
      // 重新设置延迟关闭
      if (props.duration > 0) {
        data.closeTimer = setTimeout(() => {
          handleClose();
        }, props.duration);
      }
    };

    // 鼠标进入
    const handleMouseenter = () => {
      clearTimeout(data.closeTimer);
      data.closeTimer = null;
    };

    // 鼠标移开
    const handleMouseleave = () => {
      startTime();
    };

    // onMounted
    onMounted(() => {
      startTime();

      data.visible = true;
    });

    return {
      prefixCls,

      // data
      data,
      viewBoxSize,
      strokeWidth,
      strokeDasharray,
      strokeDashoffset,

      // computed
      classes,
      baseClasses,
      contentClasses,
      contentHaveIcon,
      renderFunc,
      wrapperStyles,

      // methods
      handleClose,
      clearCloseTimer,
      handleMouseenter,
      handleMouseleave,
    };
  },
  components: {
    RenderCell,
  },
});
</script>
