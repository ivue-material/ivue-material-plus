import { getCurrentInstance } from 'vue';
import { isString } from '@vue/shared';
import { buildProps, definePropType } from '@ivue-material-plus/utils';
import { isNil } from 'lodash-unified';

// type
import type { ExtractPropTypes, ComponentInternalInstance } from 'vue';
import type { Emitter, EventType } from 'mitt';
import type Select from './select.vue';
import type { OptionInstance, OptionData } from './option';
import { isBoolean } from '@vueuse/core';

export type Color = string | string[];
export type ModelValue = string | number | (string | number)[];
export type DefaultLabel = string | number | string[];
export type SelectValue = string | number | (string | number)[] | OptionData;

type SearchMethod = (value: string, status?: string) => void;

// props
export const selectProps = buildProps({
  /**
   * 设置选择的值
   *
   * @type {String, Number, Array}
   */
  modelValue: {
    type: definePropType<ModelValue>([String, Number, Array]),
    default: '',
  },
  /**
   * 远程搜索时，显示默认 label，详见示例
   *
   * @type {String, Number, Array}
   */
  defaultLabel: {
    type: definePropType<DefaultLabel>([String, Number, Array]),
    default: '',
  },
  /**
   * 选择选项时的颜色
   *
   * @type {String | Array}
   */
  selectedColor: {
    type: definePropType<Color>([String, Array]),
    default: '#5B8EFF',
  },
  /**
   * hover 选择选项时的颜色
   *
   * @type {String | Array}
   */
  hoverColor: {
    type: definePropType<Color>([String, Array]),
    default: '#5B8EFF',
  },
  /**
   * 是否开启多选
   *
   * @type {Boolean}
   */
  multiple: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否开启多选过滤收起时清除输入
   *
   * @type {Boolean}
   */
  multipleFilterableClear: {
    type: Boolean,
    default: false,
  },
  /**
   * 设置多选删除图标
   *
   * @type {Boolean}
   */
  multipleIcon: {
    type: String,
    default: 'cancel',
  },
  /**
   * 是否禁用选择组件
   *
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否开启外部点击的 capture 模式，可通过全局配置
   *
   * @type {Boolean}
   */
  capture: {
    type: Boolean,
    default() {
      const global = (getCurrentInstance() as ComponentInternalInstance)
        .appContext.config.globalProperties;

      return !global.$IVUE ? true : global.$IVUE.capture;
    },
  },
  /**
   * 是否支持搜索
   *
   * @type {Boolean}
   */
  filterable: {
    type: Boolean,
    default: false,
  },
  /**
   * input name
   *
   * @type {String}
   */
  name: {
    type: String,
  },
  /**
   * 是否将label和value一起返回
   *
   * @type {Boolean}
   */
  labelAndValue: {
    type: Boolean,
    default: false,
  },
  /**
   * 在 Select 内显示图标
   *
   * @type {String}
   */
  prefix: {
    type: String,
  },
  /**
   * 多选时最多显示多少个 tag
   *
   * @type {Number}
   */
  maxTagCount: {
    type: Number,
  },
  /**
   * 隐藏 tag 时显示的内容，参数是剩余项数量
   *
   * @type {Function}
   */
  maxTagPlaceholder: {
    type: Function,
  },
  /**
   * 输入提示
   *
   * @type {String}
   */
  placeholder: {
    type: String,
    default: '请选择',
  },
  /**
   * 是否允许用户创建新条目，需开启 filterable
   *
   * @type {Boolean}
   */
  allowCreate: {
    type: Boolean,
    default: false,
  },
  /**
   * 创建新条目按钮图标
   *
   * @type {Boolean}
   */
  allowCreateIcon: {
    type: String,
    default: 'reply',
  },
  /**
   * 没有找到数据时的提示
   *
   * @type {String}
   */
  notFindText: {
    type: String,
    default: '无匹配数据',
  },
  /**
   * 搜索方法
   *
   * @type {Function}
   */
  searchMethod: {
    type: definePropType<SearchMethod>(Function),
  },
  /**
   * 下拉图标
   *
   * @type {String}
   */
  arrowDownIcon: {
    type: String,
    default: 'keyboard_arrow_down',
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
   * 清除选择图标
   *
   * @type {String}
   */
  resetSelectIcon: {
    type: String,
    default: 'cancel',
  },
  /**
   * 开启搜索时，隐藏group组件头
   *
   * @type {Boolean}
   */
  filterableHiddenGroup: {
    type: Boolean,
    default: false,
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
    default: '加载中',
  },
  /**
   * 搜索时，只按 label 进行搜索
   *
   * @type {Boolean}
   */
  filterByLabel: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否开启还原输入框内容（仅在单选时生效）
   *
   * @type {Boolean}
   */
  restoreInputOption: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否将弹层放置于 body 内
   *
   * @type {Boolean}
   */
  transfer: {
    type: Boolean,
    default() {
      const global = (getCurrentInstance() as ComponentInternalInstance)
        .appContext.config.globalProperties;

      return !global.$IVUE || global.$IVUE.transfer === ''
        ? false
        : global.$IVUE.transfer;
    },
  },
  /**
   * 弹窗的展开方向
   *
   * @type {String}
   */
  placement: {
    type: String,
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
    default: '',
  },
  /**
   * 自动完成
   *
   * @type {Boolean}
   */
  autoComplete: {
    type: Boolean,
    default: false,
  },
  /**
   * 外部输入框输入数据
   *
   * @type {String}
   */
  filterQueryProp: {
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
  /**
   * id
   *
   * @type {String}
   */
  id: {
    type: String,
  },
} as const);
// props 类型
export type SelectProps = ExtractPropTypes<typeof selectProps>;

// emits事件类型
export const selectEmits = {
  'update:modelValue': (value: ModelValue) => value || isNil(value),
  'on-change': (value: ModelValue) => value || isNil(value),
  'on-clear': () => true,
  'on-menu-open': (value: boolean) => isBoolean(value),
  'on-filter-query-change': (value: string) => isString(value),
  'on-set-default-options': (options: OptionData[]) => options,
  'on-create': (value: string) => isString(value),
  'on-select': (value: OptionData) => value,
};
export type SelectEmits = typeof selectEmits;

// 组件实例
export type SelectInstance = InstanceType<typeof Select>;

// Data
export interface Data {
  visibleMenu: boolean;
  isFocused: boolean;
  values: any[];
  options: OptionInstance[];
  focusIndex: number;
  filterQueryChange: boolean;
  filterQuery: string;
  hasMouseHover: boolean;
  lastSearchQuery: string;
  selectEmitter: Emitter<Record<EventType, unknown>>;
  hasExpectedValue: boolean;
  _filterQuery: string;
  disableMenu: boolean;
}
