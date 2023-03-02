<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  Transition,
  h,
  ref,
  unref,
} from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// mixins
import { colorable } from '@ivue-material-plus/utils/mixins/colorable';

// utils
import CreateNativeLocaleFormatter from './utils/create-native-locale-formatter';
import MonthChange from './utils/month-change';

// components
import { IvueButton, IvueIcon } from '@ivue-material-plus/components';

// date-picker-header
import { datePickerHeaderProps } from './date-picker-header';

const prefixCls = 'ivue-date-picker-header';

export default defineComponent({
  emits: ['toggle', 'input'],
  props: datePickerHeaderProps,
  setup(props, { emit, slots }) {
    // bem
    const bem = useNamespace(prefixCls);

    // mixins
    const { setTextColor } = colorable();

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

      // 最大年份
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
        // 只读
        props.readonly ||
        // 小于最小值
        (change < 0 && props.min && calculateChange(change) < props.min) ||
        // 大于最大值
        (change > 0 &&
          props.max &&
          (props.activeType === 'YEAR'
            ? endYear >= Number(props.max)
            : calculateChange(change) > props.max));

      // 是否禁用
      if (props.activeType === 'YEAR' || props.activeType === 'MONTH') {
        if (change > 0 && props.value === props.max) {
          disabled = true;
        }
      }

      return h(
        IvueButton,
        {
          color: props.color,
          flat: true,
          icon: true,
          disabled: !!disabled,
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
                default: () => (change < 0 ? props.prevIcon : props.nextIcon),
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
        endYear = startYear + 9 > Number(props.max) ? props.max : startYear + 9;
      } else {
        endYear = startYear + 9;
      }

      // 头部文字
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
            : unref(formatter)!(String(props.value)),
        ]
      );

      // transition
      const transition = h(
        Transition,
        {
          // 是否使用反向动画
          name: unref(isReversing)
            ? 'ivue-date-picker-tab-reverse-transition'
            : 'ivue-date-picker-tab-transition',
        },
        {
          default: () => header,
        }
      );

      return h(
        'div',
        {
          class: bem.e('date'),
        },
        transition
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
      let everyClick = 1;

      // 是否是年
      if (props.activeType === 'YEAR') {
        everyClick = 10;
      }

      return h(
        'div',
        {
          class: bem.b(),
        },
        [genBtn(-everyClick), genHeader(), genBtn(everyClick)]
      );
    };
  },
});
</script>
