import type { InjectionKey } from 'vue';


export type SubmenuContext = {
  default?: null
}

export const SubmenuContextKey: InjectionKey<SubmenuContext> =
  Symbol('ivue-menu-submenu');
