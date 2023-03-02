<script lang="ts">
import { defineComponent, reactive, computed, watch, h, unref } from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// mixins
import { colorable } from '@ivue-material-plus/utils/mixins/colorable';

// 格式化日期格式
import CreateNativeLocaleFormatter from './utils/create-native-locale-formatter';
// 拼接字符串
import Pad from './utils/pad';
// 允许选择的日期
import isDateAllowed from './utils/is-date-allowed';

// components
import Picker from './picker.vue';
import DatePickerHeader from './date-picker-header.vue';
import DatePickerDate from './date-picker-date.vue';
import DatePickerMonth from './date-picker-month.vue';
import DatePickerYears from './date-picker-years.vue';
import DatePickerTitle from './date-picker-title.vue';

// date-picker
import { datePickerProps } from './date-picker';

// type
import type { DatePickerData } from './date-picker';

const prefixCls = 'ivue-date-picker';

export default defineComponent({
  name: prefixCls,
  emits: ['update:modelValue', 'update:pickerDate', 'on-change'],
  props: datePickerProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // 设置颜色
    const { setBackgroundColor, setTextColor } = colorable();

    // data
    const data = reactive<DatePickerData>({
      // 输入日期
      inputDay: '',
      // 输入月份
      inputMonth: '',
      // 输入年份
      inputYear: '',
      // 'YYYY' / 'YYYY-M' format (leading zero for month is not required)
      tableDate: '',
      // 当前时间
      now: new Date(),
      // 当前激活的类型
      activeType: '',
    });

    // computed

    // 计算 v-model
    const computedValue = computed<string>(() => {
      return props.multiple
        ? (props.modelValue as string[])[props.modelValue!.length - 1]
        : (props.modelValue as string);
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
        titleDateFormatter!(date)
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
            ? unref(defaultTitleDateFormatter)!(dates[0])
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
      return props.max ? sanitizeDateString(props.max, 'month') : '';
    });

    // 最小月份
    const minMonth = computed(() => {
      return props.min ? sanitizeDateString(props.min, 'month') : '';
    });

    // 最小年份
    const minYear = computed(() => {
      return props.min ? sanitizeDateString(props.min, 'year') : '';
    });

    // 最大年份
    const maxYear = computed(() => {
      return props.max ? sanitizeDateString(props.max, 'year') : '';
    });

    // 当前日期
    const current = computed(() => {
      // 是否显示当前日期
      if (props.showCurrent) {
        return sanitizeDateString(
          `${data.now.getFullYear()}-${
            data.now.getMonth() + 1
          }-${data.now.getDate()}`,
          props.type
        );
      }
      // 没有当前日期
      else {
        return '';
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
      // 月份
      if (
        !props.modelValue ||
        !props.modelValue.length ||
        props.type === 'month'
      ) {
        return props.modelValue;
      }
      // 多选
      else if (props.multiple) {
        return (props.modelValue as string[]).map((val: string) =>
          val.slice(0, 7)
        );
      }
      // 单选
      else {
        return (props.modelValue as string).slice(0, 7);
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

      // 日期数据
      data.tableDate = (() => {
        // 监听pickerDate变化以便在更改时执行某些操作，当选择月/年时触发
        if (props.pickerDate) {
          return props.pickerDate;
        }

        const date =
          ((props.multiple
            ? props.modelValue[props.modelValue.length - 1]
            : props.modelValue) as string) ||
          `${data.now.getFullYear()}-${data.now.getMonth() + 1}`;

        const type = props.type === 'date' ? 'month' : 'year';

        return sanitizeDateString(date, type);
      })();

      // 监听pickerDate变化以便在更改时执行某些操作，当选择月/年时触发
      if (props.pickerDate !== data.tableDate) {
        emit('update:pickerDate', data.tableDate);
      }
    };

    // 点击日期事件
    const emitInput = (newInput: string) => {
      const output = props.multiple
        ? props.modelValue.indexOf(newInput) === -1
          ? (props.modelValue as string[]).concat([newInput])
          : (props.modelValue as string[]).filter((x) => x !== newInput)
        : newInput;

      // update:modelValue
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

      return `${year}-${Pad(month)}-${Pad(date)}`.slice(
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
      // 计算后的v-model
      if (unref(computedValue)) {
        const _computedValue = unref(computedValue).split('-');

        // 年
        data.inputYear = parseInt(_computedValue[0], 10);
        // 月
        data.inputMonth = parseInt(_computedValue[1], 10) - 1;

        // 日
        if (props.type === 'date') {
          data.inputDay = parseInt(_computedValue[2], 10);
        }
      }
      // 其他
      else {
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
      // 输入年份
      data.inputYear = parseInt(value.split('-')[0], 10);
      // 输入月份
      data.inputMonth = parseInt(value.split('-')[1], 10) - 1;
      // 输入日期
      data.inputDay = parseInt(value.split('-')[2], 10);

      // 点击日期事件
      emitInput(inputDate.value);
    };

    // 月期点击事件
    const monthClick = (value: string) => {
      // 输入年份
      data.inputYear = parseInt(value.split('-')[0], 10);
      // 输入月份
      data.inputMonth = parseInt(value.split('-')[1], 10) - 1;

      // 日选择
      if (props.type === 'date') {
        data.tableDate = value;
        data.activeType = 'DATE';

        // 点击月份或者年份时日期月份或年份是否跟随改变 & 不是多选 & 是否可以选择日期
        if (
          props.reactive &&
          !props.multiple &&
          canIsDateAllowed(inputDate.value)
        ) {
          emit('update:modelValue', inputDate.value);
        }
      }
      // 点击日期事件
      else {
        emitInput(inputDate.value);
      }
    };

    // 年份点击事件
    const yearClick = (value: string) => {
      // 输入年份
      data.inputYear = value;

      // 月份选择
      if (props.type === 'month') {
        // 日期格式
        data.tableDate = `${value}`;
      } else {
        // 日期格式
        data.tableDate = `${value}-${Pad(tableMonth.value + 1)}`;
      }

      // 激活的类型
      data.activeType = 'MONTH';

      // 点击月份或者年份时日期月份或年份是否跟随改变 & 不是多选 & 是否可以选择日期
      if (
        props.reactive &&
        !props.multiple &&
        canIsDateAllowed(inputDate.value)
      ) {
        emit('update:modelValue', inputDate.value);
      }
    };

    // 是否可以选择日期
    const canIsDateAllowed = (value: string) => {
      return isDateAllowed(value, props.min, props.max, props.allowedDates);
    };

    // 渲染标题内容
    const genPickerTitle = () => {
      return h(DatePickerTitle, {
        // 是否只读
        readonly: props.readonly,
        // 日期
        date: props.modelValue
          ? unref(formatters).titleDate!(props.modelValue)
          : '',
        // 当前年份
        year: unref(formatters).titleYear!(`${data.inputYear}`),
        // value
        value: props.multiple ? props.modelValue[0] : props.modelValue,
        // 选择年份
        selectingYear: data.activeType === 'YEAR',
        // 年份图标
        yearIcon: props.yearIcon,
        // 选择年触发
        'onUpdate:selectingYear': (value: string) => {
          data.activeType = value ? 'YEAR' : props.type.toUpperCase();
        },
      });
    };

    // 渲染内容头部
    const genTableHeader = () => {
      return h(DatePickerHeader, {
        // 日期时间
        value:
          data.activeType === 'DATE'
            ? `${tableYear.value}-${Pad(tableMonth.value + 1)}`
            : `${tableYear.value}`,
        // 语言
        locale: props.locale,
        // 年月
        tableDate: `${tableYear.value}`,
        // 最小年份或月份
        min: data.activeType === 'DATE' ? minMonth.value : minYear.value,
        // 最大年份或月份
        max: data.activeType === 'DATE' ? maxMonth.value : maxYear.value,
        // 文字颜色
        color: props.color,
        // 左边按钮图标
        nextIcon: props.nextIcon,
        // 右边按钮图标
        prevIcon: props.prevIcon,
        // 只读
        readonly: props.readonly,
        // 当前激活的类型
        activeType: data.activeType,
        // 日期格式化
        format: props.headerDateFormat,
        // 日期点击
        onInput: (value: string) => {
          data.tableDate = value;
        },
        // 切换当前激活类型
        onToggle: () => {
          data.activeType = data.activeType === 'DATE' ? 'MONTH' : 'YEAR';
        },
      });
    };

    // 渲染日期
    const genDateTable = () => {
      return h(DatePickerDate, {
        // 年月
        tableDate: `${tableYear.value}-${Pad(tableMonth.value + 1)}`,
        // 一周的第一天
        firstDayOfWeek: props.firstDayOfWeek,
        // 语言
        locale: props.locale,
        // value
        value: props.modelValue,
        // 最小年份或月份
        min: props.min,
        // 最大年份或月份
        max: props.max,
        // 设置允许选择日期函数
        allowedDates: props.allowedDates,
        // 只读
        readonly: props.readonly,
        // 当前日期
        current: unref(current),
        // 日期格式化函数
        format: props.dayFormat,
        // 设置背景颜色方法
        setBackgroundColor: setBackgroundColor,
        // 设置文字颜色方法
        setTextColor: setTextColor,
        // 便签用于标记需要注意的日期
        note: props.note,
        // 便签用于标记需要注意的日期的颜色
        noteColor: props.noteColor,
        // 文字颜色
        color: props.color,
        // 点击日期
        onInput: dateClick,
        // 监听日期数据变化
        onTableDate: (value: string) => {
          data.tableDate = value;
        },
      });
    };

    // 渲染月
    const genMonthTable = () => {
      return h(DatePickerMonth, {
        // 年月
        tableDate: `${tableYear.value}`,
        // 颜色
        color: props.color,
        // 语言
        locale: props.locale,
        // 日期时间
        value: selectedMonths.value,
        // 最小月份
        min: minMonth.value,
        // 最大月份
        max: maxMonth.value,
        // 设置允许选择日期函数
        allowedDates: props.type === 'month' ? props.allowedDates : undefined,
        // 只读
        readonly: props.readonly,
        // 当前日期
        current: current.value
          ? sanitizeDateString(current.value, 'month')
          : '',
        // 当前激活的类型
        activeType: data.activeType,
        // 格式化函数
        format: props.monthFormat,
        // 设置背景颜色函数
        setBackgroundColor: setBackgroundColor,
        // 设置文字颜色函数
        setTextColor: setTextColor,
        // 日期点击
        onInput: monthClick,
        // 监听当前日期变化
        onTableDate: (value: string) => {
          data.tableDate = value;
        },
      });
    };

    // 渲染年
    const genYears = () => {
      return h(DatePickerYears, {
        // 日期时间
        value: `${tableYear.value}`,
        // 年月
        tableDate: `${tableYear.value}`,
        // 文字颜色
        color: props.color,
        // 最小年份
        min: minYear.value,
        // 最大年份
        max: maxYear.value,
        // 只读
        readonly: props.readonly,
        // 设置允许选择日期函数
        allowedDates: props.type === 'month' ? props.allowedDates : undefined,
        // 语言
        locale: props.locale,
        // 当前日期
        current: current.value,
        // 当前激活的类型
        activeType: data.activeType,
        // 当前年份
        year: `${data.inputYear}`,
        // 设置背景颜色方法
        backgroundColor: setBackgroundColor,
        // 设置文字颜色方法
        textColor: setTextColor,
        // 日期点击
        onInput: yearClick,
        // 日期数据变化
        onTableDate: (value: string) => {
          data.tableDate = value;
        },
      });
    };

    // 渲染内容
    const genPickerBody = () => {
      let children = [
        genTableHeader(),
        data.activeType === 'DATE' ? genDateTable() : genMonthTable(),
      ];

      // 当前激活类型是年
      if (data.activeType === 'YEAR') {
        children = [genTableHeader(), genYears()];
      }

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

        // 不是多选 & 有vale & 没有监听月份或者年份的变化
        if (!props.multiple && props.modelValue && !props.pickerDate) {
          data.tableDate = sanitizeDateString(
            inputDate.value,
            props.type === 'month' ? 'year' : 'month'
          );
        }
        // 多选 & 有vale & 之前没有数据 & 没有监听月份或者年份的变化
        else if (
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
        }
        // 日
        else if (computedValue.value && props.type === 'date') {
          data.tableDate = sanitizeDateString(computedValue.value, 'month');
        }
        // 月
        else if (computedValue.value && props.type === 'month') {
          data.tableDate = sanitizeDateString(computedValue.value, 'year');
        }
      }
    );

    // 监听日历类型变化
    watch(
      () => props.type,
      (type) => {
        // 当前激活的type
        data.activeType = type.toUpperCase();

        // modelValue
        if (props.modelValue && props.modelValue.length) {
          const modelValue = (
            props.multiple ? props.modelValue : [props.modelValue]
          ) as string[];

          // 是否是多选
          const output = modelValue
            .map((val: string) => sanitizeDateString(val, type))
            .filter(canIsDateAllowed);

          // update:modelValue
          emit('update:modelValue', props.multiple ? output : output[0]);
        }
      }
    );

    // 初始化
    initData();

    return () => {
      return h(
        Picker,
        {
          // 强制100％宽度
          class: {
            [bem.is('fullWidth')]: props.fullWidth,
          },
          // 头部颜色 | 整体颜色
          color: props.headerColor || props.color,
          // 日历方向
          landscape: props.landscape,
          // 选择框宽度
          width: props.width,
          // 强制100％宽度
          fullWidth: props.fullWidth,
        },
        {
          // 标题
          title: props.noTitle ? null : () => genPickerTitle(),
          default: () => genPickerBody(),
        }
      );
    };
  },
});
</script>
