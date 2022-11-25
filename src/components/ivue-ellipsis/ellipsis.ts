export interface Props {
  text?: string;
  length?: number;
  height?: number;
  disabled: boolean;
  lines: number;
  fullWidthRecognition: boolean;
  autoResize: boolean;
  tooltip: boolean;
  placement: string;
}

export interface Data {
  computedReady: boolean;
  computedText: string;
  oversize: boolean;
}
