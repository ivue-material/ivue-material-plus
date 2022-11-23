export interface Props {
  offsetTop: number;
  offsetBottom: number;
  useCapture: boolean;
}

export interface Data {
  affix: boolean;
  slot: boolean;
  styles: {
    bottom?: string;
    left?: string;
    width?: string;
    top?: string;
  };
  slotStyle: {
    width?: string;
    height?: string;
  };
}
