import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type SvgLoader from './svg-loader.vue';

// props
export const svgLoaderProps = buildProps({
  /**
   * svg图标的来源
   *
   * @type {String}
   */
  svgSrc: {
    type: String,
    required: true,
  },
} as const);
// props 类型
export type SvgLoaderProps = ExtractPropTypes<typeof svgLoaderProps>;

// emits事件类型
export const svgLoaderEmits = {
  'on-svg-loaded': () => true,
};
export type SvgLoaderEmits = typeof svgLoaderEmits;

// 组件实例
export type SvgLoaderInstance = InstanceType<typeof SvgLoader>;
