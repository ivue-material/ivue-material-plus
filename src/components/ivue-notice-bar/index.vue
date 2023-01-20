<template>
  <div :class="wrapperClasses" :style="wrapperStyles" v-show="data.show">
    <!-- icon -->
    <div :class="`${prefixCls}-left`">
      <slot name="leftIcon">
        <ivue-icon :class="`${prefixCls}-icon`" v-if="leftIcon">{{
          leftIcon
        }}</ivue-icon>
      </slot>
    </div>
    <!-- 内容 -->
    <div :class="`${prefixCls}-text--wrapper`" ref="contentWrapper">
      <div
        :class="textClasses"
        :style="textStyles"
        :onTransitionend="handleTransitionEnd"
        ref="content"
      >
        <slot>{{ text }}</slot>
      </div>
    </div>
    <!-- icon -->
    <div :class="`${prefixCls}-right`">
      <slot name="nextIcon">
        <!-- 关闭按钮 -->
        <ivue-icon
          :class="`${prefixCls}-icon`"
          @click="handleClose"
          v-if="mode === 'closeable'"
          >close</ivue-icon
        >
        <!-- 链接按钮 -->
        <ivue-icon
          :class="`${prefixCls}-icon`"
          @click="handleLink"
          v-if="mode === 'link'"
          >arrow_forward_ios</ivue-icon
        >
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  onActivated,
  nextTick,
  onUnmounted,
  onDeactivated,
  watch,
} from 'vue';
import { isDef } from '../../utils/validate';
import { doubleRaf, raf, isCssColor } from '../../utils/helpers';
import { on, off } from '../../utils/dom';
import IvueIcon from '../ivue-icon';
import { oneOf } from '../../utils/assist';

// type
import type { Props, Data } from './types/notice-bar';

const prefixCls = 'ivue-notice-bar';

