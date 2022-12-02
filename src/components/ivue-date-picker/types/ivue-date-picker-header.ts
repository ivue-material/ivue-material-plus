
export interface Props {
  value?: string | number;
  locale: string;
  nextIcon: string;
  prevIcon: string;
  min?: string;
  max?: string;
  readonly?: boolean;
  activeType?: string;
  format?: any;
  tableDate?: string;
  color: string | any[];
  textColor?: string;
}
