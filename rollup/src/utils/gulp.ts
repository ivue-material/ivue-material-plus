import { buildRoot } from '../../build-utils';
import { run } from './process';

// 运行任务名称
export const withTaskName = (name, fn) => {
  return Object.assign(fn, {
    displayName: name,
  });
};

// 运行任务
export const runTask = (name) => {
  return withTaskName(`shellTask:${name}`, () => {
    return run(`npm run start ${name}`, buildRoot);
  });
};
