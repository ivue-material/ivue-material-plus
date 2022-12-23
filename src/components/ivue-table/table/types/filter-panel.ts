import type { Ref, ComponentInternalInstance } from 'vue';
import type { TableColumnCtx } from '../../table-column/defaults';
import type { Store } from '../../store';
import type FilterPanel from '../filter-panel.vue';

export type FilterPanelInstance = InstanceType<typeof FilterPanel>

export interface Props {
  placement: string;
  column?: TableColumnCtx;
  upDataColumn: any;
  store?: Store;
  tooltipStop?: boolean;
}

export interface Parent extends ComponentInternalInstance {
  filterPanels?: Ref<Record<number, FilterPanelInstance>>;
}


export interface Parent extends ComponentInternalInstance {
  filterPanels?: Ref<Record<number, FilterPanelInstance>>;
}
