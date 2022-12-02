import { ComponentInternalInstance, Ref, ComponentPublicInstance } from 'vue';

import { Sort } from '../../table/defaults';
import type FilterPanel from '../../table/filter-panel.vue';
import type { Store } from '../../store';

export type FilterPanelInstance = InstanceType<typeof FilterPanel>

export type DragState = {
  startMouseLeft?: number;
  startLeft?: number;
  startColumnLeft?: number;
  tableLeft?: number
}

export type SortOrder = 'descending' | 'ascending' | null;

export interface TableHeader extends ComponentInternalInstance {
  state: {
    handleColumnsChange
    handleScrollableWidthChange
  };
  filterPanels: Ref<Record<number, FilterPanelInstance>>;
  $parent: ComponentPublicInstance | null;
}

export interface TableHeaderProps {
  fixed: string
  store: Store
  border: boolean
  defaultSort: Sort
}
