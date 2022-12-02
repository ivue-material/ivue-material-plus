export interface Props {
  emboss: boolean;
  falseColor?: string | any[];
  disabled: boolean;
  rippleDisabled: boolean;
  loading: boolean;
  embossLoadingColor: string;
  trueValue: string | number | boolean;
  falseValue: string | number | boolean;
  modelValue: string | number | boolean;
  size: string;
  beforeChange: any;
  color: string | any[];
  textColor: string;
}

export type Size = 'large' | 'small' | 'default';
