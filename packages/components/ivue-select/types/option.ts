export interface Props {
  ripple: boolean;
  disabled: boolean;
  selected: boolean;
  isFocused: boolean;
  label?: string | number;
  value?: string | number;
  selectedColor?: string | any[];
  hoverColor?: string | any[];
  allowCreate: boolean;
  showCreateItem: boolean;
  filterQuery: string;
}

export interface Data {
  isFocused: boolean;
  disabled: boolean;
  hasMouseHover: boolean;
  visible: boolean;
}

export interface OptionData {
  value?: string | number;
  label?: string | number;
  disabled?: boolean;
}
