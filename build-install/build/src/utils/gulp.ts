import { buildRoot } from '../../../build-utils/src';
import { run } from './process';

// 运行任务名称
export const withTaskName = (name: string, fn) => {
  return Object.assign(fn, {
    displayName: name,
  });
};

// 运行任务
export const runTask = (name: string) => {
  return withTaskName(`shellTask:${name}`, () => {
    return run(`npm run start ${name}`, buildRoot);
  });
};
