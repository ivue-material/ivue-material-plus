import type { InjectionKey } from 'vue';
import type BottomNavItem from './index.vue';

export type BottomNavItemInstance = InstanceType<typeof BottomNavItem>

export type BottomNavContext = {
  updateValue: (value: number | string) => void;
  addItem: (item: BottomNavItemInstance) => void;
  removeItem: (uid: number | undefined) => void;
}

export const BottomNavContextKey: InjectionKey<BottomNavContext> =
  Symbol('ivue-bottom-nav');


export interface Props {
  name: number | string;
  color?: string | any[];
  textColor?: string;
}


export interface Data {
  isActive: boolean;
  uid: number;
}
