export interface Props {
  leftArrow: string;
  rightArrow: string;
  autoplay: boolean;
  interval: number;
  direction: string;
  pauseOnHover: boolean;
  offset: number;
  slidingSpeed: number;
  slidingEndNext: boolean;
  scrollQuantity: number;
  arrow: string;
  dataList: any[];
}


export interface Data {
  timer: ReturnType<typeof setInterval> | null;
  loop: boolean;
  showCopyTrack: boolean;
  listWidth: number;
  contentWidth: number;
  listTranslate: number;
  listTranslateStart: boolean;
  listCopyTranslate: number;
  listCopyTranslateStart: boolean;
  overflowWidth: number;
  scrollDoneQuantity: number;
  direction: string;
  arrowInterval: ReturnType<typeof setInterval> | null;
  arrowSetTimeout: ReturnType<typeof setTimeout> | null;
  span: number;
  slidingStart: boolean;
}
