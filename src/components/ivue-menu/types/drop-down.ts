export interface Props {
  transfer: boolean;
  transitionName: string;
  placement: any;
  visible?: boolean;
  styles?: any;
  classes?: any;
  className?: string;
}

export interface Data {
  width: string;
  zIndex: number;
  popper: any;
  popperStatus: boolean;
}
