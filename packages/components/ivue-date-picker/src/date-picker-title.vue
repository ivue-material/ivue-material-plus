<script lang="ts">
import { defineComponent, h, Transition, watch, ref } from 'vue';

// 渲染点击按钮
import { genPickerButton } from './picker-button';
// components
import { IvueIcon } from '@ivue-material-plus/components';

// date-picker-title
import { datePickerTitleProps } from './date-picker-title';

const prefixCls = 'ivue-date-picker-title';

export default defineComponent({
  name: prefixCls,
  emits: ['update:selectingYear'],
  props: datePickerTitleProps,
  setup(props, { emit }) {
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
          props.readonly,
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
