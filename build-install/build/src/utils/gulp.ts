import { buildRoot } from '@ivue-material-plus/build-utils';

import { run } from './process';

// 运行任务名称
export const withTaskName = (name: string, fn: any) => {
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
