import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type {
  UploaderFileListItem,
  Interceptor,
} from '@ivue-material-plus/hooks';
import type UploadList from './upload-list.vue';

// props
export const uploadListProps = buildProps({
  /**
   * 上传的文件的列表
   *
   * @type {Array}
   */
  files: {
    type: definePropType<UploaderFileListItem[]>(Array),
    default: () => [],
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
   * 标识符，可以在回调函数的第二项参数中获取
   *
   * @type {Number, String}
   */
  name: {
    type: [Number, String],
    default: '',
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
   * 预览图片放大
   *
   * @type {Boolean}
   */
  previewFullImage: {
    type: Boolean,
    default: true,
  },
  /**
   * 预览图裁剪模式
   *
   * @type {String}
   */
  imageFit: {
    type: String,
    values: ['fill', 'contain', 'cover', 'none', 'scale-down'],
    default: 'cover',
  },
} as const);
// props 类型
export type UploadListProps = ExtractPropTypes<typeof uploadListProps>;

// emits事件类型
export const uploadListEmits = {
  'on-preview': (file: UploaderFileListItem, index: number) => true,
  'on-delete': (file: UploaderFileListItem, index: number) => true,
};
export type UploadListEmits = typeof uploadListEmits;

// 组件实例
export type UploadListInstance = InstanceType<typeof UploadList>;

// File
export interface UploadFile extends File {
  url?: string;
  previewSize?: string | number;
  content?: string;
  status?: string;
  message?: string;
  deletable?: string;
  imageFit?: string;
  beforeDelete?: Interceptor;
}
