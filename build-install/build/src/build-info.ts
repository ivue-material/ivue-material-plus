import path from 'path';

import { PKG_NAME } from '@ivue-material-plus/build-constants';
import { uiOutput } from '@ivue-material-plus/build-utils';

// 输出文件的模块名称
export const modules = ['esm', 'cjs'] as const;
export type Module = (typeof modules)[number];

export const target = 'es2018';

// 打包配置
export const buildConfig = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      // /dist/ivue-material-plus
      path: path.resolve(uiOutput, 'es'),
    },
    bundle: {
      // ivue-material-plus/es
      path: `${PKG_NAME}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      // /dist/ivue-material-plus
      path: path.resolve(uiOutput, 'lib'),
    },
    bundle: {
      // ivue-material-plus/lib
      path: `${PKG_NAME}/lib`,
    },
  },
};

// 构建配置条目
export const buildConfigEntries = Object.entries(buildConfig);
