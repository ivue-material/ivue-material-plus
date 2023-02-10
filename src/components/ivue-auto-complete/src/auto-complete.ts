import { getCurrentInstance } from 'vue';
import { buildProps, definePropType } from '@ivue-material-plus/utils';
import { Placement } from '@ivue-material-plus/utils/mixins/popper';
import { isString } from '@vue/shared';
import { isNumber } from '@vueuse/core';

// type
import type { ExtractPropTypes } from 'vue';
import type Select from '../../ivue-select/index.vue';
import type Input from '../../ivue-input/index.vue';
import type AutoComplete from './auto-complete.vue';

export type Select = InstanceType<typeof Select>;
export type Input = InstanceType<typeof Input>;

// 选项
export type Option = {
  value: string | number;
  label: string | number;
};

// 外部过滤方法
export type FilterMethod = (
  currentValue: string,
  item: string | number
) => boolean;

// 过滤的数据
export type FilteredData = string[] | number[];

// 自动完成的数据源
export type List = any[];

// props
export const autoCompleteProps = buildProps({
  /**
   * 设置选择的值
   *
   * @type {String}
   */
  modelValue: {
    type: String,
    default: '',
  },
  /**
   * 输入提示
   *
   * @type {String}
   */
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * 是否禁用
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否可以清除选择
   *
   * @type {Boolean}
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * 弹窗的展开方向
   *
   * @type {String}
   */
  placement: {
    type: definePropType<Placement>(String),
    values: [
      'top',
      'bottom',
      'top-start',
      'bottom-start',
      'top-end',
      'bottom-end',
    ],
    default: 'bottom-start',
  },
  /**
   * 开启 transfer 时，给浮层添加额外的 class 名称
   *
   * @type {String}
   */
  transferClassName: {
    type: String,
  },
  /**
   * 是否将弹层放置于 body 内，在 Tabs、
   * 带有 fixed 的 Table 列内使用时，
   * 建议添加此属性，它将不受父级样式影响，
   * 从而达到更好的效果
   *
   * @type {Boolean}
   */
  transfer: {
    type: Boolean,
    default() {
      const global = getCurrentInstance().appContext.config.globalProperties;
      return !global.$IVUE || global.$IVUE.transfer === ''
        ? false
        : global.$IVUE.transfer;
    },
  },
  /**
   * id
   *
   * @type {String}
   */
  id: {
    type: String,
  },
  /**
   * 是否开启外部点击的 capture 模式，可通过全局配置
   *
   * @type {Boolean}
   */
  capture: {
    type: Boolean,
    default() {
      const global = getCurrentInstance().appContext.config.globalProperties;
      return !global.$IVUE ? true : global.$IVUE.capture;
    },
  },
  /**
   * 输入框name
   *
   * @type {String}
   */
  name: {
    type: String,
  },
  /**
   * 自动完成的数据源
   *
   * @type {Array}
   */
  list: {
    type: definePropType<List>([Array]),
    default: () => [],
  },
  /**
   * 外部过滤方法
   *
   * @type {Function, Boolean}
   */
  filterMethod: {
    type: definePropType<FilterMethod>([Function]),
  },
  /**
   * 远程搜索方法
   *
   * @type {Function}
   */
  remoteMethod: {
    type: Function,
  },
  /**
   * 加载中
   *
   * @type {Boolean}
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * 加载中的文字提示
   *
   * @type {String}
   */
  loadingText: {
    type: String,
    default: '',
  },
  /**
   * 输入时是否触发表单的校验
   *
   * @type {Boolean}
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
});

// props 类型
export type AutoCompleteProps = ExtractPropTypes<typeof autoCompleteProps>;

// emits事件类型
export const autoCompleteEmits = {
  'update:modelValue': (value: string) => isString(value),
  'on-search': (query: string) => isString(query),
  'on-select': (value: string | number) => isString(value) || isNumber(value),
  'on-focus': (evt: FocusEvent) => evt instanceof FocusEvent,
  'on-blur': (evt: FocusEvent) => evt instanceof FocusEvent,
  'on-clear': () => true,
  'on-change': (value: string) => isString(value),
};
export type AutoCompleteEmits = typeof autoCompleteEmits;

// 组件实例
export type AutoCompleteInstance = InstanceType<typeof AutoComplete>;
