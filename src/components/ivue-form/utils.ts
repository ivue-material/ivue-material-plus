
import { ensureArray } from '../../utils/arrays';
import { FormItemProp, Arrayable, FormItemContext } from './types/form-item';

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
