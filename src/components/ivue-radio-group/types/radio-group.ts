import type { InjectionKey, Ref } from 'vue';

export type RadioContext = {
  default?: null | string
  name?: string
  change?: (value: string | number) => void
  currentValue?: Ref<string | number>
}

export const RadioContextKey: InjectionKey<RadioContext> =
  Symbol('ivue-radio-group');

export type Size = 'large' | 'small' | 'default';

export interface Props {
  modelValue: string | number;
  name: string;
  vertical: boolean;
  type?: string;
  buttonStyle: string;
  size: string;
}
