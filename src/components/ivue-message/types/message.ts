
export interface Props {
  content: string;
  type: string;
  className: string;
  closable: boolean;
  background: boolean;
  render?: any;
  haveIcon?: boolean;
  onClose?: any;
  styles?: any;
  id: string;
  duration: number;
  offset: number;
  position: string;
  zIndex: number;
  title?: string;
  desc?: string;
  loadingIcon?: string;
}

export interface Data {
  haveDesc: boolean;
  closeTimer: ReturnType<typeof setTimeout> | null;
  visible: boolean;
  iconTypes: Record<string, string>;
}

export type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type Type = 'normal' | 'info' | 'warning' | 'success' | 'error' | 'loading';

export type Options = {
  content?: string,
  offset?: number,
  onClose?: () => any,
  type?: Type,
  duration?: number,
  id?: string,
  zIndex?: number,
  loadingIcon?: string
}
