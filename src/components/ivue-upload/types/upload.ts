
import {
  UploaderFileListItem,
  UploaderResultType,
  UploaderMaxSize,
} from '../../../utils/helpers';

type PromiseOrNot<T> = T | Promise<T>;

export type UploaderAfterRead = (
  items: UploaderFileListItem | UploaderFileListItem[],
  detail: {
    name: string | number;
    index: number;
  }
) => void;

export type UploaderBeforeRead = (
  file: File | File[],
  detail: {
    name: string | number;
    index: number;
  }
) => PromiseOrNot<File | File[] | undefined>;

export interface Props {
  type: string;
  accept?: string;
  dragAccept?: any[];
  multiple: boolean;
  disabled: boolean;
  resultType: UploaderResultType;
  modelValue: UploaderFileListItem[];
  maxSize: UploaderMaxSize;
  maxCount: number | string;
  afterRead: UploaderAfterRead;
  beforeRead: UploaderBeforeRead;
  name: number | string;
  failedIcon: string;
  deletable: boolean;
  showUpload: boolean;
  previewSize: number | string;
  previewImage: boolean;
  beforeDelete: any;
  previewImageEnlarge: boolean;
  previewImageInitialIndex?: number;
}

export interface Data {
  fileList: UploaderFileListItem[]
  dragOver: boolean;
  imagePreview: boolean;
  imagePreviewList: string[];
  imagePreviewInitialIndex: number;
}
