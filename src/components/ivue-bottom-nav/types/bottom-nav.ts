import type { BottomNavItemInstance } from '../../ivue-bottom-nav-item/types/bottom-nav-item';

export interface Props {
  modelValue: number | string;
  height: number | string;
  visible: boolean;
  position: string;
  shift: boolean;
  scale: boolean;
  color?: string | any[];
  textColor?: string;
}

export interface Data {
  items: BottomNavItemInstance[];
}
