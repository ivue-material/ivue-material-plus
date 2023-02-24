<template>
  <div :class="wrapperClasses" ref="wrapper">
    <!-- 图标 -->
    <span :class="bem.be('head', 'prefix')" v-if="$slots.prefix || prefix">
      <slot name="prefix">
        <ivue-icon v-if="prefix">{{ prefix }}</ivue-icon>
      </slot>
    </span>
    <!-- 多选和设置了最大显示数时的方框 -->
    <template v-for="(item, index) in selectedMultiple">
      <div
        :class="bem.b('tag')"
        :key="item.value"
        v-if="maxTagCount === undefined || index < maxTagCount"
      >
        <span
          :class="{
            [bem.be('tag', 'text')]: true,
            [bem.is('tag-hidden')]: item.disabled,
          }"
          >{{ item.label }}</span
        >
        <ivue-icon
          v-if="!item.disabled"
          :class="multipleIcon"
          @click.stop="handleRemoveSelectItem(item)"
          >{{ multipleIcon }}</ivue-icon
        >
      </div>
    </template>
    <!-- 多选达到最大值省略 -->
    <div
      :class="bem.b('tag')"
      v-if="maxTagCount !== undefined && selectedMultiple.length > maxTagCount"
    >
      <span
        :class="{
          [bem.be('tag', 'text')]: true,
          [bem.is('max')]: true,
        }"
      >
        <template v-if="maxTagPlaceholder">{{
          maxTagPlaceholder(selectedMultiple.length - maxTagCount)
        }}</template>
        <template v-else
          >+{{ selectedMultiple.length - maxTagCount }}...</template
        >
      </span>
    </div>
    <!-- 普通渲染 -->
    <input
      :class="defaultDisplayClasses"
      :value="defaultDisplayValue"
      type="text"
      tabindex="0"
      readonly
      spellcheck="false"
      autocomplete="off"
      :disabled="disabled"
      :id="id"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      v-if="defaultDisplayValue"
    />
    <!-- 输入框 -->
    <input
      type="text"
      v-if="filterable"
      v-model="filterQuery"
      :class="inputClasses"
      :style="inputStyles"
      :placeholder="showPlaceholder ? placeholder : ''"
      :disabled="disabled"
      :id="id"
      spellcheck="false"
      autocomplete="off"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      @input="handleResetInputState"
      @keydown.delete="handleInputDelete"
      @keydown.enter="handleInputEnter"
      ref="input"
    />
    <!-- 下拉图标 -->
    <transition name="ivue-select-fade">
      <ivue-icon
        :class="[bem.be('head', 'arrow')]"
        v-if="!resetSelect && !isSearchMethod"
        >{{ arrowDownIcon }}</ivue-icon
      >
    </transition>
    <!-- 重置选择 -->
    <transition name="ivue-select-fade">
      <ivue-icon
        :class="[bem.be('head', 'arrow'), bem.be('head', 'clear')]"
        v-if="resetSelect"
        @click.stop="handleClear"
        >{{ resetSelectIcon }}</ivue-icon
      >
    </transition>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  inject,
  watch,
  nextTick,
  ref,
  unref,
} from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// select-head
import { selectHeadProps } from './select-head';
// tokens
import { SelectContextKey, SelectContext } from '@ivue-material-plus/tokens';
// components
import { IvueIcon } from '@ivue-material-plus/components';

// type
import { OptionData } from './option';

const prefixCls = 'ivue-select';

