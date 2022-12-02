export interface File {
  previewSize?: string | number;
  content?: string;
  url?: string;
  status?: string;
  message?: string;
  deletable? :string;
  imageFit?: string;
}

export interface Props {
  files: File[];
  failedIcon: string;
  deletable: boolean;
  beforeDelete: any;
  name: number | string;
  previewSize?: number | string;
  previewImageEnlarge: boolean;
}
