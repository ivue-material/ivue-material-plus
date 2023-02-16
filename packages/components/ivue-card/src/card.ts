import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Card from './card.vue';
import type { RouteLocationRaw } from 'vue-router';

// props
export const cardProps = buildProps({
  /**
   * 跳转的链接，支持 vue-router 对象
   *
   * @type {Object | String}
   */
  to: {
    type: definePropType<RouteLocationRaw>([Object, String]),
  },
  /**
   * 标题
   *
   * @type {String}
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * 是否显示边框，建议在灰色背景下使用
   *
   * @type {Boolean}
   */
  border: {
    type: Boolean,
    default: true,
  },
  /**
   * 卡片阴影，建议在灰色背景下使用
   *
   * @type {Boolean}
   */
  shadow: {
    type: Boolean,
    default: false,
  },
  /**
   * 禁用鼠标悬停显示阴影
   *
   * @type {Boolean}
   */
  disHover: {
    type: Boolean,
    default: false,
  },
  /**
   * 卡片内部间距
   *
   * @type {Number | String}
   */
  padding: {
    type: [Number, String],
  },
  /**
   * 标题内部间距(paddingStylesLinkage开启该属性将不生效)
   *
   * @type {Number | String}
   */
  titlePadding: {
    type: [Number, String],
  },
  /**
   * 相当于 a 链接的 target 属性
   *
   * @type {String}
   */
  target: {
    type: String,
    values: ['_blank', '_self', '_parent', '_top'],
    default: '_self',
  },
  /**
   * 路由跳转时，开启 replace 将不会向 history 添加新记录
   *
   * @type {Boolean}
   */
  replace: {
    type: Boolean,
    default: false,
  },
  /**
   * 圆角
   *
   * @type {Number}
   */
  radius: {
    type: Number,
  },
  /**
   * 样式联动(联动标题和内容的padding)
   *
   * @type {Boolean}
   */
  paddingStylesLinkage: {
    type: Boolean,
    default: true,
  },
  /**
   * 额外显示的内容位置
   *
   * @type {String}
   */
  extra: {
    type: String,
    value: ['top', 'center'],
    default: 'center',
  },
} as const);
// props 类型
export type CardProps = ExtractPropTypes<typeof cardProps>;

// 组件实例
export type CardInstance = InstanceType<typeof Card>;
