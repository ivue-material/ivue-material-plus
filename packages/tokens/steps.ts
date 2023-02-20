import type { InjectionKey } from 'vue';

export type Options = {
  data: {
    stepNumber: number;
    index: number;
    currentStatus: string;
    nextError: boolean;
  };
  uid: number | string;
};

export type Data = {
  options: Options[];
  status: string;
  initData: boolean;
};

export type StepsContext = {
  props: {
    textDirection: string;
    direction: string;
    space: number | string;
  };
  data: Data;
  onOptionDestroy: (index: number) => void;
};

export const StepsContextKey: InjectionKey<StepsContext> = Symbol('ivue-steps');