export default defineComponent({
  name: prefixCls,
  emits: ['on-replay', 'on-close', 'on-link'],
  props: {
    /**
     * 文本
     *
     * @type {String}
     */
    text: {
      type: String,
    },
    /**
     * 滚动速率 (px/s)
     *
     * @type {Number}
     */
    speed: {
      type: Number,
      default: 60,
    },
    /**
     * 动画延迟时间 (s)
     *
     * @type {Number}
     */
    delay: {
      type: Number,
      default: 1,
    },
    /**
     * 是否开启滚动播放，内容长度溢出时默认开启
     *
     * @type {Boolean}
     */
    scrollable: {
      type: Boolean,
      default: false,
    },
    /**
     * 模式
     *
     * @type {String}
     */
    mode: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['closeable', 'link']);
      },
    },
    /**
     * 是否开启文本换行，只在禁用滚动时生效
     *
     * @type {Boolean}
     */
    wrapable: {
      type: Boolean,
    },
    /**
     * 左边按钮
     *
     * @type {String}
     */
    leftIcon: {
      type: String,
    },
    /**
     * 背景
     *
     * @type {String | Array}
     */
    background: {
      type: [String, Array],
    },
    /**
     * 文字颜色
     *
     * @type {String}
     */
    textColor: {
      type: String,
    },
  },
  setup(props: Props, { emit }) {
    // dom
    const contentWrapper = ref<HTMLElement>();
    const content = ref<HTMLElement>();

    const data = reactive<Data>({
      /**
       * 是否显示
       *
       * @type {Boolean}
       */
      show: true,
      /**
       * 偏移位置
       *
       * @type {Number}
       */
      offset: 0,
      /**
       * 延迟时间
       *
       * @type {Number}
       */
      duration: 0,
      /**
       * 是否挂载完成
       *
       * @type {Boolean}
       */
      mounted: null,
      /**
       * 内容外层宽度
       *
       * @type {Number}
       */
      contentWrapperWidth: 0,
      /**
       * 内容宽度
       *
       * @type {Number}
       */
      contentWidth: 0,
      /**
       * 倒计时
       *
       * @type {Function}
       */
      startTimer: null,
    });

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}-wrapable`]: props.wrapable,
        },
      ];
    });

    const wrapperStyles = computed(() => {
      return {
        ...setBackgroundColor(props.background),
        ...setTextColor(props.textColor),
      };
    });

    // 文字样式
    const textStyles = computed(() => {
      return {
        transform: data.offset ? `translateX(${data.offset}px)` : '',
        transitionDuration: `${data.duration}s`,
      };
    });

    // 文字样式
    const textClasses = computed(() => {
      return [
        `${prefixCls}-text`,
        {
          [`${prefixCls}-text--ellipsis`]:
            props.scrollable === false && !props.wrapable,
        },
      ];
    });

    // methods

    // 设置背景颜色
    const setBackgroundColor = (color: string | any[]) => {
      let style = {};

      // 是否是数组
      if (Array.isArray(color)) {
        style = {
          background: `linear-gradient(135deg,${color[0]} 0%, ${color[1]} 100%)`,
        };
      } else if (isCssColor(color)) {
        style = {
          'background-color': `${color}`,
        };
      }

      return style;
    };

    // 设置文字颜色
    const setTextColor = (color: string) => {
      let style = {};

      if (isCssColor(color)) {
        style = {
          color: `${color}`,
        };
      }

      return style;
    };

    // 初始化数据
    const reset = () => {
      const { delay, speed, scrollable } = props;

      // 是否有定义 delay
      const delayTime = isDef(delay) ? +delay * 1000 : 0;

      data.contentWrapperWidth = 0;
      data.contentWidth = 0;

      // 清除定时器
      clearTimeout(data.startTimer);

      // 动画延迟时间
      data.startTimer = setTimeout(() => {
        if (!contentWrapper.value || !content.value || scrollable === false) {
          return;
        }

        // 内容外层宽度
        const contentWrapperWidth =
          contentWrapper.value.getBoundingClientRect().width;
        // 内容宽度
        const contentWidth = content.value.getBoundingClientRect().width;

        // 是否开启滚动播放 || 内容长度溢出时默认开启
        if (scrollable || contentWidth > contentWrapperWidth) {
          doubleRaf(() => {
            data.contentWrapperWidth = contentWrapperWidth;
            data.contentWidth = contentWidth;

            data.offset = -contentWidth;
            data.duration = contentWidth / +speed;
          });
        }
      }, delayTime);
    };

    // 动画结束
    const handleTransitionEnd = () => {
      // 重制偏移位置
      data.offset = data.contentWrapperWidth;

      // 运动时间
      data.duration = 0;

      // 使用requestAnimationFrame
      raf(() => {
        // 使用双 raf 确保动画可以开始
        doubleRaf(() => {
          // 重新设置偏移位置
          data.offset = -data.contentWidth;
          // 重新设置运动时间
          data.duration =
            (data.contentWidth + data.contentWrapperWidth) / +props.speed;

          // 每当滚动栏重新开始滚动时触发
          emit('on-replay');
        });
      });
    };

    // 关闭
    const handleClose = () => {
      data.show = false;

      emit('on-close');
    };

    // link
    const handleLink = () => {
      emit('on-link');
    };

    // watch

    // 监听文字 | 是否开启滚动播放
    watch(() => [props.text, props.scrollable], reset);

    // onMounted
    onMounted(() => {
      reset();

      // 当一条会话历史记录被执行的时候将会触发页面显示
      on(window, 'pageshow', reset);

      nextTick(() => {
        data.mounted = true;
      });
    });

    // onActivated
    onActivated(() => {
      if (data.mounted) {
        reset();

        // 当一条会话历史记录被执行的时候将会触发页面显示
        on(window, 'pageshow', reset);
      }
    });

    // onUnmounted
    onUnmounted(() => {
      // 当一条会话历史记录被执行的时候将会触发页面显示
      off(window, 'pageshow', reset);
    });

    // onDeactivated
    onDeactivated(() => {
      // 当一条会话历史记录被执行的时候将会触发页面显示
      off(window, 'pageshow', reset);
    });

    return {
      prefixCls,

      // dom
      contentWrapper,
      content,

      // data
      data,

      // computed
      textStyles,
      textClasses,
      wrapperClasses,
      wrapperStyles,

      // methods
      reset,
      handleTransitionEnd,
      handleClose,
      handleLink,
    };
  },
  components: {
    IvueIcon,
  },
});
</script>
