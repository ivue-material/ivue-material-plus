export interface Props {
  format?: any;
  target?: any;
  interval: number;
  type: string;
}

export interface Data {
  lastTime: number;
  countDownTimer: ReturnType<typeof setTimeout> | null;
}
