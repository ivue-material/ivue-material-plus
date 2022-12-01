
import type {
  ComponentInternalInstance,
  ComponentPublicInstance,
} from 'vue';


interface _ComponentPublicInstance extends ComponentPublicInstance {
  setBackgroundColor: (color: string | string[]) => any
}

export interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}

export interface Props {
  shape: string;
  src: string;
  icon: string;
  size: number | string;
  color?: string | string[];
}

export interface Data {
  isSlotShow: boolean;
  slotScale: number;
  slotWidth: number;
}
