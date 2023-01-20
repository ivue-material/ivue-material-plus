<template>
  <div :class="prefixCls" ref="wrapper">
    <template v-if="data.computedReady">
      <!-- tooltip -->
      <ivue-tooltip
        :class="`${prefixCls}-tooltip--wrapper`"
        :content="text"
        :placement="placement"
        :theme="theme"
        :transfer="transfer"
        :maxWidth="maxWidth"
        v-if="tooltip"
      >
        <span :class="`${prefixCls}-tooltip`">
          <!-- text -->
          <span :class="`${prefixCls}-text`" ref="textRef">{{ text }}</span>
          <!-- oversize -->
          <span
            :class="`${prefixCls}-more`"
            v-show="data.oversize"
            ref="moreRef"
          >
            <slot name="more">...</slot>
          </span>
          <!-- suffix -->
          <slot name="suffix"></slot>
        </span>
      </ivue-tooltip>
      <!-- 普通显示 -->
      <template v-else>
        <!-- text -->
        <span :class="`${prefixCls}-text`" ref="textRef">{{ text }}</span>
        <!-- oversize -->
        <span :class="`${prefixCls}-more`" v-show="data.oversize" ref="moreRef">
          <slot name="more">...</slot>
        </span>
        <!-- suffix -->
        <slot name="suffix"></slot>
      </template>
    </template>
    <!-- 站位节点 -->
    <div :class="`${prefixCls}-hidden`" v-else>
      <!-- text -->
      <span :class="`${prefixCls}-text`" ref="textRef">{{ text }}</span>
      <!-- oversize -->
      <span :class="`${prefixCls}-more`" v-show="data.oversize" ref="moreRef">
        <slot name="more">...</slot>
      </span>
      <!-- suffix -->
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
} from 'vue';
import { useEventListener } from '@vueuse/core';

// utils
import { oneOf } from '../../utils/assist';
import { getStyle } from '../../utils/assist';

import IvueTooltip from '../ivue-tooltip';

// type
import type { Props, Data } from './types/ellipsis';

const prefixCls = 'ivue-ellipsis';

