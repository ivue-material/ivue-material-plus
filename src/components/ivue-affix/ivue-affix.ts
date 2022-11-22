export type Props = {
  offsetTop: number;
  offsetBottom: number;
  useCapture: boolean;
};

export type Data = {
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
};
