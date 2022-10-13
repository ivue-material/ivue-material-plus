import type { InjectionKey } from 'vue';

export type SubmenuContext = {
  default?: null,
  handleUpdateActiveName?: (currentActiveName: number | string | boolean) => void
}

export const SubmenuContextKey: InjectionKey<SubmenuContext> =
  Symbol('ivue-menu-submenu');
