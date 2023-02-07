import { ComponentInternalInstance, ComponentPublicInstance } from 'vue';

interface _ComponentPublicInstance extends ComponentPublicInstance {
  updatePopper: () => void;
}

export interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}

export interface Props {
  transfer: boolean;
  disabled: boolean;
  always: boolean;
  delay: number;
  controlled: boolean;
  transferClassName?: string;
  content: string | number;
  maxWidth: string | number;
  beforeShowPopper?: any;
  manual: boolean;
  capture: boolean;
  theme: string;
  noArrow: boolean;
  placement: string;
}
