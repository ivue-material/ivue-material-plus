<script lang='ts'>
import {
    defineComponent,
    computed,
    watch,
    Transition,
    h,
    ref,
} from 'vue';

import { colorable } from '../../utils/mixins/colorable';
import CreateNativeLocaleFormatter from '../../utils/create-native-locale-formatter';
import MonthChange from '../../utils/month-change';

import IvueButton from '../ivue-button/index.vue';
import IvueIcon from '../ivue-icon/index.vue';

// type
import type {
    Props,
} from './types/ivue-date-picker-header';

const prefixCls = 'ivue-date-picker-header';

export default defineComponent({
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
        /**
         * 左边按钮图标
         *
         * @type {String}
         */
        nextIcon: {
            type: String,
            default: 'chevron_right',
        },
        /**
         * 右边按钮图标
         *
         * @type {String}
         */
        prevIcon: {
            type: String,
            default: 'chevron_left',
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
         * 是否只读
         *
         * @type {Boolean}
         */
        readonly: {
            type: Boolean,
        },
        /**
         * 当前激活的type
         *
         * @type {String}
         */
        activeType: {
            type: String,
        },
        /**
         * format
         *
         * @type {Function}
         */
        format: {
            type: Function,
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
        /**
         * 文字颜色
         *
         * @type {String | Array}
         */
        color: {
            type: [String, Array],
        },
    },
    setup(props: Props, { emit, slots }) {
        // mixins
        const { setTextColor } = colorable(props);

        // 是否使用反向动画
        const isReversing = ref<boolean>(false);

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
            const year = Number(props.tableDate.split('-')[0]) * 1;

            if (!props.max) {
                return year;
            }

            const max = Number(props.max.split('-')[0]) * 1;

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
            const endYear = startYear + 9;

            let disabled =
                props.readonly ||
                (change < 0 &&
                    props.min &&
                    calculateChange(change) < props.min) ||
                (change > 0 &&
                    props.max &&
                    (props.activeType === 'YEAR'
                        ? endYear >= Number(props.max)
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

                if (props.max && number > Number(props.max)) {
                    number = Number(props.max);
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
                endYear =
                    startYear + 9 > Number(props.max)
                        ? props.max
                        : startYear + 9;
            } else {
                endYear = startYear + 9;
            }

            const header = h(
                'strong',
                setTextColor(color, {
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
                    name: isReversing.value
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
                isReversing.value = newVal < oldVal;
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
