
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
} from 'vue';


export interface Props {
  landscape?: boolean;
  headerColor?: string;
  width: number | string;
  fullWidth: boolean;
  noTitle: boolean;
  modelValue: any;
  titleYearFormat: any;
  titleDateFormat: any;
  headerDateFormat: any;
  dayFormat: any;
  monthFormat: any;
  locale: string;
  multiple: boolean;
  type: string;
  yearIcon: string;
  readonly: boolean;
  pickerDate: string;
  min: string;
  max: string;
  nextIcon: string;
  prevIcon: string;
  firstDayOfWeek: string | number;
  allowedDates: any;
  showCurrent: any;
  note: any;
  noteColor: string | any;
  reactive: boolean;
  color?: string | string[];
  textColor?: string;
}

export interface Data {
  inputDay: string | number;
  inputMonth: string | number;
  inputYear: string | number;
  now: Date;
  activeType: string;
  tableDate: string;
}

interface _ComponentPublicInstance extends ComponentPublicInstance {
  setBackgroundColor: (color: string | string[]) => any;
  setTextColor: () => any
}

export interface _ComponentInternalInstance extends ComponentInternalInstance {
  proxy: _ComponentPublicInstance | null;
}
