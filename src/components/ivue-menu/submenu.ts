import type { InjectionKey } from 'vue';
import type DropDown from './dropdown.vue';

export type SubmenuContext = {
  default?: null
}

export const SubmenuContextKey: InjectionKey<SubmenuContext> =
  Symbol('ivue-menu-submenu');

export type DropDownRef = InstanceType<typeof DropDown>
