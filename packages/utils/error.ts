import { isString } from '@vue/shared';

class IvueMaterialPlusError extends Error {
  constructor(m: string) {
    super(m);
    this.name = 'IvueMaterialPlusError';
  }
}

export function throwError(scope: string, m: string): never {
  throw new IvueMaterialPlusError(`[${scope}] ${m}`);
}

// 生产环境提示错误
export function debugWarn(err: Error): void;
export function debugWarn(scope: string, message: string): void;
export function debugWarn(scope: string | Error, message?: string): void {
  if (process.env.NODE_ENV !== 'production') {
    const error: Error = isString(scope)
      ? new IvueMaterialPlusError(`[${scope}] ${message}`)
      : scope;

    console.warn(error);
  }
}
