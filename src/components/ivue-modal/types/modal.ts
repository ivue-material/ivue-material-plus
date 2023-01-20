import { ComponentInternalInstance, ComponentPublicInstance } from 'vue';

interface _ComponentPublicInstance extends ComponentPublicInstance {
  removeScrollEffect: () => void;
  addScrollEffect: () => void;
  modalList: Record<string, any>[];
  $root: _ComponentPublicInstance | null;
}

export interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}

export interface Props {
  modelValue: boolean;
  transfer: boolean;
  transitionNames: any[];
  zIndex: number;
  mask: boolean;
  maskClosable: boolean;
  beforeClose?: any;
  modalWrapperClasses: string;
  scrollable: boolean;
  width: number | string;
  styles?: any;
  title?: string;
  closeIcon: string;
  closable: boolean;
  cancelText: string;
  confirmText: string;
  loading: boolean;
  loadingType: string;
  top: number;
  resetDragPosition: boolean;
  center: boolean;
  fullscreen: boolean;
  footerHide: boolean;
  draggable: boolean;
  sticky: boolean;
  stickyDistance: number;
  render?: any;
  resetBody?: boolean;
  showCancel?: boolean;
  content?: string;
  icon?: string;
  onCancel?: any;
  onConfirm?: any;
  onRemove?: any;
  lockScroll: boolean;
}

// 拖动初始数据
type DragData = {
  x?: number;
  y?: number;
  dragX?: number;
  dragY?: number;
  dragging?: boolean;
  rect?: boolean;
};

export interface Data {
  visible: boolean;
  modalIndex: number;
  wrapperShow: boolean;
  isMouseTriggerIn: boolean;
  timer: ReturnType<typeof setTimeout> | null;
  lastVisible: boolean;
  dragData: DragData;
  spinLoading: boolean;
  buttonLoading: boolean;
  resetRenderBody: boolean;
}
