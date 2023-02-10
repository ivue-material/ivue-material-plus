import { isFunction, isUndefined } from 'lodash';

/**
 *
 * @param obj 要在其上添加或修改属性的对象
 * @param prop 属性名称
 * @param value obj[prop] 或 getter 的值
 * @returns 一个可以重置 `obj[prop]` 的值或 getter 的恢复函数
 */
const defineGetter = (
  obj: Record<string, any>,
  prop: string,
  value: any,
  defaultValue?: any
) => {
  // 默认值
  let oldValue = defaultValue;

  // 获取指定对象的自身属性描述符
  const { get, configurable } =
    Object.getOwnPropertyDescriptor(obj, prop) || {};

  // undefined
  if (isUndefined(defaultValue) && isUndefined(get)) {
    try {
      oldValue = obj[prop];
    } catch {
      throw new Error(
        `TypeError: Illegal invocation. Cannot read ${prop} of '${obj}', '${obj}' might be a prototype,  please specify default value instead.`
      );
    }
  }

  // 上一个值
  const oldGetter = get ?? (() => oldValue);

  // 设置get方法
  const getter = isFunction(value) ? value : () => value;

  // 添加或修改对象的属性
  Object.defineProperty(obj, prop, {
    configurable: true,
    get: getter,
  });

  // 返回对象
  return () => {
    Object.defineProperty(obj, prop, {
      configurable,
      get: oldGetter,
    });
  };
};

export default defineGetter;
