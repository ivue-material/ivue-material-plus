<template>
  <div
    ref="selectWrapper"
    :class="classes"
    v-click-outside:[capture]="handleClickOutside"
    v-click-outside:[capture].mousedown="handleClickOutside"
  >
    <div
      ref="reference"
      :class="selectionClasses"
      :tabindex="selectTabindex"
      @blur="handleHeaderFocus"
      @focus="handleHeaderFocus"
      @click="handleToggleMenu"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      @keydown.down.stop.prevent="handleKeyDown"
      @keydown.up.stop.prevent="handleKeyDown"
      @keydown.enter.stop.prevent="handleKeyDown"
      @keydown.esc.stop.prevent="handleKeyDown"
      @keydown.tab="handleKeyDown"
    >
      <slot name="input">
        <input type="hidden" :name="name" :value="currentSelectValue" />
        <!-- 头部 -->
        <select-head
          :id="inputId"
          :prefix="prefix"
          :filterable="filterable"
          :multiple="multiple"
          :maxTagCount="maxTagCount"
          :multipleIcon="multipleIcon"
          :maxTagPlaceholder="maxTagPlaceholder"
          :placeholder="placeholder"
          :arrowDownIcon="arrowDownIcon"
          :clearable="canClearable"
          :values="values"
          :isSearchMethod="isSearchMethod"
          :resetSelectIcon="resetSelectIcon"
          :disabled="inputDisabled"
          :filterQueryProp="filterQuery"
          :allowCreate="allowCreate"
          :showCreateItem="showCreateItem"
          @on-clear="clearSingleSelect"
          @on-filter-query-change="handleFilterQueryChange"
          @on-input-focus="handleInputFocus"
          @on-input-blur="handleInputBlur"
          @on-enter="handleCreateItem"
          ref="selectHead"
        >
          <template #prefix v-if="$slots.prefix">
            <slot name="prefix"></slot>
          </template>
        </select-head>
      </slot>
    </div>
    <!-- 下拉菜单 -->
    <transition name="drop-transition">
      <drop-down
        :transfer="transfer"
        :data-transfer="transfer"
        :placement="placement"
        :class="dropdownClasses"
        v-transfer-dom
        key="IvueSelectDropdown"
        ref="dropdown"
        v-show="dropVisible"
      >
        <!-- 没有找到数据时的提示 -->
        <ul
          :class="bem.be('dropdown', 'not-find')"
          v-show="showNotFindText && !allowCreate && notFindText"
        >
          <li>{{ notFindText }}</li>
        </ul>
        <!-- 列表 -->
        <ul
          :class="bem.be('dropdown', 'list')"
          v-if="!isSearchMethod || (isSearchMethod && !loading)"
        >
          <!-- 创建选项 -->
          <ivue-option
            :class="bem.is('create')"
            :allowCreate="allowCreate"
            :showCreateItem="showCreateItem"
            :filterQuery="filterQuery"
            @on-create="handleCreateItem"
            v-if="showCreateItem"
          >
            <!-- 搜索内容 -->
            <p class="text">{{ filterQuery }}</p>
            <!-- 图标 -->
            <ivue-icon>{{ allowCreateIcon }}</ivue-icon>
          </ivue-option>
          <!-- slot -->
          <slot></slot>
        </ul>
        <!-- 加载中 -->
        <ul v-show="loading" :class="bem.be('dropdown', 'loading')">
          <div :class="bem.is('load')" v-ivue-loading="true"></div>
          <!-- loadingText -->
          <span>{{ loadingText }}</span>
        </ul>
      </drop-down>
    </transition>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  getCurrentInstance,
  provide,
  ref,
  nextTick,
  watch,
  onMounted,
  inject,
  unref,
  shallowRef,
  toRefs,
} from 'vue';
import mitt from 'mitt';
import { useNamespace } from '@ivue-material-plus/hooks';

// utils
import { debugWarn } from '@ivue-material-plus/utils';
// directives
import { ClickOutside, TransferDom } from '@ivue-material-plus/directives';
import { IvueLoadingDirective } from '@ivue-material-plus/components/ivue-loading';
// hooks
import {
  useFormItem,
  useFormItemInputId,
  useDisabled,
} from '@ivue-material-plus/hooks';
// tokens
import {
  PopoverContextKey,
  SelectContextKey,
} from '@ivue-material-plus/tokens';
// select
import { selectProps, selectEmits } from './select';

// type
import type { ComponentInternalInstance } from 'vue';
import type { Emitter, EventType } from 'mitt';

import type { ModelValue, SelectValue } from './select';
import type { DropDownInstance } from './drop-down';
import type { SelectHeadInstance } from './select-head';
import type { OptionInstance, OptionData } from './option';

