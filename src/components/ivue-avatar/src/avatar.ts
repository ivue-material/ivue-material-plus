
import { buildProps } from '../../../utils/vue/props/index';
import { oneOf } from '../../../utils/assist';

export const avatarProps = buildProps({
  /**
   * 类型
   *
   * @type {String}
   */
  shape: {
    validator(value: string) {
      return oneOf(value, ['circle', 'square']);
    },
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
