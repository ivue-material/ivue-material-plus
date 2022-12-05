export interface File {
  previewSize?: string | number;
  content?: string;
  url?: string;
  status?: string;
  message?: string;
  deletable? :string;
  imageFit?: string;
  beforeDelete?: any;
}

export interface Props {
  files: File[];
  failedIcon: string;
  deletable: boolean;
  beforeDelete: any;
  name: number | string;
  previewSize?: number | string;
  previewFullImage: boolean;
  imageFit: string;
}
