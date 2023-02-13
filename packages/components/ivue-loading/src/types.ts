import type { VNode, UnwrapRef } from 'vue';
import type { MaybeRef } from '@vueuse/core';

// loading参数项
export type LoadingOptionsResolved = {
  parent: LoadingParentElement;
  background: MaybeRef<string>;
  iconClass?: string;
  iconText?: string;
  text: MaybeRef<string>;
  fullscreen: boolean;
  lock: boolean;
  customClass: MaybeRef<string>;
  visible: boolean;
  target: HTMLElement;
  loadingSpinner: () => VNode | VNode;
  close: () => void;
  beforeClose?: () => boolean;
};

// LoadingParentElement
export interface LoadingParentElement extends HTMLElement {
  LoadingAddClassList?: () => void;
}

// LoadingOptions
export type LoadingOptions = Partial<
  Omit<LoadingOptionsResolved, 'parent' | 'target'> & {
    target: HTMLElement | string;
    body: boolean;
  }
>;

// 绑定到到个元素
export type LoadingBinding = boolean | UnwrapRef<LoadingOptions>;
