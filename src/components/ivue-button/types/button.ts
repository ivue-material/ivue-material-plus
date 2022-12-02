
export interface Props {
  index: number | string;
  href: string;
  type: string;
  disabled: boolean;
  ripple: boolean;
  flat: boolean;
  depressed: boolean;
  icon: boolean;
  outline: boolean;
  center: boolean;
  radius: boolean;
  isActive: boolean;
  status: string;
  loading: boolean;
  color?: string | any[];
  textColor?: string;
}

export type Status =
  | 'primary'
  | 'light-primary'
  | 'dark-primary'
  | 'success'
  | 'warning'
  | 'error';

export interface Data {
  rippleActive: boolean;
  mobile: boolean;
}

export interface ButtonAttrs {
  class?: Record<string, any>;
  href?: string;
  type?: string;
  disabled?: boolean;
  onTouchstart: (event: TouchEvent) => void;
  onTouchmove: (event: TouchEvent) => void;
  onClick: (event: Event) => void;
}
