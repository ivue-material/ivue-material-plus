import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes, Ref } from 'vue';
import type Panel from './panel.vue';

// props
export const panelProps = buildProps({
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
   * 用于设置激活 panel
   *
   * @type {String}
   */
  name: {
    type: String,
    default: '',
  },
  /**
   * 隐藏箭头
   *
   * @type {Boolean}
   */
  hideArrow: {
    type: Boolean,
    default: false,
  },
});

// props 类型
export type PanelProps = ExtractPropTypes<typeof panelProps>;

// 组件实例
export type PanelInstance = InstanceType<typeof Panel>;

// 组件proxy实例
export type PanelProxyInstance = {
  uid: number;
  name: string;
  isActive: Ref<boolean>;
  index: Ref<number>;
};
