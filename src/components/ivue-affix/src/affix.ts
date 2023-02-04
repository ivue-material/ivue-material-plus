import { ExtractPropTypes } from 'vue';
import { isBoolean } from '@vueuse/core';

import { buildProps } from '../../../utils/vue/props/index';

// type
import type Affix from './affix.vue';

// 固定状态
export enum AffixStatus {
  // 不能执行
  None,
  // 可以执行
  Start,
}

// 状态
export interface AffixState {
  // 固定节点style
  affixStyle?: AffixStyle;
  // 占位节点style
  placeholderStyle?: PlaceholderStyle;
  // 判断是否可以执行
  status: AffixStatus;
  // 是否固定
  fixed: boolean;
  // 上一个目标节点
  prevTarget: Window | HTMLElement | null;
}

// 绑定事件的节点
export declare type BindElement = HTMLElement | Window | null | undefined;

// 初始化固定样式
export type AffixStyle = {
  width?: string;
  height?: string;
  top?: string;
  bottom?: string;
};

// 初始化占位样式
export type PlaceholderStyle = {
  width?: string;
  height?: string;
};

// props
export const affixProps = buildProps({
  /**
   * 距离窗口顶部达到指定偏移量后触发
   *
   * @type {Number}
   */
  offsetTop: {
    type: Number,
    default: 0,
  },
  /**
   * 距离窗口底部达到指定偏移量后触发
   *
   * @type {Number}
   */
  offsetBottom: {
    type: Number,
  },
  /**
   * addEventListener 原生的 useCapture 选项
   *
   * @type {Boolean}
   */
  useCapture: {
    type: Boolean,
    default: false,
  },
  /**
   * 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数
   *
   * @type {HTMLElement}
   */
  target: {
    type: HTMLElement,
  },
});

// props 类型
export type AffixProps = ExtractPropTypes<typeof affixProps>;

export const affixEmits = {
  'on-change': (fixed: boolean) => isBoolean(fixed),
};
// emits事件类型
export type AffixEmits = typeof affixEmits;
// 组件实例
export type AffixInstance = InstanceType<typeof Affix>;
