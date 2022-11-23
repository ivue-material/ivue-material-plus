import type Select from '../ivue-select/index.vue';
import type Input from '../ivue-input/index.vue';

export type Select = InstanceType<typeof Select>
export type Input = InstanceType<typeof Input>

export type Option = {
  value: string | number;
  label: string | number;
}

export interface Props {
  modelValue: string | number;
  placeholder: string;
  disabled: boolean;
  clearable: boolean;
  placement: string;
  transferClassName: string;
  transfer: boolean;
  id: string;
  capture: boolean;
  name: string;
  list: any[];
  filterMethod?: any | boolean;
  remoteMethod?: any;
  loading: boolean;
  loadingText: string;
}

export interface Data {
  currentValue: string | number;
  disableEmitChange: boolean;
}
