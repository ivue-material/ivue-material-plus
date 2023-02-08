// import { computed, inject, unref } from 'vue';
// import { useProp } from '../use-prop';

// // type
// import type { MaybeRef } from '@vueuse/core';
// import { FormContextKey } from '../../components/ivue-form/types/form';

// // 是否禁用
// export const useDisabled = (fallback?: MaybeRef<boolean | undefined>) => {
//   // 禁用
//   const disabled = useProp<boolean>('disabled');

//   // 表单
//   const form = inject(FormContextKey, undefined);

//   return computed(
//     () => disabled.value || unref(fallback) || form?.disabled || false
//   );
// };
