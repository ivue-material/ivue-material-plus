<template>
  <ivue-select
    :modelValue="data.currentValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :placement="placement"
    :transferClassName="transferClassName"
    :searchMethod="searchMethod"
    :transfer="transfer"
    :capture="capture"
    :notFindText="''"
    :loading="loading"
    :loadingText="loadingText"
    :id="null"
    filterable
    auto-complete
    ref="select"
    @on-select="handleSelect"
    @on-clickoutside="handleClickOutside"
  >
    <!-- input -->
    <template #input>
      <slot name="input">
        <ivue-input
          v-model="data.currentValue"
          :name="name"
          :id="inputId"
          :placeholder="placeholder"
          :disabled="disabled"
          :clearable="clearable"
          @on-focus="handleFocus"
          @on-blur="handleBlur"
          @on-clear="handleClear"
          ref="input"
        >
          <template #prefix v-if="$slots.prefix">
            <slot name="prefix"></slot>
          </template>
          <template #suffix v-if="$slots.suffix">
            <slot name="suffix"></slot>
          </template>
        </ivue-input>
      </slot>
    </template>
    <!-- option -->
    <slot>
      <ivue-option v-for="item in filteredData" :value="item" :key="item">{{
        item
      }}</ivue-option>
    </slot>
  </ivue-select>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
} from 'vue';
import IvueSelect from '../ivue-select/index.vue';
import IvueInput from '../ivue-input/index.vue';
import IvueOption from '../ivue-select/option.vue';

import { oneOf } from '../../utils/assist';
import { debugWarn } from '../../utils/error';
import { useFormItem, useFormItemInputId } from '../../hooks';

// type
import type { Select, Input, Props, Data, Option } from './types/auto-complete';

const prefixCls = 'ivue-auto-complete';

export default defineComponent({
  name: prefixCls,
  emits: [
    'update:modelValue',
    'on-search',
    'on-change',
    'on-select',
    'on-focus',
    'on-blur',
    'on-clear',
  ],
  props: {
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
      type: String,
      validator(value: string) {
        return oneOf(value, [
          'top',
          'bottom',
          'top-start',
          'bottom-start',
          'top-end',
          'bottom-end',
        ]);
      },
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
      type: Array,
      default: () => [],
    },
    /**
     * 外部过滤方法
     *
     * @type {Function, Boolean}
     */
    filterMethod: {
      type: [Function, Boolean],
      default: false,
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
  },
  setup(props: Props, { emit }) {
    // 设置表单对应的输入框id
    const { formItem } = useFormItem();

    // 输入框id
    const { inputId } = useFormItemInputId(props, {
      formItemContext: formItem,
    });

    // dom

    // select
    const select = ref<Select>();
    // input
    const input = ref<Input>();

    // data
    const data = reactive<Data>({
      /**
       * 当前输入值
       *
       * @type {String}
       */
      currentValue: props.modelValue,
      /**
       * 禁用事件改变
       *
       * @type {Boolean}
       */
      disableEmitChange: false,
    });

    // computed

    // 过滤的数据
    const filteredData = computed(() => {
      // 是否根据输入项进行筛选
      if (props.filterMethod) {
        return props.list.filter((item) => {
          return props.filterMethod(data.currentValue, item);
        });
      } else {
        return props.list;
      }
    });

    // methods

    // 搜索方法
    const searchMethod = (query: string) => {
      emit('on-search', query);

      if (props.remoteMethod) {
        props.remoteMethod(query);
      }
    };

    // 被选中时调用，参数为选中项的 value 值
    const handleSelect = (option: Option) => {
      const value = option.value;

      if (value === undefined || value === null) {
        return;
      }

      data.currentValue = `${value}`;

      // blur
      input.value.blur();

      emit('on-select', value);
    };

    // 点击外部
    const handleClickOutside = () => {
      nextTick(() => {
        // blur
        input.value.blur();
      });
    };

    // 获取焦点
    const handleFocus = (event: Event) => {
      emit('on-focus', event);

      // 输入时是否触发表单的校验
      if (props.validateEvent) {
        formItem?.validate?.('focus').catch((err) => debugWarn(err));
      }
    };

    // 失去焦点
    const handleBlur = (event: Event) => {
      emit('on-blur', event);

      // 输入时是否触发表单的校验
      if (props.validateEvent) {
        formItem?.validate?.('focus').catch((err) => debugWarn(err));
      }
    };

    // 清空时触发
    const handleClear = () => {
      emit('on-clear');
    };

    // watch

    // 监听设置选择的值
    watch(
      () => props.modelValue,
      (value) => {
        // 当前输入值不相等
        if (data.currentValue !== value) {
          data.disableEmitChange = true;
        }

        data.currentValue = value;

        // 输入时是否触发表单的校验
        if (props.validateEvent) {
          formItem?.validate?.('change').catch((err) => debugWarn(err));
        }
      }
    );

    // 监听当前输入值
    watch(
      () => data.currentValue,
      (value) => {
        select.value.setQuery(value);

        emit('update:modelValue', value);

        // 防止触发多次
        if (data.disableEmitChange) {
          data.disableEmitChange = false;

          return;
        }

        emit('on-change', value);
      }
    );

    return {
      // dom
      select,
      input,

      // data
      data,
      inputId,

      filteredData,

      // methods
      searchMethod,
      handleSelect,
      handleClickOutside,
      handleFocus,
      handleBlur,
      handleClear,
    };
  },
  components: {
    IvueSelect,
    IvueInput,
    IvueOption,
  },
});
</script>
