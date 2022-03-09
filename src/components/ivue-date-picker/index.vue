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

import IvuePicker from './ivue-picker.vue';
import IvueDatePickerTitle from './ivue-date-picker-title.vue';

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

        // methods

        // 初始化
        const initData = () => {
            data.activeType = props.type.toUpperCase();

            // 设置年，月，日值
            setInputDate();
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
            });
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
                }
            );
        };
    },
});
</script>
