<template>
  <transition
    name="ivue-notification-fade"
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
      <!-- 内容 -->
      <div :class="contentClasses" ref="content">
        <template v-if="type === 'normal'">
          <div :class="[`${prefixCls}-content`, haveDesc]">
            <div :class="`${prefixCls}-title`">{{ title }}</div>
            <div :class="`${prefixCls}-desc`">{{ desc }}</div>
          </div>
        </template>
        <template v-else>
          <div
            :class="`${prefixCls}-content ${prefixCls}-have-icon ${prefixCls}-have-${type} ${haveDesc}`"
          >
            <i
              :class="`ivue-icon ${prefixCls}-icon ${prefixCls}-icon-${type}`"
              >{{ data.iconTypes[type] }}</i
            >
            <div :class="`${prefixCls}-title`">{{ title }}</div>
            <div :class="`${prefixCls}-desc`">{{ desc }}</div>
          </div>
        </template>
      </div>
      <!-- render 渲染 -->
      <div :class="contentHaveIcon" v-if="renderFunc">
        <render-cell :render="renderFunc"></render-cell>
      </div>
      <!-- 关闭按钮 -->
      <div
        :class="`${baseClasses}-close`"
        @click.stop="handleClose"
        v-show="closable"
      >
        <i class="ivue-icon">close</i>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, onMounted, PropType } from 'vue';
import { useEventListener } from '@vueuse/core';

import { oneOf } from '../../utils/assist';
import { EVENT_CODE } from '../../utils/helpers';
import RenderCell from '../../utils/render';

// types
import type { Props, Data, Position, Type } from './types/notice';

const prefixCls = 'ivue-notice';

export default defineComponent({
  name: prefixCls,
  emits: ['destroy'],
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
      default: true,
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
      default: 4500,
    },
    /**
     * 偏移位置
     *
     * @type {Number}
     */
    offset: {
      type: Number,
      default: 0,
    },
    /**
     * 自定义弹出位置
     *
     * @type {String}
     */
    position: {
      type: String as PropType<Position>,
      validator(value: string) {
        return oneOf(value, [
          'top-right',
          'top-left',
          'bottom-right',
          'bottom-left',
        ]);
      },
      default: 'top-right',
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
     * 标题
     *
     * @type {String}
     */
    title: {
      type: String,
    },
    /**
     * 描述
     *
     * @type {String}
     */
    desc: {
      type: String,
    },
  },
  setup(props: Props) {
    // data
    const data = reactive<Data>({
      /**
       * 是否有描述
       *
       * @type {Boolean}
       */
      haveDesc: false,
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
        'ivue-notice',
        baseClasses.value,
        {
          [`${props.className}`]: !!props.className,
          [`${_baseClass}-closable`]: props.closable,
          [`${_baseClass}-have-desc`]: data.haveDesc,
        },
        horizontalClass.value,
      ];
    });

    // 当前方向
    const verticalProperty = computed(() => {
      return props.position.startsWith('top') ? 'top' : 'bottom';
    });

    // 弹出方向
    const horizontalClass = computed(() => {
      return props.position.indexOf('right') > 1 ? 'right' : 'left';
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      return {
        [verticalProperty.value]: `${props.offset}px`,
        'z-index': props.zIndex,
      };
    });

    // 有描述
    const haveDesc = computed(() => {
      return props.render && !props.title
        ? ''
        : props.desc || props.render
        ? `${prefixCls}-have-desc`
        : '';
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

    // 键盘点击
    const onKeydown = ({ code }: KeyboardEvent) => {
      if (code === EVENT_CODE.delete || code === EVENT_CODE.backspace) {
        clearCloseTimer(); // press delete/backspace clear timer
      } else if (code === EVENT_CODE.esc) {
        // press esc to close the notification
        if (data.visible) {
          handleClose();
        }
      } else {
        startTime(); // resume timer
      }
    };

    // onMounted
    onMounted(() => {
      startTime();

      data.visible = true;

      useEventListener(document, 'keydown', onKeydown);
    });

    return {
      prefixCls,

      // data
      data,

      // computed
      classes,
      baseClasses,
      contentClasses,
      contentHaveIcon,
      renderFunc,
      wrapperStyles,
      haveDesc,

      // methods
      handleClose,
      clearCloseTimer,
      handleMouseenter,
      handleMouseleave,
      horizontalClass,
    };
  },
  components: {
    RenderCell,
  },
});
</script>
