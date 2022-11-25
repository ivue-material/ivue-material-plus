
import { CountUpOptions, } from 'countup.js';

export interface Props {
  startValue: number;
  endValue: number;
  duration: number;
  decimals: number;
  options: CountUpOptions;
  callback: any;
}
