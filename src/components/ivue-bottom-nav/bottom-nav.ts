import {
  ComponentPublicInstance
} from 'vue';

export type BottomNavItemContext = ComponentPublicInstance | null;

export interface Props {
  modelValue: number | string;
  height: number | string;
  visible: boolean;
  position: string;
  shift: boolean;
  scale: boolean;
}
