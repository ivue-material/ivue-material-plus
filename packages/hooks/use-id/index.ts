import { Ref, InjectionKey, inject, computed, unref } from 'vue';

// type
import type { MaybeRef } from '@vueuse/core';

export type IvueIdInjectionContext = {
  prefix: number;
  current: number;
};

export const ID_INJECTION_KEY: InjectionKey<IvueIdInjectionContext> =
  Symbol('ivue-id-injection');

// 随机生成id
const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10000),
  current: 0,
};

// 生成随机id
export const useId = (deterministicId?: MaybeRef<string>): Ref<string> => {
  const idInjection = inject(ID_INJECTION_KEY, defaultIdInjection);

  const setId = computed(
    () =>
      unref(deterministicId) ||
      `ivue-id-${idInjection.prefix}-${idInjection.current++}`
  );

  return setId;
};
