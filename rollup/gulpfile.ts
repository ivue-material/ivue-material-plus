import { mkdir } from 'fs/promises';
import path from 'path';
import { copy } from 'fs-extra';
import { parallel, series } from 'gulp';
import { outputPath, buildOutput } from './build-utils';
import { runTask, withTaskName, buildConfig } from './src';

import {
  buildStyles,
  buildFonts,
  buildResolversCopy,
} from './src/tasks/build-styles';

// ts
import type { TaskFunction } from 'gulp';
import type { Module } from './src';

// 复制类型文件
export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'src');

  // 复制类型
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    );

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done);
};

export default series(
  withTaskName('createOutput', () =>
    mkdir(outputPath, {
      recursive: true,
    })
  ),

  parallel(
    runTask('buildComponents'),
    runTask('buildResolvers'),

    // 打包样式
    series(buildStyles, buildFonts, buildResolversCopy)
  ),

  // 复制types dt文件夹到 unplugin-vue-components
  parallel(copyTypesDefinitions)
);

export * from './src';
