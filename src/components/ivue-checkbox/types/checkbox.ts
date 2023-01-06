
export interface Props {
  modelValue: string | number | boolean;
  disabled: boolean;
  name: string;
  trueValue: string | number | boolean;
  falseValue: string | number | boolean;
  color: string | string[];
  label: string | number | boolean;
  border: boolean;
  indeterminate: boolean;
  validateEvent: boolean;
}


export interface Data {
  focusInner: boolean;
  groupName: string;
  groupModel: (string | number)[];
}
