import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Upload from './upload.vue';

// type
import type {
  UploaderFileListItem,
  UploaderResultType,
  UploaderMaxSize,
  Interceptor,
} from '@ivue-material-plus/hooks';

// props
export const uploadProps = buildProps({
  /**
   * 返回的数据
   *
   * @type {Array}
   */
  modelValue: {
    type: definePropType<UploaderFileListItem[]>(Array),
    default: () => [],
  },
  /**
   * 上传组件类型
   *
   * @type {String}
   *
   * select (点击选择)
   *
   * drag (支持拖动)
   */
  type: {
    type: String,
    values: ['select', 'drag'],
    default: 'select',
  },
  /**
   * 接受的上传类型
   *
   * @type {String}
   */
  accept: {
    type: String,
    default: 'image/*',
  },
  /**
   * 拖拽接受的上传类型后缀
   *
   * @type {Array}
   */
  dragAccept: {
    type: Array,
  },
  /**
   * 是否支持多选文件
   *
   * @type {Boolean}
   */
  multiple: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否禁用
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否将上传区域设置为只读状态
   *
   * @type {Boolean}
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * 图片选取模式，可选值为 camera (直接调起摄像头)
   *
   * @type {String}
   */
  capture: {
    type: definePropType<any>(String),
  },
  /**
   * 文件读取结果类型，可选值为 file text dataUrl url
   *
   * @type {String}
   */
  resultType: {
    type: definePropType<UploaderResultType>(String),
    default: 'dataUrl',
  },
  /**
   * 文件大小限制，单位为 byte
   *
   * @type {number | string | (file: File) => boolean}
   */
  maxSize: {
    type: definePropType<UploaderMaxSize>([Number, String, Function]),
    default: Number.MAX_VALUE,
  },
  /**
   * 文件上传数量限制
   *
   * @type {Number, String}
   */
  maxCount: {
    type: [Number, String],
    default: Number.MAX_VALUE,
  },
  /**
   * 文件读取完成后的回调函数
   *
   * @type {Boolean}
   */
  afterRead: {
    type: definePropType<UploaderAfterRead>(Function),
  },
  /**
   * before-read	文件读取前的回调函数，返回 false 可终止文件读取，支持返回 Promise
   *
   * @type {Function}
   */
  beforeRead: {
    type: definePropType<UploaderBeforeRead>(Function),
  },
  /**
   * 标识符，可以在回调函数的第二项参数中获取
   *
   * @type {Number, String}
   */
  name: {
    type: [Number, String],
    default: '',
  },
  /**
   * 错误时的图标
   *
   * @type {String}
   */
  failedIcon: {
    type: String,
    default: '',
  },
  /**
   * 是否展示删除按钮
   *
   * @type {Boolean}
   */
  deletable: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否展示上传区域
   *
   * @type {Boolean}
   */
  showUpload: {
    type: Boolean,
    default: true,
  },
  /**
   * 预览图和上传区域的尺寸，默认单位为 px
   *
   * @type {Number | String}
   */
  previewSize: {
    type: [Number, String],
  },
  /**
   * 是否在上传完成后展示预览图
   *
   * @type {Boolean}
   */
  previewImage: {
    type: Boolean,
    default: true,
  },
  /**
   * 文件删除前的回调函数，返回 false 可终止文件读取，
   * 支持返回 Promise
   *
   * @type {Function}
   */
  beforeDelete: {
    type: definePropType<Interceptor>(Function),
  },
  /**
   * 预览图片放大
   *
   * @type {Boolean}
   */
  previewFullImage: {
    type: Boolean,
    default: true,
  },
  /**
   * 预览图片开始位置下标
   *
   * @type {Boolean}
   */
  previewImageInitialIndex: {
    type: Number,
    default: -1,
  },
  /**
   * 防止body滚动
   *
   * @type {Boolean}
   */
  bodyOverflow: {
    type: Boolean,
    default: true,
  },
  /**
   * 上传方向
   *
   * @type {String}
   */
  uploadDirection: {
    type: String,
    values: ['left', 'right'],
    default: 'right',
  },
  /**
   * 预览图裁剪模式
   *
   * @type {String}
   */
  imageFit: {
    type: String,
    values: ['contain', 'cover', 'fill', 'none', 'scale-down'],
    default: 'cover',
  },
} as const);
// props 类型
export type UploadProps = ExtractPropTypes<typeof uploadProps>;

// emits事件类型
export const uploadEmits = {
  'update:modelValue': (value: UploaderFileListItem[]) => value,
  'on-delete': (
    file: UploaderFileListItem,
    detail: {
      name: string | number;
      index: number;
    }
  ) => true,
  'on-oversize': (
    items: UploaderFileListItem | UploaderFileListItem[],
    detail: {
      name: string | number;
      index: number;
    }
  ) => true,
  'on-preview': (file: UploaderFileListItem) => file,
  'on-drag-upload-error': (file: File | File[]) => file,
  'on-close-preview': () => true,
};
export type UploadEmits = typeof uploadEmits;

// 组件实例
export type UploadInstance = InstanceType<typeof Upload>;

// 文件读取完成后的回调函数
export type UploaderAfterRead = (
  items: UploaderFileListItem | UploaderFileListItem[],
  detail: {
    name: string | number;
    index: number;
  }
) => void;

// 文件读取前的回调函数，返回 false 可终止文件读取，支持返回 Promise
type PromiseOrNot<T> = T | Promise<T>;

export type UploaderBeforeRead = (
  file: File | File[],
  detail: {
    name: string | number;
    index: number;
  }
) => PromiseOrNot<File | File[] | undefined>;

export interface UploadData {
  fileList: UploaderFileListItem[];
  dragOver: boolean;
  imagePreview: boolean;
  imagePreviewList: string[];
  imagePreviewInitialIndex: number;
}
