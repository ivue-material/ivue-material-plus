<template>
  <!-- 左右滚动 -->
  <thumb
    :move="moveX"
    :ratio="ratioX"
    :barSize="barWidth"
    :always="always"
  ></thumb>
  <!-- 上下滚动 -->
  <thumb
    :move="moveY"
    :ratio="ratioY"
    :barSize="barHeight"
    :always="always"
    vertical
  ></thumb>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Thumb from './thumb.vue';

// type
import { Props } from './types/bar';

const prefixCls = 'ivue-scrollbar-bar';

// top 2 + bottom 2
const GAP = 4;

export default defineComponent({
  name: prefixCls,
  props: {
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
     * 滚动条高度
     *
     * @type {String}
     */
    barHeight: {
      type: String,
      default: '',
    },
    /**
     * 滚动条宽度
     *
     * @type {String}
     */
    barWidth: {
      type: String,
      default: '',
    },
    /**
     * x轴滚动比率
     *
     * @type {Number}
     */
    ratioX: {
      type: Number,
      default: 1,
    },
    /**
     * y轴滚动比率
     *
     * @type {Number}
     */
    ratioY: {
      type: Number,
      default: 1,
    },
  },
  setup(props: Props) {
    // x移动的位置
    const moveX = ref<number>(0);

    // y移动的位置
    const moveY = ref<number>(0);

    // methods

    // 滚动
    const handleScroll = (wrapper: HTMLDivElement) => {
      if (wrapper) {
        const offsetHeight = wrapper.offsetHeight - GAP;
        const offsetWidth = wrapper.offsetWidth - GAP;

        // x移动的位置
        moveX.value = ((wrapper.scrollLeft * 100) / offsetWidth) * props.ratioX;

        // y移动的位置
        moveY.value = ((wrapper.scrollTop * 100) / offsetHeight) * props.ratioY;
      }
    };

    return {
      // data
      moveX,
      moveY,

      // methods
      handleScroll,
    };
  },
  components: {
    Thumb,
  },
});
</script>
