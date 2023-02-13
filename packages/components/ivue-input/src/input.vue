<template>
  <div :class="wrapClasses">
    <template v-if="type !== 'textarea'">
      <!-- 前置内容，仅在 text 类型下有效 -->
      <div
        :class="[`${prefixCls}-group-prepend`, ...prependColor]"
        :style="prependStyle"
        v-if="prepend"
      >
        <slot name="prepend"></slot>
      </div>
      <!-- 输入框 -->
      <div :class="contentClass">
        <!-- 首部图标 -->
        <span :class="[`${prefixCls}-prefix`]" v-show="showPrefix">
          <slot name="prefix">
            <i class="ivue-icon">{{ prefix }}</i>
          </slot>
        </span>

        <input
          :class="inputClass"
          :placeholder="placeholder"
          :spellcheck="spellcheck"
          :type="currentType"
          :disabled="inputDisabled"
          :autocomplete="autocomplete"
          :readonly="readonly"
          :name="name"
          :value="currentValue"
          :autofocus="autofocus"
          :number="number"
          :id="inputId"
          :maxlength="maxlength"
          @keyup.enter="handleEnter"
          @keyup="handleKeyup"
          @keypress="handleKeypress"
          @keydown="handleKeydown"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          ref="input"
        />

        <!-- 重置选择 -->
        <div
          :class="[`${prefixCls}-icon`, `${prefixCls}-clear`]"
          v-if="clearable && currentValue && !disabled"
          @click.stop="handleClear"
        >
          <ivue-icon
            :class="[`${prefixCls}-icon-clear`, showSuffix ? 'is-suffix' : '']"
            >{{ clearIcon }}</ivue-icon
          >
        </div>
        <!-- 字数统计 -->
        <span :class="`${prefixCls}-word-count`" v-if="showWordLimit"
          >{{ textLength }}/{{ upperLimit }}</span
        >
        <!-- 是否显示密码 -->
        <div
          :class="[`${prefixCls}-suffix`, `${prefixCls}-password`]"
          v-if="password"
          @click="handleShowPassword"
        >
          <template v-if="showPassword">
            <slot name="password-on">
              <i class="ivue-icon">{{ passwordIcon.on }}</i>
            </slot>
          </template>
          <template v-else>
            <slot name="password-off">
              <i class="ivue-icon">{{ passwordIcon.off }}</i>
            </slot>
          </template>
        </div>
        <!-- 尾部图标 -->
        <span
          :class="[`${prefixCls}-suffix`]"
          v-if="showSuffix"
          @click.stop="handleSuffix"
        >
          <slot name="suffix">
            <i class="ivue-icon">{{ suffix }}</i>
          </slot>
        </span>
      </div>
      <!-- 搜索型输入框 -->
      <template v-if="search && enterButton === false">
        <i :class="[`${prefixCls}-icon`, 'ivue-icon']" @click="handleSearch"
          >search</i
        >
      </template>
      <template v-else-if="search && enterButton">
        <div
          :class="[`${prefixCls}-group-append`, `${prefixCls}-search`]"
          @click="handleSearch"
        >
          <i :class="['ivue-icon']" v-if="enterButton === true">search</i>
          <template v-else>{{ enterButton }}</template>
        </div>
      </template>
      <!-- 后置内容，仅在 text 类型下有效 -->
      <div
        :class="[`${prefixCls}-group-append`, ...appendColor]"
        :style="appendStyle"
        v-if="append"
      >
        <slot name="append"></slot>
      </div>
    </template>
    <template v-else>
      <textarea
        :id="inputId"
        :name="name"
        :disabled="inputDisabled"
        :class="textareaClasses"
        :style="textareaStyles"
        :value="currentValue"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :readonly="readonly"
        :rows="rows"
        :maxlength="maxlength"
        :spellcheck="spellcheck"
        :wrap="wrap"
        @keyup.enter="handleEnter"
        @keyup="handleKeyup"
        @keypress="handleKeypress"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        ref="textarea"
      ></textarea>
      <!-- 字数统计 -->
      <span :class="`${prefixCls}-word-count`" v-if="showWordLimit"
        >{{ textLength }}/{{ upperLimit }}</span
      >
    </template>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue';

import { isCssColor } from '@ivue-material-plus/utils';

// component
import IvueIcon from '@ivue-material-plus/components/ivue-icon';

// use
import { useInput } from './use-input';

// inputProps
import { inputProps } from './input';

const prefixCls = 'ivue-input';

