<script lang="ts">
import { defineComponent, reactive, computed, watch, h } from 'vue';

import { colorable } from '../../utils/mixins/colorable';
import CreateNativeLocaleFormatter from '../../utils/create-native-locale-formatter';
import Pad from '../../utils/pad';
import isDateAllowed from '../../utils/is-date-allowed';

import IvuePicker from './ivue-picker.vue';
import IvueDatePickerTitle from './ivue-date-picker-title.vue';
import IvueDatePickerHeader from './ivue-date-picker-header.vue';
import IvueDatePickerDate from './ivue-date-picker-date.vue';
import IvueDatePickerMonth from './ivue-date-picker-month.vue';
import IvueDatePickerYears from './ivue-date-picker-years.vue';

// type
import { Props, Data } from './types/date-picker';

export default defineComponent({
  name: 'ivue-date-picker',
  emits: ['update:modelValue', 'update:pickerDate', 'on-change'],
  props: {
    /**
     * 日历方向
     *
     * @type {Boolean}
     */
    landscape: {
      type: Boolean,
    },
    /**
     * 头部颜色
     *
     * @type {String}
     */
    headerColor: {
      type: String,
    },
    /**
     * 选择框宽度
     *
     * @type {Boolean}
     */
    width: {
      type: [Number, String],
      default: 290,
      validator: (value: number | string) => parseInt(`${value}`, 10) > 0,
    },
    /**
     * 强制100％宽度
     *
     * @type {Boolean}
     */
    fullWidth: {
      type: Boolean,
    },
    /**
     * 隐藏日历头部
     *
     * @type {Boolean}
     */
    noTitle: {
      type: Boolean,
    },
    /**
     * 日期时间
     *
     * @type {Array, String}
     */
    modelValue: {
      type: [Array, String],
    },
    /**
     * Function formatting the year in table header and pickup title
     *
     * @type {Function}
     */
    titleYearFormat: {
      type: Function,
    },
    /**
     * Function formatting currently selected date in the picker title
     *
     * @type {Function}
     */
    titleDateFormat: {
      type: Function,
    },
    /**
     * 在日/月表头中格式化 tableDate 的函数
     *
     * @type {Function}
     */
    headerDateFormat: {
      type: Function,
    },
    /**
     * 在日期选择器表中格式化日期的函数
     *
     * @type {Function}
     */
    dayFormat: {
      type: Function,
    },
    /**
     * 函数格式化月份表中的月份
     *
     * @type {Function}
     */
    monthFormat: {
      type: Function,
    },
    /**
     * 语言
     *
     * @type {String}
     */
    locale: {
      type: String,
      default: 'en-us',
    },
    /**
     * 是否支持日期多选
     *
     * @type {Boolean}
     */
    multiple: {
      type: Boolean,
    },
    /**
     * 日历显示的类型 默认显示为日期
     *
     * @type {String}
     */
    type: {
      type: String,
      validator: (type: string) => ['date', 'month'].includes(type),
      default: 'date',
    },
    /**
     * 为年份标题添加图标
     *
     * @type {String}
     */
    yearIcon: {
      type: String,
    },
    /**
     * 是否只读
     *
     * @type {Boolean}
     */
    readonly: {
      type: Boolean,
    },
    /**
     * 用于监听月份或者年份的变化
     *
     * @type {String}
     */
    pickerDate: {
      type: String,
    },
    /**
     * 最小年份或月份
     *
     * @type {String}
     */
    min: {
      type: String,
    },
    /**
     * 最大年份或月份
     *
     * @type {String}
     */
    max: {
      type: String,
    },
    /**
     * 头部按钮右图标
     *
     * @type {String}
     */
    nextIcon: {
      type: String,
      default: 'chevron_right',
    },
    /**
     * 头部按钮左图标
     *
     * @type {String}
     */
    prevIcon: {
      type: String,
      default: 'chevron_left',
    },
    /**
     * 一周的第一天
     *
     * @type {String,Number}
     */
    firstDayOfWeek: {
      type: [String, Number],
      default: 0,
    },
    /**
     * 设置允许选择日期函数
     *
     * @type {Function}
     */
    allowedDates: {
      type: Function,
    },
    /**
     * 是否显示当前日期
     *
     * @type {Boolean}
     */
    showCurrent: {
      type: Boolean,
      default: false,
    },
    /**
     * 便签用于标记需要注意的日期
     *
     * @type {Array,Function}
     */
    note: {
      type: [Array, Function],
      default: null,
    },
    /**
     * 便签用于标记需要注意的日期的颜色
     *
     * @type {String, Function, Object}
     */
    noteColor: {
      type: [String, Function, Object],
      default: 'warning',
    },
    /**
     * 点击月份或者年份时日期月份或年份是否跟随改变
     *
     * @type {Boolean}
     */
    reactive: {
      type: Boolean,
    },
    /**
     * 颜色
     *
     * @type {String}
     */
    color: {
      type: String,
      default: '',
    },
  },
  setup(props: Props, { emit }) {
    // mixins
    const { setBackgroundColor, setTextColor } = colorable(props);

    // data
    const data = reactive<Data>({
      // 日期
      inputDay: null,
      // 输入年份
      inputYear: null,
      // 输入月份
      inputMonth: null,
      // 当前时间
      now: new Date(),
      // 当前激活的type
      activeType: '',
      // tableDate is a string in 'YYYY' / 'YYYY-M' format (leading zero for month is not required)
      tableDate: null,
    });

    // computed

    // 计算 value
    const computedValue = computed(() => {
      return props.multiple
        ? props.modelValue[props.modelValue.length - 1]
        : props.modelValue;
    });

    // 默认日期格式
    const defaultTitleDateFormatter = computed(() => {
      // 标题格式
      const titleFormats = {
        year: { year: 'numeric', timeZone: 'UTC' },
        month: { month: 'long', timeZone: 'UTC' },
        date: {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        },
      };

      // 格式化
      const titleDateFormatter = CreateNativeLocaleFormatter(
        props.locale,
        titleFormats[props.type],
        {
          start: 0,
          length: { date: 10, month: 7, year: 4 }[props.type],
        }
      );

      // 日期换行
      const landscapeFormatter = (date: string) =>
        titleDateFormatter(date)
          .replace(
            /([^\d\s])([\d])/g,
            (match, nonDigit, digit) => `${nonDigit} ${digit}`
          )
          .replace(', ', ',<br>');

      return props.landscape ? landscapeFormatter : titleDateFormatter;
    });

    // 默认多选日期格式
    const defaultTitleMultipleDateFormatter = computed(() => {
      if (props.modelValue.length < 2) {
        return (dates: string[]) =>
          dates.length
            ? defaultTitleDateFormatter.value(dates[0])
            : '0 selected';
      }

      return (dates: string[]) => `${dates.length} selected`;
    });

    // 格式化日期
    const formatters = computed(() => {
      return {
        // 标题年份
        titleYear:
          props.titleYearFormat ||
          CreateNativeLocaleFormatter(
            props.locale,
            { year: 'numeric', timeZone: 'UTC' },
            { start: 0, length: 4 }
          ),
        // 标题日期
        titleDate:
          props.titleDateFormat ||
          (props.multiple
            ? defaultTitleMultipleDateFormatter.value
            : defaultTitleDateFormatter.value),
      };
    });

    // 年份
    const tableYear = computed(() => {
      return Number((props.pickerDate || data.tableDate).split('-')[0]) * 1;
    });

    // 月份
    const tableMonth = computed(() => {
      return Number((props.pickerDate || data.tableDate).split('-')[1]) - 1;
    });

    // 最大月份
    const maxMonth = computed(() => {
      return props.max ? sanitizeDateString(props.max, 'month') : null;
    });

    // 最小月份
    const minMonth = computed(() => {
      return props.min ? sanitizeDateString(props.min, 'month') : null;
    });

    // 最小年份
    const minYear = computed(() => {
      return props.min ? sanitizeDateString(props.min, 'year') : null;
    });

    // 最大年份
    const maxYear = computed(() => {
      return props.max ? sanitizeDateString(props.max, 'year') : null;
    });

    // 当前日期
    const current = computed(() => {
      if (props.showCurrent) {
        return sanitizeDateString(
          `${data.now.getFullYear()}-${
            data.now.getMonth() + 1
          }-${data.now.getDate()}`,
          props.type
        );
      } else {
        return null;
      }
    });

    // 选择的日期
    const inputDate = computed(() => {
      return props.type === 'date'
        ? `${data.inputYear}-${Pad(Number(data.inputMonth) + 1)}-${Pad(
            data.inputDay
          )}`
        : `${data.inputYear}-${Pad(Number(data.inputMonth) + 1)}`;
    });

    // 选择的日期
    const selectedMonths = computed(() => {
      if (
        !props.modelValue ||
        !props.modelValue.length ||
        props.type === 'month'
      ) {
        return props.modelValue;
      } else if (props.multiple) {
        return props.modelValue.map((val: string) => val.substr(0, 7));
      } else {
        return props.modelValue.substr(0, 7);
      }
    });

    // methods

    // 初始化
    const initData = () => {
      data.activeType = props.type.toUpperCase();

      // 检查设置为多选后value值是否正确
      checkMultipleProp();

      // 设置年，月，日值
      setInputDate();

      data.tableDate = (() => {
        if (props.pickerDate) {
          return props.pickerDate;
        }

        const date =
          (props.multiple
            ? props.modelValue[props.modelValue.length - 1]
            : props.modelValue) ||
          `${data.now.getFullYear()}-${data.now.getMonth() + 1}`;

        const type = props.type === 'date' ? 'month' : 'year';

        return sanitizeDateString(date, type);
      })();

      if (props.pickerDate !== data.tableDate) {
        emit('update:pickerDate', data.tableDate);
      }
    };

    // 点击日期事件
    const emitInput = (newInput: string | string[]) => {
      const output = props.multiple
        ? props.modelValue.indexOf(newInput) === -1
          ? props.modelValue.concat([newInput])
          : props.modelValue.filter((x) => x !== newInput)
        : newInput;

      emit('update:modelValue', output);

      // 多选
      if (props.multiple) {
        emit('on-change', output);
      }
      // 单选
      else {
        emit('on-change', newInput);
      }
    };

    // Adds leading zero to month/day if necessary, returns 'YYYY' if type = 'year',
    // 'YYYY-MM' if 'month' and 'YYYY-MM-DD' if 'date'
    const sanitizeDateString = (dateString: string, type: string) => {
      const [year, month = 1, date = 1] = dateString.split('-');

      return `${year}-${Pad(month)}-${Pad(date)}`.substr(
        0,
        { date: 10, month: 7, year: 4 }[type]
      );
    };

    // 检查设置为多选后value值是否正确
    const checkMultipleProp = () => {
      if (props.modelValue == null) {
        return;
      }

      const valueType = props.modelValue.constructor.name;
      const expected = props.multiple ? 'Array' : 'String';

      if (valueType !== expected) {
        // eslint-disable-next-line no-console
        console.warn(
          `Value must be ${
            props.multiple ? 'an' : 'a'
          } ${expected}, got ${valueType}`,
          this
        );
      }
    };

    // 设置年，月，日值
    const setInputDate = () => {
      if (computedValue.value) {
        const _computedValue = computedValue.value.split('-');

        // 年
        data.inputYear = parseInt(_computedValue[0], 10);
        // 月
        data.inputMonth = parseInt(_computedValue[1], 10) - 1;

        // 日
        if (props.type === 'date') {
          data.inputDay = parseInt(_computedValue[2], 10);
        }
      } else {
        // 年
        data.inputYear = data.inputYear || data.now.getFullYear();
        // 月
        data.inputMonth =
          data.inputMonth == null ? data.inputMonth : data.now.getMonth();

        // 日
        data.inputDay = data.inputDay || data.now.getDate();
      }
    };

    // 日期点击事件
    const dateClick = (value: string) => {
      data.inputYear = parseInt(value.split('-')[0], 10);
      data.inputMonth = parseInt(value.split('-')[1], 10) - 1;
      data.inputDay = parseInt(value.split('-')[2], 10);

      emitInput(inputDate.value);
    };

    // 月期点击事件
    const monthClick = (value: string) => {
      data.inputYear = parseInt(value.split('-')[0], 10);
      data.inputMonth = parseInt(value.split('-')[1], 10) - 1;

      if (props.type === 'date') {
        data.tableDate = value;
        data.activeType = 'DATE';

        props.reactive &&
          !props.multiple &&
          handleIsDateAllowed(inputDate.value) &&
          emit('update:modelValue', inputDate.value);
      } else {
        emitInput(inputDate.value);
      }
    };

    // 年份点击事件
    const yearClick = (value: string) => {
      data.inputYear = value;

      if (props.type === 'month') {
        data.tableDate = `${value}`;
      } else {
        data.tableDate = `${value}-${Pad(tableMonth.value + 1)}`;
      }

      data.activeType = 'MONTH';

      props.reactive &&
        !props.multiple &&
        handleIsDateAllowed(inputDate.value) &&
        emit('update:modelValue', inputDate.value);
    };

    // 是否可以选择日期
    const handleIsDateAllowed = (value: string) => {
      return isDateAllowed(value, props.min, props.max, props.allowedDates);
    };

    // 渲染标题内容
    const genPickerTitle = () => {
      return h(IvueDatePickerTitle, {
        readonly: props.readonly,
        date: props.modelValue
          ? formatters.value.titleDate(props.modelValue)
          : '',
        year: formatters.value.titleYear(`${data.inputYear}`),
        value: props.multiple ? props.modelValue[0] : props.modelValue,
        selectingYear: data.activeType === 'YEAR',
        yearIcon: props.yearIcon,
        'onUpdate:selectingYear': (value) => {
          data.activeType = value ? 'YEAR' : props.type.toUpperCase();
        },
      });
    };

    // 渲染内容头部
    const genTableHeader = () => {
      return h(IvueDatePickerHeader, {
        locale: props.locale,
        tableDate: `${tableYear.value}`,
        value:
          data.activeType === 'DATE'
            ? `${tableYear.value}-${Pad(tableMonth.value + 1)}`
            : `${tableYear.value}`,
        max: data.activeType === 'DATE' ? maxMonth.value : maxYear.value,
        min: data.activeType === 'DATE' ? minMonth.value : minYear.value,
        color: props.color,
        nextIcon: props.nextIcon,
        prevIcon: props.prevIcon,
        readonly: props.readonly,
        activeType: data.activeType,
        format: props.headerDateFormat,
        onInput: (value) => {
          data.tableDate = value;
        },
        onToggle: () => {
          data.activeType = data.activeType === 'DATE' ? 'MONTH' : 'YEAR';
        },
      });
    };

    // 渲染日期
    const genDateTable = () => {
      return h(IvueDatePickerDate, {
        tableDate: `${tableYear.value}-${Pad(tableMonth.value + 1)}`,
        firstDayOfWeek: props.firstDayOfWeek,
        locale: props.locale,
        value: props.modelValue,
        max: props.max,
        min: props.min,
        allowedDates: props.allowedDates,
        readonly: props.readonly,
        current: current.value,
        format: props.dayFormat,
        backgroundColor: setBackgroundColor,
        textColor: setTextColor,
        note: props.note,
        noteColor: props.noteColor,
        color: props.color,
        onInput: dateClick,
        onTableDate: (value: string) => {
          data.tableDate = value;
        },
      });
    };

    // 渲染月
    const genMonthTable = () => {
      return h(IvueDatePickerMonth, {
        tableDate: `${tableYear.value}`,
        color: props.color,
        locale: props.locale,
        value: selectedMonths.value,
        max: maxMonth.value,
        min: minMonth.value,
        allowedDates: props.type === 'month' ? props.allowedDates : null,
        readonly: props.readonly,
        current: current.value
          ? sanitizeDateString(current.value, 'month')
          : null,
        activeType: data.activeType,
        format: props.monthFormat,
        backgroundColor: setBackgroundColor,
        textColor: setTextColor,
        onInput: monthClick,
        onTableDate: (value: string) => (data.tableDate = value),
      });
    };

    // 渲染年
    const genYears = () => {
      return h(IvueDatePickerYears, {
        tableDate: `${tableYear.value}`,
        color: props.color,
        max: maxYear.value,
        min: minYear.value,
        readonly: props.readonly,
        allowedDates: props.type === 'month' ? props.allowedDates : null,
        locale: props.locale,
        value: `${tableYear.value}`,
        current: current.value,
        activeType: data.activeType,
        year: `${data.inputYear}`,
        backgroundColor: setBackgroundColor,
        textColor: setTextColor,
        onInput: yearClick,
        onTableDate: (value: string) => (data.tableDate = value),
      });
    };

    // 渲染内容
    const genPickerBody = () => {
      const children =
        data.activeType === 'YEAR'
          ? [genTableHeader(), genYears()]
          : [
              genTableHeader(),
              data.activeType === 'DATE' ? genDateTable() : genMonthTable(),
            ];

      return h(
        'div',
        {
          key: data.activeType,
          style: props.readonly
            ? {
                'pointer-events': 'none',
              }
            : undefined,
        },
        {
          default: () => children,
        }
      );
    };

    // 监听 tableDate
    watch(
      () => data.tableDate,
      (val) => {
        // 发送月份或年份改变事件
        emit('update:pickerDate', val);
      }
    );

    // 监听 日期时间
    watch(
      () => props.modelValue,
      (newValue, oldValue) => {
        // 检查设置为多选后value值是否正确
        checkMultipleProp();
        // 设置年，月，日值
        setInputDate();

        if (!props.multiple && props.modelValue && !props.pickerDate) {
          data.tableDate = sanitizeDateString(
            inputDate.value,
            props.type === 'month' ? 'year' : 'month'
          );
        } else if (
          props.multiple &&
          props.modelValue.length &&
          !oldValue.length &&
          !props.pickerDate
        ) {
          data.tableDate = sanitizeDateString(
            inputDate.value,
            props.type === 'month' ? 'year' : 'month'
          );
        }
      }
    );

    //  监听月份或者年份的变化
    watch(
      () => props.pickerDate,
      (value) => {
        if (value) {
          data.tableDate = value;
        } else if (computedValue.value && props.type === 'date') {
          data.tableDate = sanitizeDateString(computedValue.value, 'month');
        } else if (computedValue.value && props.type === 'month') {
          data.tableDate = sanitizeDateString(computedValue.value, 'year');
        }
      }
    );

    // 监听日历类型变化
    watch(
      () => props.type,
      (type) => {
        data.activeType = type.toUpperCase();
        if (props.modelValue && props.modelValue.length) {
          const output = (
            props.multiple ? props.modelValue : [props.modelValue]
          )
            .map((val: string) => sanitizeDateString(val, type))
            .filter(handleIsDateAllowed);
          emit('update:modelValue', props.multiple ? output : output[0]);
        }
      }
    );

    // 初始化
    initData();

    return () => {
      return h(
        IvuePicker,
        {
          class: {
            ['ivue-picker--fullWidth']: props.fullWidth,
          },
          // 颜色
          color: props.headerColor || props.color,
          // 日历方向
          landscape: props.landscape,
          // 选择框宽度
          width: props.width,
          // 强制100％宽度
          fullWidth: props.fullWidth,
        },
        {
          title: props.noTitle ? null : () => genPickerTitle(),
          default: () => genPickerBody(),
        }
      );
    };
  },
  components: {
    IvueDatePickerYears,
  },
});
</script>
