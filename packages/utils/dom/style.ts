import { isString } from '@vue/shared';
import { isNumber } from '@vueuse/core';

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) {
    return '';
  }

  // string
  if (isString(value)) {
    return value;
  }
  // number
  else if (isNumber(value)) {
    return `${value}${defaultUnit}`;
  }
}
