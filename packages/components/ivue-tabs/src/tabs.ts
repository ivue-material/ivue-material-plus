import { buildProps } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type Tabs from './tabs.vue';
import type { TabInstance } from './tab';
import type { ItemInstance } from './item';

// props
export const tabsProps = buildProps({
  /**
   * 当前激活 tab 面板的 name，可以使用 v-model 双向绑定数据
   *
   * @type {String,Number}
   */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  /**
   * 导航内容居中
   *
   * @type {Boolean}
   */
  centered: {
    type: Boolean,
    default: false,
  },
  /**
   * 导航内容向右
   *
   * @type {Boolean}
   */
  right: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否显示导航栏箭头
   *
   * @type {Boolean}
   */
  showArrows: {
    type: Boolean,
    default: true,
  },
  /**
   * 左边按钮
   *
   * @type {String}
   */
  prevIcon: {
    type: String,
    default: 'chevron_left',
  },
  /**
   * 右边按钮
   *
   * @type {String}
   */
  nextIcon: {
    type: String,
    default: 'chevron_right',
  },
  /**
   * 固定宽度标签
   *
   * @type {Boolean}
   */
  fixedWidth: {
    type: Boolean,
    default: false,
  },
  /**
   * 自动适应宽度标签
   *
   * @type {Boolean}
   */
  autoWidth: {
    type: Boolean,
    default: false,
  },
  /**
   * 导航高度
   *
   * @type {String,Number}
   */
  height: {
    type: [String, Number],
  },
  /**
   * 滑动条颜色
   *
   * @type {String}
   */
  sliderColor: {
    type: String,
    default: 'primary',
  },
  /**
   * 滑动条隐藏
   *
   * @type {Boolean}
   */
  hideSlider: {
    type: Boolean,
    default: false,
  },
  /**
   * 调整显示箭头时设置的前后滚动的间距
   *
   * @type {Number | String}
   */
  arrowsMargin: {
    type: [Number, String],
    default: 40,
  },
});
// props 类型
export type TabsProps = ExtractPropTypes<typeof tabsProps>;

// emits事件类型
export const tabsEmits = ['update:modelValue'];
export type TabsEmits = typeof tabsEmits;

// 组件实例
export type TabsInstance = InstanceType<typeof Tabs>;

// Data
export interface TabsData {
  tabs: TabInstance[];
  tabsItem: ItemInstance[];
  isOverflowing: boolean;
  nextIconVisible: boolean;
  prevIconVisible: boolean;
  scrollOffset: number;
  startX: number;
  widths: any;
  resizeTimeout: any;
  sliderLeft: number;
  sliderWidth: number;
  isBooted: boolean;
  isInit: boolean;
}
