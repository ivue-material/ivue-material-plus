

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

import { genPickerButton } from './picker-button';
import { IvueIcon } from '../ivue-icon';

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
        selectingYear: Boolean,
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
    setup(props: any, { emit }) {
        // data
        const data = reactive<{
            isReversing: boolean;
        }>({
            // 日期
            isReversing: false,
        });

        // methods

        // 年份按钮
        const genYearBtn = () => {
            return genPickerButton(
                emit,
                props.selectingYear,
                'selectingYear',
                true,
                [props.year, props.yearIcon ? genYearIcon() : null],
                false,
                `${prefixCls}--year`
            );
        };

        // 渲染日期
        const genTitleDate = () => {
            return genPickerButton(
                emit,
                props.selectingYear,
                'selectingYear',
                false,
                genTitleText(),
                false,
                `${prefixCls}--date`
            );
        };

        // 渲染标题
        const genTitleText = () => {
            return h(
                'transition',
                {
                    props: {
                        name: data.isReversing
                            ? 'picker-reverse-transition'
                            : 'picker-transition',
                    },
                },
                [
                    h('div', {
                        innerHTML: props.date || '&nbsp;',
                    }),
                ]
            );
        };

        // 按钮
        const genYearIcon = () => {
            return h(IvueIcon, props.yearIcon);
        };

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
