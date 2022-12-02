export interface Props {
  firstDayOfWeek: string | number;
  tableDate: string;
  locale: string;
  activeType: string;
  value: string | any[];
  min?: string;
  max?: string;
  allowedDates?: any;
  current?: string;
  readonly?: boolean;
  format?: any;
  backgroundColor?: any;
  note?: any[] | any;
  noteColor?: any;
  color: string | any[];
  textColor?: any;
}
