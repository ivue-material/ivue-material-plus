

<script lang='ts'>
import { defineComponent, h, Transition, watch, ref } from 'vue';

import { genPickerButton } from './picker-button';
import { IvueIcon } from '../ivue-icon';

// type
import type { Props } from './ivue-date-picker-title';

const prefixCls = 'ivue-date-picker-title';

export default defineComponent({
    name: prefixCls,
    emits: ['update:selectingYear'],
    props: {
        /**
         * 选择年份
         *
         * @type {Boolean}
         */
        selectingYear: {
            type: Boolean,
        },
        /**
         * 当前年份
         *
         * @type {Number, String}
         */
        year: {
            type: [Number, String],
            default: '',
        },
        /**
         * 日期
         *
         * @type {String}
         */
        date: {
            type: String,
            default: '',
        },
        /**
         * value
         *
         * @type {String}
         */
        value: {
            type: String,
        },
        /**
         * 年份图标
         *
         * @type {String}
         */
        yearIcon: {
            type: String,
        },
    },
    setup(props: Props, { emit }) {
        // 是否使用反向动画
        const isReversing = ref<boolean>(false);

        // methods

        // 年份按钮
        const genYearBtn = () => {
            return h(
                'div',
                {},
                genPickerButton(
                    emit,
                    props.selectingYear,
                    true,
                    'selectingYear',
                    [props.year, props.yearIcon ? genYearIcon() : null],
                    false,
                    `${prefixCls}--year`
                )
            );
        };

        // 渲染日期
        const genTitleDate = () => {
            return genPickerButton(
                emit,
                props.selectingYear,
                false,
                'selectingYear',
                genTitleText(),
                false,
                `${prefixCls}--date`
            );
        };

        // 渲染标题
        const genTitleText = () => {
            return h(
                Transition,
                {
                    name: isReversing.value
                        ? 'picker-reverse-transition'
                        : 'picker-transition',
                },
                {
                    default: () =>
                        h('div', {
                            innerHTML: props.date || '&nbsp;',
                            key: props.value,
                        }),
                }
            );
        };

        // 按钮
        const genYearIcon = () => {
            return h(
                IvueIcon,
                {},
                {
                    default: () => props.yearIcon,
                }
            );
        };

        // watch
        // 监听日期时间
        watch(
            () => props.value,
            (newVal, oldVal) => {
                isReversing.value = newVal < oldVal;
            }
        );

        return () =>
            h(
                'div',
                {
                    class: {
                        [`${prefixCls}`]: true,
                    },
                },
                [genYearBtn(), genTitleDate()]
            );
    },
});
</script>
