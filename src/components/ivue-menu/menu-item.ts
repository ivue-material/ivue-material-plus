
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
} from 'vue';


interface _ComponentPublicInstance extends ComponentPublicInstance {
  handleCheckClick: (event: Event, newWindow: boolean) => void
}

interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}

export type {
  _ComponentInternalInstance
};
