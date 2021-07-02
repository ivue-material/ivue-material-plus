import {
    reactive,
    getCurrentInstance,
    computed,
    nextTick
} from 'vue';

const prefixCls = 'ivue-select';

// data
export function useSelectStates(props) {

    const { proxy }: any = getCurrentInstance();

    // data
    const data: any = reactive<{
    visibleMenu: boolean;
    capture: boolean;
    isFocused: boolean;
    values: Array<any>;
    options: Array<any>;
    cachedOptions: Array<any>;
    focusIndex: number;
    filterQueryChange: boolean;
    filterQuery: string;
    hasMouseHover: boolean;
    lastSearchQuery: string;
  }>({
      // 是否显示菜单
      visibleMenu: false,
      // 是否开启 capture 模式，也可通过全局配置
      capture: !proxy.$IVUE ? props.capture : proxy.$IVUE.capture,
      // 判断是否有焦点
      isFocused: false,
      // 最终渲染的数据
      values: [],
      // 子选项 dom
      options: [],
      //  缓存子选项dom
      cachedOptions: [],
      // 焦点项
      focusIndex: -1,
      // 是否开始输入框支持搜索
      filterQueryChange: false,
      // 搜索输入框输入数据
      filterQuery: '',
      // 鼠标悬浮
      hasMouseHover: false,
      // 下一个搜索请求
      lastSearchQuery: '',
  });

    return data;
}

// 内容
export const useSelect = (props, data, ctx) => {

    const {
        setFocusIndex,
        handleClickOutside,
        handleHeaderFocus,
        handleToggleMenu,
        handleOptionClick,
        handleOption
    } = useMethods(props, data);

    const _useComputed = useComputed(props, data, { handleOption });

    return {
        ..._useComputed,

        // methods
        setFocusIndex,
        handleClickOutside,
        handleHeaderFocus,
        handleToggleMenu,
        handleOptionClick,
    };
};


// computed
const useComputed = (props: any, data: any, { handleOption }) => {

    // 外部样式
    const classes = computed(() => {
        return [
            `${prefixCls}`,
            {
                // 默认
                [`${prefixCls}-default`]: !props.multiple,
                // 是否支持多选
                [`${prefixCls}-multiple`]: props.multiple,
                // 是否禁用
                [`${prefixCls}-disabled`]: props.disabled,
                // 是否显示菜单
                [`${prefixCls}-visible`]: data.visibleMenu,
            },
        ];
    });

    // 选择框样式
    const selectionClasses = computed(() => {
        return [
            `${prefixCls}-selection-default`,
            {
                [`${prefixCls}-selection`]: !props.autocomplete,
                [`${prefixCls}-selection-focused`]: data.isFocused,
            },
        ];
    });

    // tab 键顺序
    const selectTabindex = computed(() => {
    // 是否禁用选择组件 | 是否支持搜索
        return props.disabled || props.filterable ? -1 : 0;
    });



    // 当前选择的值
    const currentSelectValue = computed(() => {
        const _value = data.values;

        // 判断是否有开启返回label和value
        if (props.labelAndValue) {
            return props.multiple ? _value : _value[0];
        } else {
            return props.multiple
                ? _value.map((option: { value: any }) => option.value)
                : (_value[0] || {}).value;
        }
    });


    // 显示没有数据时的文本
    const showNotFindText = computed(() => {
    // 是否禁用选择组件 | 是否支持搜索
        return (
            data.selectOptions && data.selectOptions.length === 0 && !isSearchMethod.value
        );
    });

    // 判断是搜索是否是一个方法
    const isSearchMethod = computed(() => {
        return typeof props.searchMethod === 'function';
    });

    // 显示下拉菜单
    const dropVisible = computed(() => {
        let status = true;

        // 没有选项
        const noSelectOptions = data.selectOptions && data.selectOptions.length === 0;

        if (
            data.filterQuery === '' && noSelectOptions && isSearchMethod.value
        ) {
            status = false;
        }

        if (props.autocomplete && noSelectOptions) {
            status = false;
        }

        return data.visibleMenu && status;
    });


    // 是否可以显示重置选择按钮
    const canClearable = computed(() => {
    // 多选模式下无效
        return (
            data.hasMouseHover && props.clearable && !props.multiple && !props.disabled
        );
    });


    // 获取菜单选择列表
    const selectOptions = computed(() => {
    // 获取选项的列表
        const selectOptions = [];

        // 选项的数据
        const slotOptions = data.options;

        // 选项计数器，计算有多少个选项
        let optionCounter = -1;

        // 当前焦点项
        const currentIndex = data.focusIndex;

        // 获取选择选项的value
        const selectedValues = data.values
            .filter(Boolean)
            .map(({ value }) => value);

        // // 判断是否有自动输入
        if (props.autoComplete) {
            console.log('autoComplete');
        }

        // for (const option of slotOptions) {
        //     // 获取选项组件里的数据
        //     const componentOptions = option.$options;
        //     // 判断是否使用了选项组
        //     if (componentOptions.name.match(optionGroupRegexp)) {
        //     }
        //     // 普通选项
        //     else {
        //         // 如果没有 filterQueryChange ，则忽略选项
        //         if (data.filterQueryChange) {
        //         }
        //         // 选项计数器
        //         optionCounter = optionCounter + 1;
        //     }

        //     selectOptions.push(
        //         handleOption(
        //             option,
        //             selectedValues,
        //             optionCounter === currentIndex
        //         )
        //     );
        // }

        data.options.map((item) => {
            // 选项计数器
            optionCounter = optionCounter + 1;

            const option  = handleOption(item, selectedValues, optionCounter === currentIndex);

            item.a = option;

            return item;
        });

        selectOptions.push('?1');

        console.log(data.options);
        console.log(data.options.length);

        // 这是一个组件数组 [components]
        return data.options;
    });



    return {
        classes,
        selectionClasses,
        selectTabindex,
        currentSelectValue,
        showNotFindText,
        isSearchMethod,
        dropVisible,
        canClearable,
        selectOptions
    };
};

