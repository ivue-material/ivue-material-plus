import { InjectionKey } from 'vue';
import type IvueInput from '../ivue-input/index.vue';
import type MenuItem from './menu-item.vue';
import type DropDown from '../ivue-select/drop-down.vue';
import type IvueCascaderMenu from './menu.vue';

export type IvueInputInstance = InstanceType<typeof IvueInput>;
export type MenuItemInstance = InstanceType<typeof MenuItem>;
export type DropDownInstance = InstanceType<typeof DropDown>;
export type IvueCascaderMenuInstance = InstanceType<typeof IvueCascaderMenu>;

export type TmpItem = {
  label?: string;
  value?: string;
}

export type Result = {
  label?: string;
  value?: string;
}

export type Options = {
  label?: string;
  value?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: any[];
  __label?: string;
  __value?: string;
  item?: Options;
}

export type CascaderContext = {
  handleResultChange?: (params: ResultChange) => void;
  updateResult: (result: Result[]) => void;
  dropdown: HTMLElement | any;
  props: Props;
  data: {
    isLoadedChildren: boolean
  };
}

export const CascaderContextKey: InjectionKey<CascaderContext> =
  Symbol('ivue-cascader');


export interface Props {
  options: Options[];
  modelValue: any[];
  name: string;
  id: string;
  filterable: boolean;
  disabled: boolean;
  renderFormat: any;
  placeholder: string;
  arrowDownIcon: string;
  arrowDownIconClass: string;
  clearableIcon: string;
  clearableIconClass: string;
  transferClassName: string;
  transfer: boolean;
  changeOnSelect: boolean;
  trigger: string;
  loadData?: any;
  clearable: boolean;
  notFoundText: string;
}

export interface Data {
  visibleMenu: boolean;
  currentValue: string[];
  selected: TmpItem[];
  queryData: string;
  validDataStr: string;
  isLoadedChildren: boolean;
  tmpSelected: TmpItem[];
  updatingValue: boolean;
  isValueNull: boolean;
  filterableSelect: boolean;
}

export interface ResultChange {
  lastValue: boolean;
  changeOnSelect: boolean;
  fromInit: boolean;
}
