import type { InjectionKey } from 'vue';
import type {
  SelectProps,
  OptionInstance,
  OptionData,
  OptionGroupProps,
} from '@ivue-material-plus/components/ivue-select';
import type { Emitter, EventType } from 'mitt';

export interface SelectContext {
  props: SelectProps;
  reference: HTMLDivElement;
  selectWrapper: HTMLDivElement;
  dropVisible: boolean;
  options: OptionInstance[];
  values: OptionData[];
  focusIndex: number;
  handleOptionClick: (option: OptionData, status?: string) => void;
  selectEmitter: Emitter<Record<EventType, unknown>>;
  onOptionDestroy: (index: number) => void;
};

export const SelectContextKey: InjectionKey<SelectContext> =
  Symbol('ivue-select');

export const SelectGroupContextKey: InjectionKey<OptionGroupProps> =
  Symbol('ivue-select-group');
