import type { InjectionKey } from 'vue';
import type Bar from '../bar.vue';

export type BarInstance = InstanceType<typeof Bar>;

export interface Props {
  wrapperClass: string;
  wrapperStyle: any;
  contentClass: string;
  contentStyle: any;
  native?: boolean;
  height: string | number;
  maxHeight: string | number;
  tag: string;
  always: boolean;
  noresize: boolean;
  minBarSize: number;
}

export interface Data {
  barHeight: string;
  barWidth: string;
  ratioX: number;
  ratioY: number;
}

export type ScrollbarContext = {
  scrollbar: HTMLDivElement;
  scrollbarWrapper: HTMLDivElement;
};

export const ScrollbarContextKey: InjectionKey<ScrollbarContext> =
  Symbol('ivue-scrollbar');
