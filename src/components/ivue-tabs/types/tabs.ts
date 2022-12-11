import { InjectionKey } from 'vue';

export interface Props {
  centered: boolean;
  right: boolean;
  showArrows: boolean;
  nextIcon: string;
  prevIcon: string;
  fixedWidth: boolean;
  height?: string | number;
  sliderColor: string;
  hideSlider: boolean;
  modelValue: string | number;
  arrowsMargin: string | number;
  autoWidth: boolean;
}

export interface Data {
  tabs: Array<any>;
  tabsItem: Array<any>;
  isOverflowing: boolean;
  nextIconVisible: boolean;
  prevIconVisible: boolean;
  scrollOffset: number;
  startX: number;
  widths: any;
  resizeTimeout: any;
  sliderLeft: number;
  sliderWidth: number;
  isBooted: boolean;
  isInit: boolean;
}

export type TabsContext = {
  props: any;
  data: any;
  unregister: any;
  tabNavClick: any;
  unregisterItems: any;
}

export const TabsContextKey: InjectionKey<TabsContext> =
  Symbol('ivue-tabs');
