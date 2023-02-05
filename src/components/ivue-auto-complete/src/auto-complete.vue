<template>
  <ivue-select
    :modelValue="currentValue"
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
  >
    <!-- input -->
    <template #input>
      <slot name="input">
        <ivue-input
          v-model="currentValue"
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
      <ivue-option v-for="item in filteredData" :value="item" :key="item"
        >{{ item }}
      </ivue-option>
    </slot>
  </ivue-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IvueSelect, IvueInput, IvueOption } from '@ivue-material-plus/index';

import { useFormItem, useFormItemInputId } from '@ivue-material-plus/hooks';

import { autoCompleteProps } from './auto-complete';
import { useAutoComplete } from './use-auto-complete';

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
  props: autoCompleteProps,
  setup(props, { emit }) {
    // 设置表单对应的输入框
    const { formItem } = useFormItem();
    // 输入框id
    const { inputId } = useFormItemInputId(props, {
      formItemContext: formItem,
    });

    // useAutoComplete
    const {
      // dom
      select,
      input,

      // data
      currentValue,
      disableEmitChange,

      // computed
      filteredData,

      // methods
      searchMethod,
      handleSelect,
      handleFocus,
      handleBlur,
      handleClear,
    } = useAutoComplete(props, emit, formItem);

    return {
      inputId,

      // dom
      select,
      input,

      // data
      currentValue,
      disableEmitChange,

      // computed
      filteredData,

      // methods
      searchMethod,
      handleSelect,
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
