import { InjectionKey } from 'vue';
import type IvueInput from '../ivue-input/index.vue';
import type MenuItem from './menu-item.vue';
import type DropDown from '../ivue-select/drop-down.vue';
import type IvueCascaderMenu from './menu.vue';

export type IvueInputInstance = InstanceType<typeof IvueInput>
export type MenuItemInstance = InstanceType<typeof MenuItem>
export type DropDownInstance = InstanceType<typeof DropDown>
export type IvueCascaderMenuInstance = InstanceType<typeof IvueCascaderMenu>

export type tmpItem = {
  label?: string
  value?: string
}

export type result = {
  label?: string
  value?: string
}

export type options = {
  label?: string
  value?: string
  loading?: boolean
  disabled?: boolean
  children?: []
}

export type CascaderContext = {
  handleResultChange?: (params: {
    lastValue: boolean
    changeOnSelect: boolean
    fromInit: boolean
  }) => void
  updateResult: (result: any[]) => void
  dropdown: HTMLElement | any
  props: {
    loadData: (item: options, callback: () => void) => void | null
  }
  data: {
    isLoadedChildren: boolean
  }
}

export const CascaderContextKey: InjectionKey<CascaderContext> =
  Symbol('ivue-cascader');
