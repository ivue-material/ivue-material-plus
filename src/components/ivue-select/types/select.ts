import { InjectionKey } from 'vue';
import type { Emitter, EventType } from 'mitt';
import type DropDown from '../drop-down.vue';
import type SelectHead from '../select-head.vue';
import type Option from '../option.vue';

import type { OptionData } from './option';

export type DropDownInstance = InstanceType<typeof DropDown>;
export type OptionInstance = InstanceType<typeof Option>;
export type SelectHeadInstance = InstanceType<typeof SelectHead>;

export interface Props {
  modelValue?: any;
  defaultLabel?: any;
  selectedColor?: string | any[];
  hoverColor?: string | any[];
  multiple?: boolean;
  multipleFilterableClear?: boolean;
  multipleIcon?: string;
  disabled?: boolean;
  capture?: boolean;
  filterable?: boolean;
  name?: string;
  labelAndValue?: boolean;
  prefix?: string;
  maxTagCount?: number;
  placeholder?: string;
  allowCreate?: boolean;
  allowCreateIcon?: string;
  notFindText?: string;
  searchMethod?: any;
  arrowDownIcon?: string;
  clearable?: boolean;
  resetSelectIcon?: string;
  filterableHiddenGroup?: boolean;
  loading?: boolean;
  loadingText?: string;
  filterByLabel?: boolean;
  restoreInputOption?: boolean;
  transfer?: boolean;
  placement?: string;
  transferClassName?: string;
  autoComplete?: boolean;
  filterQueryProp?: string;
}


export interface Data {
  visibleMenu: boolean;
  isFocused: boolean;
  values: any[];
  options: OptionInstance[];
  focusIndex: number;
  filterQueryChange: boolean;
  filterQuery: string;
  hasMouseHover: boolean;
  lastSearchQuery: string;
  selectEmitter: Emitter<Record<EventType, unknown>>;
  hasExpectedValue: boolean;
  _filterQuery: string;
  disableMenu: boolean;
}

export type SelectContext = {
  props?: Props;
  reference?: HTMLDivElement;
  selectWrapper?: HTMLDivElement;
  dropVisible?: boolean;
  options?: OptionInstance[];
  values?: OptionData[];
  focusIndex?: number;
  handleOptionClick?: (option: OptionData, status?: string) => void;
  selectEmitter?: Emitter<Record<EventType, unknown>>;
  onOptionDestroy?: (index: number) => void;
}

export const SelectContextKey: InjectionKey<SelectContext> =
  Symbol('ivue-select');
