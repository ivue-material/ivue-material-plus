<template>
  <!-- 状态点 -->
  <span :class="prefixCls" v-if="dot">
    <slot></slot>
    <sup :style="styles" :class="dotClasses" v-show="showBadge"></sup>
  </span>
  <!-- 状态点的颜色 -->
  <span v-else-if="status" :class="statusWrapperClasses">
    <span :class="statusClasses" :style="statusStyles"></span>
    <!-- text -->
    <span :class="`${prefixCls}-status--text`">
      <slot name="text">{{ text }}</slot>
    </span>
  </span>
  <!-- 普通显示 -->
  <span :class="prefixCls" v-else>
    <slot></slot>
    <transition :name="`${prefixCls}-fade`">
      <sup
        :style="slotsStyles"
        :class="countSlotsClasses"
        v-if="$slots.count"
        v-show="showBadge"
      >
        <slot name="count"></slot>
      </sup>
      <sup
        :style="styles"
        :class="countClasses"
        v-else-if="hasCount"
        v-show="showBadge"
      >
        <sup>
          <slot name="text">{{ finalCount }}</slot>
        </sup>
      </sup>
    </transition>
  </span>
</template>

<script lang="ts">
import hexToRgba from 'hex-to-rgba';
import { oneOf } from '../../utils/assist';

import {
  defineComponent,
  computed,
  getCurrentInstance,
  ComponentInternalInstance,
} from 'vue';

// type
import type { Props } from './types/badge';

const prefixCls = 'ivue-badge';

function isCssColor(color: string) {
  return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
}

const initColorList = [
  'blue',
  'green',
  'red',
  'yellow',
  'pink',
  'orange',
  'gold',
  'lime',
  'cyan',
  'purple',
  'success',
  'processing',
  'default',
  'error',
  'warning',
];

export default defineComponent({
  name: prefixCls,
  props: {
    /**
     * 显示的数字
     *
     * @type {Number}
     */
    count: {
      type: Number,
    },
    /**
     * 自定义的class名称，dot 模式下无效
     *
     * @type {String}
     */
    className: {
      type: String,
    },
    /**
     * 封顶的数字值
     *
     * @type {Number, String}
     */
    overflowCount: {
      type: [Number, String],
      default: 99,
    },
    /**
     * 当数值为0时是否显示
     *
     * @type {Boolean}
     */
    showZero: {
      type: Boolean,
      default: false,
    },
    /**
     * 自定义内容
     *
     * @type {String}
     */
    text: {
      type: String,
      default: '',
    },
    /**
     * 颜色
     *
     * @type {String}
     */
    color: {
      type: String,
      default: '#FF617F',
    },
    /**
     * 数字偏移位置
     *
     * @type {Array}
     */
    offset: {
      type: Array,
    },
    /**
     * 显示成小红点
     *
     * @type {Boolean}
     */
    dot: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示徽标
     *
     * @type {Boolean}
     */
    show: {
      type: Boolean,
      default: true,
    },
    /**
     * 设置 Badge 为状态点
     *
     * @type {String}
     */
    status: {
      type: String,
    },
  },
  setup(props: Props) {
    // 支持访问内部组件实例
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    // computed

    // 原始class
    const dotClasses = computed(() => {
      let _color = {};

      // 自定义颜色
      if (!isCssColor(props.color)) {
        _color = { [props.color]: true };
      }

      return [`${prefixCls}-dot`, _color];
    });

    // 数值样式
    const countClasses = computed(() => {
      const { color, className } = props;

      let _color = {
        [`${className}`]: !!className,
        [`${prefixCls}-count--alone`]: alone.value,
      };

      // 自定义颜色
      if (!isCssColor(color)) {
        _color = {
          ..._color,
          [color]: true,
        };
      }

      return [`${prefixCls}-count`, _color];
    });

    // 数值slot样式
    const countSlotsClasses = computed(() => {
      const { color, className } = props;

      let _color = {
        [`${className}`]: !!className,
      };

      // 自定义颜色
      if (!isCssColor(color)) {
        _color = {
          ..._color,
          [color]: true,
        };
      }

      return [`${prefixCls}-count`, `${prefixCls}-count--custom`, _color];
    });

    // 状态点的颜色
    const statusWrapperClasses = computed(() => {
      return [prefixCls, `${prefixCls}-status`];
    });

    // 状态点的颜色
    const statusClasses = computed(() => {
      const { status, color } = props;

      let _color = {
        [`${prefixCls}-status--${color}`]:
          !!color && oneOf(color, initColorList),
      };

      // 自定义颜色
      if (!isCssColor(status)) {
        _color = {
          ..._color,
          [`${prefixCls}-status--${status}`]: !!status,
        };
      }

      return [`${prefixCls}-status--dot`, _color];
    });

    // 状态点的颜色
    const statusStyles = computed(() => {
      const { status } = props;

      const style = {};

      if (isCssColor(status)) {
        style['background-color'] = status;
      }

      return style;
    });

    // 微标位置
    const styles = computed(() => {
      const style = {};

      if (props.offset && props.offset.length === 2) {
        style['margin-top'] = `${props.offset[0]}px`;
        style['margin-right'] = `${props.offset[1]}px`;
      }

      // 自定义颜色
      if (isCssColor(props.color)) {
        style['background-color'] = props.color;
        style['box-shadow'] = `0 0 2px 1px ${hexToRgba(props.color, '0.5')}`;
      }

      return style;
    });

    // 微标位置
    const slotsStyles = computed(() => {
      const style = {};

      if (props.offset && props.offset.length === 2) {
        style['margin-top'] = `${props.offset[0]}px`;
        style['margin-right'] = `${props.offset[1]}px`;
      }

      return style;
    });

    // 判断是否显示封顶数字值
    const finalCount = computed(() => {
      const { count, overflowCount, text } = props;

      // 判断是否有文字
      if (text !== '') {
        return text;
      }

      // 显示的数字 >= 封顶的数字值 ? 封顶的数字值+ : 显示的数字
      return parseInt(`${count}`) >= parseInt(`${overflowCount}`)
        ? `${overflowCount}+`
        : count;
    });

    // 是否显示数字
    const showBadge = computed(() => {
      const { count, dot, showZero, text, show } = props;

      let status = false;

      if (!show) {
        return show;
      }

      // 是否有数字
      if (count) {
        // 是否等于0
        status = !(parseInt(`${count}`) === 0);
      }

      // 是否显示成小红点
      if (dot) {
        status = true;

        if (count !== null) {
          // 是否等于0
          if (parseInt(`${count}`) === 0) {
            status = false;
          }
        }
      }

      // 是否有文本
      if (text !== '') {
        status = true;
      }

      // 0不显示 ||  当数值为0是是否显示
      return status || showZero;
    });

    // 是否有数值
    const hasCount = computed(() => {
      const { count, text, showZero } = props;

      if (count || text !== '') {
        return true;
      }

      if (showZero && parseInt(`${count}`) === 0) {
        return true;
      } else {
        return false;
      }
    });

    // 是否有数值
    const alone = computed(() => {
      return proxy.$slots.default === undefined;
    });

    return {
      prefixCls,

      // computed
      dotClasses,
      countClasses,
      countSlotsClasses,
      statusWrapperClasses,
      statusClasses,
      slotsStyles,
      statusStyles,
      styles,
      finalCount,
      showBadge,
      hasCount,
      alone,
    };
  },
});
</script>

<style lang="scss" scoped></style>
