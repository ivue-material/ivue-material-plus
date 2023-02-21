import { getCurrentInstance } from 'vue';
import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Spin from './spin.vue';

// props
export const spinProps = buildProps({
  /**
   * 显示
   *
   * @type {Boolean}
   */
  show: {
    type: Boolean,
    default: true,
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
   * 是否固定 需要父级有relative或absolute
   *
   * @type {Boolean}
   */
  fix: {
    type: Boolean,
    default() {
      const global = getCurrentInstance()!.appContext.config.globalProperties;

      return !global.$IVUE || !global.$IVUE.spin.fix
        ? false
        : global.$IVUE.spin.fix;
    },
  },
  /**
   * 全屏显示
   *
   * @type {Boolean}
   */
  fullscreen: {
    type: Boolean,
    default: false,
  },
});
// props 类型
export type SpinProps = ExtractPropTypes<typeof spinProps>;

// 组件实例
export type SpinInstance = InstanceType<typeof Spin>;
