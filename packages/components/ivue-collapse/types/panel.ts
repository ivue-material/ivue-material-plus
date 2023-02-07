import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue';

export interface _ComponentPublicInstance extends ComponentPublicInstance {
  name: string;
  data: Data;
}

export interface PanelInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}

export interface Data {
  isActive: boolean;
  index: number;
  mounted: boolean;
}
