import type { InjectionKey } from 'vue';
import { SubmenuList } from './menu';

export type SubmenuContext = {
  default?: null,
  activeName?: (currentActiveName: number | string | boolean) => void
  handleMenuItemSelect?: (name: string | number) => void
}

export const SubmenuContextKey: InjectionKey<SubmenuContext> =
  Symbol('ivue-menu-submenu');


export interface Props {
  name: string | number;
  disabled: boolean;
}

export interface Data {
  opened: boolean;
  dropWidth: number;
  timeout: ReturnType<typeof setTimeout> | null;
  childSubmenuList: SubmenuList[];
  active: boolean | number | string;
}
