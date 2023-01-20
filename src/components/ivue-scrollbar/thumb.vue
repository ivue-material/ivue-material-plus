<template>
  <transition :name="`${prefixCls}-fade`">
    <!-- v-show="always || visible" -->
    <div
      :class="wrapperClasses"
      @mousedown="handleThumbWrapperMousedown"
      ref="thumbWrapper"
      v-show="always || data.visible"
    >
      <div
        :class="`${prefixCls}-thumb`"
        :style="thumbStyles"
        @mousedown="handleThumbMousedown"
        ref="thumb"
      ></div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  reactive,
  inject,
  onBeforeUnmount,
  onMounted,
} from 'vue';
import { useEventListener } from '@vueuse/core';

import { on, off } from '../../utils/dom';

// type
import { ScrollbarContextKey, ScrollbarContext } from './types/scrollbar';
import type { Props, Data } from './types/thumb';

const prefixCls = 'ivue-scrollbar';

// 鼠标按下
let mousedown = false;
// 鼠标离开
let mouseLeave = false;

// 开始选择任意文本内容时触发
let originalOnSelectStart = document.onselectstart;

export default defineComponent({
  name: 'ivue-scrollbar-thumb',
  props: {
    /**
     * 偏移位置
     *
     * @type {Number}
     */
    move: {
      type: Number,
    },
    /**
     * 轴滚动比率
     *
     * @type {Number}
     */
    ratio: {
      type: Number,
      default: 1,
    },
    /**
     * 滚动条总是显示
     *
     * @type {Boolean}
     */
    always: {
      type: Boolean,
      default: false,
    },
    /**
     * 滚动条大小
     *
     * @type {String}
     */
    barSize: {
      type: String,
      default: '',
    },
    /**
     * 方向
     *
     * @type {Boolean}
     */
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    // IvueScrollbar
    const IvueScrollbar = inject(ScrollbarContextKey) as ScrollbarContext;

    // dom
    const thumbWrapper = ref<HTMLDivElement>();
    const thumb = ref<HTMLDivElement>();

    // data
    const data = reactive<Data>({
      /**
       * 状态
       *
       * @type {Object}
       */
      thumbState: {},
      /**
       * 显示
       *
       * @type {Boolean}
       */
      visible: false,
    });

    // wrapperClasses
    const wrapperClasses = computed(() => {
      return [
        `${prefixCls}-bar`,
        props.vertical ? 'is-vertical' : 'is-horizontal',
      ];
    });

    // 滑动块样式
    const thumbStyles = computed(() => {
      let obj = {};

      // 垂直
      if (props.vertical) {
        obj = {
          height: props.barSize,
          transform: `translateY(${props.move}%)`,
        };
      }
      // 横向
      else {
        obj = {
          width: props.barSize,
          transform: `translateX(${props.move}%)`,
        };
      }

      return obj;
    });

    // 偏移比率
    const offsetRatio = computed(() => {
      // thumbWrapper height = scrollbarWrapper height - 4

      // 垂直
      // offsetRatioY = 滚动条的原始高度 / 表格滚动高度 / ratioY / 滚动块高度
      if (props.vertical) {
        return (
          thumbWrapper.value.offsetHeight ** 2 /
          IvueScrollbar.scrollbarWrapper.scrollHeight /
          props.ratio /
          thumb.value.offsetHeight
        );
      }

      // 横向
      // offsetRatioX = 滚动条的原始宽度 / 表格滚动宽度 / ratioX / 滚动块宽度
      if (!props.vertical) {
        return (
          thumbWrapper.value.offsetWidth ** 2 /
          IvueScrollbar.scrollbarWrapper.scrollWidth /
          props.ratio /
          thumb.value.offsetWidth
        );
      }

      return null;
    });

    // methods

    // 滑动块拖动
    const handleThumbMousedown = (event: MouseEvent) => {
      event.stopPropagation();

      // 防止中键和右键的点击事件;
      if (event.ctrlKey || [1, 2].includes(event.button)) {
        return;
      }

      // 取消所有选择
      window.getSelection()?.removeAllRanges();

      // 阻止监听同一事件的其他事件监听器被调用
      event.stopImmediatePropagation();

      // 鼠标按下
      mousedown = true;

      // 鼠标移动
      on(document, 'mousemove', handleMousemove);

      // 鼠标按下
      on(document, 'mouseup', handleMouseup);

      // 开始选择任意文本内容时触发
      originalOnSelectStart = document.onselectstart;

      // 禁止选中
      document.onselectstart = () => false;

      // 当前目标
      const target = event.currentTarget as HTMLDivElement;

      if (!target) {
        return;
      }

      // 垂直
      if (props.vertical) {
        // 可偏移高度
        data.thumbState['Y'] =
          target.offsetHeight -
          (event.clientY - target.getBoundingClientRect().top);
      }

      // 横向
      if (!props.vertical) {
        // 可偏移宽度
        data.thumbState['X'] =
          target.offsetWidth -
          (event.clientX - target.getBoundingClientRect().left);
      }
    };

    // 鼠标移动
    const handleMousemove = (event: MouseEvent) => {
      // 是否有dom
      if (!thumbWrapper.value || !thumb.value) {
        return;
      }

      // 鼠标按下
      if (mousedown === false) {
        return;
      }

      // 点击时的偏移位置
      let clickOffset = 0;

      // 拖动时的偏移位置
      let moveOffset = 0;

      // 点击位置
      let clickPosition = 0;

      // 垂直
      if (props.vertical) {
        // 是否可以偏移
        clickOffset = data.thumbState['Y'];

        if (!clickOffset) {
          return;
        }

        // 拖动时的偏移位置
        moveOffset =
          (thumbWrapper.value.getBoundingClientRect().top - event.clientY) * -1;

        // 在滚动条点击的位置
        clickPosition = thumb.value.offsetHeight - clickOffset;

        // 点击位置的百分比
        const clickPositionPercentage =
          // 拖动时的偏移位置 - 点击时的偏移位置 * 100 * 偏移比率
          ((moveOffset - clickPosition) * 100 * offsetRatio.value) /
          thumbWrapper.value.offsetHeight;

        // 设置滚动高度
        IvueScrollbar.scrollbarWrapper.scrollTop =
          (clickPositionPercentage *
            IvueScrollbar.scrollbarWrapper.scrollHeight) /
          100;
      }

      // 横向
      if (!props.vertical) {
        // 是否可以偏移
        clickOffset = data.thumbState['X'];

        if (!clickOffset) {
          return;
        }

        // 拖动时的偏移位置
        moveOffset =
          (thumbWrapper.value.getBoundingClientRect().left - event.clientX) *
          -1;

        // 在滚动条点击的位置
        clickPosition = thumb.value.offsetWidth - clickOffset;

        // 点击位置的百分比
        const clickPositionPercentage =
          ((moveOffset - clickPosition) * 100 * offsetRatio.value) /
          thumbWrapper.value.offsetWidth;

        // 设置滚动宽度
        IvueScrollbar.scrollbarWrapper.scrollLeft =
          (clickPositionPercentage *
            IvueScrollbar.scrollbarWrapper.scrollWidth) /
          100;
      }
    };

    // 鼠标按下
    const handleMouseup = () => {
      mousedown = false;

      // 垂直
      if (props.vertical) {
        data.thumbState['Y'] = 0;
      }

      // 横向
      if (!props.vertical) {
        data.thumbState['X'] = 0;
      }

      // 鼠标移动
      off(document, 'mousemove', handleMousemove);

      // 鼠标按下
      off(document, 'mouseup', handleMouseup);

      // 恢复选择任意文本内容时触发
      handleRestoreSelectStart();

      // 鼠标离开
      if (mouseLeave) {
        data.visible = false;
      }
    };

    // 恢复选择
    const handleRestoreSelectStart = () => {
      if (document.onselectstart !== originalOnSelectStart) {
        document.onselectstart = originalOnSelectStart;
      }
    };

    // 滚动条点击
    const handleThumbWrapperMousedown = (event: MouseEvent) => {
      if (
        !thumb.value ||
        !thumbWrapper.value ||
        !IvueScrollbar.scrollbarWrapper
      ) {
        return;
      }

      // 视口到鼠标点击的位置
      let offset = 0;
      // 滚动块的一半
      let thumbHalf = 0;

      // 元素的大小及其相对于视口的位置。
      const boundingClientRect = (
        event.target as HTMLElement
      ).getBoundingClientRect();

      // 滚动块的位置
      let thumbPositionPercentage = 0;

      // 垂直
      if (props.vertical) {
        // 视口到鼠标点击的位置
        offset = Math.abs(boundingClientRect.top - event.clientY);

        thumbHalf = thumb.value.offsetHeight / 2;

        thumbPositionPercentage =
          ((offset - thumbHalf) * 100 * offsetRatio.value) /
          thumbWrapper.value.offsetHeight;

        IvueScrollbar.scrollbarWrapper.scrollTop =
          (thumbPositionPercentage *
            IvueScrollbar.scrollbarWrapper.scrollHeight) /
          100;
      }

      // 横向
      if (!props.vertical) {
        // 视口到鼠标点击的位置
        offset = Math.abs(boundingClientRect.left - event.clientX);

        thumbHalf = thumb.value.offsetWidth / 2;

        thumbPositionPercentage =
          ((offset - thumbHalf) * 100 * offsetRatio.value) /
          thumbWrapper.value.offsetWidth;

        IvueScrollbar.scrollbarWrapper.scrollLeft =
          (thumbPositionPercentage *
            IvueScrollbar.scrollbarWrapper.scrollWidth) /
          100;
      }
    };

    // 鼠标移动到表格
    const handleMousemoveTable = () => {
      mouseLeave = false;

      data.visible = !!props.barSize;
    };

    // 鼠标移出到表格
    const handleMouseleaveTable = () => {
      mouseLeave = true;

      data.visible = mousedown;
    };

    // onBeforeUnmount
    onBeforeUnmount(() => {
      handleRestoreSelectStart();

      // 鼠标移动
      off(document, 'mousemove', handleMousemove);

      // 鼠标按下
      off(document, 'mouseup', handleMouseup);
    });

    // onMounted
    onMounted(() => {
      // mousemove
      useEventListener(
        IvueScrollbar.scrollbar,
        'mousemove',
        handleMousemoveTable
      );

      // mouseleave
      useEventListener(
        IvueScrollbar.scrollbar,
        'mouseleave',
        handleMouseleaveTable
      );
    });

    return {
      prefixCls,
      // dom
      thumbWrapper,
      thumb,

      // data
      data,

      // computed
      wrapperClasses,
      thumbStyles,

      // methods
      handleThumbMousedown,
      handleThumbWrapperMousedown,
    };
  },
});
</script>
