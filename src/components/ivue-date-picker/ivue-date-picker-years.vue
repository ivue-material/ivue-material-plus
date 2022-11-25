<script lang='ts'>
import {
    defineComponent,
    computed,
    watch,
    Transition,
    h,
    withDirectives,
    resolveDirective,
    ref,
    VNode,
} from 'vue';

import Touch from '../../utils/directives/touch';
import Colorable from '../../utils/mixins/colorable';
import CreateNativeLocaleFormatter from '../../utils/create-native-locale-formatter';
import isDateAllowed from '../../utils/is-date-allowed';

// type
import type { Props } from './ivue-date-picker-years';

const prefixCls = 'ivue-date-picker-years';

export default defineComponent({
    name: prefixCls,
    mixins: [Colorable],
    directives: { Touch },
    // 声明事件
    emits: ['table-date', 'input'],
    props: {
        /**
         * 日期 时间
         *
         * @type {String,Array}
         */
        value: {
            type: [String, Array],
            required: true,
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
         * 当前年份
         *
         * @type {Number | String}
         */
        year: {
            type: [Number, String],
            default: '',
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
         * 当前日期
         *
         * @type {String}
         */
        current: {
            type: String,
        },
        /**
         * 背景颜色
         *
         * @type {Function}
         */
        backgroundColor: {
            type: Function,
        },
        /**
         * 文字颜色
         *
         * @type {Function}
         */
        textColor: {
            type: Function,
        },
        /**
         * 文字颜色
         *
         * @type {String | Array}
         */
        color: {
            type: [String, Array],
        },
        /**
         * 只读
         *
         * @type {Boolean}
         */
        readonly: {
            type: Boolean,
        },
        /**
         * 设置允许选择日期函数
         *
         * @type {Function}
         */
        allowedDates: {
            type: Function,
        },
    },
    setup(props: Props, { emit }) {
        // 是否使用反向动画
        const isReversing = ref<boolean>(false);

        // computed

        // 动画
        const computedTransition = computed(() => {
            return isReversing.value
                ? 'tab-reverse-transition'
                : 'tab-transition';
        });

        // 显示的年份
        const displayedYear = computed(() => {
            return Number(props.tableDate.split('-')[0]) * 1;
        });

        const formatter = computed(() => {
            return CreateNativeLocaleFormatter(
                props.locale,
                { year: 'numeric', timeZone: 'UTC' },
                { start: 0, length: 4 }
            );
        });

        // methods

        // 计算表日期
        const calculateTableDate = (value: number) => {
            let _value = value;
            if (value > 0) {
                _value = value + 9;
            } else {
                _value = value - 9;
            }

            return `${parseInt(props.tableDate) + parseInt(`${_value}`)}`;
        };

        // 点击
        const touch = (value: number) => {
            emit('table-date', calculateTableDate(value));
        };

        // 内容
        const genTable = (staticClass: string, children?: VNode[]) => {
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

        // 表格内容
        const genTBody = () => {
            const children = [];
            // 一行3个
            const cols = Array(3).fill(null);
            // 4 行
            const rows = 12 / cols.length;

            // 开始年份
            const startYear = Math.floor(displayedYear.value / 10) * 10;

            for (let row = 0; row < rows; row++) {
                const tds = cols.map((_, col) => {
                    const _number = row * cols.length + col;

                    return h(
                        'td',
                        {
                            key: formatter.value(`${startYear + _number}`),
                        },
                        [genButton(`${startYear + _number}`)]
                    );
                });

                // 删除多余年份
                if (row === 3) {
                    tds.splice(1);
                }

                children.push(
                    h(
                        'tr',
                        {
                            key: row,
                        },
                        tds
                    )
                );
            }

            return h('tbody', {}, children);
        };

        // 按钮样式
        const genButtonClasses = (isSelected: boolean, isCurrent: boolean) => {
            return {
                'ivue-button--selected': isSelected,
                'ivue-button--current': isCurrent,
                'ivue-button--readonly': props.readonly && isSelected,
            };
        };

        // genButton
        const genButton = (value: string) => {
            // 是否选中
            const isSelected =
                props.activeType === 'YEAR'
                    ? props.year === value
                    : value === props.value ||
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
                (isSelected || isCurrent) &&
                (!!props.color || 'ivue-picker-primary');

            return h(
                'button',
                setColor(color, {
                    class: {
                        ['ivue-button']: true,
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

        // 监听日期时间
        watch(
            () => props.tableDate,
            (newVal, oldVal) => {
                isReversing.value = newVal < oldVal;
            }
        );

        return () => genTable(`${prefixCls} ${prefixCls}--table`, [genTBody()]);
    },
});
</script>
