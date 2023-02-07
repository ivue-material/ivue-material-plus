// 去除只读类型
export type Writable<T> = { -readonly [P in keyof T]: T[P] };
// 去除只读类型数组
export type WritableArray<T> = T extends readonly any[] ? Writable<T> : T;

// 是否是never
export type IfNever<T, Y = true, N = false> = [T] extends [never] ? Y : N;

// 是否是unknown
export type IfUnknown<T, Y, N> = [unknown] extends [T] ? Y : N;

// 返回unknown或者never
export type UnknownToNever<T> = IfUnknown<T, never, T>;

export {};
