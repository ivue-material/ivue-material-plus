<template>
  <li
    v-show="data.visible"
    :data-visible="data.visible"
    data-select="select-item"
    :class="wrapperClasses"
    :style="wrapperStyles"
    v-ripple="ripple"
    @click.stop="handleOptionClick"
    @mousedown.prevent
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <slot>{{ showLabel }}</slot>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  getCurrentInstance,
  inject,
  reactive,
  onBeforeUnmount,
  onMounted,
  nextTick,
  unref,
} from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

import { isCssColor } from '@ivue-material-plus/utils';
// option
import { optionProps } from './option';
// directives
import { Ripple } from '@ivue-material-plus/directives';
// tokens
import {
  SelectContext,
  SelectContextKey,
  SelectGroupContextKey,
} from '@ivue-material-plus/tokens';

// type
import type { ComponentInternalInstance } from 'vue';
import type { DataOpen, OptionInstance } from './option';

const prefixCls = 'ivue-select-item';

export default defineComponent({
  name: 'ivue-option',
  componentName: 'ivue-select-item',
  directives: {
    Ripple,
  },
  props: optionProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // vm
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    // inject
    const select = inject(SelectContextKey) as SelectContext;

    // 有选项组
    const selectGroup = inject(SelectGroupContextKey, {
      disabled: false,
    });

    // data
    const data = reactive<DataOpen>({
      /**
       * 是否获取到焦点
       *
       * @type {Boolean}
       */
      isFocused: false,
      /**
       * 是否禁用选项
       *
       * @type {Boolean}
       */
      disabled: props.disabled,
      /**
       * 鼠标悬浮
       *
       * @type {Boolean}
       */
      hasMouseHover: false,
      /**
       * 是否显示
       *
       * @type {Boolean}
       */
      visible: true,
    });

    // computed

    // classes
    const wrapperClasses = computed(() => {
      return [
        bem.b(),
        {
          // 禁用
          [bem.is('disabled')]: unref(isDisabled),
          // 获取焦点
          [bem.is('focus')]: data.isFocused,
          // 选中
          [bem.is('selected')]: unref(itemSelected) && select.props.autoComplete,
        },
      ];
    });

    // styles
    const wrapperStyles = computed(() => {
      let obj = {};

      // 单选触发
      if (
        (unref(itemSelected) && !select.props.autoComplete) ||
        data.isFocused
      ) {
        // 单选
        if (!select.props.multiple) {
          obj = {
            ...obj,
            ...setBackgroundColor(select.props.selectedColor),
          };
        }
        // 多选
        else {
          if (data.isFocused) {
            obj = {
              ...obj,
              ...setBackgroundColor(select.props.selectedColor),
            };
          } else {
            obj = {
              ...obj,
              ...setTextColor(select.props.selectedColor),
            };
          }
        }
      }

      // 鼠标悬浮
      if (data.hasMouseHover && !unref(isDisabled)) {
        // 单选
        if (!select.props.multiple) {
          obj = {
            ...obj,
            ...setBackgroundColor(props.hoverColor || select.props.hoverColor),
          };
        }
        // 多选
        else {
          obj = {
            ...obj,
            ...setBackgroundColor(
              props.selectedColor || select.props.selectedColor
            ),
            color: '#ffffff',
          };
        }
      }

      return obj;
    });

    // 是否禁用
    const isDisabled = computed(() => {
      return data.disabled || selectGroup.disabled;
    });

    // 是否显示label
    const showLabel = computed(() => {
      return props.label ? props.label : props.value;
    });

    // 获取label
    const getLabel = computed(() => {
      return props.label || proxy!.$el.textContent;
    });

    // 当前选项是否激活
    const itemSelected = computed(() => {
      // 单选激活
      if (!select.props.multiple) {
        return isEqual(props.value, select.props.modelValue as string | number);
      }
      // 多选激活
      else {
        return contains(
          select.props.modelValue as (string | number)[],
          props.value
        );
      }
    });

    // computed
    const isObject = computed(() => {
      return (
        Object.prototype.toString.call(props.value).toLowerCase() ===
        '[object object]'
      );
    });

    // methods

    // 点击选项
    const handleOptionClick = () => {
      // 禁用
      if (unref(isDisabled)) {
        return;
      }

      // 开启了创建列表
      if (props.allowCreate) {
        handleCreateItem();
      }
      // 普通点击
      else {
        select.handleOptionClick({
          value: props.value,
          label: unref(getLabel),
        });
      }
    };

    // 创建新列表
    const handleCreateItem = () => {
      if (
        props.allowCreate &&
        props.filterQuery !== '' &&
        props.showCreateItem
      ) {
        emit('on-create');
      }
    };

    // 两个值是否相等
    const isEqual = (a: string | number, b: string | number) => {
      if (!unref(isObject)) {
        return a === b;
      }
    };

    // 是否包含元素
    const contains = (
      arr: (string | number)[] = [],
      target: string | number
    ) => {
      if (!unref(isObject)) {
        return arr && arr.indexOf(target) > -1;
      }
    };

    // 设置背景颜色
    const setBackgroundColor = (color: string | string[]) => {
      let style = {};

      // 是否是数组
      if (Array.isArray(color)) {
        style = {
          background: `linear-gradient(135deg,${color[0]} 0%, ${color[1]} 100%)`,
          color: '#fff',
        };
      }
      // 样式是css
      else if (isCssColor(color)) {
        style = {
          'background-color': `${color}`,
          color: '#fff',
        };
      }

      return style;
    };

    // 设置文字颜色
    const setTextColor = (color: string | string[]) => {
      let style = {};

      // 是否是数组
      if (Array.isArray(color)) {
        style = {
          color: `${color[0]}`,
        };
      }
      // 样式是css
      else if (isCssColor(`${color}`)) {
        style = {
          color: `${color}`,
        };
      }

      return style;
    };

    // 鼠标进入
    const handleMouseenter = () => {
      if (!select.dropVisible) {
        return;
      }

      data.hasMouseHover = true;
    };

    // 鼠标离开
    const handleMouseleave = () => {
      data.hasMouseHover = false;
    };

    // onMounted
    onMounted(() => {
      if (!props.allowCreate) {
        // 插入dom
        select.options.push(proxy as OptionInstance);
      }
    });

    // onBeforeUnmount
    onBeforeUnmount(() => {
      nextTick(() => {
        select.onOptionDestroy(
          select.options.map((item) => item.value).indexOf(props.value)
        );
      });
    });

    return {
      bem,

      // data,
      data,

      // computed
      wrapperClasses,
      wrapperStyles,
      showLabel,
      getLabel,
      itemSelected,
      isDisabled,

      // methods
      handleOptionClick,
      handleMouseenter,
      handleMouseleave,
      setBackgroundColor,
    };
  },
});
</script>
