export interface Props {
  content: string;
  type: string;
  className?: string;
  closable: boolean;
  render?: any;
  haveIcon: boolean;
  onClose?: any;
  styles?: any;
  id: string;
  duration: number;
  offset: number;
  position: string;
  zIndex: number;
  title: string;
  desc: string;
}

export interface Data {
  haveDesc: boolean;
  closeTimer: any;
  visible: boolean;
  iconTypes: Record<string, string>;
}
