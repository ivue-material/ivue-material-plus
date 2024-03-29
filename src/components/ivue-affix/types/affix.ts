import { CSSProperties } from 'vue';
export interface Props {
  offsetTop: number;
  offsetBottom?: number;
  useCapture: boolean;
  target?: HTMLElement;
}

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
