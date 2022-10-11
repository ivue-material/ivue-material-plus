import type { InjectionKey } from 'vue';

export type menuItemList = {
  uid: number
  activeName: (name: string | number) => void
}

export type MenuContext = {
  default?: null
  data?: {
    menuItemList: menuItemList[]
  },
  mode?: string
  menuItemActive?: (name: string | number) => void
  handleEmitSelectEvent?: (name: string | number) => void
}

export const MenuContextKey: InjectionKey<MenuContext> =
  Symbol('ivue-menu');
