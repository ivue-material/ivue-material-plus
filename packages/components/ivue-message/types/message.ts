export interface Props {
  content: string;
  type: string;
  className: string;
  closable: boolean;
  background: boolean;
  render?: any;
  onClose?: any;
  id: string;
  duration: number;
  top: number;
  zIndex: number;
  loadingIcon?: string;
}

export interface Data {
  closeTimer: ReturnType<typeof setTimeout> | null;
  visible: boolean;
  iconTypes: Record<string, string>;
}

export type Type =
  | 'normal'
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'loading';

export type Options = {
  content?: string;
  top?: number;
  onClose?: () => any;
  type?: Type;
  duration?: number;
  id?: string;
  zIndex?: number;
  loadingIcon?: string;
};
