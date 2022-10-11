import type { InjectionKey } from 'vue';


export type RadioContext = {
  default?: null | string
  name?: string
  change?: (value: string | number) => void
  data?: {
    currentValue: string | number
  }
}

export const RadioContextKey: InjectionKey<RadioContext> =
  Symbol('ivue-radio-group');
