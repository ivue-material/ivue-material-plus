<template>
  <div
    :class="prefixCls"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <!-- 按钮 -->
    <template v-if="data.showCopyTrack">
      <ivue-button
        :class="leftButtonClasses"
        flat
        icon
        @click="handleArrowClick('left')"
        v-if="!$slots.leftArrow"
      >
        <ivue-icon>{{ leftArrow }}</ivue-icon>
      </ivue-button>
      <template v-if="$slots.leftArrow">
        <div :class="leftButtonClasses" @click="handleArrowClick('left')">
          <slot name="leftArrow"></slot>
        </div>
      </template>
    </template>

    <!-- scroll -->
    <div :class="`${prefixCls}-scroll`" ref="scroll">
      <!-- 内容 -->
      <div :class="`${prefixCls}-content`" ref="content">
        <div :class="`${prefixCls}-list`" :style="listStyles" ref="list">
          <slot></slot>
        </div>
        <!-- 复制的内容 -->
        <div
          :class="`${prefixCls}-list copy-track`"
          :style="listCopyStyles"
          v-if="data.showCopyTrack"
        >
          <slot></slot>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <template v-if="data.showCopyTrack">
      <ivue-button
        :class="rightButtonClasses"
        flat
        icon
        @click="handleArrowClick('right')"
        v-if="!$slots.rightArrow"
      >
        <slot name="rightArrow">
          <ivue-icon>{{ rightArrow }}</ivue-icon>
        </slot>
      </ivue-button>
      <template v-if="$slots.rightArrow">
        <div :class="rightButtonClasses" @click="handleArrowClick('right')">
          <slot name="rightArrow"></slot>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  ref,
  nextTick,
  onMounted,
  onUnmounted,
  watch,
} from 'vue';

import { oneOf } from '../../utils/assist';

import IvueButton from '../ivue-button';
import IvueIcon from '../ivue-icon';

// type
import type { Props, Data } from './types/carousel-loop';

const prefixCls = 'ivue-carousel-loop';

