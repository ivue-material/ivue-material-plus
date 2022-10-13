import type { InjectionKey } from 'vue';

export type SubmenuContext = {
  default?: null,
  activeName?: (currentActiveName: number | string | boolean) => void
  handleMenuItemSelect?: (name: string | number) => void
}

export const SubmenuContextKey: InjectionKey<SubmenuContext> =
  Symbol('ivue-menu-submenu');
