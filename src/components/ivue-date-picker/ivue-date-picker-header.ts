
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
} from 'vue';

export interface Props {
  value?: string | number;
  locale: string;
  nextIcon: string;
  prevIcon: string;
  min?: string;
  max?: string;
  readonly?: boolean;
  activeType?: string;
  format?: any;
  tableDate?: string;
  color: string | any[];
}

interface _ComponentPublicInstance extends ComponentPublicInstance {
  setTextColor: (color: any, data: any) => any
}

export interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}
