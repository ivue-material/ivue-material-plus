import { OptionData } from './option';

export interface Props {
  disabled: boolean;
  multiple: boolean;
  multipleIcon: string;
  values: OptionData[];
  prefix?: string;
  filterable: boolean;
  maxTagCount: number;
  maxTagPlaceholder: any;
  placeholder: string;
  arrowDownIcon: string;
  clearable: boolean;
  isSearchMethod: boolean;
  resetSelectIcon: string;
  filterQueryProp: string;
  selectionDom: any;
  allowCreate: boolean;
  showCreateItem: boolean;
}

export interface Data {
  inputLength: number;
  filterQuery: string;
  isInputChange: boolean;
}
