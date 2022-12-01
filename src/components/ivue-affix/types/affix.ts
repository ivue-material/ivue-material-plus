export interface Props {
  offsetTop: number;
  offsetBottom: number;
  useCapture: boolean;
}

export interface Data {
  affix: boolean;
  slot: boolean;
  styles: {
    top?: string;
    bottom?: string;
    left?: string;
    width?: string;
  };
  slotStyle: {
    width?: string;
    height?: string;
  };
}
