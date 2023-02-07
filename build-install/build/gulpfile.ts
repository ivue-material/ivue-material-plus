import { mkdir } from 'fs/promises';
import { parallel, series } from 'gulp';
import { run, withTaskName, runTask } from './src';
import { ivueMaterialPlusOutput } from '../build-utils/src';

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  // 创建目录 compatible to build on windows
  withTaskName('createOutput', () =>
    mkdir(ivueMaterialPlusOutput, { recursive: true })
  ),

  // 开始构建
  parallel(runTask('buildModules'))
);
