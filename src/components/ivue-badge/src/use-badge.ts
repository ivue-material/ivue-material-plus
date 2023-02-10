import { computed } from 'vue';

// type
import type { ComponentInternalInstance } from 'vue';
import type { BadgeProps } from './badge';

export const useBadge = (
  props: BadgeProps,
  slots: ComponentInternalInstance['slots']
) => {
  // computed

  // 是否没有 slot
  const alone = computed(() => {
    return slots.default === undefined;
  });

  // 是否有数值
  const hasCount = computed(() => {
    const { count, text, showZero } = props;

    if (count || text !== '') {
      return true;
    }

    if (showZero && parseInt(`${count}`) === 0) {
      return true;
    } else {
      return false;
    }
  });

  // 是否显示数字
  const showBadge = computed(() => {
    const { count, dot, showZero, text, show } = props;

    let status = false;

    // 是否显示徽标
    if (!show) {
      return show;
    }

    // 是否有数字
    if (count) {
      // 是否等于0
      status = !(parseInt(`${count}`) === 0);
    }

    // 是否显示成小红点
    if (dot) {
      status = true;

      if (count !== null) {
        // 是否等于0
        if (parseInt(`${count}`) === 0) {
          status = false;
        }
      }
    }

    // 是否有文本
    if (text !== '') {
      status = true;
    }

    // 0不显示 ||  当数值为0是是否显示
    return status || showZero;
  });

  // 判断是否显示封顶数字值
  const finalCount = computed(() => {
    const { count, overflowCount, text } = props;

    // 判断是否有文字
    if (text !== '') {
      return text;
    }

    // 显示的数字 >= 封顶的数字值 ? 封顶的数字值+ : 显示的数字
    return parseInt(`${count}`) >= parseInt(`${overflowCount}`)
      ? `${overflowCount}+`
      : count;
  });

  return {
    // computed
    alone,
    hasCount,
    showBadge,
    finalCount,
  };
};
