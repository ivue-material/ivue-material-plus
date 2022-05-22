<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    watch,
    Transition,
    h,
    getCurrentInstance,
} from 'vue';
import Colorable from '../../utils/mixins/colorable';
import CreateNativeLocaleFormatter from '../../utils/create-native-locale-formatter';
import MonthChange from '../../utils/month-change';

import IvueButton from '../ivue-button/index.vue';
import IvueIcon from '../ivue-icon/index.vue';

const prefixCls = 'ivue-date-picker-header';

export default defineComponent({
    mixins: [Colorable],
    emits: ['toggle', 'input'],
    props: {
        /**
         * 日期 时间
         *
         * @type {String}
         */
        value: {
            type: [Number, String],
            required: true,
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
        nextIcon: {
            type: String,
            default: 'chevron_right',
        },
        prevIcon: {
            type: String,
            default: 'chevron_left',
        },
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
         * 是否只读
         *
         * @type {Boolean}
         */
        readonly: Boolean,
        /**
         * 当前激活的type
         *
         * @type {String}
         */
        activeType: String,
        /**
         * format
         *
         * @type {Function}
         */
        format: {
            type: Function,
            default: null,
        },
        /**
         * 年月
         *
         * @type {String}
         */
        tableDate: {
            type: String,
            required: true,
        },
    },
    setup(props: any, { emit, slots }) {
        // 支持访问内部组件实例
        const { proxy }: any = getCurrentInstance();

        // data
        const data = reactive<{
            isReversing: boolean;
        }>({
            // 是否使用反向动画
            isReversing: false,
        });

        // computed

        const formatter = computed(() => {
            if (props.format) {
                return props.format;
            }
            // 日期
            else if (String(props.value).split('-')[1]) {
                return CreateNativeLocaleFormatter(
                    props.locale,
                    { month: 'long', year: 'numeric', timeZone: 'UTC' },
                    { start: 0, length: 7 }
                );
            }
            // 年份
            else {
                return CreateNativeLocaleFormatter(
                    props.locale,
                    { year: 'numeric', timeZone: 'UTC' },
                    { start: 0, length: 4 }
                );
            }
        });

        // 显示的年份
        const displayedYear = computed(() => {
            const year = props.tableDate.split('-')[0] * 1;

            if (!props.max) {
                return year;
            }

            const max = props.max.split('-')[0] * 1;

            if (year > max) {
                return max;
            }

            return year;
        });

        // methods

        // 按钮
        const genBtn = (change: number) => {
            // 开始年份
            const startYear = Math.floor(displayedYear.value / 10) * 10;
            // 结束年份
            let endYear = startYear + 9;

            let disabled =
                props.readonly ||
                (change < 0 &&
                    props.min &&
                    calculateChange(change) < props.min) ||
                (change > 0 &&
                    props.max &&
                    (props.activeType === 'YEAR'
                        ? endYear >= props.max
                        : calculateChange(change) > props.max));

            if (props.activeType === 'YEAR' || props.activeType === 'MONTH') {
                if (change > 0 && props.value === props.max) {
                    disabled = true;
                }
            }

            return h(
                IvueButton,
                {
                    class: 'ivue-icon-button',
                    flat: true,
                    icon: true,
                    disabled,
                    onClick: () => {
                        emit('input', calculateChange(change));
                    },
                },
                {
                    default: () =>
                        h(
                            IvueIcon,
                            {},
                            {
                                default: () =>
                                    change < 0
                                        ? props.prevIcon
                                        : props.nextIcon,
                            }
                        ),
                }
            );
        };

        // 设置value值
        const calculateChange = (sign: number) => {
            const [year, month] = String(props.value)
                .split('-')
                .map((v: any) => 1 * v);

            if (!month) {
                let number = year + sign;

                if (props.max && number > props.max) {
                    number = props.max;
                }

                return `${number}`;
            } else {
                return MonthChange(String(props.value), sign);
            }
        };

        // 头部
        const genHeader = () => {
            const color = props.color;

            // 开始年份
            const startYear = Math.floor(displayedYear.value / 10) * 10;
            // 结束年份
            let endYear = null;

            if (props.max) {
                endYear = startYear + 9 > props.max ? props.max : startYear + 9;
            } else {
                endYear = startYear + 9;
            }

            const header = h(
                'strong',
                proxy.setTextColor(color, {
                    key: String(props.value),
                    onClick: () => {
                        emit('toggle');
                    },
                }),
                [
                    slots.default
                        ? slots.default()
                        : props.activeType === 'YEAR'
                        ? `${startYear}-${endYear}`
                        : formatter.value(String(props.value)),
                ]
            );

            const transition = h(
                Transition,
                {
                    name: data.isReversing
                        ? 'tab-reverse-transition'
                        : 'tab-transition',
                },
                {
                    default: () => header,
                }
            );

            return h(
                'div',
                {
                    class: {
                        [`${prefixCls}--value`]: true,
                    },
                },
                [transition]
            );
        };

        // 监听日期时间
        watch(
            () => props.value,
            (newVal, oldVal) => {
                data.isReversing = newVal < oldVal;
            }
        );

        return () => {
            let everyClick = null;

            if (props.activeType === 'YEAR') {
                everyClick = 10;
            } else {
                everyClick = 1;
            }

            return h(
                'div',
                {
                    class: prefixCls,
                },
                [genBtn(-everyClick), genHeader(), genBtn(everyClick)]
            );
        };
    },
});
</script>
