import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Icon from './icon.vue';

// props
export const iconProps = buildProps({
  /**
   * svg 链接
   *
   * @type {String}
   */
  svgSrc: {
    type: String,
  },
  /**
   * flex 项排序
   *
   * @type {Number}
   */
  order: {
    type: Number,
  },
});
// props 类型
export type IconProps = ExtractPropTypes<typeof iconProps>;

// emits事件类型
export const iconEmits = {
  'on-svg-loaded': () => true,
};
export type IconEmits = typeof iconEmits;

// 组件实例
export type IconInstance = InstanceType<typeof Icon>;
