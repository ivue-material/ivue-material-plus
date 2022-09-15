import type { InjectionKey } from 'vue';
import type { BottomNavItemContext } from '../ivue-bottom-nav/bottom-nav';

export type BottomNavContext = {
  updateValue: (value: number | string) => void
  addItem: (item: BottomNavItemContext) => void
  removeItem: (uid: number | undefined) => void
}

export const BottomNavContextKey: InjectionKey<BottomNavContext> =
  Symbol('ivue-bottom-nav');
