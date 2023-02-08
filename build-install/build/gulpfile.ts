// @ts-nocheck
import { mkdir } from 'fs/promises';
import { parallel, series } from 'gulp';
import { run, withTaskName, runTask } from './src';
import { uiOutput } from '../build-utils/src';

// type
import type { TaskFunction } from 'gulp';

const build: TaskFunction = series(
  // 清除目录
  withTaskName('clean', () => run('pnpm run clean')),
  // 创建目录 compatible to build on windows
  withTaskName('createOutput', () => mkdir(uiOutput, { recursive: true })),

  // 开始构建
  parallel(
    // 打包模块
    // runTask('buildModules'),

    // 构建完整包文件
    // runTask('buildFullBundle'),

    // 生成类型定义
    runTask('generateTypesDefinitions')
  )
);

export default build;

export * from './src';
