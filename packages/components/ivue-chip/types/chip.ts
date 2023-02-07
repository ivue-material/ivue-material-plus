export interface Props {
  modelValue: boolean;
  textColor?: string;
  color?: string | any[];
  disabled?: boolean;
  outline?: boolean;
  square?: boolean;
  close?: boolean;
  closeIcon: string;
  depressed?: boolean;
}

export type ColorStyle = {
  color?: string;
};

export type BgStyle = {
  background?: string;
  backgroundColor?: string;
};

export type Styles = {
  color?: string;
  background?: string;
  backgroundColor?: string;
};
