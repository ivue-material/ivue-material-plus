export interface Props {
  status: string;
  hideInfo: boolean;
  textInside: boolean;
  successPercent: number;
  percent: number;
  strokeWidth: number;
  vertical: boolean;
  strokeColor?: string | any[];
  boxShadowColor?: string;
  icon?: string;
  indeterminate: boolean;
  duration: number;
}
