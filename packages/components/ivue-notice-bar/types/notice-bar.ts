export interface Props {
  text?: string;
  speed: number;
  delay: number;
  scrollable: boolean;
  mode: string;
  wrapable: boolean;
  leftIcon?: string;
  background?: string | any[];
  textColor?: string;
}

export interface Data {
  show: boolean;
  offset: number;
  duration: number;
  mounted: boolean | null;
  contentWrapperWidth: number;
  contentWidth: number;
  startTimer: ReturnType<typeof setTimeout> | null;
}
