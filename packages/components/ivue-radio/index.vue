<template>
  <label :class="wrapperClasses">
    <!-- 圆点 -->
    <span :class="contentClasses">
      <span :class="innerClasses" :style="innerStyles"></span>
      <!-- 输入框 -->
      <input
        type="radio"
        :class="inputClasses"
        :name="data.groupName"
        :disabled="inputDisabled"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </span>
    <!-- 内容 -->
    <slot>{{ label }}</slot>
  </label>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  watch,
  inject,
  onMounted,
} from 'vue';
import { isCssColor, setTextColor } from '../../utils/helpers';
import { debugWarn } from '../../utils/error';
import { useFormItem, useFormItemInputId, useDisabled } from '../../hooks';

// type
import type { Props, Data } from './types/radio';
import { RadioContextKey } from '../ivue-radio-group/types/radio-group';

const prefixCls = 'ivue-radio';

export default defineComponent({
  name: prefixCls,
  emits: ['update:modelValue', 'on-change'],
  props: {
    /**
     * 只在单独使用时有效。可以使用 v-model 双向绑定数据
     *
     * @type {String | Number | Boolean}
     */
    modelValue: {
      type: [String, Number, Boolean],
      default: false,
    },
    /**
     * 选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
     *
     * @type {String | Number | Boolean}
     */
    trueValue: {
      type: [String, Number, Boolean],
      default: true,
    },
    /**
     * 没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
     *
     * @type {String | Number | Boolean}
     */
    falseValue: {
      type: [String, Number, Boolean],
      default: false,
    },
    /**
     * 指定当前选项的 value 值，组合会自动判断当前选择的项目
     *
     * @type {String, Number}
     */
    label: {
      type: [String, Number],
    },
    /**
     * 是否禁用当前项
     *
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 颜色
     *
     * @type {String}
     */
    color: {
      type: String,
      default: 'primary',
    },
    /**
     * name 属性
     *
     * @type {String}
     */
    name: {
      type: String,
    },
    /**
     * 是否显示边框
     *
     * @type {Boolean}
     */
    border: {
      type: Boolean,
      default: false,
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
    // 组合
    const IvueRadioGroup = inject(RadioContextKey, {
      default: null,
    });

    // 输入框禁用
    const inputDisabled = useDisabled();

    // data

    const data: any = reactive<Data>({
      /**
       * input 焦点
       *
       * @type {Boolean}
       */
      focusInner: false,
      /**
       * 组合名称
       *
       * @type {String}
       */
      groupName: props.name,
    });

    // onMounted
    onMounted(() => {
      // 是否有组合
      if (IvueRadioGroup.name) {
        if (props.name && props.name !== IvueRadioGroup.name) {
          /* eslint-disable no-console */
          if (console.warn) {
            console.warn('Name does not match Radio Group name.');
          }
        } else {
          data.groupName = IvueRadioGroup.name;
        }
      }
    });

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-group--item`]: IvueRadioGroup.name,
          [`${prefixCls}-wrapper--checked`]: currentValue.value,
          [`${prefixCls}-wrapper--disabled`]: inputDisabled.value,
          [`${prefixCls}-border`]: props.border,
        },
      ];
    });

    // 内容外层
    const contentClasses = computed(() => {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-checked`]: currentValue.value,
          [`${prefixCls}-disabled`]: inputDisabled.value,
        },
      ];
    });

    // 圆点 class
    const innerClasses = computed(() => {
      const obj = {
        [`${prefixCls}-focus`]: data.focusInner,
      };

      // 文字样式
      const isTextColor: any = setTextColor(props.color);

      if (isTextColor.color && !isCssColor(isTextColor.color)) {
        obj[isTextColor.color] = true;
      }

      return [`${prefixCls}-inner`, obj];
    });

    // 圆点 style
    const innerStyles = computed(() => {
      const obj: any = {};

      // 文字样式
      const isTextColor: any = setTextColor(props.color);

      if (isTextColor.color && isCssColor(isTextColor.color)) {
        obj.color = isTextColor.color;
      }

      return obj;
    });

    // 输入框
    const inputClasses = computed(() => {
      return `${prefixCls}-input`;
    });

    // 当前值
    const currentValue = computed(() => {
      // 有组合
      if (IvueRadioGroup.name) {
        return IvueRadioGroup.currentValue.value === props.label;
      }
      // 没有组合
      else {
        return props.modelValue === props.trueValue;
      }
    });

    // methods

    // 改变
    const handleChange = (event) => {
      // 禁用
      if (inputDisabled.value) {
        return false;
      }

      // 是否选中
      const checked = event.target.checked;

      // 设置 v-model
      const value = checked ? props.trueValue : props.falseValue;

      emit('update:modelValue', value);

      // 组合
      if (IvueRadioGroup.name) {
        // 是否有当前选项值
        if (props.label !== undefined) {
          IvueRadioGroup.change(props.label);
        }
      }
      // 没有组合
      else {
        // 发送事件
        emit('on-change', value);
      }
    };

    // 获取焦点
    const handleFocus = () => {
      // input 焦点
      data.focusInner = true;
    };

    // 失去焦点
    const handleBlur = () => {
      // input 焦点
      data.focusInner = false;
    };

    // watch

    // 监听 v-model
    watch(
      () => props.modelValue,
      (value) => {
        // 当前值不符合
        if (!(value === props.trueValue || value === props.falseValue)) {
          throw 'Value should be trueValue or falseValue.';
        }

        // 输入时是否触发表单的校验
        if (props.validateEvent) {
          formItem?.validate('change').catch((err) => debugWarn(err));
        }
      }
    );

    // 设置表单对应的输入框id
    const { formItem } = useFormItem();

    // 输入框id
    const { inputId } = useFormItemInputId(props, {
      formItemContext: formItem,
    });

    return {
      prefixCls,

      // data
      data,
      inputId,
      inputDisabled,

      // computed
      wrapperClasses,
      contentClasses,
      innerClasses,
      innerStyles,
      inputClasses,
      currentValue,

      // methods
      handleChange,
      handleFocus,
      handleBlur,
    };
  },
});
</script>