export default defineComponent({
  name: prefixCls,
  emits: ['on-hide', 'on-show'],
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
     * 按照指定长度截取
     *
     * @type {Number}
     */
    length: {
      type: Number,
    },
    /**
     * 限制的高度
     *
     * @type {Number}
     */
    height: {
      type: Number,
    },
    /**
     * 是否禁用省略
     *
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 限制行数，将换算为 height。如果设置了 height，则直接使用 height 计算
     *
     * @type {Number}
     */
    lines: {
      type: Number,
    },
    /**
     * 是否将全角字符的长度视为2来计算字符串长度，适用于 length
     *
     * @type {Boolean}
     */
    fullWidthRecognition: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否自动根据外层宽度动态改变 (设置 height 时生效)
     *
     * @type {Boolean}
     */
    autoResize: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否开启 tooltip
     *
     * @type {Boolean}
     */
    tooltip: {
      type: Boolean,
      default: false,
    },
    /**
     * 弹窗的展开方向
     *
     * @type {String}
     */
    placement: {
      type: String,
      validator(value: string) {
        return oneOf(value, [
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'left',
          'left-start',
          'left-end',
          'right',
          'right-start',
          'right-end',
        ]);
      },
      default: 'bottom',
    },
    /**
     * 主题，可选值为 dark 或 light
     *
     * @type {String}
     */
    theme: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['dark', 'light']);
      },
      default: 'dark',
    },
    /**
     * 是否将弹层放置于 body 内，在 Tabs、
     * 带有 fixed 的 Table 列内使用时，
     * 建议添加此属性，它将不受父级样式影响，
     * 从而达到更好的效果
     *
     * @type {Boolean}
     */
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;

        return !global.$IVUE || global.$IVUE.transfer === ''
          ? false
          : global.$IVUE.transfer;
      },
    },
    /**
     * 最大宽度，超出最大值后，文本将自动换行，并两端对齐
     *
     * @type {String, Number}
     */
    maxWidth: {
      type: [String, Number],
    },
  },
  setup(props: Props, { emit }) {
    // dom
    const wrapper = ref<HTMLDivElement>();
    const textRef = ref<HTMLSpanElement>();
    const moreRef = ref<HTMLSpanElement>();

    // data
    const data = reactive<Data>({
      /**
       * 先隐形计算，计算好后，再根据配置显示
       *
       * @type {Boolean}
       */
      computedReady: false,
      /**
       * 计算后显示的text
       *
       * @type {String}
       */
      computedText: '',
      /**
       * 超出长度
       *
       * @type {Boolean}
       */
      oversize: false,
    });

    // methods

    // 初始化
    const init = () => {
      // 禁用
      if (!props.disabled) {
        // 计算显示的text
        setShowText();
        // 超出显示
        limitShow();
      }
      // 禁用显示未省略
      else {
        data.computedReady = true;
      }
    };

    // 计算显示的text
    const setShowText = () => {
      // 初始化状态
      data.oversize = false;
      // 先隐形计算，计算好后，再根据配置显示
      data.computedReady = false;

      nextTick(() => {
        const $wrapper = wrapper.value;
        const $more = moreRef.value;

        // 限制的高度
        let height = props.height;
        // 文本
        let text = props.text;

        // 当 height 未定义，且 lines 定义时，计算真实高度，否则使用 限制的高度
        if (!props.height && props.lines) {
          // 行高
          const lineHeight = parseInt(getStyle($wrapper, 'lineHeight'), 10);

          // 行高 * 限制行数
          height = lineHeight * props.lines;
        }

        // 有textRef
        // 指定 length，则按具体字数剪裁
        if (props.length) {
          const textLength = props.fullWidthRecognition
            ? getStrFullLength(text)
            : text.length;

          // 超出指定长度截取
          if (textLength > props.length) {
            // 超出长度
            data.oversize = true;
            $more.style.display = 'inline-block';

            // 计算后显示的text
            text = props.fullWidthRecognition
              ? cutStrLength(text, props.length)
              : text.slice(0, props.length);
          }

          // 计算后显示的text
          data.computedText = text;
        }
        // 指定高度
        else {
          specifiedHeight(height);
        }
      });
    };

    // 指定高度
    const specifiedHeight = (height: number) => {
      const $wrapper = wrapper.value;
      const $more = moreRef.value;
      const $text = textRef.value;

      // 文本
      let text = props.text;

      // 最大执行次数
      let n = 1000;

      // offsetHeight > 设置的高度
      if ($wrapper.offsetHeight > height) {
        // 超出长度
        data.oversize = true;

        $more.style.display = 'inline-block';

        while ($wrapper.offsetHeight > height && n > 0) {
          if ($wrapper.offsetHeight > height * 3) {
            text = text.substring(0, Math.floor(text.length / 2));

            $text.innerText = text;
          } else {
            text = text.substring(0, text.length - 1);

            $text.innerText = text;
          }

          n--;
        }
      }

      // 没有开启自动根据外层宽度动态改变
      if (!props.autoResize) {
        // 计算后显示的text
        data.computedText = text;
      }
    };

    // 超出显示
    const limitShow = () => {
      data.computedReady = true;

      nextTick(() => {
        if (textRef.value) {
          // 文本省略的时候触发
          if (wrapper.value.offsetHeight > props.height) {
            emit('on-hide');
          }
          // 文本全部展示的时候触发
          else {
            emit('on-show');
          }
        }
      });
    };

    // 获取字符串全部长度
    const getStrFullLength = (str = '') => {
      return str.split('').reduce((pre, cur) => {
        // 字符在字符串中的下标->第一个
        const charCode = cur.charCodeAt(0);

        // 前 128 ASCII 字符编码
        if (charCode >= 0 && charCode <= 128) {
          return pre + 1;
        }

        return pre + 2;
      }, 0);
    };

    // 切割字符串
    const cutStrLength = (str = '', maxLength: number) => {
      let showLength = 0;

      return str.split('').reduce((pre, cur) => {
        // 字符在字符串中的下标->第一个
        const charCode = cur.charCodeAt(0);

        // 前 128 ASCII 字符编码
        if (charCode >= 0 && charCode <= 128) {
          showLength += 1;
        }
        // 不是前 128 ASCII 字符编码
        else {
          showLength += 2;
        }

        // 设置长度
        if (showLength <= maxLength) {
          return pre + cur;
        }

        return pre;
      }, '');
    };

    // 自适应高度
    const autoResizeHeight = () => {
      // 已经显示文本 && 有设置高度
      if (data.computedReady && props.height) {
        // 限制的高度
        const height = props.height;
        // 文本
        const text = props.text;

        // 重新设置文本
        textRef.value.innerText = text;

        // 指定高度
        specifiedHeight(height);
      }
    };

    // 设置文本节点文本
    const setTextInnerText = () => {
      // 计算后显示的text
      textRef.value.innerText = data.computedText;
    };

    // watch

    // 监听计算后显示的text
    watch(
      () => data.computedText,
      (value) => {
        if (value) {
          data.computedReady = true;

          // 设置文本节点文本
          setTextInnerText();
        }
      }
    );

    // 监听按照指定长度截取
    watch(
      () => props.length,
      () => {
        init();
      }
    );

    // 监听限制的高度
    watch(
      () => props.height,
      () => {
        init();
      }
    );

    // 监听是否禁用省略
    watch(
      () => props.disabled,
      () => {
        init();
      }
    );

    // 监听限制行数
    watch(
      () => props.lines,
      () => {
        init();
      }
    );

    // onMounted
    onMounted(() => {
      // 初始化
      init();

      // 是否自动根据外层宽度动态改变
      if (props.autoResize && props.height) {
        // window resize
        useEventListener('resize', autoResizeHeight);
      }
    });

    return {
      prefixCls,

      // dom
      wrapper,
      textRef,
      moreRef,

      // data
      data,
    };
  },
  components: {
    IvueTooltip,
  },
});
</script>
