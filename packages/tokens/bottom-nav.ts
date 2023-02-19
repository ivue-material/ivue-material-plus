import type { InjectionKey } from 'vue';
import { BottomNavItemInstance } from '@ivue-material-plus/components/ivue-bottom-nav-item';

export type BottomNavContext = {
  updateValue: (value: number | string) => void;
  addItem: (item: BottomNavItemInstance) => void;
  removeItem: (uid: number) => void;
};

export const BottomNavContextKey: InjectionKey<BottomNavContext> =
  Symbol('ivue-bottom-nav');
