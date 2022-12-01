import type { InjectionKey } from 'vue';

export type PopoverContext = {
  data?: {
    disableCloseUnderTransfer: boolean
    closeDelay: number,
  }
  default?: boolean
  visible?: boolean
  handleCancel?: () => void
}

export const PopoverContextKey: InjectionKey<PopoverContext> =
  Symbol('ivue-popover');


export interface Props {
  title?: string | number;
  content: string | number;
  trigger: string;
  transfer: boolean;
  transferClassName?: string;
  theme: string;
  width?: string | number;
  wordWrap: boolean;
  confirm: boolean;
  disabled: boolean;
  delay: number;
  placement: string;
  capture: boolean;
  cancelText: string;
  confirmText: string;
  modelValue: boolean
}

export interface Data {
  timeout: ReturnType<typeof setTimeout> | null;
  zIndex: number;
  disableCloseUnderTransfer: boolean;
  isInput: boolean;
  currentTargetFocus: boolean;
  closeDelay: number;
}
