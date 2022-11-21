
import type { InjectionKey } from 'vue';

export type StepsContext = {
  props: {
    textDirection: string;
    direction: string;
    alignCenter: boolean;
    space: number | string;
  }
  data?: {
    options: any;
  }
  onOptionDestroy: (index: number) => void;
}

export type Options = {
  data: {
    stepNumber: number;
    index: number;
    currentStatus: string;
    nextError: boolean;
  }
}

export type Props = {
  currentStep: number;
  direction: string;
  status: string;
  space: number | string;
  alignCenter: boolean;
  textDirection: string;
}

export type Data = {
  options: Options[];
  status: string;
  initData: boolean;
}

export const StepsContextKey: InjectionKey<StepsContext> =
  Symbol('ivue-steps');
