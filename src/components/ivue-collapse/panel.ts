
import Panel from './panel.vue';

interface _Panel extends InstanceType<typeof Panel> {
  uid: number;
  proxy: {
    name: string;
    data: {
      isActive: boolean;
      index: number;
    }
  };
}

export type PanelInstance = _Panel

export interface Data {
  isActive: boolean;
  index: number;
  mounted: boolean;
}
