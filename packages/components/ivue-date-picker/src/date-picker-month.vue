<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  Transition,
  h,
  withDirectives,
  resolveDirective,
  VNode,
} from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// directives
import { Touch } from '@ivue-material-plus/directives';

// utils
import isDateAllowed from './utils/is-date-allowed';
import CreateNativeLocaleFormatter from './utils/create-native-locale-formatter';
import Pad from './utils/pad';

// date-picker-month
import { datePickerMonthProps } from './date-picker-month';

const prefixCls = 'ivue-date-picker-month';

export default defineComponent({
  name: prefixCls,
  directives: { Touch },
  // 声明事件
  emits: ['table-date', 'input'],
  props: datePickerMonthProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // 是否使用反向动画
    const isReversing = ref<boolean>(false);

    // computed

    // 动画
    const computedTransition = computed(() => {
      return isReversing.value
        ? 'ivue-date-picker-tab-reverse-transition'
        : 'ivue-date-picker-tab-transition';
    });

    // 日期格式
    const formatter = computed(() => {
      return (
        props.format ||
        CreateNativeLocaleFormatter(
          props.locale,
          { month: 'short', timeZone: 'UTC' },
          { start: 5, length: 2 }
        )
      );
    });

    // 显示的年份
    const displayedYear = computed(() => {
      return Number(props.tableDate.split('-')[0]) * 1;
    });

    // methods

    // 计算表日期
    const calculateTableDate = (dates: number) => {
      // Math.sign 返回一个数字的符号，表示该数字是正数，负数还是零
      return `${parseInt(props.tableDate, 10) + Math.sign(dates || 1)}`;
    };

    // 点击
    const touch = (value: number) => {
      emit('table-date', calculateTableDate(value));
    };

    // 内容
    const genTable = (staticClass: string, children: VNode[]) => {
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
              left: (e: MouseEvent) => e.offsetX < -15 && touch(1),
              right: (e: MouseEvent) => e.offsetX > 15 && touch(-1),
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

      for (let row = 0; row < rows; row++) {
        const tds = cols.map((_, col) => {
          // 月数
          const month = row * cols.length + col;

          return h(
            'td',
            {
              key: month,
            },
            [genButton(`${displayedYear.value}-${Pad(month + 1)}`)]
          );
        });

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

      return h('tbody', children);
    };

    // 按钮样式
    const genButtonClasses = (isSelected: boolean, isCurrent: boolean) => {
      return {
        // 是否选中
        [bem.is('selected')]: isSelected,
        // 是否有显示当前日期
        [bem.is('current')]: isCurrent,
        // 是否只读
        [bem.is('readonly')]: props.readonly && isSelected,
      };
    };

    // genButton
    const genButton = (value: string) => {
      // 是否选中
      const isSelected =
        value === props.value ||
        (Array.isArray(props.value) && props.value.indexOf(value) !== -1);

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
            : false || props.activeType === 'MONTH'
            ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}` ===
              value
            : false;
      } else {
        isCurrent = value === props.current;
      }

      // 设置颜色
      const setColor = isSelected
        ? props.setBackgroundColor
        : props.setTextColor;

      // 颜色
      const color = (isSelected || isCurrent) && (props.color || 'primary');

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

    return () => genTable(bem.b(), [genTBody()]);
  },
});
</script>
