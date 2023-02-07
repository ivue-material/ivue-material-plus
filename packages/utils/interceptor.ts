import { isPromise } from './validate';

export type Interceptor = (...args: any[]) => Promise<boolean> | boolean;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function callInterceptor(options: {
  // 拦截器
  interceptor?: Interceptor;
  // 需要返回的数据
  args?: any[];
  // 事件
  done: () => void;
  canceled?: () => void;
}) {
  const { interceptor, args, done, canceled } = options;

  // 是否有拦截器
  if (interceptor) {
    // eslint-disable-next-line prefer-spread
    const returnVal = interceptor.apply(null, args || []);

    if (isPromise(returnVal)) {
      returnVal
        .then((value) => {
          if (value) {
            done();
          } else if (canceled) {
            canceled();
          }
        })
        .catch(noop);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  }
  // 没有直接返回事件
  else {
    done();
  }
}