// methods
const useMethods = (props, data) => {
    // 点击外部
    const handleClickOutside = (event) => {

        // 判断是否显示了菜单
        if (data.visibleMenu) {
            if (event.type === 'mousedown') {
                event.preventDefault();

                return;
            }


            // 点击后隐藏菜单
            //  hideMenu();

            // 取消焦点
            data.isFocused = false;
        }
        // 关闭
        else {
            // 取消焦点
            data.isFocused = false;
        }

    };

    // 头部输入框获取焦点
    const handleHeaderFocus = ({ type }) => {
        if (props.disabled) {
            return;
        }

        data.isFocused = type === 'focus';
    };



    // 提取选项数据
    const handleOption = (option, values, isFocused) => {
    // 如果选项节点没有子组件就直接返回选项节点

        // 渲染的 value
        const optionValue = option.value;
        // 渲染的 label
        const optionLabel = option.label;
        // 是否禁用选项
        const disabled = option.disabled;

        // 当前选择的选项
        const isSelect = values.includes(optionValue) || values.includes(optionLabel);

        const propsData = {
            selected: isSelect,
            isFocused: isFocused,
            disabled:
        typeof disabled === 'undefined'
            ? false
            : disabled !== false,
        };

        return {
            option,
            ...propsData,
        };
    };


    // 点击菜单
    const handleToggleMenu = (event, force) => {
    // 选择组件是否禁用
        if (props.disabled) {
            return false;
        }

        // 设置菜单状态
        data.visibleMenu =
      typeof force !== 'undefined' ? force : !data.visibleMenu;
    };


    // 隐藏菜单
    const hideMenu = () => {
        handleToggleMenu(null, false);
    };

    // 选项菜单点击
    const handleOptionClick = (option) => {
        console.log(option);
        // 判断是否开启了多选
        if (props.multiple) {
        }
        // 单选
        else {
            // 过滤输入框数据
            data.filterQuery = String(option.label).trim();
            // 最终渲染的数据
            data.values = [option];

            // 点击后隐藏菜单
            hideMenu();

            // 搜索请求
            data.lastSearchQuery = '';
        }

        // 获取焦点项
        data.focusIndex = setFocusIndex(option);
        console.log(data.focusIndex);

        // 判断是否进行了过滤输入
        if (data.filterQueryChange) {
            // 等菜单动画执行完再清除
            setTimeout(() => {
                data.filterQueryChange = false;
            }, 300);
        }
        // 没有开启过滤
        else {
            // 等菜单动画执行完再清除
            nextTick(() => {
                data.filterQueryChange = false;
            });
        }
    };

    // 设置选项焦点位置
    const setFocusIndex = (option) => {
        return data.selectOptions.findIndex((item) => {
            if (typeof option === 'object') {
                // 判断是否有key 使用key匹配选项
                return item.value === option.value;
            } else {
                return item.value === option;
            }
        });
    };


    return {
        handleClickOutside,
        handleHeaderFocus,
        handleToggleMenu,
        setFocusIndex,
        handleOptionClick,
        handleOption
    };
};
