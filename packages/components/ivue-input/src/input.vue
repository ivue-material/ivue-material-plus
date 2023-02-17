<template>
  <div :class="wrapClasses">
    <!-- 普通输入框 -->
    <template v-if="type !== 'textarea'">
      <!-- 前置内容，仅在 text 类型下有效 -->
      <div
        :class="[bem.e('group-prepend'), ...prependColor]"
        :style="prependStyle"
        v-if="prepend"
      >
        <slot name="prepend"></slot>
      </div>
      <!-- 输入框 -->
      <div :class="contentClasses">
        <!-- 首部图标 -->
        <span :class="bem.b('prefix')" v-show="showPrefix">
          <slot name="prefix">
            <ivue-icon>{{ prefix }}</ivue-icon>
          </slot>
        </span>
        <!-- input -->
        <input
          :class="inputClasses"
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
          :class="bem.b('icon')"
          v-if="clearable && currentValue && !disabled"
          @click.stop="handleClear"
        >
          <ivue-icon
            :class="[bem.be('icon', 'clear'), showSuffix && bem.is('suffix')]"
          >
            {{ clearIcon }}
          </ivue-icon>
        </div>
        <!-- 字数统计 -->
        <span :class="bem.b('word-count')" v-if="showWordLimit"
          >{{ textLength }}/{{ upperLimit }}</span
        >
        <!-- 是否显示密码 -->
        <div
          :class="[bem.b('suffix'), bem.b('password')]"
          v-if="password"
          @click="handleShowPassword"
        >
          <!-- password on-->
          <template v-if="showPassword">
            <slot name="password-on">
              <ivue-icon>{{ passwordIcon.on }}</ivue-icon>
            </slot>
          </template>
          <!-- password off -->
          <template v-else>
            <slot name="password-off">
              <ivue-icon>{{ passwordIcon.off }}</ivue-icon>
            </slot>
          </template>
        </div>
        <!-- 尾部图标 -->
        <span
          :class="bem.b('suffix')"
          v-if="showSuffix"
          @click.stop="handleSuffix"
        >
          <slot name="suffix">
            <ivue-icon>{{ suffix }}</ivue-icon>
          </slot>
        </span>
      </div>
      <!-- 搜索型输入框 -->
      <template v-if="search && enterButton === false">
        <ivue-icon :class="bem.b('icon')" @click="handleSearch">
          search
        </ivue-icon>
      </template>
      <!-- 搜索按钮 -->
      <template v-else-if="search && enterButton">
        <div
          :class="[bem.e('group-append'), bem.e('search')]"
          @click="handleSearch"
        >
          <ivue-icon v-if="enterButton === true">search</ivue-icon>
          <template v-else>{{ enterButton }}</template>
        </div>
      </template>
      <!-- 后置内容，仅在 text 类型下有效 -->
      <div
        :class="[bem.e('group-append'), ...appendColor]"
        :style="appendStyle"
        v-if="append"
      >
        <slot name="append"></slot>
      </div>
    </template>
    <!-- 文本区域 -->
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
      <span :class="bem.b('word-count')" v-if="showWordLimit"
        >{{ textLength }}/{{ upperLimit }}</span
      >
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { isCssColor } from '@ivue-material-plus/utils';
import { useNamespace } from '@ivue-material-plus/hooks';

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
    // bem
    const bem = useNamespace(prefixCls);

    const {
      inputId,

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
        bem.b('wrapper'),
        {
          // 是否显示清除按钮
          [bem.is('clearable')]: props.clearable,
          // 当前输入框类型
          [bem.is(`${props.type}`)]: props.type,
          // 前置内容
          [bem.is('group')]:
            prepend.value ||
            append.value ||
            (props.search && props.enterButton),
          // 前置内容
          [bem.is('group-with-prepend')]: prepend.value,
          // 后置内容
          [bem.is('group-with-append')]:
            append.value || (props.search && props.enterButton),
        },
      ];
    });

    // 输入框外层样式
    const contentClasses = computed(() => {
      return [
        bem.b('content'),
        {
          [bem.is('group')]:
            prepend.value ||
            append.value ||
            (props.search && props.enterButton),
          // 没有边框
          [bem.is('no-border')]: !props.border,
          // 前置内容
          [bem.is('prepend')]: prepend.value,
          // 后置内容
          [bem.is('append')]:
            append.value || (props.search && props.enterButton),
          // 禁用
          [bem.is('disabled')]: inputDisabled.value,
          // 获取焦点
          [bem.is('focused')]: focused.value,
        },
      ];
    });

    // 输入框样式
    const inputClasses = computed(() => {
      return [
        bem.b(),
        {
          [bem.is('with-prefix')]: showPrefix.value,
          [bem.is('with-suffix')]:
            showSuffix.value || (props.search && props.enterButton === false),
        },
      ];
    });

    // 文本框样式
    const textareaClasses = computed(() => {
      return [
        bem.b(),
        bem.b('textarea'),
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

    return {
      // bem
      bem,
      prefixCls,

      // 输入框id
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
      contentClasses,
      inputClasses,
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
