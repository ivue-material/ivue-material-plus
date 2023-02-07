import { warn } from 'vue';
import { fromPairs } from 'lodash-unified';
import { isObject, hasOwn } from '@vue/shared';

// type
import type { PropType } from 'vue';
import type {
  EpProp,
  EpPropConvert,
  EpPropFinalized,
  EpPropInput,
  EpPropMergeType,
  IfEpProp,
  IfNativePropType,
  NativePropType,
} from './types';

// key
export const epPropKey = '__epPropKey';

// 默认prop类型
export const definePropType = <T>(val: any): PropType<T> => val;

// 是否是 原生 prop 返回 prop 参数
export const isEpProp = (val: unknown): val is EpProp<any, any, any> =>
  isObject(val) && !!(val as any)[epPropKey];

/**
 * @description Build prop. It can better optimize prop types
 * @description 生成 prop，能更好地优化类型
 * @example
  // limited options
  // the type will be PropType<'light' | 'dark'>
  buildProp({
    type: String,
    values: ['light', 'dark'],
  } as const)
  * @example
  // limited options and other types
  // the type will be PropType<'small' | 'large' | number>
  buildProp({
    type: [String, Number],
    values: ['small', 'large'],
    validator: (val: unknown): val is number => typeof val === 'number',
  } as const)
  @link see more: https://github.com/element-plus/element-plus/pull/3341
 */
export const buildProp = <
  Type = never,
  Value = never,
  Validator = never,
  Default extends EpPropMergeType<Type, Value, Validator> = never,
  Required extends boolean = false
>(
  prop: EpPropInput<Type, Value, Validator, Default, Required>,
  key?: string
): EpPropFinalized<Type, Value, Validator, Default, Required> => {
  // filter native prop type and nested prop, e.g `null`, `undefined` (from `buildProps`)
  // 过滤原生 prop 类型和嵌套 prop，例如 `null`、`undefined`（来自 `buildProps`）
  if (!isObject(prop) || isEpProp(prop)) {
    return prop as any;
  }

  // prop 属性
  const { values, required, default: defaultValue, type, validator } = prop;

  /**
   * 自定义验证函数
   *
   * @values {提供一个数组，会自动生成类型加入到 PropType 中}
   * @validator {提供一个函数用于校验参数是否正确 返回值需为 val is T，会自动加入到 PropType 中}
   *
   * @returns {values || validator}
   */
  const _validator =
    values || validator
      ? (val: unknown) => {
          let valid = false;
          let allowedValues: unknown[] = [];

          // 提供一个数组，会自动生成类型加入到 PropType 中
          if (values) {
            // 创建一个新数组，避免修改原有值
            allowedValues = Array.from(values);

            // 是否有默认值
            if (hasOwn(prop, 'default')) {
              allowedValues.push(defaultValue);
            }

            // valid = false 时赋值 allowedValues 数组是否包含 val
            // valid = true
            valid ||= allowedValues.includes(val);
          }

          // 有验证方法
          if (validator) {
            // 把验证方法赋值
            valid ||= validator(val);
          }

          // 没有验证方法 && 有需要验证的值 提示错误
          if (!valid && allowedValues.length > 0) {
            // 错误类型
            const allowValuesText = [...new Set(allowedValues)]
              .map((value) => JSON.stringify(value))
              .join(', ');

            // warn
            // 验证失败 for prop 预期 allowValuesText 之一 得到值 val
            warn(
              `Invalid prop: validation failed${
                key ? ` for prop "${key}"` : ''
              }. Expected one of [${allowValuesText}], got value ${JSON.stringify(
                val
              )}.`
            );
          }

          // 反正是否验证通过
          return valid;
        }
      : undefined;

  // 优化类型
  const epProp: any = {
    type,
    // 必填
    required: !!required,
    // 将 prop 值作为唯一参数传入的自定义验证函数
    validator: _validator,
    // 是优化类型
    [epPropKey]: true,
  };

  // prop 中是否有默认参数
  if (hasOwn(prop, 'default')) {
    epProp.default = defaultValue;
  }

  // 返回优化类型
  return epProp;
};

// 类型推倒props
export const buildProps = <
  Props extends Record<
    string,
    | { [epPropKey]: true }
    // 原生 prop 类型
    | NativePropType
    // prop 输入参数（约束）对应 {type | required | values | validator | default}
    | EpPropInput<any, any, any, any, any>
  >
>(
  props: Props
): {
  // 判断是否为 `EpProp` 如果第一参数不是 epPropKey 则使用 原生 prop 类型
  [K in keyof Props]: IfEpProp<
    Props[K],
    Props[K],
    // 判断是否为 `EpProp
    IfNativePropType<Props[K], Props[K], EpPropConvert<Props[K]>>
  >;
} =>
  // 吧值转换成一个新对象
  fromPairs(
    Object.entries(props).map(([key, option]) => [
      key,
      // 验证props中的属性
      buildProp(option as any, key),
    ])
  ) as any;
