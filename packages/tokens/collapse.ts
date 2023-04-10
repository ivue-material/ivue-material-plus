import type { InjectionKey } from 'vue';

import { PanelProxyInstance } from '@ivue-material-plus/components/ivue-collapse-panel';

export type CollapseContext = {
  pushExpandable: (item: PanelProxyInstance) => void;
  removeExpandable: (item: PanelProxyInstance) => void;
  toggle: (obj: { name: string | number; isActive: boolean }) => void;
};

export const CollapseContextKey: InjectionKey<CollapseContext> =
  Symbol('ivue-collapse');
