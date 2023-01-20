import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue';

export interface Props {
  fullWidth: boolean;
  width: number | string;
  transition: string;
  landscape: boolean;
  color: string | any[];
  textColor?: string;
}

interface _ComponentPublicInstance extends ComponentPublicInstance {
  landscape: boolean;
}

export interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}
