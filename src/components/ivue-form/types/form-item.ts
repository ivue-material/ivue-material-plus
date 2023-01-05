import type { InjectionKey } from 'vue';

export interface Props {
  label: string;
  for: string;
  labelWidth: string | number;
}


export type FormItemContext = Props & {
  inputIds: string[];
  removeInputId: (id: string) => void;
  addInputId: (id: string) => void;
}

export const FormItemContextKey: InjectionKey<FormItemContext> =
  Symbol('ivue-form-item');