export default defineComponent({
  name: prefixCls,
  emits: ['on-scroll-end'],
  props: {
    /**
     * 左箭头图标
     *
     * @type {String}
     */
    leftArrow: {
      type: String,
      default: 'keyboard_arrow_left',
    },
    /**
     * 右箭头图标
     *
     * @type {String}
     */
    rightArrow: {
      type: String,
      default: 'keyboard_arrow_right',
    },
    /**
     * 是否自动滚动
     *
     * @type {Boolean}
     */
    autoplay: {
      type: Boolean,
      default: true,
    },
    /**
     * 自动滚动的时间间隔，单位为毫秒
     *
     * @type {Number}
     */
    interval: {
      type: Number,
      default: 16.7,
    },
    /**
     * 滚动方向
     *
     * @type {String}
     */
    direction: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['left', 'right']);
      },
      default: 'right',
    },
    /**
     * 鼠标悬浮时暂停自动滚动
     *
     * @type {Boolean}
     */
    pauseOnHover: {
      type: Boolean,
      default: true,
    },
    /**
     * 每一次滚动偏移大小
     *
     * @type {Number}
     */
    offset: {
      type: Number,
      default: 200,
    },
    /**
     * 滑动速率（毫秒）
     *
     * @type {Number}
     */
    slidingSpeed: {
      type: Number,
      default: 5,
    },
    /**
     * 按钮点击是否等待动画完成后才可以下一步
     *
     * @type {Boolean}
     */
    slidingEndNext: {
      type: Boolean,
      default: true,
    },
    /**
     * 滚动次数
     *
     * @type {Number}
     */
    scrollQuantity: {
      type: Number,
    },
    /**
     * 箭头显示时机
     *
     * @type {String}
     *
     * hover（悬停），always（一直显示），never（不显示）, outside (外部)
     */
    arrow: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['hover', 'always', 'never', 'outside']);
      },
      default: 'always',
    },
    /**
     * 外部数据传入用于监听数据变化更新滚动动画
     *
     * @type {Array}
     */
    dataList: {
      type: Array,
    },
  },
  setup(props: Props, { emit, slots }) {
    // dom
    const scroll = ref<HTMLDivElement>();
    const content = ref<HTMLDivElement>();
    const list = ref<HTMLDivElement>();

    // data
    const data = reactive<Data>({
      /**
       * setInterval
       *
       * @type  {Function}
       */
      timer: null,
      /**
       * 是否循环显示
       *
       * @type {Boolean}
       */
      loop: true,
      /**
       * 显示复制的内容
       *
       * @type {Boolean}
       */
      showCopyTrack: false,
      /**
       * 列表宽度
       *
       * @type {Number}
       */
      listWidth: 0,
      /**
       * 内容宽度
       *
       * @type {Number}
       */
      contentWidth: 0,
      /**
       * 列表动画
       *
       * @type {Number}
       */
      listTranslate: 0,
      /**
       * 列表动画开始
       *
       * @type {Boolean}
       */
      listTranslateStart: true,
      /**
       * 复制列表动画
       *
       * @type {Number}
       */
      listCopyTranslate: 0,
      /**
       * 复制列表动画开始
       *
       * @type {Boolean}
       */
      listCopyTranslateStart: false,
      /**
       * 溢出宽度
       *
       * @type {Number}
       */
      overflowWidth: 0,
      /**
       * 列表滚动完成数量
       *
       * @type {Number}
       */
      scrollDoneQuantity: 0,
      /**
       * 方向
       *
       * @type {String}
       */
      direction: props.direction,
      /**
       * 箭头点击滚动
       *
       * @type {Function}
       */
      arrowInterval: null,
      /**
       * 箭头点击滚动
       *
       * @type {Function}
       */
      arrowSetTimeout: null,
      /**
       * 跨度
       *
       * @type {Number}
       */
      span: -1,
      /**
       * 滑动开始
       *
       * @type {Boolean}
       */
      slidingStart: false,
    });

    // computed

    // 列表样式
    const listStyles = computed(() => {
      return {
        transform: `translateX(${data.listTranslate}px)`,
      };
    });

    // 复制列表样式
    const listCopyStyles = computed(() => {
      return {
        transform: `translateX(${data.listCopyTranslate}px)`,
      };
    });

    // 左按钮
    const leftButtonClasses = computed(() => {
      return [
        `${prefixCls}-arrow left`,
        `${prefixCls}-arrow--${props.arrow}`,
        {
          [`${prefixCls}-arrow--slot`]: slots.leftArrow,
        },
      ];
    });

    // 右按钮
    const rightButtonClasses = computed(() => {
      return [
        `${prefixCls}-arrow right`,
        `${prefixCls}-arrow--${props.arrow}`,
        {
          [`${prefixCls}-arrow--slot`]: slots.leftArrow,
        },
      ];
    });

    // 总宽度
    const overallWidth = computed(() => {
      // 总宽度 = 已经滚动成功次数 > 0 ? 列表宽度 + 父级宽度 : 列表宽度
      let allWidth = 0;

      // 向左
      if (data.span < 0) {
        allWidth = data.listWidth;
      }

      // 向右
      if (data.span > 0) {
        allWidth = data.contentWidth;
      }

      return allWidth;
    });

    // methods

    // 初始化数据
    const initData = () => {
      // 可滚动滚动的宽度
      const scrollWidth = scroll.value.scrollWidth;
      // 滚动层宽度
      const offsetWidth = scroll.value.offsetWidth;

      // 内容宽度
      data.contentWidth = content.value.offsetWidth;

      // 列表宽度
      data.listWidth = list.value.offsetWidth;

      // 溢出宽度
      data.overflowWidth = data.listWidth - data.contentWidth;

      // 初始化列表动画
      data.listTranslate = 0;

      // 超过长度显示复制的内容
      if (scrollWidth - offsetWidth > 0) {
        data.showCopyTrack = true;
      }

      // 向左
      if (props.direction === 'left') {
        data.span = -1;

        data.listCopyTranslate = data.contentWidth;
      }

      // 向右
      if (props.direction === 'right') {
        data.span = 1;

        data.listCopyTranslate = -data.listWidth;
      }

      // 自动滚动
      startTime();
    };

    // 设置列表动画
    const setListTranslate = () => {
      // 列表动画开始
      if (data.listTranslateStart) {
        // 列表动画 < 总宽度
        data.listTranslate += data.span;

        // 向左
        if (data.span < 0) {
          // 列表最后一个已展示 -> 重制列表动画位置
          if (data.listTranslate === -data.overflowWidth) {
            // 复制列表动画开始
            data.listCopyTranslateStart = true;

            // 重制列表动画位置
            data.listCopyTranslate = data.contentWidth;
          }

          // 最后一个已隐藏 -> 重制列表动画位置
          if (data.listTranslate === -overallWidth.value) {
            // 列表动画结束
            data.listTranslateStart = false;

            // 重制列表动画位置
            data.listTranslate = data.contentWidth;

            // 记录滚动次数
            data.scrollDoneQuantity += 1;
          }
        }

        // 向右
        if (data.span > 0) {
          // 列表开始滚动 === 0 -> 复制列表紧跟 -> 重制复制列表动画位置
          if (data.listTranslate === 0) {
            // 重制复制列表动画位置
            data.listCopyTranslate = -data.listWidth;
          }

          // 复制列表开始滚动
          if (data.listTranslate > 0) {
            data.listCopyTranslateStart = true;
          }

          // 第一个已隐藏 -> 重制列表动画位置
          if (data.listTranslate === overallWidth.value) {
            // 列表动画结束
            data.listTranslateStart = false;

            // 重制列表动画位置
            data.listTranslate = -data.listWidth;

            // 记录滚动次数
            data.scrollDoneQuantity += 1;
          }
        }
      }

      // 复制列表动画开始
      if (data.listCopyTranslateStart) {
        // 复制列表动画 < 总宽度
        data.listCopyTranslate += data.span;

        // 向左
        if (data.span < 0) {
          // 列表最后一个已展示 -> 重制列表动画位置
          if (
            data.listCopyTranslate < 0 &&
            data.listCopyTranslate === -data.overflowWidth
          ) {
            // 列表动画开始
            data.listTranslateStart = true;

            // 重制列表动画位置
            data.listTranslate = data.contentWidth;
          }

          // 最后一个已隐藏 -> 重制复制列表动画位置
          if (data.listCopyTranslate === -overallWidth.value) {
            // 列表动画结束
            data.listCopyTranslateStart = false;

            // 重制复制列表动画位置
            data.listCopyTranslate = data.contentWidth;

            // 记录滚动次数
            data.scrollDoneQuantity += 1;
          }
        }

        // 向右
        if (data.span > 0) {
          // 第一个已显示 -> 重制列表动画位置
          if (data.listCopyTranslate === 0) {
            // 重制列表动画位置
            data.listTranslate = -data.listWidth;

            // 重制列表动画开始
            data.listTranslateStart = true;
          }

          // 第一个已隐藏 -> 重制复制列表动画位置
          if (data.listCopyTranslate === data.contentWidth) {
            // 列表动画开始
            data.listCopyTranslateStart = false;

            // 重制复制列表动画位置
            data.listCopyTranslate = -data.listWidth;

            // 记录滚动次数
            data.scrollDoneQuantity += 1;
          }
        }
      }
    };

    // 自动滚动
    const startTime = () => {
      // 没有显示复制的内容
      if (!data.showCopyTrack) {
        return;
      }

      // 达到滚动次数
      if (data.scrollDoneQuantity >= props.scrollQuantity) {
        clearTimer();

        return;
      }

      // 自动切换的时间间隔，单位为毫秒 < 0 ｜ 没有开启自动切换 | 已经存在倒计时
      if (props.interval <= 0 || !props.autoplay || data.timer) {
        return;
      }

      // 可以滚动
      nextTick(() => {
        data.timer = setInterval(() => {
          setListTranslate();
        }, props.interval);
      });
    };

    // 清除定时器
    const clearTimer = () => {
      if (data.timer) {
        clearInterval(data.timer);

        data.timer = null;
      }
    };

    // 清除箭头定时器
    const clearArrowInterval = () => {
      // 清除 setInterval
      if (data.arrowInterval) {
        clearInterval(data.arrowInterval);
        data.arrowInterval = null;
      }
    };

    // 箭头点击
    const handleArrowClick = (arrow: 'left' | 'right') => {
      // 设置方向

      // 向左
      if (arrow === 'left') {
        data.span = -1;

        // 没有进行过滑动 -> 初始化复制列表位置
        if (data.listTranslate === 0) {
          data.listCopyTranslate = data.contentWidth;
        }
      }

      // 向右
      if (arrow === 'right') {
        data.span = 1;

        // 没有进行过滑动 -> 初始化复制列表位置
        if (data.listTranslate === 0) {
          data.listCopyTranslate = -data.listWidth;
        }
      }

      // 是否等待动画完成后才可以下一步
      if (props.slidingEndNext) {
        if (data.slidingStart) {
          return;
        }

        // 滑动开始
        data.slidingStart = true;
      }

      // 清除原有计时器
      clearTimer();
      // 清除 setInterval
      clearArrowInterval();

      // 清除setTimeout
      if (data.arrowSetTimeout) {
        clearTimeout(data.arrowSetTimeout);
        data.arrowSetTimeout = null;
      }

      // 设置滚动
      data.arrowInterval = setInterval(() => {
        setListTranslate();
      }, props.slidingSpeed);

      // n秒后停止滚动
      data.arrowSetTimeout = setTimeout(
        () => {
          // 重置滑动开始
          data.slidingStart = false;

          // 清除 setInterval
          clearArrowInterval();

          // 没有鼠标悬浮时暂停自动切换
          if (!props.pauseOnHover) {
            // 重新开始自动滚动
            startTime();
          }
        },
        // 几秒后停止 滑动速率 * 每一次滚动偏移大小
        props.slidingSpeed * props.offset
      );
    };

    // 鼠标进入
    const handleMouseenter = () => {
      // 鼠标悬浮时暂停自动切换
      if (props.pauseOnHover) {
        clearTimer();
      }
    };

    // 鼠标移开
    const handleMouseleave = () => {
      startTime();
    };

    // watch

    // 监听滚动次数
    watch(
      () => data.scrollDoneQuantity,
      (value) => {
        // 达到滚动次数
        if (props.scrollQuantity && value >= props.scrollQuantity) {
          clearTimer();

          // 滚动完成
          emit('on-scroll-end', data.scrollDoneQuantity);
        }
      }
    );

    // 监听数据变化
    watch(
      () => props.dataList || slots.default(),
      () => {
        // 清除定时器
        clearTimer();

        nextTick(() => {
          // 初始化数据
          initData();
        });
      },
      {
        // 深度监听
        deep: true,
      }
    );

    // 监听是否自动滚动
    watch(
      () => props.autoplay,
      () => {
        // 清除定时器
        clearTimer();

        nextTick(() => {
          // 初始化数据
          initData();
        });
      }
    );

    // onMounted
    onMounted(() => {
      // 初始化数据
      initData();
    });

    // onUnmounted
    onUnmounted(() => {
      // 清除定时器
      clearTimer();
    });

    return {
      prefixCls,

      // dom
      scroll,
      content,
      list,

      // data
      data,

      // computed
      listStyles,
      listCopyStyles,
      leftButtonClasses,
      rightButtonClasses,

      // methods
      startTime,
      clearTimer,
      handleArrowClick,
      handleMouseenter,
      handleMouseleave,
    };
  },
  components: {
    IvueButton,
    IvueIcon,
  },
});
</script>
