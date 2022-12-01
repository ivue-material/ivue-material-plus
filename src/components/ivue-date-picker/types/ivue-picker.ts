
import type {
  ComponentInternalInstance,
  ComponentPublicInstance,
} from 'vue';

export interface Props {
  fullWidth: boolean;
  width: number | string;
  transition: string;
  landscape: boolean;
  color: string | any[];
}

type Style = {
  style?: any;
  class?: any;
}

interface _ComponentPublicInstance extends ComponentPublicInstance {
  setBackgroundColor: (color: string | any[], obj: Style) => any;
  landscape: boolean;
}


export interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}
