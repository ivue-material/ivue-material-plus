
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
} from 'vue';


interface _ComponentPublicInstance extends ComponentPublicInstance {
  removeScrollEffect: () => void
  addScrollEffect: () => void
  modalList: Record<string, any>[]
  $root: _ComponentPublicInstance | null
}

interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}

export type {
  _ComponentInternalInstance
};
