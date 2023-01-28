import type { InjectionKey, Ref } from 'vue';

// RadioContext
export type RadioContext = {
  default?: null | string;
  name?: string;
  change?: (value: string | number) => void;
  currentValue?: Ref<string | number>;
};

// RadioContextKey
export const RadioContextKey: InjectionKey<RadioContext> =
  Symbol('ivue-radio-group');

// Size
export type Size = 'large' | 'small' | 'default';

// Props
export interface Props {
  modelValue: string | number;
  name: string;
  vertical: boolean;
  type?: string;
  buttonStyle: string;
  size: string;
  validateEvent: boolean;
  id?: string;
}
