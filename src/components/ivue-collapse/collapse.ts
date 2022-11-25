import { InjectionKey, ComponentInternalInstance } from 'vue';

export interface Props {
  modelValue: string | any[];
  simple: boolean;
  accordion: boolean;
}

export interface Data {
  currentValue: string | string[];
  childrenList: Record<string, any>;
}

export type CollapseContext = {
  pushExpandable: (vm: ComponentInternalInstance) => void;
  removeExpandable: (vm: ComponentInternalInstance) => void;
  toggle: (obj: { name: string; isActive: boolean }) => void
}

export const CascaderContextKey: InjectionKey<CollapseContext> =
  Symbol('ivue-collapse');
