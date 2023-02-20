import path from 'path';
import { copyFile, mkdir } from 'fs/promises';
import { copy } from 'fs-extra';
import { parallel, series } from 'gulp';
import { run, withTaskName, runTask, buildConfig } from './src';
import {
  uiOutput,
  uiPackage,
  projRoot,
  buildOutput,
} from '@ivue-material-plus/build-utils';
// type
import type { TaskFunction } from 'gulp';
import type { Module } from './src';

// 复制文件到dist
export const copyFullStyle = async () => {
  // await mkdir(path.resolve(uiOutput, 'dist'), { recursive: true });
  // index
  // await copyFile(
  //   path.resolve(uiOutput, 'styles/index.css'),
  //   path.resolve(uiOutput, 'dist/index.css')
  // );
};

// 复制文件
export const copyFiles = () =>
  Promise.all([
    // 组件目录的 compPackage
    copyFile(uiPackage, path.join(uiOutput, 'package.json')),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(uiOutput, 'README.md')
    ),
  ]);

// 复制类型文件
export const copyTypesDefinitions: TaskFunction = (done) => {
  // dist -> types -> packages
  const src = path.resolve(buildOutput, 'types', 'packages');

  // 复制类型
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    );

  // 复制到对应的目录下
  return parallel(copyTypes('esm'), copyTypes('cjs'))(done);
};

const build: TaskFunction = series(
  // 清除目录
  withTaskName('clean', () => run('pnpm run clean')),
  // 创建目录 compatible to build on windows
  withTaskName('createOutput', () => mkdir(uiOutput, { recursive: true })),

  // 开始构建
  parallel(
    // 打包模块
    // runTask('buildModules'),

    // // 构建完整包文件
    // runTask('buildFullBundle'),

    // // 生成类型定义
    // runTask('generateTypesDefinitions'),

    // 打包样式
    series(
      withTaskName('buildStyles', () =>
        run('pnpm run -C packages/styles build')
      )
      // copyFullStyle
    )
  )

  // parallel(copyTypesDefinitions, copyFiles)
);

export default build;

export * from './src';
