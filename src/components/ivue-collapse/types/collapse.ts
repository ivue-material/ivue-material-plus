import type { InjectionKey } from 'vue';
import type { PanelInstance } from './panel';

export interface Props {
  modelValue: string | any[];
  simple: boolean;
  accordion: boolean;
}

export interface Data {
  currentValue: string | string[];
  childrenList: {
    expandable: any[];
    pushExpandable: (expandableListItem: PanelInstance) => void;
    removeExpandable: (expandableListItem: PanelInstance) => void;
    toggle: (obj: { name: string; isActive: boolean }) => void
  }
}

export type CollapseContext = {
  pushExpandable: (expandableListItem: PanelInstance) => void;
  removeExpandable: (expandableListItem: PanelInstance) => void;
  toggle: (obj: { name: string; isActive: boolean }) => void
}

export const CascaderContextKey: InjectionKey<CollapseContext> =
  Symbol('ivue-collapse');
