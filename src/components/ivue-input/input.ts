export interface Props {
  modelValue: string;
  type: string;
  placeholder: string;
  spellcheck: boolean;
  disabled: boolean;
  autocomplete: string;
  readonly: boolean;
  name: string;
  maxlength: number;
  id: string;
  autofocus: boolean;
  number: boolean;
  prependBgColor: string;
  appendBgColor: string;
  prefix: string;
  suffix: string;
  size: string;
  clearable: boolean;
  clearIcon: string;
  showWordLimit: boolean;
  password: boolean;
  passwordIcon: {
    on?: string;
    off?: string;
  };
  search: boolean;
  enterButton: boolean | string;
  rows: number;
  autoHeight: {
    minRows?: string;
    maxRows?: string;
  };
  border: boolean;
  isValue: boolean;
}

export type TextareaStyles = {
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  overflowY?: any;
}
