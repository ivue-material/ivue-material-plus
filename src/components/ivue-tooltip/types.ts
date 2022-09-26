
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
} from 'vue';


interface _ComponentPublicInstance extends ComponentPublicInstance {
  updatePopper: () => void
}

interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}

export type {
  _ComponentInternalInstance
};
