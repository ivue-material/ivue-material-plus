export interface Props {
  disabled: boolean;
  autofocus: boolean;
  readonly: boolean;
  editable: boolean;
  name?: string;
  placeholder: string;
  formatter: any;
  precision?: number;
  modelValue: number;
  activeChange: boolean;
  parser: any;
  max: number;
  min: number;
  controlsOutside: boolean;
  step: number;
}

export interface Data {
  focused: boolean;
  currentValue: number;
  upDisabled: boolean;
  downDisabled: boolean;
}
