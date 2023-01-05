import type { InjectionKey } from 'vue';

export interface Props {
  labelPosition: string;
  requireAsteriskPosition: string;
  labelSuffix: string;
  labelWidth: string | number
}

export type FormContext = Props & {
  default?: null,
}

export const FormContextKey: InjectionKey<FormContext> =
  Symbol('ivue-form');
