export const unique = <T>(arr: T[]) => [...new Set(arr)];

type Many<T> = T | ReadonlyArray<T>;
export const ensureArray = <T>(arr: Many<T>) => {
  if (!arr && (arr as any) !== 0) {
    return [];
  }

  return Array.isArray(arr) ? arr : [arr];
};
