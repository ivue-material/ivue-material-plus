import type { InjectionKey } from 'vue';

export type CheckboxContext = {
  default?: null | string;
  name?: string;
  handleChange?: (value: (string | number)[]) => void;
  props?: Props;
};

export const CheckboxContextKey: InjectionKey<CheckboxContext> = Symbol(
  'ivue-checkbox-group'
);

export interface Props {
  modelValue: any[];
  validateEvent: boolean;
  id?: string;
}
