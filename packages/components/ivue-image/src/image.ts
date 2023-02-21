import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Image from './image.vue';

type ScrollContainer = HTMLElement | string;

// props
export const imageProps = buildProps({
  /**
   * 圆角
   *
   * @type {Number | String}
   */
  radius: {
    type: [Number, String],
    default: 0,
  },
  /**
   * 图片源地址
   *
   * @type {String}
   */
  src: {
    type: String,
    default: '',
  },
  /**
   * 确定图片如何适应容器框，同原生 object-fit
   *
   * @type {String}
   */
  fit: {
    type: String,
    values: ['', 'contain', 'cover', 'fill', 'none', 'scale-down'],
    default: '',
  },
  /**
   * 图片描述
   *
   * @type {String}
   */
  alt: {
    type: String,
    default: '',
  },
  /**
   * 首部用来监管哪些访问来源信息
   *
   * @type {String}
   */
  referrerPolicy: {
    type: String,
    values: [
      'no-referrer',
      'no-referrer-when-downgrade',
      'origin',
      'origin-when-cross-origin',
      'same-origin',
      'strict-origin',
      'strict-origin-when-cross-origin',
      'unsafe-url',
    ],
  },
  /**
   * 是否使用懒加载
   *
   * @type {Boolean}
   */
  lazy: {
    type: Boolean,
    default: false,
  },
  /**
   * loading文案
   *
   * @type {String}
   */
  loadingText: {
    type: String,
    default: '加载中',
  },
  /**
   * 加载错误文案
   *
   * @type {String}
   */
  errorText: {
    type: String,
    default: '加载失败',
  },
  /**
   * 是否图片预览
   *
   * @type {Boolean}
   */
  preview: {
    type: Boolean,
    default: false,
  },
  /**
   * 图片预览文案
   *
   * @type {String}
   */
  previewText: {
    type: String,
    default: '预览',
  },
  /**
   * 是否显示预览提示和遮罩
   *
   * @type {Boolean}
   */
  previewTip: {
    type: Boolean,
    default: true,
  },
  /**
   * 滚动加载容器
   *
   * @type {HTMLElement}
   */
  scrollContainer: {
    type: definePropType<ScrollContainer>([String, Object]),
    default: '',
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
   * 图片预览列表
   *
   * @type {Array}
   */
  previewList: {
    type: definePropType<string[]>(Array),
  },
} as const);
// props 类型
export type ImageProps = ExtractPropTypes<typeof imageProps>;

// 组件实例
export type ImageInstance = InstanceType<typeof Image>;
