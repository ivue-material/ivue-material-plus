export interface Props {
  content: string;
  type: string;
  className?: string;
  closable: boolean;
  render?: any;
  onClose?: any;
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

export type Position =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';
export type Type = 'normal' | 'info' | 'warning' | 'success' | 'error';

export type Options = {
  title?: string;
  desc?: string;
  onClose?: () => any;
  render?: () => any;
  duration?: number;
  position?: Position;
  offset?: number;
  id?: string;
  zIndex?: number;
  type?: Type;
  closable?: boolean;
  name?: string;
};