export default defineComponent({
  name: 'ivue-select-head',
  props: selectHeadProps,
  setup(props, { slots, emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // dom
    const wrapper = ref<HTMLElement>();
    const input = ref<HTMLInputElement>();

    // inject
    const select = inject(SelectContextKey) as SelectContext;

    // 输入框长度
    const inputLength = ref<number>(30);
    // 输入框输入数据
    const filterQuery = ref<string>(props.filterQueryProp);
    // 输入框是否输入-这里不是判断直接赋值v-model而是输入框确实有输入行为
    const isInputChange = ref<boolean>(false);

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return {
        [bem.b('head')]: true,
        // 在 Select 内显示图标
        [bem.is('prefix')]: slots.prefix || props.prefix,
        // 开启了过滤 && 有图标
        [bem.is('flex')]: props.filterable && (slots.prefix || props.prefix),
      };
    });

    // 多项选择
    const selectedMultiple = computed(() => {
      return props.multiple ? props.values : [];
    });

    // 普通显示的class
    const defaultDisplayClasses = computed(() => {
      return [
        bem.b('input'),
        {
          [bem.is('with-prefix')]: slots.prefix || props.prefix,
          [bem.is('selection-value')]:
            !showPlaceholder.value && !props.multiple && !props.filterable,
          [bem.is('placeholder')]: showPlaceholder.value && !props.filterable,
        },
      ];
    });

    // 过滤输入框
    const inputClasses = computed(() => {
      return [
        bem.be('input', 'filter'),
        {
          [bem.is('filter-placeholder')]: showPlaceholder.value,
        },
      ];
    });

    // 是否显示占位符
    const showPlaceholder = computed(() => {
      let status = false;
      if (!props.multiple) {
        const value = props.values[0];

        // 判断 undefined 和清除空格
        if (typeof value === 'undefined' || String(value).trim() === '') {
          status = true;
        }
      } else {
        if (!(props.values.length > 0)) {
          status = true;
        }
      }

      return status;
    });

    // 普通显示的值
    const defaultDisplayValue = computed(() => {
      // 判断是否是多选 或者 是否开启了输入框过滤
      if ((props.multiple && props.values.length > 0) || props.filterable) {
        return '';
      }

      return `${selectedSingle.value}` || props.placeholder;
    });

    // 选择单个选项
    const selectedSingle = computed(() => {
      const selected = props.values[0];

      return selected ? selected.label : '';
    });

    // 重置选择
    const resetSelect = computed(() => {
      return !showPlaceholder.value && props.clearable;
    });

    // 输入框样式
    const inputStyles = computed(() => {
      const style: {
        width?: string;
      } = {};

      // 多选
      if (props.multiple) {
        if (showPlaceholder.value) {
          style.width = '100%';
        } else {
          style.width = `${unref(inputLength)}px`;
        }
      }

      return style;
    });

    // methods

    // 清除选择
    const handleClear = () => {
      emit('on-clear');
    };

    // 删除选择选项
    const handleRemoveSelectItem = (value: OptionData) => {
      if (props.disabled) {
        return false;
      }

      // 多选删除了
      select.handleOptionClick(value, 'delete-multiple');
    };

    // 判断焦点发送事件
    const handleInputFocus = () => {
      emit('on-input-focus');
    };

    // 失去焦点
    const handleInputBlur = () => {
      if (props.showCreateItem) {
        return;
      }

      // 没有选项
      if (!props.values.length) {
        filterQuery.value = '';
      }

      emit('on-input-blur');
    };

    // 重置输入框状态
    const handleResetInputState = (event?: Event) => {
      const value =
        (event && (event.target as HTMLInputElement).value) ||
        unref(filterQuery);

      // 输入框长度
      inputLength.value = value.length * 12 + 20;

      const wrapperOffsetWidth = wrapper.value!.offsetWidth;

      if (unref(inputLength) > wrapperOffsetWidth) {
        inputLength.value = wrapperOffsetWidth;
      }
    };

    // 输入框删除
    const handleInputDelete = (event: Event) => {
      const targetValue = (event.target as HTMLInputElement).value;

      if (
        props.multiple &&
        selectedMultiple.value.length &&
        unref(filterQuery) === '' &&
        targetValue === ''
      ) {
        handleRemoveSelectItem(
          selectedMultiple.value[selectedMultiple.value.length - 1]
        );
      }
    };

    // 点击确认
    const handleInputEnter = (event: Event) => {
      emit('on-enter', event);
    };

    // watch

    // 监听最终渲染的数据
    watch(
      () => props.values,
      ([value]) => {
        // 开启了过滤
        if (!props.filterable) {
          return;
        }

        isInputChange.value = true;

        // 判断多选
        if (props.multiple) {
          // 输入框输入数据
          filterQuery.value = '';
          // 判断输入框是否输入-这里不是判断直接赋值v-model而是输入框确实有输入行为
          isInputChange.value = false;

          return;
        }

        // 设置输入框数据
        if (
          typeof value === 'undefined' ||
          (typeof value === 'string' && value === '') ||
          value === null
        ) {
          filterQuery.value = '';
        } else {
          filterQuery.value = `${value.label}`;
        }

        // nextTick
        nextTick(() => {
          // 判断输入框是否输入-这里不是判断直接赋值v-model而是输入框确实有输入行为
          isInputChange.value = false;
        });
      }
    );

    // 监听过滤输入
    watch(
      () => unref(filterQuery),
      (value) => {
        if (unref(isInputChange)) {
          isInputChange.value = false;

          return;
        }

        emit('on-filter-query-change', value);
      }
    );

    // 监听外部过滤输入
    watch(
      () => props.filterQueryProp,
      (value) => {
        if (value !== unref(filterQuery) && props.filterable) {
          filterQuery.value = value;
        }

        // 重置输入框长度
        handleResetInputState();
      }
    );

    return {
      prefixCls,
      bem,

      // dom
      wrapper,
      input,
      filterQuery,

      // computed
      wrapperClasses,
      selectedMultiple,
      defaultDisplayClasses,
      defaultDisplayValue,
      resetSelect,
      showPlaceholder,
      inputStyles,
      inputClasses,

      // methods
      handleClear,
      handleRemoveSelectItem,
      handleInputFocus,
      handleInputBlur,
      handleResetInputState,
      handleInputDelete,
      handleInputEnter,
    };
  },
  components: {
    IvueIcon,
  },
});
</script>
