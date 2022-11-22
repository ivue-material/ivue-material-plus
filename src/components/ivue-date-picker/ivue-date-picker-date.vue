
<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    watch,
    Transition,
    h,
    withDirectives,
    resolveDirective,
} from 'vue';
import Colorable from '../../utils/mixins/colorable';
import MonthChange from '../../utils/month-change';
import Touch from '../../utils/directives/touch';
import CreateNativeLocaleFormatter from '../../utils/create-native-locale-formatter';
import { createRange } from '../../utils/helpers';
import Pad from '../../utils/pad';
import isDateAllowed from '../../utils/is-date-allowed';

const prefixCls = 'ivue-date-picker-date';

export default defineComponent({
    name: prefixCls,
    mixins: [Colorable],
    directives: { Touch },
    // 声明事件
    emits: ['table-date', 'input'],
    props: {
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
         * 年月
         *
         * @type {String}
         */
        tableDate: {
            type: String,
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
         * 当前激活的type
         *
         * @type {String}
         */
        activeType: String,
        /**
         * 日期 时间
         *
         * @type {String,Array}
         */
        value: [String, Array],
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
         * 设置允许选择日期函数
         *
         * @type {Function}
         */
        allowedDates: Function,
        /**
         * 当前日期
         *
         * @type {String}
         */
        current: String,
        /**
         * 只读
         *
         * @type {Boolean}
         */
        readonly: Boolean,
        /**
         * 格式化函数
         *
         * @type {Function}
         */
        format: {
            type: Function,
            default: null,
        },
        /**
         * 背景颜色
         *
         * @type {Function}
         */
        backgroundColor: Function,
        /**
         * 文字颜色
         *
         * @type {Function}
         */
        textColor: Function,
        /**
         * 便签用于标记需要注意的日期
         *
         * @type {Array, Function}
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
    },
    setup(props: any, { emit }) {
        // data
        const data = reactive<{
            isReversing: boolean;
        }>({
            // 是否使用反向动画
            isReversing: false,
        });

        // computed

        // 动画
        const computedTransition = computed(() => {
            return data.isReversing
                ? 'tab-reverse-transition'
                : 'tab-transition';
        });

        // 格式化每周日期
        const weekDayFormatter = computed(() => {
            return CreateNativeLocaleFormatter(props.locale, {
                weekday: 'narrow',
                timeZone: 'UTC',
            });
        });

        // 每周日期
        const weekDays = computed(() => {
            const first = parseInt(props.firstDayOfWeek, 10);

            return weekDayFormatter.value
                ? // 2017-01-15 is Sunday
                  createRange(7).map((i) =>
                      weekDayFormatter.value(`2017-01-${first + i + 15}`)
                  )
                : createRange(7).map(
                      (i: any) =>
                          ['S', 'M', 'T', 'W', 'T', 'F', 'S'][(i + first) % 7]
                  );
        });

        // 显示的年份
        const displayedYear = computed(() => {
            return props.tableDate.split('-')[0] * 1;
        });

        // 显示月份
        const displayedMonth = computed(() => {
            return props.tableDate.split('-')[1] - 1;
        });

        // 日期格式
        const formatter = computed(() => {
            return (
                props.format ||
                CreateNativeLocaleFormatter(
                    props.locale,
                    { day: 'numeric', timeZone: 'UTC' },
                    { start: 8, length: 2 }
                )
            );
        });

        // methods

        // 表格元素
        const genTR = (children) => {
            return [h('tr', {}, children)];
        };

        // 按钮样式
        const genButtonClasses = (isSelected: boolean, isCurrent: boolean) => {
            return {
                'ivue-button--selected': isSelected,
                'ivue-button--current': isCurrent,
                'ivue-button--readonly': props.readonly && isSelected,
            };
        };

        // 返回从firstDayOfWeek到当月第一天的天数
        const weekDaysBeforeFirstDayOfTheMonth = () => {
            // 本月的第一天
            const firstDayOfTheMonth = new Date(
                `${displayedYear.value}-${Pad(
                    displayedMonth.value + 1
                )}-01T00:00:00+00:00`
            );

            const weekDay = firstDayOfTheMonth.getUTCDay();

            return (weekDay - parseInt(props.firstDayOfWeek) + 7) % 7;
        };

        // 计算表日期
        const calculateTableDate = (dates) => {
            // Math.sign 返回一个数字的符号，表示该数字是正数，负数还是零
            return MonthChange(props.tableDate, Math.sign(dates || 1));
        };

        // 点击
        const touch = (value) => {
            emit('table-date', calculateTableDate(value));
        };

        // 内容
        const genTable = (staticClass: string, children: Array<any>) => {
            const transition = h(
                Transition,
                {
                    name: computedTransition.value,
                },
                {
                    default: () =>
                        h(
                            'table',
                            {
                                key: props.tableDate,
                            },
                            {
                                default: () => children,
                            }
                        ),
                }
            );

            // 解析指令
            const rippleDirective = resolveDirective('touch');

            return withDirectives(
                h(
                    'div',
                    {
                        class: staticClass,
                    },
                    [transition]
                ),
                [
                    [
                        rippleDirective,
                        {
                            left: (e) => e.offsetX < -15 && touch(1),
                            right: (e) => e.offsetX > 15 && touch(-1),
                        },
                    ],
                ]
            );
        };

        // 日期头部
        const genTHead = () => {
            const days = weekDays.value.map((day) => h('th', {}, day));

            return h(
                'thead',
                {},
                {
                    default: () => genTR(days),
                }
            );
        };

        // genButton
        const genButton = (value: string, staticClass: string) => {
            // 是否选中
            const isSelected =
                value === props.value ||
                (Array.isArray(props.value) &&
                    props.value.indexOf(value) !== -1);

            // 是否允许选择
            const isAllowed = isDateAllowed(
                value,
                props.min,
                props.max,
                props.allowedDates
            );

            // 是否有显示当前日期
            let isCurrent = false;

            if (props.activeType && props.current) {
                isCurrent =
                    props.activeType === 'YEAR'
                        ? `${new Date().getFullYear()}` === value
                        : null || props.activeType === 'MONTH'
                        ? `${new Date().getFullYear()}-${
                              new Date().getMonth() + 1
                          }` === value
                        : null;
            } else {
                isCurrent = value === props.current;
            }

            const setColor = isSelected
                ? props.backgroundColor
                : props.textColor;

            const color =
                (isSelected || isCurrent) && (props.color || 'ivue-picker-primary');

            const _staticClass = staticClass ? staticClass : '';

            return h(
                'button',
                setColor(color, {
                    class: {
                        [`ivue-button ${_staticClass}`]: true,
                        ...genButtonClasses(isSelected, isCurrent),
                    },
                    disabled: !isAllowed,
                    onClick: () => {
                        if (!isAllowed) {
                            return;
                        }

                        emit('input', value);
                    },
                }),
                formatter.value(value)
            );
        };

        // 日期
        const genTBody = () => {
            // 节点
            const children = [];
            // 获取当前月份天数
            const daysInMonth = new Date(
                displayedYear.value,
                displayedMonth.value + 1,
                0
            ).getDate();

            // 第一行日期数
            let day = weekDaysBeforeFirstDayOfTheMonth();
            // 行数
            let rows = [];

            while (day--) {
                rows.push(h('td'));
            }

            for (day = 1; day <= daysInMonth; day++) {
                const date = `${displayedYear.value}-${Pad(
                    displayedMonth.value + 1
                )}-${Pad(day)}`;

                rows.push(
                    h('td', [
                        genButton(date, 'ivue-button--icon'),
                        isNote(date) ? genNote(date) : null,
                    ])
                );

                // 一行7个
                if (rows.length % 7 === 0) {
                    children.push(genTR(rows));

                    rows = [];
                }
            }

            if (rows.length) {
                children.push(genTR(rows));
            }

            return h('tbody', {}, children);
        };

        // 是否有便签
        const isNote = (date: string) => {
            if (Array.isArray(props.note)) {
                return props.note.indexOf(date) > -1;
            } else if (props.note instanceof Function) {
                return props.note(date);
            } else {
                return false;
            }
        };

        // 渲染便签
        const genNote = (date) => {
            let noteColor;

            if (typeof props.noteColor === 'string') {
                noteColor = props.noteColor;
            } else if (typeof props.noteColor === 'function') {
                noteColor = props.noteColor(date);
            } else {
                noteColor = props.noteColor[date];
            }

            return h(
                'div',
                props.backgroundColor(noteColor || props.color || 'warning', {
                    class: {
                        [`${prefixCls}--note`]: true,
                    },
                })
            );
        };

        // 监听日期时间
        watch(
            () => props.tableDate,
            (newVal, oldVal) => {
                data.isReversing = newVal < oldVal;
            }
        );

        return () =>
            genTable(`${prefixCls} ${prefixCls}--table`, [
                genTHead(),
                genTBody(),
            ]);
    },
});
</script>
