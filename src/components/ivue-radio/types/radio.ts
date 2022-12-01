export interface Props {
  modelValue: string | number | boolean;
  trueValue: string | number | boolean;
  falseValue: string | number | boolean;
  label?: string | number;
  disabled?: boolean;
  color: string;
  name?: string;
  border: boolean;
}

export interface Data {
  focusInner: boolean;
  groupName: string;
}
