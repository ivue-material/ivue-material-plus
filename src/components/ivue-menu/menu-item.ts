import {
  ComponentInternalInstance,
  ComponentPublicInstance,
} from 'vue';

interface _ComponentPublicInstance extends ComponentPublicInstance {
  handleCheckClick: (event: Event, newWindow: boolean) => void
}

export interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}

export interface Props {
  name: string | number;
  disabled: boolean;
  target: string,
  to: string | any;
}
