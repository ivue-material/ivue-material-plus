import type Select from '../ivue-select/index.vue';
import Input from '../ivue-input/index.vue';

export type Select = InstanceType<typeof Select>
export type Input = InstanceType<typeof Input>


export type Props = {
  modelValue: string | number | any[];
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
  filterMethod: any,
  remoteMethod: any
};
