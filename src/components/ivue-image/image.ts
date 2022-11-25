export interface Props {
  radius: number | string;
  src: string;
  fit: string;
  alt: string;
  referrerPolicy: string;
  lazy: boolean;
  loadingText: string;
  errorText: string;
  preview: boolean;
  previewTip: boolean;
  scrollContainer: any;
  initialIndex: number;
  previewList: any[];
  previewText: string;
}

export interface Data {
  loadingImage: boolean;
  loading: boolean;
  imageError: boolean;
  scrollElement: any;
  observer: IntersectionObserver;
  imagePreviewModal: boolean;
}
