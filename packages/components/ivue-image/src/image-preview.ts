import { getCurrentInstance } from 'vue';
import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type ImagePreview from './image-preview.vue';

// props
export const imagePreviewProps = buildProps({
  /**
   * 是否显示，可使用 v-model 双向绑定
   *
   * @type {Boolean}
   */
  modelValue: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否将弹层放置于 body 内
   *
   * @type {Boolean}
   */
  transfer: {
    type: Boolean,
    default() {
      const global = getCurrentInstance()!.appContext.config.globalProperties;

      return !global.$IVUE || global.$IVUE.transfer === ''
        ? false
        : global.$IVUE.transfer;
    },
  },
  /**
   * 打开预览的第一项
   *
   * @type {Number}
   */
  initialIndex: {
    type: Number,
    default: 0,
  },
  /**
   * 是否允许点击遮罩层关闭
   *
   * @type {Boolean}
   */
  maskClosable: {
    type: Boolean,
    default: true,
  },
  /**
   * 图片预览列表
   *
   * @type {Array}
   */
  previewList: {
    type: definePropType<string[]>(Array),
    default: () => [],
  },
  /**
   * 是否循环切换
   *
   * @type {Boolean}
   */
  infinite: {
    type: Boolean,
    default: true,
  },
  /**
   * 图片预览操作栏选项，按数组顺序排序
   *
   * @type {Array}
   */
  toolbar: {
    type: Array,
    default() {
      const global = getCurrentInstance()!.appContext.config.globalProperties;

      return !global.$IVUE ||
        !global.$IVUE.image ||
        global.$IVUE.image.toolbar === ''
        ? [
            'zoomIn',
            'zoomOut',
            'original',
            'rotateLeft',
            'rotateRight',
            'download',
          ]
        : global.$IVUE.image.toolbar;
    },
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
} as const);
// props 类型
export type ImagePreviewProps = ExtractPropTypes<typeof imagePreviewProps>;

// 组件实例
export type ImagePreviewInstance = InstanceType<typeof ImagePreview>;