// components
// 输入框
import SelectHead from './select-head.vue';
// 下拉框
import DropDown from './drop-down.vue';
// 选项
import IvueOption from './option.vue';
// icon
import IvueIcon from '@ivue-material-plus/components/ivue-icon';

const prefixCls = 'ivue-select';

export default defineComponent({
  name: prefixCls,
  // 注册局部指令
  directives: { ClickOutside, TransferDom, IvueLoading: IvueLoadingDirective },
  emits: selectEmits,
  props: selectProps,
  setup(props, { emit, slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    // vm
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    // dom
    const selectWrapper = ref<HTMLDivElement>();
    const reference = ref<HTMLDivElement>();
    const dropdown = ref<DropDownInstance>();
    const selectHead = ref<SelectHeadInstance>();

    // 输入框禁用
    const inputDisabled = useDisabled();

    // ivue-popover
    const popover = inject(PopoverContextKey, {
      default: null,
    });

    // 设置表单对应的输入框id
    const { formItem } = useFormItem();

    // 输入框id
    const { inputId } = useFormItemInputId(
      props,
      {
        formItemContext: formItem,
      },
      slots
    );

    // data

    // 是否显示菜单
    const visibleMenu = ref<boolean>(false);
    // 禁用菜单
    const disableMenu = ref<boolean>(false);
    // 鼠标悬浮
    const hasMouseHover = ref<boolean>(false);
    // 是否开始输入框支持搜索
    const filterQueryChange = ref<boolean>(false);
    // 最终渲染的数据
    const values = ref<OptionData[]>([]);
    // 判断是否有焦点
    const isFocused = ref<boolean>(false);
    // 焦点项
    const focusIndex = ref<number>(-1);
    // 搜索输入框输入数据
    const filterQuery = ref<string>(props.filterQueryProp || '');
    // 过滤输入内容
    const filterQueryAutoComplete = ref<string>('');
    // 上一次搜索输入
    const lastSearchQuery = ref<string>('');
    // 当前有 value 值
    const hasExpectedValue = ref<boolean>(false);

    // 事件发射器/发布订阅
    const selectEmitter = shallowRef<Emitter<Record<EventType, unknown>>>(
      mitt()
    );
    // 子选项 dom
    const options = ref<OptionInstance[]>([]);

    // computed

    // 外部样式
    const classes = computed(() => {
      return [
        `${prefixCls}`,
        {
          // 默认
          [bem.m('default')]: !props.multiple,
          // 是否支持多选
          [bem.m('multiple')]: props.multiple,
          // 是否禁用
          [bem.is('disabled')]: unref(inputDisabled),
          // 是否显示菜单
          [bem.m('visible')]: unref(visibleMenu),
        },
      ];
    });

    // 选择框样式
    const selectionClasses = computed(() => {
      return [
        bem.bm('selection', 'default'),
        {
          [bem.b('selection')]: !props.autoComplete,
          // 当前选择框获取焦点
          [bem.bm('selection', 'focused')]: unref(isFocused),
        },
      ];
    });

    // tab 键顺序
    const selectTabindex = computed(() => {
      // 是否禁用选择组件 | 是否支持搜索
      return unref(inputDisabled) || props.filterable ? -1 : 0;
    });

    // 当前选择的值
    const currentSelectValue = computed(() => {
      const _value = unref(values);

      // 开启返回label和value
      if (props.labelAndValue) {
        return props.multiple ? _value : _value[0];
      }
      // 没有开启返回label和value
      else {
        return props.multiple
          ? _value.map((option) => option.value)
          : (_value[0] || {}).value;
      }
    });

    // 显示没有数据时的文本
    const showNotFindText = computed(() => {
      // 是否禁用选择组件 | 是否支持搜索
      return (
        unref(selectOptions) &&
        unref(selectOptions).length === 0 &&
        (!unref(isSearchMethod) || (unref(isSearchMethod) && !props.loading))
      );
    });

    // 判断是搜索是否是一个方法
    const isSearchMethod = computed(() => {
      return typeof props.searchMethod === 'function';
    });

    // 获取菜单选择列表
    const selectOptions = computed(() => {
      // 获取选项的列表
      const _selectOptions = [];

      // 选项计数器，计算有多少个选项
      let optionCounter = -1;

      // 当前焦点项
      const currentIndex = unref(focusIndex);

      // 获取选择选项的value
      const selectedValues = unref(values)
        .filter(Boolean)
        .map(({ value }: any) => value);

      // 判断是否有自动输入
      if (props.autoComplete) {
        for (const option of unref(options)) {
          option.data.visible = true;

          //如果没有 filterQueryChange ，则忽略选项
          const optionFilter = props.filterable
            ? validateOption(option)
            : option;

          // 不符合条件的选项隐藏
          if (!optionFilter) {
            option.data.visible = false;
          }
          // 符合条件的选项显示
          else {
            option.data.visible = true;
          }

          // autoComplete 过滤输入的内容
          if (unref(filterQueryAutoComplete) === '') {
            option.data.visible = true;
          }

          // 有显示选项 加入计数器
          if (option.data.visible) {
            // 选项计数器
            optionCounter = optionCounter + 1;

            _selectOptions.push(
              handleOption(
                option,
                selectedValues,
                optionCounter === currentIndex
              )
            );
          }
        }

        return _selectOptions;
      }

      // 选项的数据
      for (const option of unref(options)) {
        //如果没有 filterQueryChange ，则忽略选项
        if (unref(filterQueryChange) || unref(filterQuery)) {
          const optionFilter = props.filterable
            ? validateOption(option)
            : option;

          // 不符合条件的选项
          if (!optionFilter) {
            option.data.visible = false;
          } else {
            option.data.visible = true;
          }

          // 过滤数组
          if (!optionFilter) {
            continue;
          }
        } else {
          option.data.visible = true;
        }

        // 有显示选项 加入计数器
        if (option.data.visible) {
          // 选项计数器
          optionCounter = optionCounter + 1;

          _selectOptions.push(
            handleOption(option, selectedValues, optionCounter === currentIndex)
          );
        }
      }

      // 这是一个组件数组 [components]
      return _selectOptions;
    });

    // 显示下拉菜单
    const dropVisible = computed(() => {
      let status = true;

      // 没有选项
      const noSelectOptions =
        unref(selectOptions) && unref(selectOptions).length === 0;

      // 没有加载中
      if (
        !props.loading &&
        unref(filterQuery) === '' &&
        noSelectOptions &&
        unref(isSearchMethod)
      ) {
        status = false;
      }

      // autoComplete
      if (props.autoComplete && noSelectOptions && !props.loading) {
        status = false;
      }

      return unref(visibleMenu) && status;
    });

    // 是否可以显示重置选择按钮
    const canClearable = computed(() => {
      // 多选模式下无效
      return (
        unref(hasMouseHover) &&
        props.clearable &&
        !props.multiple &&
        !unref(inputDisabled)
      );
    });

    // 当前选择的值
    const selectValue = computed(() => {
      // 判断是否有开启返回label和value
      if (props.labelAndValue) {
        return props.multiple ? unref(values) : unref(values)[0];
      } else {
        return props.multiple
          ? unref(values).map((option) => option.value)
          : (unref(values)[0] || {}).value;
      }
    });

    // 显示创建的选项
    const showCreateItem = computed(() => {
      let state = false;

      // 开启了创建选项, 有搜索内容
      if (props.allowCreate && unref(filterQuery) !== '') {
        state = true;

        // 是否有选项列表
        if (unref(options) && unref(options).length) {
          if (
            unref(options).find(
              (item: any) => item.getLabel === unref(filterQuery)
            )
          )
            state = false;
        }
      }

      return state;
    });

    // 下拉框样式
    const dropdownClasses = computed(() => {
      return {
        // 是否将弹层放置于 body 内
        [bem.is('transfer')]: props.transfer,
        [`${prefixCls}-multiple`]: props.multiple && props.transfer,
        // 开启 autoComplete
        ['ivue-auto-complete']: props.autoComplete,
        // 开启 autoComplete 没有数据
        ['ivue-auto-complete--notdata']:
          unref(selectOptions).length === 0 &&
          props.autoComplete &&
          !props.loading,
        // 开启 transfer 时，给浮层添加额外的 class 名称
        [props.transferClassName]: props.transferClassName,
      };
    });

    // methods

    // 点击外部
    const handleClickOutside = (event: Event) => {
      // 判断是否显示了菜单
      if (unref(visibleMenu)) {
        if (event.type === 'mousedown') {
          event.preventDefault();

          return;
        }

        // 是否将弹层放置于 body 内
        if (props.transfer) {
          const { $el } = unref(dropdown) as DropDownInstance;
          if ($el === event.target || $el.contains(event.target)) {
            return;
          }
        }

        // 取消焦点
        isFocused.value = false;

        // 不是自动完成组件
        if (!props.autoComplete) {
          event.stopPropagation();
        }

        // preventDefault
        event.preventDefault();

        // 点击后隐藏菜单
        hideMenu();
      }
      // 关闭
      else {
        // 取消焦点
        isFocused.value = false;
      }
    };

    // 头部输入框获取焦点
    const handleHeaderFocus = ({ type }: Event) => {
      if (unref(inputDisabled)) {
        return;
      }

      // 获取焦点
      isFocused.value = type === 'focus';
    };

    // 提取选项数据
    const handleOption = (
      option: OptionInstance,
      values: string[],
      isFocused: boolean
    ) => {
      // 如果选项节点没有子组件就直接返回选项节点
      // 是否获取到焦点
      option.data.isFocused = isFocused;

      return {
        option,
      };
    };

    // 点击菜单
    const handleToggleMenu = (event?: Event | null, force?: boolean) => {
      // 在Popover嵌套中
      if (unref(disableMenu) && event) {
        return false;
      }

      // 选择组件是否禁用
      if (unref(inputDisabled)) {
        return false;
      }

      // 设置菜单状态
      visibleMenu.value =
        typeof force !== 'undefined' ? force : !unref(visibleMenu);

      // 菜单收起
      if (!unref(visibleMenu)) {
        // 取消焦点
        if (props.filterable) {
          const input = proxy!.$el.querySelector('input[type="text"]');

          input.blur();
        }

        // 更新下拉框
        dropdown.value?.update();
      }
    };

    // 隐藏菜单
    const hideMenu = () => {
      handleToggleMenu(null, false);
    };

    // 选项菜单点击
    const handleOptionClick = (option: OptionData, status?: string) => {
      // 在Popover嵌套中
      if (popover.data) {
        disableMenu.value = true;
      }

      // 判断是否开启了多选
      if (props.multiple) {
        const selected = unref(values).find(
          ({ value }: any) => value === option.value
        );

        // 判断是搜索是否是一个方法
        if (unref(isSearchMethod)) {
          // 下一个搜索请求 || 搜索输入框输入数据
          lastSearchQuery.value = unref(lastSearchQuery) || unref(filterQuery);
        } else {
          // 下一个搜索请求
          lastSearchQuery.value = '';
        }

        // 当前是否有对应的选项 && 不是创建新列表
        if (selected) {
          values.value = unref(values).filter(
            ({ value }: any) => value !== option.value
          );
        }
        // 没有当前选项
        else {
          values.value = unref(values).concat(option);
        }

        // 多选项没有
        if (unref(values).length === 0) {
          // 重置焦点项
          focusIndex.value = -1;
        }

        // 鼠标点击选项元素后放回焦点
        isFocused.value = true;

        // 多选删除了
        if (status === 'delete-multiple') {
          setTimeout(() => {
            // 重置焦点项
            focusIndex.value = -1;
          });
        }
      }
      // 单选
      else {
        // 点击后隐藏菜单
        hideMenu();

        // 过滤输入框数据
        filterQuery.value = String(option.label).trim();

        // 最终渲染的数据
        values.value = [option];

        // 搜索请求
        lastSearchQuery.value = '';
      }

      // 是否支持搜索
      if (props.filterable) {
        const input = proxy!.$el.querySelector('input[type="text"]');

        // 不是自动输入
        if (!props.autoComplete) {
          // 输入框获取焦点
          nextTick(() => {
            input.focus();
          });
        }
      }

      // 选择项目时触发
      emit('on-select', option);

      // 更新下拉框
      dropdown.value?.update();

      // nextTick
      nextTick(() => {
        // 有展开菜单才设置焦点
        if (unref(visibleMenu)) {
          // 获取焦点项
          focusIndex.value = setFocusIndex(option);
        } else {
          focusIndex.value = -1;
        }
      });

      // 判断是否进行了过滤输入
      if (unref(filterQueryChange)) {
        // 等菜单动画执行完再清除
        setTimeout(() => {
          filterQueryChange.value = false;
        }, 300);
      }
      // 没有开启过滤
      else {
        // 等菜单动画执行完再清除
        nextTick(() => {
          filterQueryChange.value = false;
        });
      }
    };

    // 设置选项焦点位置
    const setFocusIndex = (option: OptionData) => {
      return unref(selectOptions).findIndex((item) => {
        // item是对象
        if (typeof option === 'object') {
          // 判断是否有key 使用key匹配选项
          return item.option.value === option.value;
        }
        // item是普通类型
        else {
          return item.option.value === option;
        }
      });
    };

    // 清楚单项选择数据
    const clearSingleSelect = () => {
      // 非多选清除数据
      if (!props.multiple) {
        // 清除上一次搜索输入
        lastSearchQuery.value = '';

        // 初始化最终渲染的数据
        values.value = [];
      }

      // API 点击清空按钮时触发
      emit('on-clear');

      // 隐藏菜单
      hideMenu();

      // 初始化数据
      if (props.clearable) {
        resetData();
      }
    };

    // 重置数据
    const resetData = () => {
      // 焦点项
      focusIndex.value = -1;
      // 最终渲染的数据
      values.value = [];
      // 鼠标悬浮
      hasMouseHover.value = false;

      // 等菜单动画消失后再清除
      // 搜索输入框输入数据
      filterQuery.value = '';
      // 是否开始输入框支持搜索
      filterQueryChange.value = false;
    };

    // 初始化值
    const getInitialValue = () => {
      let initialValue = Array.isArray(props.modelValue)
        ? props.modelValue
        : [props.modelValue];

      // 判断 值 === undefined 或者是 ''而且 参数不是无穷大
      if (
        typeof initialValue[0] === 'undefined' ||
        (String(initialValue[0]).trim() === '' &&
          !Number.isFinite(initialValue[0]))
      ) {
        initialValue = [];
      }

      // 开启搜索，没有多选
      if (unref(isSearchMethod) && !props.multiple && props.modelValue) {
        // 获取选项数据
        const optionData = getOptionData(props.modelValue as string | number);

        // 过滤输入框数据
        filterQuery.value = optionData
          ? optionData.label
          : String(props.modelValue);
      }

      return initialValue.filter((item: string | number) => {
        return Boolean(item) || item === 0;
      });
    };

    // 获取选项的值
    const getOptionData = (value: string | number) => {
      const option = unref(options).find((option: any) => {
        return option.value === value || option.getLabel === value;
      });

      // 没有选项数据
      if (!option) {
        return null;
      }

      // 不是 autoComplete
      if (!props.autoComplete) {
        // 有展开菜单 -> 获取焦点项
        if (unref(visibleMenu)) {
          focusIndex.value = setFocusIndex(option as OptionData);
        }
      }

      return {
        value: option.value,
        label: option.getLabel,
        disabled: option.isDisabled,
      };
    };

    // 过滤输入框输入
    const handleFilterQueryChange = (query: string) => {
      // 是否显示下拉菜单
      if (query.length > 0 && query !== unref(filterQuery)) {
        if (props.autoComplete) {
          // 输入框是否获取焦点
          const isInputFocused =
            document.hasFocus &&
            document.hasFocus() &&
            document.activeElement === proxy!.$el.querySelector('input');

          visibleMenu.value = isInputFocused;
        } else {
          visibleMenu.value = true;
        }
      }

      // 输入框需要过滤的数据
      filterQuery.value = query;

      // 输入框过滤输入开始
      filterQueryChange.value = true;
    };

    // 输入框获取焦点
    const handleInputFocus = () => {
      isFocused.value = true;
    };

    // 输入框失去焦点
    const handleInputBlur = () => {
      isFocused.value = false;
    };

    // 过滤选项组件
    const validateOption = (options: OptionInstance) => {
      // value
      const value = options.value;
      // label
      const label = options.label || options.value;
      // elm
      const elm = options.$el || '';

      // 文本内容 将数组元素计算为一个值（从左到右）
      const textContent = elm.textContent;

      // 把数据转换成字符串
      const stringValues = props.filterByLabel
        ? [label].toString()
        : [value, label, textContent].toString();

      // 把输入框数据转换成小写去除前后空格
      const _filterQuery = unref(filterQuery).toLowerCase().trim();

      // 是否开启搜索 && 没有多选 && 没有输入 && 没有上一个熟人
      if (
        props.filterable &&
        !props.multiple &&
        _filterQuery === '' &&
        !unref(lastSearchQuery)
      ) {
        return false;
      }

      // 判断 stringValues 数组中是否包含 filterQuery 中的值 includes()
      return stringValues.toLowerCase().includes(_filterQuery);
    };

    // 设置滚动条滚动
    const focusScroll = (index: number) => {
      if (index < 0 || props.autoComplete) {
        return;
      }

      if (unref(options)[index]) {
        // update scroll
        const _options = unref(options)[index];

        // dropdown
        const _dropdown = dropdown.value?.$el;
        // 底部距离
        const bottomOverflowDistance =
          _options.$el.getBoundingClientRect().bottom -
          _dropdown.getBoundingClientRect().bottom;

        // 顶部距离
        const topOverflowDistance =
          _options.$el.getBoundingClientRect().top -
          _dropdown.getBoundingClientRect().top;

        // 滚动到底部
        if (bottomOverflowDistance > 0) {
          _dropdown.scrollTop += bottomOverflowDistance;
        }

        // 滚动到顶部
        if (topOverflowDistance < 0) {
          _dropdown.scrollTop += topOverflowDistance;
        }
      }
    };

    // 选项销毁
    const handleOptionDestroy = (index: number) => {
      if (index > -1) {
        options.value = options.value.splice(index, 1);
      }
    };

    // 按键
    const handleKeyDown = (event: any) => {
      const key = event.key || event.code;
      const keyCode = event.keyCode || event.which;

      // Backspace
      if (key === 'Backspace' || keyCode === 8) {
        return; // so we don't call preventDefault
      }

      // 展开
      if (unref(visibleMenu)) {
        // Tab
        if (key === 'Tab') {
          hideMenu();
        }

        // Esc slide-up
        if (key === 'Escape') {
          hideMenu();
        }

        // next
        if (key === 'ArrowUp') {
          navigateOptions(-1);
        }

        // prev
        if (key === 'ArrowDown') {
          navigateOptions(1);
        }

        // enter
        if (key === 'Enter') {
          if (unref(focusIndex) === -1) {
            return hideMenu();
          }

          const optionItem = unref(selectOptions)[unref(focusIndex)];

          if (optionItem) {
            // 获取选项数据
            const option = getOptionData(optionItem.option.value);

            handleOptionClick(option as any);
          } else {
            hideMenu();
          }
        }
      } else {
        const keysCanOpenMenu = ['ArrowDown', 'ArrowUp'];

        // 如果焦点在当前选择框的话按 next or prev 可以打开选项菜单
        if (keysCanOpenMenu.includes(event.key)) {
          handleToggleMenu(null, true);
        }
      }
    };

    // 鼠标进入
    const handleMouseenter = () => {
      hasMouseHover.value = true;
    };

    // 鼠标离开
    const handleMouseleave = () => {
      hasMouseHover.value = false;
    };

    // 下一个选项
    const navigateOptions = (direction: number) => {
      const optionLength = unref(selectOptions).length - 1;

      let index = unref(focusIndex) + direction;

      if (index < 0) {
        index = optionLength;
      }

      // 重置下标
      if (index > optionLength) {
        index = 0;
      }

      // 寻找下标选项
      if (direction > 0) {
        let activeOption = -1;
        for (let i = 0; i < unref(selectOptions).length; i++) {
          // 判断选项是否可选
          const isActiveOption = !unref(selectOptions)[i].option.disabled;

          // 设置激活的选项
          if (isActiveOption) {
            activeOption = i;
          }

          if (activeOption >= index) {
            break;
          }
        }

        index = activeOption;
      } else {
        let activeOption = unref(selectOptions).length;

        for (let i = optionLength; i >= 0; i--) {
          // 判断选项是否可选
          const isActiveOption = !unref(selectOptions)[i].option.disabled;

          // 设置激活的选项
          if (isActiveOption) {
            activeOption = i;
          }

          if (activeOption <= index) {
            break;
          }
        }

        index = activeOption;
      }

      // 设置焦点选项
      focusIndex.value = index;
    };

    // 检查值是否相等
    const checkValuesNotEqual = (
      value: ModelValue,
      publicValue: SelectValue,
      values: OptionData[]
    ) => {
      const strValue = JSON.stringify(value);
      const strPublic = JSON.stringify(publicValue);
      const strValues = JSON.stringify(
        values.map((item) => {
          return item.value;
        })
      );

      return (
        strValue !== strPublic ||
        strValue !== strValues ||
        strValues !== strPublic
      );
    };

    // 检查当前值更新状态
    const checkUpdateStatus = () => {
      if (getInitialValue().length > 0 && unref(selectOptions).length === 0) {
        hasExpectedValue.value = true;
      }
    };

    // 创建新列表
    const handleCreateItem = (event: Event) => {
      if (
        props.allowCreate &&
        unref(filterQuery) !== '' &&
        unref(showCreateItem)
      ) {
        // 创建新列表点击确认阻止上层 key up Enter 事件触发
        event && event.stopPropagation();

        const _filterQuery = unref(filterQuery);

        // 新建条目时触发
        emit('on-create', _filterQuery);

        // 清除输入
        filterQuery.value = '';

        const option = {
          value: _filterQuery,
          label: _filterQuery,
          disabled: false,
        };

        // 多选
        if (props.multiple) {
          handleOptionClick(option, 'create-item');
        } else {
          // 单选时如果不在 nextTick 里执行，无法赋值
          nextTick(() => {
            handleOptionClick(option);
          });
        }
      }
    };

    // 设置过滤输入框输入
    const setQuery = (query: string) => {
      // 过滤输入框输入
      filterQueryAutoComplete.value = query;

      // 重置焦点项
      focusIndex.value = -1;

      if (query) {
        // 过滤输入框输入
        handleFilterQueryChange(query);

        return;
      }

      // 输入框未空
      if (query === '' && props.searchMethod) {
        props.searchMethod(query);
      }

      // 没有输入值
      if (query === null) {
        // 过滤输入框输入
        handleFilterQueryChange('');

        // 最终渲染的数据
        values.value = [];

        // 清空搜索关键词后，重新搜索相同的关键词没有触发远程搜索
        lastSearchQuery.value = '';
      }
    };

    // 获取焦点
    const focus = () => {
      if (props.filterable) {
        (selectHead.value?.$refs.input as HTMLElement).focus();

        // 展开下拉框
        handleToggleMenu(null, true);
      }
    };

    // 初始化输入
    options.value = [];

    // onMounted
    onMounted(() => {
      // 设置初始值
      if (!unref(isSearchMethod) && unref(selectOptions).length > 0) {
        values.value = getInitialValue()
          .map((value: string | number) => {
            if (typeof value === 'undefined' && !value) {
              return null;
            }
            return getOptionData(value);
          })
          .filter(Boolean) as OptionData[];
      }

      // 有搜索方法，设置默认标签
      if (unref(isSearchMethod) && props.defaultLabel) {
        // 单选
        if (!props.multiple) {
          // 外部输入框输入数据
          filterQuery.value = props.defaultLabel as string;
          // 当前有 value 值
          hasExpectedValue.value = true;
        }
        // 多选
        else if (
          props.multiple &&
          props.defaultLabel instanceof Array &&
          (props.modelValue as (string | number)[]).length ===
            props.defaultLabel.length
        ) {
          const _values = (props.modelValue as (string | number)[]).map(
            (item, index) => {
              return {
                value: item,
                label: (props.defaultLabel as string[])[index],
              };
            }
          );

          // 远程搜索时，显示默认 label, 配合 default-label 使用
          emit('on-set-default-options', _values);

          // nextTick
          nextTick(() => {
            values.value = _values;
          });
        }
      }
    });

    // provide
    provide(
      SelectContextKey,
      reactive({
        // props
        props: toRefs(props) as any,
        selectWrapper,
        reference,
        dropVisible,
        options: unref(options),
        values: unref(values),
        focusIndex: unref(focusIndex),
        handleOptionClick,
        selectEmitter: unref(selectEmitter),
        onOptionDestroy: handleOptionDestroy,
      })
    );

    // watch

    // 监听设置的值
    watch(
      () => props.modelValue,
      (value) => {
        // 检查当前值更新状态
        checkUpdateStatus();

        if (value === '') {
          values.value = [];

          filterQueryChange.value = true;
        }
        // 当前值是否相等
        else if (
          checkValuesNotEqual(
            value as ModelValue,
            unref(selectValue) as SelectValue,
            unref(values)
          )
        ) {
          // 修改适配
          nextTick(() => {
            if (unref(options).length > 0) {
              const _values = getInitialValue()
                .map((value) => {
                  if (typeof value === 'undefined' && !value) {
                    return null;
                  }

                  return getOptionData(value);
                })
                .filter(Boolean) as OptionData[];

              values.value = _values;
            }
          });
        }

        // 在Popover嵌套中
        if (popover.data) {
          disableMenu.value = true;
          popover.data.disableCloseUnderTransfer = true;

          setTimeout(() => {
            popover.handleCancel && popover.handleCancel();
          }, 300);

          setTimeout(() => {
            disableMenu.value = false;
          }, 1000);
        }

        // 输入时是否触发表单的校验
        if (props.validateEvent) {
          formItem?.validate?.('change').catch((err) => debugWarn(err));
        }
      }
    );

    // 监听最终渲染的数据的变化
    watch(
      () => unref(values),
      (newValue, oldValue) => {
        const _newValue = JSON.stringify(newValue);
        const _oldValue = JSON.stringify(oldValue);

        // 设置v-model的值
        const vModelValue =
          props.labelAndValue && selectValue.value
            ? props.multiple
              ? (selectValue.value as OptionData[]).map(({ value }) => value)
              : (selectValue.value as OptionData).value
            : selectValue.value;

        // 输入框值
        const emitInput =
          _newValue !== _oldValue && vModelValue !== props.modelValue;

        if (emitInput) {
          // 更新 v-model
          emit('update:modelValue', vModelValue as ModelValue);

          // 选中的 Option 变化时触发
          emit('on-change', selectValue.value as ModelValue);
        }
      }
    );

    // 监听菜单显示隐藏
    watch(
      () => unref(visibleMenu),
      (state) => {
        // API 下拉框展开或收起时触发
        emit('on-menu-open', state);

        // 显示时
        if (state) {
          if (props.filterable) {
            // 触发选项组显示
            unref(selectEmitter).emit('ivueOptionGroupQueryChange');
          }
        }

        // 恢复单选查询值
        const [option] = unref(values);

        // 清除输入
        if (
          option &&
          !unref(isFocused) &&
          props.filterable &&
          props.multiple &&
          props.multipleFilterableClear
        ) {
          // 外部输入框输入数据
          filterQuery.value = '';

          // 等菜单动画执行完再清除
          nextTick(() => {
            filterQueryChange.value = false;
          });
        }

        // 在Popover嵌套中
        if (popover.data) {
          popover.data.closeDelay = state ? 300 : 0;
        }

        // 清除焦点项
        if (!state && unref(values).length == 0) {
          focusIndex.value = -1;
        }
      }
    );

    // 焦点项
    watch(
      () => unref(focusIndex),
      (index) => {
        focusScroll(index);
      }
    );

    // 监听过滤输入框输入数据
    watch(
      () => unref(filterQuery),
      (value) => {
        // 没有输入内容取消焦点
        if (value === '') {
          focusIndex.value = -1;
        }

        // API 搜索词改变时触发
        emit('on-filter-query-change', value);

        // 是否是有效查询
        const hasValidQuery =
          value !== '' &&
          (value !== unref(lastSearchQuery) || !unref(lastSearchQuery));

        // 是否有搜索方法
        const shouldCallRemoteMethod =
          // 是否是有效查询
          !!props.searchMethod && hasValidQuery;

        // 是否有搜索方法
        if (shouldCallRemoteMethod) {
          focusIndex.value = -1;

          props.searchMethod(value);
        }

        // 开启了远程搜索 && 有上一次输入 && 当前输入为空
        if (unref(lastSearchQuery) && value === '' && props.searchMethod) {
          focusIndex.value = -1;

          props.searchMethod(value, 'reset');
        }

        // 正常搜索
        if (value !== '' && isSearchMethod.value) {
          lastSearchQuery.value = value;
        }

        // 输入为空隐藏下拉框 非多选
        if (value === '' && !props.multiple && !props.searchMethod) {
          // 没有获取焦点隐藏下拉框
          if (!unref(isFocused)) {
            visibleMenu.value = false;
          }

          // 等菜单动画执行完再清除
          nextTick(() => {
            filterQueryChange.value = false;
          });
        }

        // 触发选项组显示;
        unref(selectEmitter).emit('ivueOptionGroupQueryChange');
      }
    );

    // 监听焦点
    watch(
      () => unref(isFocused),
      (focused) => {
        // 输入框获取焦点，移除焦点
        const el = props.filterable
          ? proxy!.$el.querySelector('input[type="text"]')
          : proxy!.$el;

        el[focused ? 'focus' : 'blur']();

        // 恢复单选查询值
        const [option] = unref(values);

        // 判断是否有点击删除按钮在进行还原输入框内容
        if (
          option &&
          props.filterable &&
          !props.multiple &&
          !focused &&
          props.restoreInputOption
        ) {
          const label = String(option.label || option.value).trim();

          if (label && unref(filterQuery) !== label) {
            // 搜索输入框输入数据
            filterQuery.value = label;

            // nextTick
            nextTick(() => {
              // 是否开始输入框支持搜索
              filterQueryChange.value = false;

              // 获取焦点项
              focusIndex.value = setFocusIndex(option);
            });
          }
        }

        // 没有开启还原输入框内容
        if (
          option &&
          props.filterable &&
          !props.multiple &&
          !focused &&
          !props.restoreInputOption
        ) {
          // 更新 v-model
          emit('update:modelValue', unref(filterQuery));
        }
      }
    );

    // 监听选项变化
    watch(
      () => selectOptions.value,
      (value) => {
        // 初始化值
        if (unref(hasExpectedValue) && value.length > 0) {
          values.value = getInitialValue()
            .map((value) => {
              if (typeof value === 'undefined' && !value) {
                return null;
              }

              return getOptionData(value);
            })
            .filter(Boolean) as OptionData[];

          hasExpectedValue.value = false;
        }

        // 更新下拉框
        dropdown.value && dropdown.value.update();
      }
    );

    // 监听下拉框
    watch(
      () => dropVisible.value,
      (value) => {
        if (value) {
          // 更新下拉框
          dropdown.value?.update();
        } else {
          // 销毁下拉框
          dropdown.value?.destroy();
        }
      }
    );

    // 在Popover嵌套中
    if (popover.data) {
      watch(
        () => popover.visible,
        (value) => {
          if (value) {
            disableMenu.value = false;
          }
        }
      );
    }

    return {
      prefixCls,
      bem,

      // dom
      selectWrapper,
      reference,
      dropdown,
      selectHead,

      // inject
      popover,

      // data
      values,
      filterQuery,

      inputId,
      inputDisabled,

      // computed
      classes,
      selectionClasses,
      selectTabindex,
      currentSelectValue,
      isSearchMethod,
      showNotFindText,
      dropVisible,
      canClearable,
      showCreateItem,
      dropdownClasses,

      // methods
      handleClickOutside,
      handleHeaderFocus,
      handleOption,
      handleToggleMenu,
      handleFilterQueryChange,
      handleInputFocus,
      handleInputBlur,
      handleKeyDown,
      handleMouseenter,
      handleMouseleave,
      handleCreateItem,
      setFocusIndex,
      setQuery,
      clearSingleSelect,
      focus,
      resetData,
    };
  },
  components: {
    SelectHead,
    DropDown,
    IvueOption,
    IvueIcon,
  },
});
</script>
