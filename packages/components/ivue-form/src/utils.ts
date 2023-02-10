import { computed, ref } from 'vue';

import { ensureArray } from '@ivue-material-plus/utils/arrays';
import { debugWarn } from '@ivue-material-plus/utils/error';

// types
import type { FormItemProp, FormItemContext } from './form-item';
import type { Arrayable } from '@ivue-material-plus/utils';

// 过滤字段
export const filterFields = (
  fields: FormItemContext[],
  props: Arrayable<FormItemProp>
) => {
  // 如果 value 不是数组, 那么强制转为数组
  const normalized = ensureArray(props);

  return normalized.length > 0
    ? fields.filter((field) => field.prop && normalized.includes(field.prop))
    : fields;
};

// 表单宽度
export function useFormLabelWidth() {
  // 标签宽度数组
  const potentialLabelWidthArr = ref<number[]>([]);

  // 是否使用 auto 宽度
  const autoLabelWidth = computed(() => {
    if (!potentialLabelWidthArr.value.length) {
      return '0';
    }

    // 取最大的表单宽度
    const max = Math.max(...potentialLabelWidthArr.value);

    return max ? `${max}px` : '';
  });

  // 获取当前标签宽度
  const getLabelWidthIndex = (width: number) => {
    const index = potentialLabelWidthArr.value.indexOf(width);

    // 没有宽度
    if (index === -1 && autoLabelWidth.value === '0') {
      debugWarn('ivue-form', `unexpected width ${width}`);
    }

    return index;
  };

  // 注册标签宽度
  const registerLabelWidth = (value: number, oldValue: number) => {
    // 改变了标签宽度
    if (value && oldValue) {
      // 获取当前标签宽度
      const index = getLabelWidthIndex(oldValue);
      potentialLabelWidthArr.value.splice(index, 1, value);
    }
    // 有当前标签宽度
    else if (value) {
      potentialLabelWidthArr.value.push(value);
    }
  };

  // 销毁标签宽度
  const deregisterLabelWidth = (value: number) => {
    const index = getLabelWidthIndex(value);

    if (index > -1) {
      potentialLabelWidthArr.value.splice(index, 1);
    }
  };

  return {
    autoLabelWidth,
    registerLabelWidth,
    deregisterLabelWidth,
  };
}
