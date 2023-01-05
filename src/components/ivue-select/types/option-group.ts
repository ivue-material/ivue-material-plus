import { InjectionKey } from 'vue';

export interface Props {
  label?: string;
  disabled?: boolean;
}

export type SelectGroupContext = Props

export const SelectGroupContextKey: InjectionKey<SelectGroupContext> =
  Symbol('ivue-select-group');
