import { buildProps, definePropType } from '@ivue-material-plus/utils';

// type
import type { ExtractPropTypes } from 'vue';
import type SelectHead from './select-head.vue';
import type { OptionData } from './option';

// props
export const selectHeadProps = buildProps({
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
   * 是否开启多选
   *
   * @type {Boolean}
   */
  multiple: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否开启多选后的图表
   *
   * @type {Boolean}
   */
  multipleIcon: {
    type: String,
    default: '',
  },
  /**
   * 最终渲染的数据
   *
   * @type {Array}
   */
  values: {
    type: definePropType<OptionData[]>(Array),
    default: () => [],
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
   * 开启过滤筛选
   *
   * @type {Boolean}
   */
  filterable: {
    type: Boolean,
    default: false,
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
   * 下拉图标
   *
   * @type {Boolean}
   */
  arrowDownIcon: {
    type: String,
  },
  /**
   * 是否可以清楚选择
   *
   * @type {Boolean}
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否有搜索方法
   *
   * @type {Boolean}
   */
  isSearchMethod: {
    type: Boolean,
    default: false,
  },
  /**
   * 重置选择图标
   *
   * @type {Boolean}
   */
  resetSelectIcon: {
    type: String,
    default: '',
  },
  /**
   * 外部过滤输入
   *
   * @type {String}
   */
  filterQueryProp: {
    type: String,
    default: '',
  },
  /**
   * 外部dom元素
   *
   * @type {Object}
   */
  selectionDom: {
    type: Object,
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
   * 显示创建的选项
   *
   * @type {Boolean}
   */
  showCreateItem: {
    type: Boolean,
    default: false,
  },
  /**
   * id
   *
   * @type {String}
   */
  id: {
    type: String,
  },
});
// props 类型
export type SelectHeadProps = ExtractPropTypes<typeof selectHeadProps>;

// 组件实例
export type SelectHeadInstance = InstanceType<typeof SelectHead>;
