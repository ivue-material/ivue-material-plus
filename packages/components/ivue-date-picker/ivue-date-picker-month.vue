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

import Touch from '../../utils/directives/touch';
import isDateAllowed from '../../utils/is-date-allowed';
import CreateNativeLocaleFormatter from '../../utils/create-native-locale-formatter';
import Pad from '../../utils/pad';

// type
import type { Props } from './types/ivue-date-picker-month';

const prefixCls = 'ivue-date-picker-month';

export default defineComponent({
  name: prefixCls,
  directives: { Touch },
  // 声明事件
  emits: ['table-date', 'input'],
  props: {
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
     * 日期时间
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
     * 当前激活的type
     *
     * @type {String}
     */
    activeType: {
      type: String,
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
     * 只读
     *
     * @type {Boolean}
     */
    readonly: {
      type: Boolean,
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
     * 设置允许选择日期函数
     *
     * @type {Function}
     */
    allowedDates: {
      type: Function,
    },
    /**
     * 颜色
     *
     * @type {String | Array}
     */
    color: {
      type: [String, Array],
      default: '',
    },
  },
  setup(props: Props, { emit }) {
    // 是否使用反向动画
    const isReversing = ref<boolean>(false);

    // computed

    // 动画
    const computedTransition = computed(() => {
      return isReversing.value ? 'tab-reverse-transition' : 'tab-transition';
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
        'ivue-button--selected': isSelected,
        'ivue-button--current': isCurrent,
        'ivue-button--readonly': props.readonly && isSelected,
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
            : null || props.activeType === 'MONTH'
            ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}` ===
              value
            : null;
      } else {
        isCurrent = value === props.current;
      }

      const setColor = isSelected ? props.backgroundColor : props.textColor;

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

    return () => genTable(`${prefixCls} ${prefixCls}--table`, [genTBody()]);
  },
});
</script>
