import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Avatar from './avatar.vue';

// props
export const avatarProps = buildProps({
  /**
   * 类型
   *
   * @type {String}
   */
  shape: {
    type: String,
    values: ['circle', 'square'],
    default: 'circle',
  },
  /**
   * 链接
   *
   * @type {String}
   */
  src: {
    type: String,
    default: '',
  },
  /**
   * 图标
   *
   * @type {String}
   */
  icon: {
    type: String,
    default: '',
  },
  /**
   * 大小
   *
   * @type {Number,String}
   */
  size: {
    type: [Number, String],
  },
  /**
   * 颜色
   *
   * @type {String | Array}
   */
  color: {
    type: [String, Array],
    default: '',
  },
});
// props 类型
export type AvatarProps = ExtractPropTypes<typeof avatarProps>;

// emits事件类型
export const avatarEmits = {
  'on-error': (event: Event) => event,
};
export type AvatarEmits = typeof avatarEmits;

// 组件实例
export type AvatarInstance = InstanceType<typeof Avatar>;
