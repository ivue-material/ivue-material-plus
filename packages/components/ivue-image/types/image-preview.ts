export interface Props {
  modelValue: boolean;
  transfer: boolean;
  initialIndex: number;
  maskClosable: boolean;
  previewList: any[];
  infinite: boolean;
  toolbar: any[];
  bodyOverflow: boolean;
}

export interface Data {
  maskIndex: number;
  imageStatus: string;
  currentIndex: number;
  transition: boolean;
  original: boolean;
  startX: number;
  startY: number;
  imageTranslate: {
    x: number;
    y: number;
  };
  imageScale: number;
  imageRotate: number;
  prevOverflow: string;
  downloading: boolean;
}