export default defineComponent({
  name: prefixCls,
  emits: [
    'update:modelValue',
    'on-change',
    'on-focus',
    'on-blur',
    'on-clear',
    'on-enter',
    'on-keyup',
    'on-keypress',
    'on-keydown',
    'on-suffix',
    'on-search',
  ],
  // 声明事件
  props: inputProps,
  // 组合式 API
  setup(props, { slots, emit }) {
    const {
      // dom
      textarea,
      input,
      focused,

      // data
      showPassword,
      currentValue,

      inputDisabled,

      // computed
      textareaStyles,
      upperLimit,
      textLength,
      currentType,
      prepend,
      append,
      showPrefix,
      showSuffix,

      // methods
      handleEnter,
      handleKeyup,
      handleKeypress,
      handleKeydown,
      handleFocus,
      handleBlur,
      handleInput,
      handleClear,
      handleShowPassword,
      handleSuffix,
      handleSearch,
      setCurrentValue,
      focus,
      blur,
    } = useInput(props, emit, slots);

    // computed

    // 外层样式
    const wrapClasses = computed(() => {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-wrapper-${props.size}`]: !!props.size,
          [`${prefixCls}-wrapper-clearable`]: props.clearable,
          [`${prefixCls}-type-${props.type}`]: props.type,
          [`${prefixCls}-group`]:
            prepend.value ||
            append.value ||
            (props.search && props.enterButton),
          [`${prefixCls}-group-${props.size}`]:
            (prepend.value ||
              append.value ||
              (props.search && props.enterButton)) &&
            !!props.size,
          [`${prefixCls}-group-with-prepend`]: prepend.value,
          [`${prefixCls}-group-with-append`]:
            append.value || (props.search && props.enterButton),
        },
      ];
    });

    // 输入框外层样式
    const contentClass = computed(() => {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-group`]:
            prepend.value ||
            append.value ||
            (props.search && props.enterButton),
          [`${prefixCls}-no-border`]: !props.border,
          [`${prefixCls}-content--prepend`]: prepend.value,
          [`${prefixCls}-content--append`]:
            append.value || (props.search && props.enterButton),
          [`${prefixCls}-content--disabled`]: inputDisabled.value,
          // 获取焦点
          [`${prefixCls}-content--focused`]: focused.value,
        },
      ];
    });

    // 输入框样式
    const inputClass = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}-${props.size}`]: !!props.size,
          [`${prefixCls}-with-prefix`]: showPrefix.value,
          [`${prefixCls}-with-suffix`]:
            showSuffix.value || (props.search && props.enterButton === false),
          [`${prefixCls}-disabled`]: inputDisabled.value,
          [`${prefixCls}-no-border`]: !props.border,
        },
      ];
    });

    // 文本框样式
    const textareaClasses = computed(() => {
      return [
        prefixCls,
        `${prefixCls}-textarea`,
        {
          [`${prefixCls}-disabled`]: inputDisabled.value,
          [`${prefixCls}-no-border`]: !props.border,
        },
      ];
    });

    // 前置内容背景
    const prependColor = computed(() => {
      let _color = {};

      if (!isCssColor(props.prependBgColor)) {
        _color = { [props.prependBgColor]: true };
      }

      return [_color];
    });

    // 前置内容背景
    const prependStyle = computed(() => {
      let _color = {};

      if (isCssColor(props.prependBgColor)) {
        _color = { 'background-color': `${props.prependBgColor}` };
      }

      return _color;
    });

    // 后置内容背景
    const appendColor = computed(() => {
      let _color = {};

      if (!isCssColor(props.appendBgColor)) {
        _color = { [props.appendBgColor]: true };
      }

      return [_color];
    });

    // 后置内容背景
    const appendStyle = computed(() => {
      let _color = {};

      if (isCssColor(props.appendBgColor)) {
        _color = { 'background-color': `${props.appendBgColor}` };
      }

      return _color;
    });

    // 设置表单对应的输入框id
    // const { formItem } = useFormItem();

    // // 输入框id
    // const { inputId } = useFormItemInputId(props, {
    //   formItemContext: formItem,
    // });
    const inputId = ref('1');

    return {
      prefixCls,

      inputId,

      // dom
      textarea,
      input,

      // data
      showPassword,
      currentValue,
      inputDisabled,

      // computed
      textareaStyles,

      wrapClasses,
      contentClass,
      inputClass,
      textareaClasses,

      prependColor,
      prependStyle,
      appendColor,
      appendStyle,

      upperLimit,
      textLength,
      currentType,
      prepend,
      append,
      showPrefix,
      showSuffix,

      // methods
      handleEnter,
      handleKeyup,
      handleKeypress,
      handleKeydown,
      handleFocus,
      handleBlur,
      handleInput,
      handleClear,
      handleShowPassword,
      handleSuffix,
      handleSearch,
      setCurrentValue,
      focus,
      blur,
    };
  },
  components: {
    IvueIcon,
  },
});
</script>
