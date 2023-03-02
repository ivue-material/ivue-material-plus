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
  unref,
} from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// utils
import { createRange } from '@ivue-material-plus/utils';
import CreateNativeLocaleFormatter from './utils/create-native-locale-formatter';
import Pad from './utils/pad';
import MonthChange from './utils/month-change';
import isDateAllowed from './utils/is-date-allowed';

// directives
import { Touch } from '@ivue-material-plus/directives';

// date-picker-date
import { datePickerDateProps } from './date-picker-date';

// type
import { VNode } from 'vue';

const prefixCls = 'ivue-date-picker-date';

export default defineComponent({
  name: prefixCls,
  directives: { Touch },
  // 声明事件
  emits: ['table-date', 'input'],
  props: datePickerDateProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // 是否使用反向动画
    const isReversing = ref<boolean>(false);

    // computed

    // 动画
    const computedTransition = computed(() => {
      return unref(isReversing)
        ? 'ivue-date-picker-tab-reverse-transition'
        : 'ivue-date-picker-tab-transition';
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
      const first = parseInt(`${props.firstDayOfWeek}`, 10);

      return unref(weekDayFormatter)
        ? // 2017-01-15 is Sunday
          createRange(7).map((i) =>
            unref(weekDayFormatter)!(`2017-01-${first + i + 15}`)
          )
        : createRange(7).map(
            (i: number) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][(i + first) % 7]
          );
    });

    // 显示的年份
    const displayedYear = computed(() => {
      return Number(props.tableDate.split('-')[0]) * 1;
    });

    // 显示月份
    const displayedMonth = computed(() => {
      return Number(props.tableDate.split('-')[1]) - 1;
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
    const genTR = (children: VNode[]) => {
      return [h('tr', {}, children)];
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

    // 返回从firstDayOfWeek到当月第一天的天数
    const weekDaysBeforeFirstDayOfTheMonth = () => {
      // 本月的第一天
      const firstDayOfTheMonth = new Date(
        `${displayedYear.value}-${Pad(
          displayedMonth.value + 1
        )}-01T00:00:00+00:00`
      );

      const weekDay = firstDayOfTheMonth.getUTCDay();

      return (weekDay - parseInt(`${props.firstDayOfWeek}`) + 7) % 7;
    };

    // 计算表日期
    const calculateTableDate = (dates: number) => {
      // Math.sign 返回一个数字的符号，表示该数字是正数，负数还是零
      return MonthChange(props.tableDate, Math.sign(dates || 1));
    };

    // 手势
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

    // 渲染日期
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

      const setColor = isSelected
        ? props.setBackgroundColor
        : props.setTextColor;

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
        unref(formatter)!(value)
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

      // 当前日期
      for (day = 1; day <= daysInMonth; day++) {
        const date = `${displayedYear.value}-${Pad(
          displayedMonth.value + 1
        )}-${Pad(day)}`;

        rows.push(
          h('td', [
            // 按钮
            genButton(date),
            // 标记
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
      // 便签用于标记需要注意的日期
      if (Array.isArray(props.note)) {
        return props.note.indexOf(date) > -1;
      }
      // Function
      else if (props.note instanceof Function) {
        return props.note(date);
      } else {
        return false;
      }
    };

    // 渲染便签
    const genNote = (date: string) => {
      let noteColor = '';

      // 字符串
      if (typeof props.noteColor === 'string') {
        noteColor = props.noteColor;
      }
      // 方法
      else if (typeof props.noteColor === 'function') {
        noteColor = (props.noteColor as any)(date);
      } else {
        noteColor = props.noteColor[date];
      }

      return h(
        'div',
        props.setBackgroundColor!(noteColor || props.color || 'warning', {
          class: {
            [bem.e('note')]: true,
          },
        })
      );
    };

    // 监听日期时间
    watch(
      () => props.tableDate,
      (newVal, oldVal) => {
        isReversing.value = newVal < oldVal;
      }
    );

    return () => genTable(bem.b(), [genTHead(), genTBody()]);
  },
});
</script>
