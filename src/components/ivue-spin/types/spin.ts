import { VNode } from 'vue';

export interface Props {
  show: boolean;
  size?: number | string;
  fix?: boolean;
  fullscreen: boolean;
}

export type Options = {
  render?: () => VNode | null
}
