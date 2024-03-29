<template>
  <div :class="prefixCls" ref="scrollbar">
    <div
      :class="wrapperClasses"
      :style="wrapperStyles"
      @scroll="handleScroll"
      ref="scrollbarWrapper"
    >
      <component
        :is="tag"
        :class="contentClasses"
        :style="contentStyle"
        ref="resize"
      >
        <slot></slot>
      </component>
    </div>
    <!-- 是否使用原生滚动条样式 -->
    <template v-if="!native">
      <bar
        :barHeight="data.barHeight"
        :barWidth="data.barWidth"
        :always="always"
        :ratioX="data.ratioX"
        :ratioY="data.ratioY"
        ref="bar"
      ></bar>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick,
  onUpdated,
  provide,
  watch,
} from 'vue';
import { useEventListener, useResizeObserver, isNumber } from '@vueuse/core';

import { addUnit, isValueNumber, isObject } from '../../utils/helpers';
import Bar from './bar.vue';

// ts
import type { CSSProperties } from 'vue';
import {
  BarInstance,
  Props,
  Data,
  ScrollbarContextKey,
} from './types/scrollbar';

// top 2 + bottom 2
const GAP = 4;

const prefixCls = 'ivue-scrollbar';

export default defineComponent({
  name: prefixCls,
  emits: ['on-scroll'],
  props: {
    /**
     * 包裹容器的自定义类名
     *
     * @type {String}
     */
    wrapperClass: {
      type: String,
      default: '',
    },
    /**
     * 包裹容器的自定义样式
     *
     * @type {String | Object}
     */
    wrapperStyle: {
      type: [String, Object],
      default: '',
    },
    /**
     * 视图的自定义类名
     *
     * @type {String}
     */
    contentClass: {
      type: String,
      default: '',
    },
    /**
     * 视图的自定义样式
     *
     * @type {String | Object}
     */
    contentStyle: {
      type: [String, Object],
      default: '',
    },
    /**
     * 是否使用原生滚动条样式
     *
     * @type {Boolean}
     */
    native: {
      type: Boolean,
      default: false,
    },
    /**
     * 滚动条高度
     *
     * @type {String | Number}
     */
    height: {
      type: [String, Number],
      default: '',
    },
    /**
     * 滚动条最大高度
     *
     * @type {String | Number}
     */
    maxHeight: {
      type: [String, Number],
      default: '',
    },
    /**
     * 视图的元素标签
     *
     * @type {String}
     */
    tag: {
      type: String,
      default: 'div',
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
     * 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能
     *
     * @type {Boolean}
     */
    noresize: {
      type: Boolean,
      default: false,
    },
    /**
     * 自定义滚动条最小尺寸(开启 native 该属性不生效)
     *
     * @type {Number}
     */
    minBarSize: {
      type: Number,
      default: 20,
    },
  },
  setup(props: Props, { emit }) {
    // dom
    const scrollbarWrapper = ref<HTMLDivElement>();
    const scrollbar = ref<HTMLDivElement>();
    const resize = ref<HTMLDivElement>();

    const bar = ref<BarInstance>();

    // data
    const data = reactive<Data>({
      /**
       * 滚动条高度
       *
       * @type {String}
       */
      barHeight: '0',
      /**
       * 滚动条宽度
       *
       * @type {String}
       */
      barWidth: '0',
      /**
       * x轴滚动比率
       *
       * @type {Number}
       */
      ratioX: 1,
      /**
       * y轴滚动比率
       *
       * @type {Number}
       */
      ratioY: 1,
    });

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        props.wrapperClass,
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-hidden-default`]: !props.native,
        },
      ];
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      const style: CSSProperties = {};

      // 滚动条高度
      if (props.height) {
        style.height = addUnit(props.height);
      }

      // 滚动条最大高度
      if (props.maxHeight) {
        style.maxHeight = addUnit(props.maxHeight);
      }

      return [props.wrapperStyle, style];
    });

    // 内容样式
    const contentClasses = computed(() => {
      return [props.contentClass, `${prefixCls}-content`];
    });

    // methods

    // 滚动
    const handleScroll = () => {
      if (scrollbarWrapper.value) {
        bar.value?.handleScroll(scrollbarWrapper.value);

        emit('on-scroll', {
          scrollTop: scrollbarWrapper.value.scrollTop,
          scrollLeft: scrollbarWrapper.value.scrollLeft,
        });
      }
    };

    // 更新状态
    const update = () => {
      if (!scrollbarWrapper.value) {
        return;
      }

      // 表格高度
      const offsetHeight = scrollbarWrapper.value.offsetHeight - GAP;
      // 可滚动高度
      const originalHeight =
        offsetHeight ** 2 / scrollbarWrapper.value.scrollHeight;
      // 滚动条高度
      const height = Math.max(originalHeight, props.minBarSize);
      // 滚动条高度
      data.barHeight = height + GAP < offsetHeight ? `${height}px` : '';

      // 表格宽度
      const offsetWidth = scrollbarWrapper.value.offsetWidth - GAP;
      // 滚动条宽度
      const originalWidth =
        offsetWidth ** 2 / scrollbarWrapper.value.scrollWidth;

      // 表格宽度
      const width = Math.max(originalWidth, props.minBarSize);
      // 滚动条宽度
      data.barWidth = width + GAP < offsetWidth ? `${width}px` : '';

      // x轴滚动比率
      data.ratioX =
        originalWidth /
        (offsetWidth - originalWidth) /
        (width / (offsetWidth - width));

      // y轴滚动比率
      data.ratioY =
        originalHeight /
        (offsetHeight - originalHeight) /
        (height / (offsetHeight - height));
    };

    // 设置滚动高度
    const setScrollTop = (value: number) => {
      if (!isValueNumber(value)) {
        return;
      }

      scrollbarWrapper.value.scrollTop = value;
    };

    // 设置滚动左右
    const setScrollLeft = (value: number) => {
      if (!isValueNumber(value)) {
        return;
      }

      scrollbarWrapper.value.scrollLeft = value;
    };

    // 滚动到一组特定坐标
    const scrollTo = (arg1: unknown, arg2?: number): void => {
      // 对象
      if (isObject(arg1)) {
        scrollbarWrapper.value.scrollTo(arg1);
      }
      // 数字
      else if (isNumber(arg1) && isNumber(arg2)) {
        scrollbarWrapper.value.scrollTo(arg1, arg2);
      }
    };

    // watch

    // 滚动条高度
    watch(
      () => props.height,
      () => {
        if (!props.native) {
          nextTick(() => {
            update();

            if (scrollbarWrapper.value) {
              bar.value?.handleScroll(scrollbarWrapper.value);
            }
          });
        }
      }
    );

    // 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能
    watch(
      () => props.noresize,
      (value) => {
        // 不响应
        if (!value) {
          // 元素内容或边框尺寸的变化
          useResizeObserver(resize.value, update);

          // window resize
          useEventListener('resize', update);
        }
      },
      {
        immediate: true,
      }
    );

    // onMounted
    onMounted(() => {
      if (!props.native) {
        nextTick(() => {
          update();
        });
      }
    });

    // 数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用
    onUpdated(() => {
      update();
    });

    // provide
    provide(
      ScrollbarContextKey,
      reactive({
        scrollbar: scrollbar,
        scrollbarWrapper: scrollbarWrapper,
      })
    );

    return {
      prefixCls,
      // dom
      scrollbarWrapper,
      scrollbar,
      bar,
      resize,

      // data
      data,
      // computed
      wrapperClasses,
      wrapperStyles,
      contentClasses,

      // methods
      handleScroll,
      setScrollTop,
      setScrollLeft,
      update,
      scrollTo,
    };
  },
  components: {
    Bar,
  },
});
</script>
