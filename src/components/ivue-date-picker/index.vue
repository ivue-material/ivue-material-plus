<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    nextTick,
    onMounted,
    onBeforeUnmount,
    provide,
    watch,
    h,
    getCurrentInstance,
} from 'vue';

import Colorable from '../../utils/mixins/colorable';
import CreateNativeLocaleFormatter from '../../utils/create-native-locale-formatter';
import Pad from '../../utils/pad';

import IvuePicker from './ivue-picker.vue';
import IvueDatePickerTitle from './ivue-date-picker-title.vue';
import IvueDatePickerHeader from './ivue-date-picker-header.vue';

export default defineComponent({
    name: 'ivue-date-picker',
    mixins: [Colorable],
    props: {
        /**
         * 日历方向
         *
         * @type {Boolean}
         */
        landscape: Boolean,
        /**
         * 头部颜色
         *
         * @type {String}
         */
        headerColor: String,
        /**
         * 选择框宽度
         *
         * @type {Boolean}
         */
        width: {
            type: [Number, String],
            default: 290,
            validator: (value: any) => parseInt(value, 10) > 0,
        },
        /**
         * 强制100％宽度
         *
         * @type {Boolean}
         */
        fullWidth: Boolean,
        /**
         * 隐藏日历头部
         *
         * @type {Boolean}
         */
        noTitle: Boolean,
        /**
         * 日期 时间
         *
         * @type {Array, String}
         */
        modelValue: [Array, String],
        /**
         * Function formatting the year in table header and pickup title
         *
         * @type {Function}
         */
        titleYearFormat: {
            type: Function,
            default: null,
        },
        /**
         * Function formatting currently selected date in the picker title
         *
         * @type {Function}
         */
        titleDateFormat: {
            type: Function,
            default: null,
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
         * @type {Function}
         */
        multiple: Boolean,
        /**
         * 日历显示的类型 默认显示为日期
         *
         * @type {String}
         */
        type: {
            type: String,
            default: 'date',
            validator: (type: string) => ['date', 'month'].includes(type),
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
        readonly: Boolean,
        /**
         * 用于监听月份或者年份的变化
         *
         * @type {Boolean}
         */
        pickerDate: String,
        /**
         * 最小年份或月份
         *
         * @type {String}
         */
        min: String,
        /**
         * 最大年份或月份
         *
         * @type {String}
         */
        max: String,
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
        // Function formatting the tableDate in the day/month table header
        headerDateFormat: {
            type: Function,
            default: null,
        },
    },
    setup(props: any, { emit }) {
        // 支持访问内部组件实例
        const vm = getCurrentInstance();

        // data
        const data = reactive<{
            inputDay: string | number;
            inputMonth: string | number;
            inputYear: string | number;
            now: any;
            activeType: string;
            tableDate: string;
        }>({
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
            const landscapeFormatter = (date) =>
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
                return (dates) =>
                    dates.length
                        ? defaultTitleDateFormatter.value(dates[0])
                        : '0 selected';
            }

            return (dates) => `${dates.length} selected`;
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
                        : defaultTitleMultipleDateFormatter.value),
            };
        });

        // 年份
        const tableYear = computed(() => {
            return (props.pickerDate || data.tableDate).split('-')[0] * 1;
        });

        // 月份
        const tableMonth = computed(() => {
            return (props.pickerDate || data.tableDate).split('-')[1] - 1;
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
            // if (this.value == null) return;
            // const valueType = this.value.constructor.name;
            // const expected = this.multiple ? 'Array' : 'String';
            // if (valueType !== expected) {
            //     console.warn(
            //         `Value must be ${
            //             this.multiple ? 'an' : 'a'
            //         } ${expected}, got ${valueType}`,
            //         this
            //     );
            // }
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
                    data.inputMonth == null
                        ? data.inputMonth
                        : data.now.getMonth();

                // 日
                data.inputDay = data.inputDay || data.now.getDate();
            }
        };

        // 渲染标题内容
        const genPickerTitle = () => {
            return h(IvueDatePickerTitle, {
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
                max:
                    data.activeType === 'DATE' ? maxMonth.value : maxYear.value,
                min:
                    data.activeType === 'DATE' ? minMonth.value : minYear.value,
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
                    data.activeType =
                        data.activeType === 'DATE' ? 'MONTH' : 'YEAR';
                },
            });
        };

        // 渲染内容
        const genPickerBody = () => {
            const children =
                data.activeType === 'YEAR'
                    ? [
                          genTableHeader(),
                          // this.genYears()
                      ]
                    : [
                          genTableHeader(),
                          //   this.activeType === 'DATE' ? this.genDateTable() : this.genMonthTable()
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

        return () => {
            // 初始化
            initData();

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
});
</script>
