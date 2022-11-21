import type { InjectionKey } from 'vue';

export type CheckboxContext = {
  default?: null | string
  name?: string
  handleChange?: (value: any[]) => void
  props?: {
    modelValue: any[]
  }
}

export const CheckboxContextKey: InjectionKey<CheckboxContext> =
  Symbol('ivue-checkbox-group');
