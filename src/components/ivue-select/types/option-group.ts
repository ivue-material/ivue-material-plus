import { InjectionKey } from 'vue';

export interface Props {
  label: string;
  disabled: boolean;
}

export type SelectGroupContext = {
  label?: string;
  disabled?: boolean;
}

export const SelectGroupContextKey: InjectionKey<SelectGroupContext> =
  Symbol('ivue-select-group');
